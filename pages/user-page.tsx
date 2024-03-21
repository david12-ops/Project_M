import { Typography } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import { useHistoryDataQuery } from '@/generated/graphql';

import styles from '../styles/Home.module.css';
import { useAuthContext } from './components/auth-context-provider';
import { PageFormChangeEm } from './components/componentsForAuth/change-email';
import { PageFormChangePass } from './components/componentsForAuth/change-pass';
import { Navbar } from './components/navbar';

const buttonPart = (name: string) => {
  if (name === 'dpd') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}
      >
        <button
          style={{
            width: '80px',
            height: '60px',
            borderRadius: '10px',
            backgroundColor: 'red',
            color: 'white',
            fontWeight: 'bold',
            border: ' solid red',
          }}
        >
          Smazat
        </button>
        <Link href="https://zrukydoruky.dpd.cz/">
          <button
            style={{
              width: '80px',
              height: '60px',
              borderRadius: '10px',
              backgroundColor: '#23B8FA',
              color: 'white',
              fontWeight: 'bold',
              border: ' solid #23B8FA',
            }}
          >
            Přejít na stránku
          </button>
        </Link>
      </div>
    );
  }

  return (
    <button
      style={{
        width: '80px',
        height: '60px',
        borderRadius: '10px',
        backgroundColor: 'red',
        color: 'white',
        fontWeight: 'bold',
        border: ' solid red',
      }}
    >
      Delete
    </button>
  );
};

export default function UserPage() {
  const { user } = useAuthContext();
  const email = user?.email;
  const hitoryD = useHistoryDataQuery();
  return (
    <div className={styles.container}>
      <Head>
        <title>User page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={user} />

      <main className={styles.main}>
        <Typography style={{ textAlign: 'center' }} variant="h4" component="h1">
          {email}
        </Typography>
        <Typography
          component={'div'}
          style={{
            display: 'flex',
            gap: '40px',
            margin: '20px',
          }}
        >
          <Typography
            component="div"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {<PageFormChangePass />}
            {<PageFormChangeEm />}
          </Typography>
        </Typography>
        <Typography style={{ textAlign: 'center' }} variant="h5" component="h1">
          History
        </Typography>
        {hitoryD.data?.historyUserData.map((historyItm) => {
          return (
            // Využití modalu
            <Typography
              component={'div'}
              key={historyItm.historyId}
              style={{
                backgroundColor: 'wheat',
                borderRadius: '10px',
                margin: '20px',
                border: '5px solid #FAEA88',
              }}
            >
              <Typography
                component={'div'}
                style={{
                  display: 'flex',
                  gap: '40px',
                  margin: '20px',
                }}
              >
                <Typography component={'div'}>
                  <strong>Data z formulare</strong>
                  <Typography component={'p'}>
                    Vyska: {historyItm.dataForm.height}
                  </Typography>
                  <Typography component={'p'}>
                    Sirka: {historyItm.dataForm.width}
                  </Typography>
                  <Typography component={'p'}>
                    Delka: {historyItm.dataForm.plength}
                  </Typography>
                  <Typography component={'p'}>
                    Hmotnost: {historyItm.dataForm.weight}
                  </Typography>
                  <Typography component={'p'}>
                    Odkud: {historyItm.dataForm.placeFrom}
                  </Typography>
                  <Typography component={'p'}>
                    Kam: {historyItm.dataForm.placeTo}
                  </Typography>
                </Typography>
                <Typography component={'div'}>
                  <strong>Data dodavatele</strong>
                  <Typography component={'p'}>
                    Jmeno: {historyItm.suppData.name}
                  </Typography>
                  <Typography component={'p'}>
                    Pojisteni: {historyItm.suppData.insurance}
                  </Typography>
                  <Typography component={'p'}>
                    Doruceni: {historyItm.suppData.delivery}
                  </Typography>
                  <Typography component={'p'}>
                    Vyzvednuti: {historyItm.suppData.pickup}
                  </Typography>
                  <Typography component={'p'}>
                    V boxu: {historyItm.suppData.packInBox}
                  </Typography>
                  <Typography component={'p'}>
                    Štítek: {historyItm.suppData.shippingLabel}
                  </Typography>
                  <Typography component={'p'}>
                    Na dobírku: {historyItm.suppData.sendCashDelivery}
                  </Typography>
                  <Typography component={'p'}>
                    Ve folii: {historyItm.suppData.foil}
                  </Typography>
                  <Typography component={'p'}>
                    Celkova cena: {historyItm.suppData.cost}
                  </Typography>
                </Typography>

                <Typography component={'div'}>
                  <strong>Balík</strong>
                  <Typography component={'p'}>
                    Oznaceni: {historyItm.suppData.packName}
                  </Typography>
                </Typography>
                {buttonPart(historyItm.suppData.name)}
              </Typography>
            </Typography>
          );
        })}
      </main>
    </div>
  );
}
