import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { PacksCardBody } from '@/copmonents/componentBody/packscard-body';
import { useSuppDataQuery } from '@/generated/graphql';

import { useAuthContext } from '../../copmonents/auth-context-provider';
import { Navbar } from '../../copmonents/navbar';
import styles from '../../styles/Home.module.css';

// eslint-disable-next-line import/no-default-export
export default function PacksCards() {
  const suppD = useSuppDataQuery();
  const [body, SetBody] = useState<JSX.Element | undefined>(undefined);
  const [admin, SetAdmin] = useState(false);
  const [logged, SetLogin] = useState(false);
  const router = useRouter();

  const { user } = useAuthContext();

  const { query } = router;
  const { id } = query;
  const title = `Vítejte na detailní strance balíčků ${
    user ? user.email ?? '' : ''
  }`;

  useEffect(() => {
    const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;
    if (user) {
      SetLogin(true);
    }
    if (user?.uid === adminId) {
      SetAdmin(true);
    }
    if (!suppD.loading) {
      const selectedSupp = suppD.data?.suplierData.find(
        (actPack) => actPack?.supplierId === id,
      );

      SetBody(
        <PacksCardBody
          data={selectedSupp}
          stylingErr={{
            textAlign: 'center',
            color: 'red',
            fontSize: '40px',
            fontWeight: 'bold',
            margin: 'auto',
          }}
          stylingImgErr={{
            border: 'solid red',
            borderRadius: '10px',
            color: 'lightblue',
            margin: 'auto',
          }}
          stylingWarning={{
            textAlign: 'center',
            color: 'orange',
            fontSize: '30px',
            fontWeight: 'bold',
            margin: 'auto',
          }}
          user={user}
          adminId={adminId}
        />,
      );
    }
  }, [suppD, logged, admin]);

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={user} />
      <main className={styles.main}>
        <h2
          style={{
            marginTop: '20px',
            color: '#3DA1FF',
            fontSize: '30px',
            textAlign: 'center',
          }}
        >
          Balíky
        </h2>
        {body}
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
