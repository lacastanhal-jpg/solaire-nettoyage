   import { initializeApp } from 'firebase/app';
   import { getFirestore } from 'firebase/firestore';
   
   const firebaseConfig = {
     apiKey: "AIzaSyCAH_1ql-9ckn_egrj1AjteNpAs2Vo5KNY",
     authDomain: "gestion-flotte-et-stoks.firebaseapp.com",
     projectId: "gestion-flotte-et-stoks",
     storageBucket: "gestion-flotte-et-stoks.firebasestorage.app",
     messagingSenderId: "824916805616",
     appId: "1:824916805616:web:8afc8c80285cb3fda43f35"
   };
   
   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   export default app;
   EOF
ls src/firebase
