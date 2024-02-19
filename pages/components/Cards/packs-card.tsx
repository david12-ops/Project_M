import { CardActions, Link } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import { SuppDataDocument, useDeletePacMutation } from '@/generated/graphql';

import styles from '../../../styles/stylesForm/style.module.css';

type Props = {
  Heiht: number;
  Weight: number;
  Width: number;
  Length: number;
  Name: string;
  Cost: number;
  keyPac: string;
  sId: string;
};

export const PackCard: React.FC<Props> = ({
  Heiht,
  Weight,
  Width,
  Length,
  Name,
  Cost,
  keyPac,
  sId,
}) => {
  const [del] = useDeletePacMutation();
  const Del = async (key: string, suppId: string) => {
    const deleted = await del({
      variables: {
        Id: suppId,
        Key: key,
      },
      refetchQueries: [{ query: SuppDataDocument }],
      awaitRefetchQueries: true,
    });
    if (deleted.data?.deletePack?.error) {
      alert(`${deleted.data?.deletePack?.error}`);
    }
    if (!deleted.data?.deletePack?.deletion) {
      alert('Balíček smazán nebyl');
    }
    alert('Balíček byl smazán');
  };
  return (
    <Card sx={{ maxWidth: 290 }}>
      <CardMedia
        component="img"
        alt={Name}
        height="140"
        image="/nettes-karikaturbeitragspaketgekritzel-geschenk-shop-logo-grafiksymbol-fuer-medienmarkierungen_44769-1534.webp"
      />
      <CardContent>
        <Typography
          sx={{ textAlign: 'center' }}
          gutterBottom
          variant="h5"
          component="div"
        >
          {Name}
        </Typography>

        <Typography
          sx={{ textAlign: 'center', borderBottom: 'solid' }}
          gutterBottom
          variant="h6"
          component="div"
        >
          Rozměry
        </Typography>

        <Typography
          sx={{ textAlign: 'center' }}
          sx-gutterbottom="true"
          variant="body1"
          component="div"
        >
          Výška: {Heiht} cm
        </Typography>

        <Typography
          sx={{ textAlign: 'center' }}
          sx-gutterbottom="true"
          variant="body1"
          component="div"
        >
          Šířka: {Width} cm
        </Typography>

        <Typography
          sx={{ textAlign: 'center' }}
          sx-gutterbottom="true"
          variant="body1"
          component="div"
        >
          Délka: {Length} cm
        </Typography>

        <Typography
          sx={{ textAlign: 'center' }}
          sx-gutterbottom="true"
          variant="body1"
          component="div"
        >
          Hmotnost: {Weight} Kg
        </Typography>

        <Typography
          sx={{ textAlign: 'center', borderBottom: 'solid' }}
          gutterBottom
          variant="h6"
          component="div"
        >
          Cena
        </Typography>

        <Typography
          sx={{ textAlign: 'center' }}
          sx-gutterbottom="true"
          variant="body1"
          component="div"
        >
          {Cost} Kč
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <button onClick={() => Del(keyPac, sId)} className={styles.crudbtDel}>
          Delete
        </button>

        <Link
          key="UpdateFormPackage"
          href={`../../Forms/UpdateFormPackage/${keyPac}`}
        >
          <button className={styles.crudbtnTable}>Update</button>
        </Link>
      </CardActions>
    </Card>
  );
};

// Upravit opacity na button
