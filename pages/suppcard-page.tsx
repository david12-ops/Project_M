import Head from 'next/head';
import { useEffect, useState } from 'react';

import { SuppDataQuery, useSuppDataQuery } from '@/generated/graphql';

import { useAuthContext } from '../copmonents/auth-context-provider';
import { DetailSupps } from '../copmonents/Cards/supp-cards';
import { Navbar } from '../copmonents/navbar';
import styles from '../styles/Home.module.css';

type Item = SuppDataQuery | undefined;

const IsThereSupp = (data: Item) => {
  return !!data;
};

const PageBody = (warning: boolean, dataSupp: Item) => {
  if (!warning) {
    return (
      <div
        style={{
          textAlign: 'center',
          color: 'orange',
          fontSize: '30px',
          fontWeight: 'bold',
          margin: 'auto',
        }}
      >
        Nejsou zásilkové služby
      </div>
    );
  }

  return (
    <div>
      {dataSupp?.suplierData.map((item) => (
        <DetailSupps
          key={item.supplierId}
          packInBox={item.packInBox}
          name={item.suppName}
          sendCash={item.sendCashDelivery}
          folie={item.foil}
          shippingLabel={item.shippingLabel}
          pickUp={item.pickUp}
          delivery={item.delivery}
          insurance={item.insurance}
          suppId={item.supplierId}
        />
      ))}
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default function SuppCards() {
  const { user } = useAuthContext();
  const suppData = useSuppDataQuery();
  const [body, SetBody] = useState({ data: <div></div> });

  useEffect(() => {
    if (!suppData.loading) {
      const errSup = IsThereSupp(suppData.data);

      SetBody({
        data: PageBody(errSup, suppData.data),
      });
    }
  }, [suppData]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Detil zásilkových služeb</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={user} />
      <main className={styles.main}>{body.data}</main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
