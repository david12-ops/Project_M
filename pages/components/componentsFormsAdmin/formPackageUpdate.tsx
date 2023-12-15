// eslint-disable-next-line unicorn/filename-case
import router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';

import {
  useSuppDataQuery,
  useUpdatePackageMutation,
} from '@/generated/graphql';

import styles from '../../../styles/stylesForm/styleForms.module.css';

type Props = {
  id: string;
};

const NoHtmlSpecialChars = (ustring: string) => {
  // zakladni - mozne pouziti cheerio or htmlparser2
  // const htmlRegex = /<[^>]*>$/;
  const option = /<[^>]*>/;
  if (option.test(ustring)) {
    alert('HTML code is not supported (<text></text>');
  }
  return ustring;
};

const Convert = (stringToNum: string) => {
  const numberFrString = 0;
  if (!Number.parseInt(stringToNum, numberFrString)) {
    alert('Invalid argument');
  }
  return Number.parseInt(stringToNum, numberFrString);
};

export const FormPackageUpdate: React.FC<Props> = ({ id }) => {
  // pouziti loadingu u mutation
  const [kg, SetKg] = React.useState(' ');
  const [cost, SetCost] = React.useState(' ');
  const [delka, SetDelka] = React.useState(' ');
  const [vyska, SetVyska] = React.useState(' ');
  const [sirka, SetSirka] = React.useState(' ');
  const [packName, SetPackName] = React.useState(' ');
  const [ActpackName, SetActPackName] = React.useState(' ');

  const [UpdatePackage] = useUpdatePackageMutation();
  const SuppPackages = useSuppDataQuery();

  useEffect(() => {
    if (id && SuppPackages.data && SuppPackages) {
      // const actualPack = SuppPackages.data?.suplierData.find(
      //   (actPack) => actPack.package === id,
      // );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      SuppPackages.data.suplierData.forEach((item) => {
        if (item.package) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          item.package.forEach(
            (pack: {
              [name: string]: {
                weight: number;
                height: number;
                width: number;
                Plength: number;
                name_package: string;
                cost: number;
              };
            }) => {
              // jmeno balicku
              // const nameItm = Object.keys(pack)[0];
              const itm = pack[id];
              console.log('itm', itm);
              // eslint-disable-next-line @typescript-eslint/no-for-in-array, guard-for-in
              if (itm) {
                SetKg(itm.weight.toString());
                SetCost(itm.cost.toString());
                SetDelka(itm.Plength.toString());
                SetVyska(itm.height.toString());
                SetSirka(itm.width.toString());
                SetActPackName(itm.name_package.toString());
                SetPackName(itm.name_package.toString());
              }
            },
          );
        } else {
          alert('Balíček nenalezen');
        }
      });
    }
  }, [id, SuppPackages.data]);

  const handleForm = async (event: React.FormEvent) => {
    // lepsi informovani o chybe
    // route push po formu
    // kontrola zda oznaci nez klikne
    event.preventDefault();
    // Mutation
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const updateVal = await UpdatePackage({
      variables: {
        Hmotnost: Convert(kg),
        Cost: Convert(cost),
        Delka: Convert(delka),
        Vyska: Convert(vyska),
        Sirka: Convert(sirka),
        Pack_name: NoHtmlSpecialChars(packName),
        ActPackName: NoHtmlSpecialChars(ActpackName),
        PackKey: id,
        // SuppId: suppId,
        // lastSuppId: suppIdLast,
      },
    });
    // vracet s resolveru suppid
    // zpetne zjisteni supp id
    if (updateVal.errors) {
      alert(`Balíček nebyl změněn, ${updateVal.errors}`);
    } else {
      return router.push(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        `/../../admpage/${suppId}`,
      );
    }
  };

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
          Update package
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
                placeholder={ActpackName}
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
                value={cost}
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
                value={sirka}
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
                value={kg}
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
                value={delka}
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
                value={vyska}
              />
            </label>
          </div>
          <div className={styles.divinput}>
            <button
              onClick={handleForm}
              className={styles.crudbtn}
              type="submit"
            >
              Upadte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
