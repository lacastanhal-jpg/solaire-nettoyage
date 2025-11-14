   import { db } from './config';
   import { 
     collection, 
     addDoc, 
     getDocs, 
     doc, 
     updateDoc, 
     deleteDoc,
     query,
     where,
     orderBy,
     onSnapshot
   } from 'firebase/firestore';
   
   // ARTICLES
   export const recupererArticles = async () => {
     try {
       const q = query(collection(db, 'articles'), orderBy('code'));
       const snapshot = await getDocs(q);
       const articles = [];
       snapshot.forEach((doc) => {
         articles.push({ id: doc.id, ...doc.data() });
       });
       return articles;
     } catch (error) {
       console.error('Erreur récupération articles:', error);
       return [];
     }
   };
   
   export const ajouterArticle = async (article) => {
     try {
       const docRef = await addDoc(collection(db, 'articles'), article);
       return docRef.id;
     } catch (error) {
       console.error('Erreur ajout article:', error);
       throw error;
     }
   };
   
   export const modifierArticle = async (id, data) => {
     try {
       const docRef = doc(db, 'articles', id);
       await updateDoc(docRef, data);
       return true;
     } catch (error) {
       console.error('Erreur modification article:', error);
       throw error;
     }
   };
   
   // ÉQUIPEMENTS
   export const recupererEquipements = async () => {
     try {
       const q = query(collection(db, 'equipements'), orderBy('immat'));
       const snapshot = await getDocs(q);
       const equipements = [];
       snapshot.forEach((doc) => {
         equipements.push({ id: doc.id, ...doc.data() });
       });
       return equipements;
     } catch (error) {
       console.error('Erreur récupération équipements:', error);
       return [];
     }
   };
   
   export const ajouterEquipement = async (equipement) => {
     try {
       const docRef = await addDoc(collection(db, 'equipements'), equipement);
       return docRef.id;
     } catch (error) {
       console.error('Erreur ajout équipement:', error);
       throw error;
     }
   };
   
   export const modifierEquipement = async (id, data) => {
     try {
       const docRef = doc(db, 'equipements', id);
       await updateDoc(docRef, data);
       return true;
     } catch (error) {
       console.error('Erreur modification équipement:', error);
       throw error;
     }
   };
   EOF
eof
