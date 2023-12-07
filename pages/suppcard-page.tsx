import Head from 'next/head';

import { useSuppDataQuery } from '@/generated/graphql';

import styles from '../styles/Home.module.css';
import { MediaCard } from './components/Cards/SuppCards';
import { SearchAppBar2 } from './components/navbar2';

// const AvgPrice = (id) => {
//   // prumerna cena z baliku co ma
//   // const packD = usePackageDataQuery();

//   // const avgPrice = packD.data?.packageData.find(
//   //   (actPack) => actPack.supplierId === id,
//   // );
//   // return AvgPrice;
// };

// eslint-disable-next-line import/no-default-export
export default function SuppCards() {
  const suppData = useSuppDataQuery();
  return (
    <div className={styles.container}>
      <Head>
        <title>Details</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SearchAppBar2 />
      <main className={styles.main}>
        <h1 style={{ textAlign: 'center' }}>Welcome to detail of suppliers</h1>
        {suppData.data?.suplierData.map((item) => (
          <MediaCard
            key={item.supplierId}
            packInBox={item.packInBox}
            name={item.suppName}
            sendCash={item.sendCashDelivery}
            folie={item.foil}
            shippingLabel={item.shippingLabel}
            pickUp={item.pickUp}
            delivery={item.delivery}
            insurance={item.insurance}
            avgPrice={0}
          />
        ))}
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
