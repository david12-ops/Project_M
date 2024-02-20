import { Button, Link } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import styles from '../../../styles/stylesForm/style.module.css';

type Props = {
  name: string;
  pickUp: string;
  delivery: string;
  packInBox: string;
  folie: string;
  shippingLabel: string;
  insurance: number;
  sendCash: string;
  suppId: string;
};

const Odstavec = (
  pickUp: string,
  delivery: string,
  packInBox: string,
  folie: string,
  shippingLabel: string,
  insurance: number,
  sendCash: string,
) => {
  const odstavec =
    packInBox === 'Ano' ? (
      <p>
        Zásilku je nutné zabalit <strong>do krabice</strong>
      </p>
    ) : (
      <p>
        Zásilku můžete zabalit <strong>do krabice</strong>
      </p>
    );

  const odstavec2 =
    folie === 'Ano' ? (
      <p>
        Může být zabaleno <strong>ve fólii</strong>
      </p>
    ) : (
      <p>
        Nesmí být zabaleno <strong>ve fólii</strong>
      </p>
    );

  const odstavec3 =
    shippingLabel === 'Ano' ? (
      <p> Přepravní štítek přiveze kurýr</p>
    ) : (
      <p> Přepravní štítek nepřiveze kurýr</p>
    );

  const odstavec4 =
    sendCash === 'Ano' ? (
      <p>
        Možnost poslat <strong>na dobírku</strong>
      </p>
    ) : (
      <p>
        Není Možnost poslat <strong>na dobírku</strong>
      </p>
    );

  return (
    <div>
      <p>
        Vyzvednutí nejdříve <strong>{pickUp}</strong>
      </p>
      <p>
        Doručení nejdříve <strong>{delivery}</strong>
      </p>
      {odstavec}
      {odstavec2}
      {odstavec3}
      <p>
        {insurance > 0
          ? `Pojištění do ${insurance} Kč v ceně`
          : 'Bez pojištění'}
      </p>
      {odstavec4}
    </div>
  );
};

export const DetailSupps: React.FC<Props> = ({
  name,
  pickUp,
  delivery,
  packInBox,
  folie,
  shippingLabel,
  insurance,
  sendCash,
  suppId,
}) => {
  return (
    <Card
      sx={{
        minWidth: 300,
        width: 750,
        maxHeight: 500,
        backgroundColor: '#DDD8BD',
        margin: '20px',
      }}
    >
      <CardContent
        sx={{
          display: 'grid',
          columnGap: '50px',
          gridTemplateColumns: 'repeat(3, 1fr)',
        }}
      >
        <Typography
          sx={{ gridColumnStart: 1, padding: '20px', fontSize: '30px' }}
          gutterBottom
          variant="h5"
          component="div"
        >
          <strong>{name}</strong>
        </Typography>
        <CardMedia
          sx={{
            gridColumnStart: 2,
            width: '100',
            height: '50px',
            padding: '20px',
          }}
          image="/static/images/cards/contemplative-reptile.jpg"
        />
        <Typography
          sx={{
            gridColumnStart: 1,
            gridColumnEnd: 3,
            padding: '20px',
            fontSize: '16px',
          }}
          variant="body2"
          color="text.secondary"
        >
          {Odstavec(
            pickUp,
            delivery,
            packInBox,
            folie,
            shippingLabel,
            insurance,
            sendCash,
          )}
        </Typography>
        <Typography
          sx={{ gridColumnStart: 3, padding: '20px', fontSize: '16px' }}
          variant="body2"
          color="text.secondary"
        >
          <CardActions style={{ justifyContent: 'center' }}>
            <Link key="packsCard" href={`/packsCard/${suppId}`}>
              <Button className={styles.crudbtnTable}>Packages</Button>
            </Link>
          </CardActions>
        </Typography>
      </CardContent>
    </Card>
  );
};

// 404 not found