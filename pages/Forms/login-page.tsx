import Head from 'next/head';

import { useAuthContext } from '../../copmonents/auth-context-provider';
import { PageFormLogin } from '../../copmonents/componentsForAuth/login';
import { Navbar } from '../../copmonents/navbar';
import styles from '../../styles/Home.module.css';

// eslint-disable-next-line import/no-default-export
export default function LoginPage() {
  const { user } = useAuthContext();
  return (
    <div className={styles.container}>
      <Head>
        <title>Přihlášení</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={user} />

      <main className={styles.main}>
        <PageFormLogin />
      </main>
    </div>
  );
}
