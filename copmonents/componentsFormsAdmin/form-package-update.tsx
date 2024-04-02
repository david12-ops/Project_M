import { State, useHookstate } from '@hookstate/core';
import { Button, styled, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';

import {
  HistoryDataDocument,
  SuppDataDocument,
  SuppDataQuery,
  useSuppDataQuery,
  useUpdateHistoryMutation,
  useUpdatePackageMutation,
} from '@/generated/graphql';

import { useAuthContext } from '../auth-context-provider';
import { MyCompTextField } from '../text-field';

type Props = {
  id: string;
};

const BackButtn = styled(Button)({
  backgroundColor: '#5193DE',
  color: 'white',
  width: '30%',
});

type Item = SuppDataQuery['suplierData'];

const UpdateButton = styled(Button)({
  backgroundColor: '#5362FC',
  color: 'white',
  width: '30%',
  alignSelf: 'center',
});

const CustomFieldset = styled('fieldset')({
  border: '5px solid #5193DE',
  borderRadius: '10px',
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  padding: '1rem',
});

type DataFrServer = {
  SuppId: string;
  PackName: string;
  Cost: string;
  Plength: string;
  Weight: string;
  Width: string;
  Height: string;
};

type UpdatedPack = {
  weight: number;
  cost: number;
  Plength: number;
  height: number;
  width: number;
  name_package: string;
  supplier_id: string;
};

type Package = {
  [name: string]: {
    weight: number;
    height: number;
    width: number;
    Plength: number;
    name_package: string;
    cost: number;
  };
};

type ErrSetterProperties = {
  errWeight: string;
  errCost: string;
  errpLength: string;
  errHeight: string;
  errWidth: string;
  errLabel: string;
};

const parseIntReliable = (numArg: string) => {
  if (numArg.length > 0) {
    const parsed = Number.parseInt(numArg, 10);
    if (parsed === 0) {
      // eslint-disable-next-line max-depth
      if (numArg.replaceAll('0', '') === '') {
        return 0;
      }
    } else if (Number.isSafeInteger(parsed)) {
      return parsed;
    }
  }
  return false;
};

const Back = async (ids: string) => {
  await router.push(`/../../admpage/${ids}`);
};

const MyAlert = (messages: {
  successUpade: string;
  errUpdate: string;
  msgHisotry: string;
}) => {
  let alert = <div></div>;

  if (messages.errUpdate !== '') {
    alert = (
      <div>
        <Alert severity="error">{messages.errUpdate}</Alert>
      </div>
    );
  }

  if (messages.successUpade !== '' && messages.msgHisotry !== '') {
    const data = JSON.parse(messages.successUpade) as UpdatedPack;
    alert = (
      <Alert severity="success">
        <div>
          <h3>Balík s parametry</h3>
          <p style={{ margin: '5px' }}>
            <strong>Označení</strong>: {data.name_package}
          </p>
          <p style={{ margin: '5px' }}>
            <strong>Cena</strong>: {data.cost} Kč
          </p>
          <p style={{ margin: '5px' }}>
            <strong>Hmotnost</strong>: {data.weight}
          </p>
          <p style={{ margin: '5px' }}>
            <strong>Délka</strong>: {data.Plength}
          </p>
          <p style={{ margin: '5px' }}>
            <strong>Šířka</strong>: {data.width}
          </p>
          <p style={{ margin: '5px' }}>
            <strong>Výška</strong>: {data.height}
          </p>
          <p style={{ margin: '5px' }}>
            <strong>Status úpravy historie</strong>: {messages.msgHisotry}
          </p>
        </div>
      </Alert>
    );
  }

  return alert;
};

const isInt = (numArg: string, min: number) => {
  const parsed = parseIntReliable(numArg);

  return parsed !== false && parsed > min;
};

const setDataDatabase = (pId: string, data: Item): DataFrServer | undefined => {
  for (const item of data) {
    const packs: Array<Package> = item.package as Array<Package>;
    if (packs) {
      // eslint-disable-next-line max-depth
      for (const pack of packs) {
        const itm = pack[pId];
        // eslint-disable-next-line max-depth
        if (itm) {
          return {
            SuppId: item.supplierId,
            PackName: itm.name_package,
            Cost: itm.cost.toString(),
            Plength: itm.Plength.toString(),
            Weight: itm.weight.toString(),
            Width: itm.width.toString(),
            Height: itm.height.toString(),
          };
        }
      }
    }
  }
  return undefined;
};

const Valid = (
  weightarg: string,
  costarg: string,
  pLengtharg: string,
  heightarg: string,
  widtharg: string,
  errSetter: State<ErrSetterProperties>,
) => {
  const messageInt = 'Očekává se číslo větší nebo rovné nule';
  if (!isInt(weightarg, 0)) {
    errSetter.errWeight.set(messageInt);
    return new Error(messageInt);
  }

  if (!isInt(costarg, 0)) {
    errSetter.errCost.set(messageInt);
    return new Error(messageInt);
  }

  if (!isInt(pLengtharg, 0)) {
    errSetter.errpLength.set(messageInt);
    return new Error(messageInt);
  }

  if (!isInt(heightarg, 0)) {
    errSetter.errHeight.set(messageInt);
    return new Error(messageInt);
  }

  if (!isInt(widtharg, 0)) {
    errSetter.errWidth.set(messageInt);
    return new Error(messageInt);
  }

  return undefined;
};

const Response = (
  response:
    | {
        __typename?: 'PackageUpdateError' | undefined;
        message: string;
      }
    | {
        __typename?: 'UPack' | undefined;
        data: {
          __typename?: 'PackageDataUpdate' | undefined;
          weight: number;
          cost: number;
          Plength: number;
          height: number;
          width: number;
          name_package: string;
          supplier_id: string;
        };
      }
    | null
    | undefined,
) => {
  const responseFromQuery: {
    data: UpdatedPack | undefined;
    error: string | undefined;
  } = {
    data: undefined,
    error: undefined,
  };
  // eslint-disable-next-line no-underscore-dangle
  if (response?.__typename === 'UPack') {
    responseFromQuery.data = response.data ?? undefined;
  }
  // eslint-disable-next-line no-underscore-dangle
  if (response?.__typename === 'PackageUpdateError') {
    responseFromQuery.error = response.message ?? undefined;
  }
  return responseFromQuery;
};

export const FormPackageUpdate: React.FC<Props> = ({ id }) => {
  const { user } = useAuthContext();
  const settersForDataPack = useHookstate({
    Weight: '',
    Cost: '',
    Plength: ' ',
    Height: '',
    Width: '',
    PackName: '',
    SuppId: '',
  });

  const setterForAlertMesssage = useHookstate({
    errUpdate: '',
    successUpdate: '',
    msgHistory: '',
  });

  const setterErrors = useHookstate({
    errWeight: '',
    errCost: '',
    errpLength: '',
    errHeight: '',
    errWidth: '',
    errLabel: '',
  });

  const idComp = 'outlined-required';

  const labelHeight = { err: 'Chyba', withoutErr: 'Výška' };
  const labelWeigth = { err: 'Chyba', withoutErr: 'Hmotnost' };
  const labelLength = { err: 'Chyba', withoutErr: 'Délka' };
  const labelWidth = { err: 'Chyba', withoutErr: 'Šířka' };
  const labelCost = { err: 'Chyba', withoutErr: 'Cena' };
  const labelName = { err: 'Chyba', withoutErr: 'Označení' };

  const userApp = useHookstate({ Admin: false, LoggedIn: false });

  const [UpdatePackage] = useUpdatePackageMutation();
  const [UpdateHistory] = useUpdateHistoryMutation();
  const SuppPackages = useSuppDataQuery();
  const [oldPackName, SetOldPackName] = React.useState('');
  const [suppId, SetSuppId] = React.useState('');

  useEffect(() => {
    const adminEm = process.env.NEXT_PUBLIC_AdminEm;
    if (user) {
      userApp.LoggedIn.set(true);
    }
    if (user?.email === adminEm) {
      userApp.Admin.set(true);
    }
    if (id && SuppPackages.data && SuppPackages) {
      const data = setDataDatabase(id, SuppPackages.data.suplierData);
      if (data) {
        SetSuppId(data.SuppId);
        SetOldPackName(data.PackName);
        settersForDataPack.set({
          SuppId: data.SuppId,
          PackName: data.PackName,
          Cost: data.Cost,
          Plength: data.Plength,
          Weight: data.Weight,
          Width: data.Width,
          Height: data.Height,
        });
      }
    }
  }, [SuppPackages]);

  const handleForm = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const valid: string | undefined = Valid(
      settersForDataPack.Weight.get(),
      settersForDataPack.Cost.get(),
      settersForDataPack.Plength.get(),
      settersForDataPack.Height.get(),
      settersForDataPack.Width.get(),
      setterErrors,
    )?.message;
    if (valid) {
      console.error(valid);
    } else {
      const result = await UpdatePackage({
        variables: {
          Weight: Number(settersForDataPack.Weight.get()),
          Cost: Number(settersForDataPack.Cost.get()),
          Length: Number(settersForDataPack.Plength.get()),
          Height: Number(settersForDataPack.Height.get()),
          Width: Number(settersForDataPack.Width.get()),
          Pack_name: settersForDataPack.PackName.get(),
          PackKey: id,
          SuppId: settersForDataPack.SuppId.get(),
        },
        refetchQueries: [
          { query: SuppDataDocument },
          { query: HistoryDataDocument },
        ],
        awaitRefetchQueries: true,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }).catch((error: string) => console.error('Chyba při úpravě balíku'));

      const response = Response(result?.data?.updatePack);

      if (
        response.error &&
        /Toto označení pužívá jíny balík/.test(response.error) === false
      ) {
        setterForAlertMesssage.errUpdate.set(response.error);
      }

      if (
        response.error &&
        /Toto označení pužívá jíny balík/.test(response.error)
      ) {
        setterErrors.errLabel.set(response.error);
      }

      let updateHistory;
      if (response.data) {
        SetSuppId(response.data.supplier_id);
        setterForAlertMesssage.successUpdate.set(JSON.stringify(response.data));
        updateHistory = await UpdateHistory({
          variables: {
            PackageName: response.data.name_package,
            OldPackName: oldPackName,
            NewPricePack: response.data.cost,
            SuppId: response.data.supplier_id,
          },
          refetchQueries: [{ query: HistoryDataDocument }],
          awaitRefetchQueries: true,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }).catch((error: string) => console.error('Chyba při úpravě historie'));
      }

      if (updateHistory?.data?.updateHistory?.message) {
        setterForAlertMesssage.msgHistory.set(
          updateHistory?.data?.updateHistory?.message,
        );
      }
    }
  };

  if (!userApp.LoggedIn.get() || !userApp.Admin.get()) {
    return (
      <div
        style={{
          textAlign: 'center',
          color: 'red',
          fontSize: '30px',
          fontWeight: 'bold',
          margin: 'auto',
        }}
      >
        Nejsi admin
      </div>
    );
  }
  return (
    <Typography component={'div'}>
      <form
        onSubmit={handleForm}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
        onChange={() => {
          setterForAlertMesssage.set({
            errUpdate: '',
            successUpdate: '',
            msgHistory: '',
          });
          setterErrors.set({
            errCost: '',
            errHeight: '',
            errpLength: '',
            errWeight: '',
            errWidth: '',
            errLabel: '',
          });
        }}
      >
        <div style={{ alignSelf: 'center' }}>
          {MyAlert({
            successUpade: setterForAlertMesssage.successUpdate.value,
            errUpdate: setterForAlertMesssage.errUpdate.value,
            msgHisotry: setterForAlertMesssage.msgHistory.value,
          })}
        </div>
        <CustomFieldset>
          <legend
            style={{
              textAlign: 'center',
              fontSize: '30px',
              fontWeight: 'bold',
            }}
          >
            Balík
          </legend>
          <MyCompTextField
            typeComp="text"
            idComp={idComp}
            labelComp={labelName}
            errorComp={setterErrors.errLabel.get()}
            funcComp={(e) => settersForDataPack.PackName.set(e)}
            helpTexterComp="Zadejte označení balíku"
            valueComp={settersForDataPack.PackName.get()}
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelCost}
            errorComp={setterErrors.errCost.get()}
            funcComp={(e) => settersForDataPack.Cost.set(e)}
            helpTexterComp="Zadejte cenu balíku"
            placeholderComp="Kč"
            valueComp={settersForDataPack.Cost.get()}
          />
        </CustomFieldset>

        <CustomFieldset>
          <legend
            style={{
              textAlign: 'center',
              fontSize: '30px',
              fontWeight: 'bold',
            }}
          >
            Parametry balíku
          </legend>
          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelWidth}
            errorComp={setterErrors.errWidth.get()}
            funcComp={(e) => settersForDataPack.Width.set(e)}
            helpTexterComp="Zadejte šířku balíku"
            placeholderComp="Cm"
            valueComp={settersForDataPack.Width.get()}
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelWeigth}
            errorComp={setterErrors.errWeight.get()}
            funcComp={(e) => settersForDataPack.Weight.set(e)}
            helpTexterComp="Zadejte hmotnost balíku"
            placeholderComp="Cm"
            valueComp={settersForDataPack.Weight.get()}
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelLength}
            errorComp={setterErrors.errpLength.get()}
            funcComp={(e) => settersForDataPack.Plength.set(e)}
            helpTexterComp="Zadejte délu balíku"
            placeholderComp="Cm"
            valueComp={settersForDataPack.Plength.get()}
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelHeight}
            errorComp={setterErrors.errHeight.get()}
            funcComp={(e) => settersForDataPack.Height.set(e)}
            helpTexterComp="Zadejte výšku balíku"
            placeholderComp="Cm"
            valueComp={settersForDataPack.Height.get()}
          />
        </CustomFieldset>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
          }}
        >
          <UpdateButton type="submit">Upravit</UpdateButton>
          <BackButtn onClick={() => Back(suppId)}>Zpět</BackButtn>
        </div>
      </form>
    </Typography>
  );
};
