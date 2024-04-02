import Head from 'next/head';
import { useEffect, useState } from 'react';

import { useAuthContext } from '../copmonents/auth-context-provider';
import { DataGridSupplier } from '../copmonents/componentsTables/table-supp';
import { Navbar } from '../copmonents/navbar';
import styles from '../styles/Home.module.css';

const Page = (logged: boolean, admin: boolean) => {
  if (!logged || !admin) {
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
        Přístup pouze pro administrátora
      </div>
    );
  }

  return (
    <div>
      <h2
        style={{
          marginTop: '70px',
          color: '#5193DE',
          fontSize: '30px',
          textAlign: 'center',
        }}
      >
        Zásilkové služby
      </h2>
      <DataGridSupplier />
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default function AdmPage() {
  const { user } = useAuthContext();
  const [admin, SetAdmin] = useState(false);
  const [logged, SetLogin] = useState(false);

  useEffect(() => {
    const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;

    if (user) {
      SetLogin(true);
    }
    if (user?.uid === adminId) {
      SetAdmin(true);
    }
  }, [logged, admin]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Admin page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={user} />

      <main className={styles.main}>{Page(logged, admin)}</main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
