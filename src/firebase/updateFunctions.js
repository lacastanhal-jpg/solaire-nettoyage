   import { doc, setDoc } from 'firebase/firestore';
   
   // Fonctions de mise à jour Firebase
   export const createUpdateFunction = (db, collectionName) => {
     return async (data) => {
       try {
         if (Array.isArray(data)) {
           for (const item of data) {
             if (item.id) {
               await setDoc(doc(db, collectionName, item.id.toString()), item);
             }
           }
         }
         console.log(`✅ ${collectionName} synchronisé avec Firebase`);
       } catch (error) {
         console.error(`Erreur sync ${collectionName}:`, error);
       }
     };
   };
   EOF
