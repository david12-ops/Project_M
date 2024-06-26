import Head from 'next/head';
import { useEffect, useState } from 'react';

import { SuppcardPageBody } from '@/copmonents/componentBody/suppcard-body';
import { useSuppDataQuery } from '@/generated/graphql';

import { useAuthContext } from '../copmonents/auth-context-provider';
import { Navbar } from '../copmonents/navbar';
import styles from '../styles/Home.module.css';

// eslint-disable-next-line import/no-default-export
export default function SuppCards() {
  const { user } = useAuthContext();
  const suppData = useSuppDataQuery();
  const [body, SetBody] = useState<JSX.Element | undefined>(undefined);

  useEffect(() => {
    if (!suppData.loading) {
      const bodyPage = (
        <SuppcardPageBody
          data={suppData.data}
          styling={{
            textAlign: 'center',
            color: 'orange',
            fontSize: '30px',
            fontWeight: 'bold',
            margin: 'auto',
          }}
        />
      );

      SetBody(bodyPage);
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
      <main className={styles.main}>{body}</main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
