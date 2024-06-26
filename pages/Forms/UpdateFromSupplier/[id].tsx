import Head from 'next/head';
import { useRouter } from 'next/router';

import { useAuthContext } from '@/copmonents/auth-context-provider';

import { FormSupplierUpdate } from '../../../copmonents/componentsFormsAdmin/form-supplier-update';
import { Navbar } from '../../../copmonents/navbar';
import styles from '../../../styles/Home.module.css';

// eslint-disable-next-line import/no-default-export
export default function Update() {
  const router = useRouter();
  const { query } = router;
  const { id } = query;
  const { user } = useAuthContext();
  return (
    <div className={styles.container}>
      <Head>
        <title>Uparvení zásilkové služby</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={user} />
      <main className={styles.main}>
        <div>
          <FormSupplierUpdate id={id ? String(id) : ''} />
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
