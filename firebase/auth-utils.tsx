// import { User } from '@prisma/client';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  User,
} from 'firebase/auth';

import firebase_app from './config';

const auth = getAuth(firebase_app);
export const authUtils = {
  login: async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  },
  logout: async () => {
    await auth.signOut();
  },
  changeUsPass: async (ActUs: User, newPass: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await updatePassword(ActUs, newPass);
  },
  channgeUsEmail: async (ActUs: User, newEmail: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await updateEmail(ActUs, newEmail);
  },
  register: async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  },
};
