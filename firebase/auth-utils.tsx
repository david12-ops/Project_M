import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getAuth,
  NextOrObserver,
  onAuthStateChanged,
  sendPasswordResetEmail,
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
    await updatePassword(ActUs, newPass);
  },
  channgeUsEmail: async (ActUs: User, newEmail: string) => {
    await updateEmail(ActUs, newEmail);
  },
  register: async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  },
  fotgotenPass: async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  },
  confrimPassReset: async (email: string, newPass: string) => {
    await confirmPasswordReset(auth, email, newPass);
  },
  onAuthStateChange: (callbackFunc: NextOrObserver<User>) => {
    return onAuthStateChanged(auth, callbackFunc);
  },
  getCurrentUser: () => auth.currentUser,
};
