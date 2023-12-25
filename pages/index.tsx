import Head from 'next/head';

import {
  useMutSuitableSuppMutation,
  useUserDataQuery,
} from '@/generated/graphql';

import styles from '../styles/Home.module.css';
import { useAuthContext } from './components/auth-context-provider';
import { SearchAppBar2 } from './components/navbar2';

export default function Home() {
  const userD = useUserDataQuery();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const [suitableSupp] = useMutSuitableSuppMutation();
  const { user, loading } = useAuthContext();
  const s = userD.data?.userdata;
  const EmUS = () => {
    return s?.map((em) => (
      <p key={em.email}>
        {em.email} : {em.dataUs} : {em.historyId} : {em.supplierId}
      </p>
    ));
  };
  const P = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    return <div>{user?.email}</div>;
  };
  const HandleForm = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await suitableSupp({
      variables: {
        Width: 7,
        Weight: 15,
        Height: 6,
        Length: 7,
      },
    });
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SearchAppBar2 />

      <main className={styles.main}>
        <div>{EmUS()}</div>
        <div>{P()}</div>
        <button onClick={HandleForm}>odeslat</button>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
