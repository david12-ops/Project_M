import Head from 'next/head';
import { useRouter } from 'next/router';

import styles from '../../../styles/Home.module.css';
import { FormSupplierUpdate } from '../../components/componentsFormsAdmin/form-supplier-update';
import { Navbar } from '../../components/navbar2';

export default function Update() {
  const router = useRouter();
  const { query } = router;
  const { id } = query;
  return (
    <div className={styles.container}>
      <Head>
        <title>Update supplier</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className={styles.main}>
        <div>
          <FormSupplierUpdate id={id ? String(id) : ''} />
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
