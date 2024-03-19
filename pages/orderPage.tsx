import Head from 'next/head';
import React from 'react';

import { authUtils } from '@/firebase/auth-utils';

import styles from '../styles/Home.module.css';
// import { StepperComp } from './components/multiForm';
import { Navbar } from './components/navbar2';

export default function Stepper() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={authUtils.getCurrentUser()} />

      <main className={styles.main}>
        {/* <div>
          <StepperComp />
        </div> */}
      </main>
    </div>
  );
}
