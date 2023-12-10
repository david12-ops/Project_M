import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useSuppDataQuery } from '@/generated/graphql';

import styles from '../../styles/Home.module.css';
import stylesF from '../../styles/stylesForm/style.module.css';
import { PackCard } from '../components/Cards/packsCard';
import { MediaCard } from '../components/Cards/suppCard';
import { SearchAppBar2 } from '../components/navbar2';

// const AvgPrice = (id) => {
//   // prumerna cena z baliku co ma
//   // const packD = usePackageDataQuery();

//   // const avgPrice = packD.data?.packageData.find(
//   //   (actPack) => actPack.supplierId === id,
//   // );
//   // return AvgPrice;
// };

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const suppD = useSuppDataQuery();

  const router = useRouter();
  const { query } = router;
  const { id } = query;

  const selectedSupp = suppD.data?.suplierData.find(
    (actPack: any) => actPack.supplierId === id,
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Upadte package</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SearchAppBar2 />
      <main className={styles.main}>
        <h1 style={{ textAlign: 'center' }}>
          Welocome to package detail of supplier
        </h1>
        {selectedSupp ? (
          <MediaCard
            key={selectedSupp.supplierId}
            packInBox={selectedSupp.packInBox}
            name={selectedSupp.suppName}
            sendCash={selectedSupp.sendCashDelivery}
            folie={selectedSupp.foil}
            shippingLabel={selectedSupp.shippingLabel}
            pickUp={selectedSupp.pickUp}
            delivery={selectedSupp.delivery}
            insurance={selectedSupp.insurance}
            avgPrice={0}
          />
        ) : (
          <div
            style={{
              textAlign: 'center',
              color: 'red',
              fontSize: '40px',
              fontWeight: 'bold',
            }}
          >
            Dodavatel nenalazen!!
          </div>
        )}
        <h2
          style={{
            marginTop: '20px',
            color: '#D67F76',
            fontSize: '30px',
            textAlign: 'center',
          }}
        >
          Packages
        </h2>
        {selectedSupp?.package ? (
          <div>
            {selectedSupp?.package.map((item: any) => {
              const keys = Object.keys(item);
              return keys.map((key: any) => (
                <div
                  key={key} // Ensure each child in a list has a unique "key" prop
                  style={{
                    backgroundColor: '#D67F76',
                    // display: 'flex',
                    // flexDirection: 'row',
                    // gap: '15px',
                    padding: '10px',
                    margin: '10px',
                    // justifyContent: 'space-around',
                    borderRadius: '10px',
                  }}
                >
                  <PackCard
                    key={key}
                    Name={item[key].name_package}
                    Cost={item[key].cost}
                    Weight={item[key].weight}
                    Width={item[key].width}
                    Length={item[key].Plength}
                    Heiht={item[key].height}
                  />
                </div>
              ));
            })}
            <Link
              key="CreateFormPackage"
              href={`../../Forms/CreateFormPackage/${id}`}
            >
              <button className={stylesF.crudbtn}>Create</button>
            </Link>
          </div>
        ) : (
          <div>
            <div
              style={{
                textAlign: 'center',
                color: 'orange',
                fontSize: '30px',
                fontWeight: 'bold',
              }}
            >
              Tento dodavatel nemá balíčky
            </div>
            <div>
              <Link
                key="CreateFormPackage"
                href={`../../Forms/CreateFormPackage/${id}`}
              >
                <button className={stylesF.crudbtn}>Create</button>
              </Link>
            </div>
          </div>
        )}
        {selectedSupp?.package ? (
          <div>{JSON.stringify(Object.values(selectedSupp.package))}</div>
        ) : (
          ' '
        )}
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
