import Head from 'next/head';
import { useRouter } from 'next/router';

import { useAuthContext } from '@/pages/components/auth-context-provider';
import { FormPackage } from '@/pages/components/componentsFormsAdmin/form-package-create';

import styles from '../../../styles/Home.module.css';
import { Navbar } from '../../components/navbar';

// eslint-disable-next-line import/no-default-export
export default function CreateForm() {
  const { query } = useRouter();
  const { id } = query;
  const { user } = useAuthContext();

  return (
    <div className={styles.container}>
      <Head>
        <title>Vytvoření balíku</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={user} />

      <main className={styles.main}>
        <FormPackage id={String(id)} />
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
