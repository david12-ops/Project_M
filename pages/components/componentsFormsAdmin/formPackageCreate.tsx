import { getAuth } from 'firebase/auth';
import router from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  useNewPackageToFirestoreMutation,
  useSuppDataQuery,
} from '@/generated/graphql';

import styles from '../../../styles/stylesForm/styleForms.module.css';

// není validace cisel na frontendu

type Props = {
  id: string;
};

const Refetch = (data: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  data.refetch();
};

const parseIntReliable = (numArg: string) => {
  const min = 1;
  if (numArg.length > 0) {
    const parsed = Number.parseInt(numArg, 10);
    if (parsed === 0) {
      // eslint-disable-next-line max-depth
      if (numArg.replaceAll('0', '') === '') {
        return 0;
      }
    } else if (Number.isSafeInteger(parsed) && Number(parsed) > min) {
      return parsed;
    }
  }
  return false;
};

export const FormPackage: React.FC<Props> = ({ id }) => {
  // const { user } = useAuthContext();
  const [kg, SetKg] = React.useState(' ');
  const [cost, SetCost] = React.useState(' ');
  const [delka, SetDelka] = React.useState(' ');
  const [vyska, SetVyska] = React.useState(' ');
  const [sirka, SetSirka] = React.useState(' ');
  const [packName, SetPackName] = React.useState(' ');
  const [newPackage] = useNewPackageToFirestoreMutation();
  const SuppPackages = useSuppDataQuery();
  const [admin, SetAdmin] = useState(false);
  const [logged, SetLogin] = useState(false);

  useEffect(() => {
    const Admin = process.env.NEXT_PUBLIC_AdminEm;
    const auth = getAuth();
    if (auth.currentUser) {
      SetLogin(true);
    }
    if (auth.currentUser?.email === Admin) {
      SetAdmin(true);
    }
  }, [logged, admin]);

  const Valid = (
    hmotnostarg: string,
    costarg: string,
    delkaarg: string,
    vyskaarg: string,
    sirkaarg: string,
    // eslint-disable-next-line unicorn/consistent-function-scoping, consistent-return
  ) => {
    if (!parseIntReliable(hmotnostarg)) {
      return new Error('Invalid argument, expext number bigger than 0');
    }

    if (!parseIntReliable(costarg)) {
      return new Error('Invalid argument, expext number bigger than 0');
    }

    if (!parseIntReliable(delkaarg)) {
      return new Error('Invalid argument, expext number bigger than 0');
    }

    if (!parseIntReliable(vyskaarg)) {
      return new Error('Invalid argument, expext number bigger than 0');
    }

    if (!parseIntReliable(sirkaarg)) {
      return new Error('Invalid argument, expext number bigger than 0');
    }
  };

  // eslint-disable-next-line consistent-return
  const handleForm = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const pID = uuidv4();
    const valid = Valid(kg, cost, delka, vyska, sirka)?.message;
    if (valid) {
      alert(valid);
    } else {
      const result: any = await newPackage({
        variables: {
          Hmotnost: Number(kg),
          Cost: Number(cost),
          Delka: Number(delka),
          Vyska: Number(vyska),
          Sirka: Number(sirka),
          Pack_name: packName,
          SuppID: id,
          PackId: pID,
        },
      });

      const err = result.data?.PackageToFirestore?.message;
      const data = result.data?.PackageToFirestore?.data;

      if (err) {
        alert(err);
      }

      if (data) {
        Refetch(SuppPackages);
        alert(`Balíček byl vytvořen s parametry: Váha: ${data.weight},
            Délka: ${data.Plength},
            Šířka: ${data.width},
            Výška: ${data.height},
            Označení: ${data.name_package}`);
        return router.push(`/../../admpage/${data.supplier_id}`);
      }
    }
  };

  if (!logged || !admin) {
    return (
      <div
        style={{
          textAlign: 'center',
          color: 'red',
          fontSize: '30px',
          fontWeight: 'bold',
        }}
      >
        Nejsi admin!!!!
      </div>
    );
  }
  return (
    <div>
      <div className={styles.container}>
        <h1
          style={{
            textAlign: 'center',
            paddingBottom: '20px',
            fontWeight: 'bold',
            fontFamily: 'serif',
            color: 'orangered',
          }}
        >
          Create package
        </h1>
        <form onSubmit={handleForm} className={styles.form}>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Name</p>
              <input
                className={styles.input}
                onChange={(e) => SetPackName(e.target.value)}
                required
                type="text"
                placeholder="Name"
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Cena</p>
              <input
                className={styles.input}
                onChange={(e) => SetCost(e.target.value)}
                required
                type="number"
                placeholder="Kč"
              />
            </label>
          </div>
          <h3 className={styles.Nadpisy}>Parametry baliku</h3>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Sirka</p>
              <input
                className={styles.input}
                onChange={(e) => SetSirka(e.target.value)}
                required
                type="number"
                placeholder="Cm"
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Hmotnost</p>
              <input
                className={styles.input}
                onChange={(e) => SetKg(e.target.value)}
                required
                type="number"
                placeholder="Kg"
              />
            </label>
          </div>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Delka</p>
              <input
                className={styles.input}
                onChange={(e) => SetDelka(e.target.value)}
                required
                type="number"
                placeholder="Cm"
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Vyska</p>
              <input
                className={styles.input}
                onChange={(e) => SetVyska(e.target.value)}
                required
                type="number"
                placeholder="Cm"
              />
            </label>
          </div>
          <div className={styles.divinput}>
            <button className={styles.crudbtn} type="submit">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
