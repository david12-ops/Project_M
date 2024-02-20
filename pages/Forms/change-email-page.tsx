import Head from 'next/head';

import styles from '../../styles/Home.module.css';
import { PageFormChangeEm } from '../components/componentsForAuth/change-email';
import { Navbar } from '../components/navbar2';

export default function ChangeEmPage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Change email account</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      <main className={styles.main}>
        <PageFormChangeEm />
      </main>
    </div>
  );
}