import { State, useHookstate } from '@hookstate/core';
import { Alert, Button, styled, Typography } from '@mui/material';
import router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  SuppDataDocument,
  useNewPackageToFirestoreMutation,
} from '@/generated/graphql';

import { useAuthContext } from '../auth-context-provider';
import { MyCompTextField } from '../text-field';

type Props = {
  id: string;
};

const CreateButton = styled(Button)({
  backgroundColor: 'green',
  color: 'white',
  width: '30%',
});

const CustomFieldset = styled('fieldset')({
  border: '5px solid #5193DE',
  borderRadius: '10px',
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  padding: '1rem',
});

const BackButtn = styled(Button)({
  backgroundColor: '#5193DE',
  color: 'white',
  width: '30%',
});

type CreatedPackage = {
  weight: number;
  cost: number;
  Plength: number;
  height: number;
  width: number;
  name_package: string;
  supplier_id: string;
};

type ErrSetterProperties = {
  errWeight: string;
  errCost: string;
  errpLength: string;
  errHeight: string;
  errWidth: string;
  errLabel: string;
};

const parseIntReliable = (numArg: string) => {
  if (numArg.length > 0) {
    const parsed = Number.parseInt(numArg, 10);
    if (parsed === 0) {
      // eslint-disable-next-line max-depth
      if (numArg.replaceAll('0', '') === '') {
        return 0;
      }
    } else if (Number.isSafeInteger(parsed)) {
      return parsed;
    }
  }
  return false;
};

const isInt = (numArg: string, min: number) => {
  const parsed = parseIntReliable(numArg);

  return parsed !== false && parsed > min;
};

const Valid = (
  weightarg: string,
  costarg: string,
  pLengtharg: string,
  heightarg: string,
  widtharg: string,
  errSetter: State<ErrSetterProperties>,
) => {
  const messageInt = 'Očekává se číslo větší nebo rovné nule';
  if (!isInt(weightarg, 0)) {
    errSetter.errWeight.set(messageInt);
    return new Error(messageInt);
  }

  if (!isInt(costarg, 0)) {
    errSetter.errCost.set(messageInt);
    return new Error(messageInt);
  }

  if (!isInt(pLengtharg, 0)) {
    errSetter.errpLength.set(messageInt);
    return new Error(messageInt);
  }

  if (!isInt(heightarg, 0)) {
    errSetter.errHeight.set(messageInt);
    return new Error(messageInt);
  }

  if (!isInt(widtharg, 0)) {
    errSetter.errWidth.set(messageInt);
    return new Error(messageInt);
  }

  errSetter.set({
    errCost: '',
    errHeight: '',
    errLabel: '',
    errpLength: '',
    errWeight: '',
    errWidth: '',
  });
  return undefined;
};

const Back = async (ids: string) => {
  await router.push(`/../../admpage/${ids}`);
};

const MyAlert = (messages: { successCreate: string; errCreate: string }) => {
  let alert = <div></div>;

  if (messages.errCreate !== '') {
    alert = (
      <div>
        <Alert severity="error">{messages.errCreate}</Alert>
      </div>
    );
  }

  if (messages.successCreate !== '') {
    const data = JSON.parse(messages.successCreate) as CreatedPackage;

    alert = (
      <div>
        <Alert severity="success">
          <div>
            <h3>Balík s parametry</h3>
            <p style={{ margin: '5px' }}>
              <strong>Označení</strong>: {data.name_package}
            </p>
            <p style={{ margin: '5px' }}>
              <strong>Cena</strong>: {data.cost} Kč
            </p>
            <p style={{ margin: '5px' }}>
              <strong>Hmotnost</strong>: {data.weight}
            </p>
            <p style={{ margin: '5px' }}>
              <strong>Délka</strong>: {data.Plength}
            </p>
            <p style={{ margin: '5px' }}>
              <strong>Šířka</strong>: {data.width}
            </p>
            <p style={{ margin: '5px' }}>
              <strong>Výška</strong>: {data.height}
            </p>
          </div>
        </Alert>
      </div>
    );
  }

  return alert;
};

const Response = (
  response:
    | {
        __typename?: 'Pack' | undefined;
        data: {
          __typename?: 'PackageDataCreate' | undefined;
          weight: number;
          cost: number;
          Plength: number;
          height: number;
          width: number;
          name_package: string;
          supplier_id: string;
        };
      }
    | {
        __typename?: 'PackageError' | undefined;
        message: string;
      }
    | null
    | undefined,
) => {
  const responseFromQuery: {
    data: CreatedPackage | undefined;
    error: string | undefined;
  } = {
    data: undefined,
    error: undefined,
  };
  // eslint-disable-next-line no-underscore-dangle
  if (response?.__typename === 'Pack') {
    responseFromQuery.data = response.data ?? undefined;
  }
  // eslint-disable-next-line no-underscore-dangle
  if (response?.__typename === 'PackageError') {
    responseFromQuery.error = response.message ?? undefined;
  }
  return responseFromQuery;
};

export const FormPackage: React.FC<Props> = ({ id }) => {
  const { user } = useAuthContext();
  const settersForDataPack = useHookstate({
    Weight: '',
    Cost: '',
    Plength: ' ',
    Height: '',
    Width: '',
    PackName: '',
  });

  const setterForAlertMesssage = useHookstate({
    errCreate: '',
    successCreate: '',
  });

  const setterErrors = useHookstate({
    errWeight: '',
    errCost: '',
    errpLength: '',
    errHeight: '',
    errWidth: '',
    errLabel: '',
  });

  const idComp = 'outlined-required';

  const labelHeight = { err: 'Chyba', withoutErr: 'Výška' };
  const labelWeigth = { err: 'Chyba', withoutErr: 'Hmotnost' };
  const labelLength = { err: 'Chyba', withoutErr: 'Délka' };
  const labelWidth = { err: 'Chyba', withoutErr: 'Šířka' };
  const labelCost = { err: 'Chyba', withoutErr: 'Cena' };
  const labelName = { err: 'Chyba', withoutErr: 'Označení' };

  const userApp = useHookstate({ Admin: false, LoggedIn: false });

  const [newPackage] = useNewPackageToFirestoreMutation();

  useEffect(() => {
    const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;
    if (user) {
      userApp.LoggedIn.set(true);
    }
    if (user?.uid === adminId) {
      userApp.Admin.set(true);
    }
  }, [userApp]);

  const handleForm = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const pID = uuidv4();
    const valid = Valid(
      settersForDataPack.Weight.get(),
      settersForDataPack.Cost.get(),
      settersForDataPack.Plength.get(),
      settersForDataPack.Height.get(),
      settersForDataPack.Width.get(),
      setterErrors,
    )?.message;
    if (valid) {
      console.error(valid);
    } else {
      const result = await newPackage({
        variables: {
          Weight: Number(settersForDataPack.Weight.get()),
          Cost: Number(settersForDataPack.Cost.get()),
          Length: Number(settersForDataPack.Plength.get()),
          Height: Number(settersForDataPack.Height.get()),
          Width: Number(settersForDataPack.Width.get()),
          Pack_name: settersForDataPack.PackName.get(),
          SuppID: id,
          PackId: pID,
        },
        refetchQueries: [{ query: SuppDataDocument }],
        awaitRefetchQueries: true,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }).catch((error: string) => console.error('Chyba při vytváření balíku'));

      const response = Response(result?.data?.PackageToFirestore);

      if (
        response.error &&
        /Toto označení pužívá jíny balík/.test(response.error) === false
      ) {
        setterForAlertMesssage.errCreate.set(response.error);
      }

      if (
        response.error &&
        /Toto označení pužívá jíny balík/.test(response.error)
      ) {
        setterErrors.errLabel.set(response.error);
      }
      if (response.data) {
        setterForAlertMesssage.successCreate.set(JSON.stringify(response.data));
      }
    }
  };

  if (!userApp.LoggedIn.get() || !userApp.Admin.get()) {
    return (
      <div
        style={{
          textAlign: 'center',
          color: 'red',
          fontSize: '30px',
          fontWeight: 'bold',
          margin: 'auto',
        }}
      >
        Přístup pouze pro administrátora
      </div>
    );
  }
  return (
    <Typography component={'div'}>
      <form
        onSubmit={handleForm}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
        onChange={() => {
          setterForAlertMesssage.set({
            errCreate: '',
            successCreate: '',
          });
          setterErrors.set({
            errCost: '',
            errHeight: '',
            errpLength: '',
            errWeight: '',
            errWidth: '',
            errLabel: '',
          });
        }}
      >
        <div style={{ alignSelf: 'center' }}>
          {MyAlert({
            successCreate: setterForAlertMesssage.successCreate.value,
            errCreate: setterForAlertMesssage.errCreate.value,
          })}
        </div>
        <CustomFieldset>
          <legend
            style={{
              textAlign: 'center',
              fontSize: '30px',
              fontWeight: 'bold',
            }}
          >
            Balík
          </legend>
          <MyCompTextField
            typeComp="text"
            idComp={idComp}
            labelComp={labelName}
            errorComp={setterErrors.errLabel.get()}
            funcComp={(e) => settersForDataPack.PackName.set(e)}
            helpTexterComp="Zadejte označení balíku"
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelCost}
            errorComp={setterErrors.errCost.get()}
            funcComp={(e) => settersForDataPack.Cost.set(e)}
            helpTexterComp="Zadejte cenu balíčku"
            placeholderComp="Kč"
          />
        </CustomFieldset>

        <CustomFieldset>
          <legend
            style={{
              textAlign: 'center',
              fontSize: '30px',
              fontWeight: 'bold',
            }}
          >
            Parametry balíku
          </legend>
          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelWidth}
            errorComp={setterErrors.errWidth.get()}
            funcComp={(e) => settersForDataPack.Width.set(e)}
            helpTexterComp="Zadejte šířku balíku"
            placeholderComp="Cm"
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelWeigth}
            errorComp={setterErrors.errWeight.get()}
            funcComp={(e) => settersForDataPack.Weight.set(e)}
            helpTexterComp="Zadejte hmotnost balíku"
            placeholderComp="Cm"
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelLength}
            errorComp={setterErrors.errpLength.get()}
            funcComp={(e) => settersForDataPack.Plength.set(e)}
            helpTexterComp="Zadejte délku balíku"
            placeholderComp="Cm"
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelHeight}
            errorComp={setterErrors.errHeight.get()}
            funcComp={(e) => settersForDataPack.Height.set(e)}
            helpTexterComp="Zadejte výšku balíku"
            placeholderComp="Cm"
          />
        </CustomFieldset>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
          }}
        >
          <CreateButton type="submit">Vytvořit</CreateButton>
          <BackButtn onClick={() => Back(id)}>Zpět</BackButtn>
        </div>
      </form>
    </Typography>
  );
};
