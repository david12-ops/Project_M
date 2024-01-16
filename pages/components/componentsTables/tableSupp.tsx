import Box from '@mui/material/Box';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import Link from 'next/link';
import router from 'next/router';
import * as React from 'react';

import { useDeleteSupp2Mutation, useSuppDataQuery } from '@/generated/graphql';

import styles from '../../../styles/stylesForm/style.module.css';

// Mozna kontrola na id
// const Refetch = (data: any) => {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//   data.refetch();
// };

export const DataGridSupplier = () => {
  // refresh tabulky
  const suppD = useSuppDataQuery();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const [deleteSuppD] = useDeleteSupp2Mutation();
  const [selection, setSelection] = React.useState<GridRowSelectionModel>([]);

  const rows =
    !suppD.data || suppD.loading
      ? []
      : suppD.data.suplierData.map((SuupD, index) => {
          return {
            id: index,
            supplierName: SuupD.suppName,
            suppId: SuupD.supplierId,
          };
        });

  const IdSupp = () => {
    return selection.map(
      (selectedId) => rows.find((item) => item.id === selectedId)?.suppId,
    );
  };

  const Check = () => {
    let errmsg;
    if (IdSupp().length === 0) {
      errmsg = 'Vyberte si prosím záznam';
    } else if (IdSupp().length > 1) {
      errmsg = 'Vzberte jen jednoho dodavatele';
    } else {
      return router.push(`/../admpage/${IdSupp()}`);
    }
    // eslint-disable-next-line no-alert
    return alert(errmsg);
  };

  const DeleteS = async () => {
    if (IdSupp().length === 0) {
      alert('Nebyl vybrán dodavatel pro mazání');
    } else {
      const DeletedId: any = IdSupp();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const result = await deleteSuppD({
        variables: {
          Id: DeletedId,
        },
      })
        .then((res) => {
          return res;
        })
        .catch((error) => alert(error));

      const err = result.data?.deleteSupp2?.error;
      const deleted = result.data?.deleteSupp2?.deletion;
      if (deleted) {
        alert('Deletion secusfull');
      }
      if (err) {
        alert(err);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          // eslint-disable-next-line sonarjs/no-duplicate-string
          style={{ background: '#ADADD6', border: 'solid white' }}
          onRowSelectionModelChange={setSelection}
          loading={suppD.loading}
          rows={rows}
          columns={[
            {
              field: 'supplierName',
              headerName: 'Supplier name',
              width: 125,
              editable: true,
            },
            {
              field: 'suppId',
              headerName: 'Supplier Id',
              type: 'number',
              width: 125,
              align: 'center',
              headerAlign: 'center',
            },
            {
              field: 'ButtonDetail',
              headerName: 'Action',
              width: 110,
              align: 'center',
              headerAlign: 'center',
              renderCell: () => (
                <button onClick={Check} className={styles.crudbtnTable}>
                  Manage
                </button>
              ),
            },
          ]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
      <div
        style={{
          display: 'flex',
          // flexWrap: 'wrap',
          flexDirection: 'row',
          justifyContent: 'space-around',
          background: '#FFE8C4',
          borderBottom: 'solid white',
          borderLeft: 'solid white',
          borderRight: 'solid white',
        }}
      >
        <h1
          style={{
            color: 'gray',
          }}
        >
          Actions
        </h1>
        <button onClick={DeleteS} className={styles.crudbtDel}>
          Delete
        </button>
        <Link key="CreateFormSupp" href="/../Forms/CreateFormSupp">
          <button className={styles.crudbtn}>Create</button>
        </Link>
        <Link key="suppcard-page" href="/../../suppcard-page">
          <button className={styles.crudbtn}>Suppliers</button>
        </Link>
      </div>
    </Box>
  );
};

// Page na not Found
// delete zaznamu po zavolani resolveru
