import Head from 'next/head';

import styles from '../styles/Home.module.css';
import { PageFormLogin } from './components/login';
import { SearchAppBar } from './components/navbar';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SearchAppBar />

      <main className={styles.main}>
        <PageFormLogin />
      </main>
    </div>
  );
}
