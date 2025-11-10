// src/hooks/index.js
// ============================================
// CUSTOM HOOKS - SOLAIRE NETTOYAGE
// ============================================

import { useState } from 'react';

// 🚛 HOOK ÉQUIPEMENTS
export const useEquipements = () => {
  const [equipements, setEquipements] = useState([
    {
      id: 1,
      immat: 'GT-316-FG',
      type: 'Camion Citerne',
      marque: 'IVECO',
      modele: 'S-WAY',
      annee: 2023,
      km: 0,
      heures: 0,
      carburant: 'Diesel',
      vin: 'ZCFCE62RU00C519482',
      ptac: 26000,
      poids: 13190,
      proprietaire: 'SOLAIRE NETTOYAGE',
      valeurAchat: 0,
      valeurActuelle: 133500,
      typeFinancement: 'Location',
      coutMensuel: 2104,
      dateDebut: '2023-12-22',
      dateFin: '2029-12-22',
      assurance: 80.10,
      dateContracteTechnique: '2024-12-22',
      notes: 'Contrat de location A1M75094 001'
    },
    {
      id: 2,
      immat: 'DX-780-QN',
      type: 'Tracteur Routier',
      marque: 'IVECO',
      modele: 'STRALIS 560',
      annee: 2015,
      km: 293992,
      heures: 0,
      carburant: 'Diesel',
      vin: 'WJMS2NWH60C329019',
      ptac: 26000,
      poids: 8518,
      proprietaire: 'SOLAIRE NETTOYAGE',
      valeurAchat: 45000,
      valeurActuelle: 42000,
      typeFinancement: 'Achat',
      coutMensuel: 0,
      dateDebut: '2020-09-18',
      dateFin: '',
      assurance: 85.00,
      dateContracteTechnique: '2020-10-17',
      notes: 'STRALIS 560 • Type 6x2'
    },
    {
      id: 3,
      immat: 'CZ-022-DP',
      type: 'Semi-Remorque',
      marque: 'NICOLAS',
      modele: 'B3207C',
      annee: 2002,
      km: 0,
      heures: 0,
      carburant: 'N/A',
      vin: 'VF9B3207C02058032',
      ptac: 34000,
      poids: 12550,
      proprietaire: 'SOLAIRE NETTOYAGE',
      valeurAchat: 15000,
      valeurActuelle: 14000,
      typeFinancement: 'Achat',
      coutMensuel: 0,
      dateDebut: '2018-06-29',
      dateFin: '',
      assurance: 120.00,
      dateContracteTechnique: '2019-08-22',
      notes: 'Semi-Remorque NICOLAS B3207C'
    },
    {
      id: 4,
      immat: 'G3-415-BW',
      type: 'Micro-tracteur',
      marque: 'FARMTRAC',
      modele: 'F26VHE14HMNDWF',
      annee: 2022,
      km: 0,
      heures: 0,
      carburant: 'Essence',
      vin: 'M6SH09RLANF585383',
      ptac: 1800,
      poids: 1057,
      proprietaire: 'SOLAIRE NETTOYAGE',
      valeurAchat: 12325.00,
      valeurActuelle: 12325.00,
      typeFinancement: 'Achat',
      coutMensuel: 0,
      dateDebut: '2022-08-25',
      dateFin: '',
      assurance: 0,
      dateContracteTechnique: '2022-08-25',
      notes: 'TRACTEUR FARMTRAC - Immatriculation 25/08/2022'
    },
    {
      id: 5,
      immat: 'GM-843-SW',
      type: 'Micro-tracteur',
      marque: 'FARMTRAC',
      modele: 'F26VHE14HMNDWL',
      annee: 2023,
      km: 0,
      heures: 0,
      carburant: 'Essence',
      vin: 'M6SH09RLDNF610727',
      ptac: 1800,
      poids: 1057,
      proprietaire: 'SOLAIRE NETTOYAGE',
      valeurAchat: 12325.00,
      valeurActuelle: 12325.00,
      typeFinancement: 'Achat',
      coutMensuel: 0,
      dateDebut: '2023-03-16',
      dateFin: '',
      assurance: 0,
      dateContracteTechnique: '2023-03-16',
      notes: 'TRACTEUR FARMTRAC - Immatriculation 16/03/2023'
    },
    {
      id: 6,
      immat: 'DZ-609-JX',
      type: 'Tracteur',
      marque: 'ANTONIO CARRARO',
      modele: 'ERGIT-ST2088965A2',
      annee: 2016,
      km: 0,
      heures: 3170,
      carburant: 'Agricole',
      vin: 'T20ACATA000P471',
      ptac: 4800,
      poids: 2650,
      proprietaire: 'SOLAIRE NETTOYAGE',
      valeurAchat: 42000.00,
      valeurActuelle: 42000.00,
      typeFinancement: 'Achat',
      coutMensuel: 0,
      dateDebut: '2025-05-27',
      dateFin: '',
      assurance: 0,
      dateContracteTechnique: '2025-05-27',
      notes: 'TRACTEUR ANTONIO CARRARO MACH 4 CHENILLES'
    }
  ]);

  return { equipements, setEquipements };
};

// 📦 HOOK ARTICLES
export const useArticles = () => {
  const [articles, setArticles] = useState([
    { id: 1, code: 'BAC5X5', description: 'Barre pour clavette en acier 5x5', fournisseur: 'LE BON ROULEMENT', prixUnitaire: 5.05, stockParDepot: { 'Atelier': 3, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 2, equipementsAffectes: [] },
    { id: 2, code: 'BAC8X7', description: 'Barre pour clavette en acier 8x7', fournisseur: 'LE BON ROULEMENT', prixUnitaire: 9.07, stockParDepot: { 'Atelier': 3, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 2, equipementsAffectes: [] },
    { id: 3, code: '388518', description: 'Bague support pont avant', fournisseur: 'RURAL MASTER', prixUnitaire: 12.41, stockParDepot: { 'Atelier': 1, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 1, equipementsAffectes: [] },
    { id: 4, code: '605670', description: 'Washer 48.0x4.0 thrust', fournisseur: 'RURAL MASTER', prixUnitaire: 5.68, stockParDepot: { 'Atelier': 1, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 1, equipementsAffectes: [] },
    { id: 5, code: '606540', description: 'Nut M10x1.508 hex', fournisseur: 'RURAL MASTER', prixUnitaire: 2.06, stockParDepot: { 'Atelier': 1, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 1, equipementsAffectes: [] },
    { id: 6, code: '605669', description: 'Seal O ring 2.62x55.0', fournisseur: 'RURAL MASTER', prixUnitaire: 2.76, stockParDepot: { 'Atelier': 1, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 1, equipementsAffectes: [] },
    { id: 7, code: '606858', description: 'Grease nipple B M6', fournisseur: 'RURAL MASTER', prixUnitaire: 2.20, stockParDepot: { 'Atelier': 1, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 1, equipementsAffectes: [] },
    { id: 8, code: '605668', description: 'Dowel bush pillow block', fournisseur: 'RURAL MASTER', prixUnitaire: 3.59, stockParDepot: { 'Atelier': 2, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 1, equipementsAffectes: [] },
    { id: 9, code: '606739', description: 'Bolt M10x1.50x356.6P hex head', fournisseur: 'RURAL MASTER', prixUnitaire: 2.62, stockParDepot: { 'Atelier': 1, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 1, equipementsAffectes: [] },
    { id: 10, code: '388497', description: 'Support pont avant', fournisseur: 'RURAL MASTER', prixUnitaire: 53.02, stockParDepot: { 'Atelier': 1, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 1, equipementsAffectes: [] },
    { id: 11, code: '764617', description: 'Chambre à air 20x108 STI', fournisseur: 'RURAL MASTER', prixUnitaire: 44.30, stockParDepot: { 'Atelier': 3, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 2, equipementsAffectes: [] },
    { id: 12, code: 'HIFSO 8055', description: 'Filtre à huile', fournisseur: 'V6 AUTOPRO', prixUnitaire: 40.80, stockParDepot: { 'Atelier': 2, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 1, equipementsAffectes: [1] },
    { id: 13, code: 'HIFSN 916020', description: 'Filtre à gasoil séparateur d\'eau', fournisseur: 'V6 AUTOPRO', prixUnitaire: 34.12, stockParDepot: { 'Atelier': 2, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 1, equipementsAffectes: [1] },
    { id: 14, code: 'WY119802-55710', description: 'Séparateur d\'eau', fournisseur: 'CLAAS LAGARRIGUE', prixUnitaire: 15.05, stockParDepot: { 'Atelier': 1, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 1, equipementsAffectes: [6] },
    { id: 15, code: 'WY123907-55810', description: 'Filtre combustible', fournisseur: 'CLAAS LAGARRIGUE', prixUnitaire: 36.88, stockParDepot: { 'Atelier': 1, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 1, equipementsAffectes: [6] },
    { id: 16, code: 'WY129150-35170', description: 'Filtre à huile', fournisseur: 'CLAAS LAGARRIGUE', prixUnitaire: 14.17, stockParDepot: { 'Atelier': 1, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 1, equipementsAffectes: [6] },
    { id: 17, code: '44524021', description: 'Filtre TRANS (TTR/TRH 9800) PONT AV', fournisseur: 'CLAAS LAGARRIGUE', prixUnitaire: 31.65, stockParDepot: { 'Atelier': 1, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 1, equipementsAffectes: [6] },
    { id: 18, code: '44524020', description: 'Filtre HYDRAU PRESSION', fournisseur: 'CLAAS LAGARRIGUE', prixUnitaire: 62.71, stockParDepot: { 'Atelier': 1, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 1, equipementsAffectes: [6] },
    { id: 19, code: 'BF16', description: 'Huile BF16 (20L)', fournisseur: 'SARL QUIERS', prixUnitaire: 5.07, stockParDepot: { 'Atelier': 40, 'Porteur 26 T': 0, 'Porteur 32 T': 0, 'Semi Remorque': 0 }, stockMin: 10, equipementsAffectes: [6] },
  ]);

  return { articles, setArticles };
};

// 📥 HOOK STOCK (Mouvements)
export const useStock = () => {
  const [mouvementsStock, setMouvementsStock] = useState([
    { id: 1, articleId: 1, type: 'entree', quantite: 3, date: '2025-09-29', raison: 'Facture 233440 - LE BON ROULEMENT', coutTotal: 15.15, depot: 'Atelier' },
    { id: 2, articleId: 2, type: 'entree', quantite: 3, date: '2025-09-29', raison: 'Facture 233440 - LE BON ROULEMENT', coutTotal: 27.20, depot: 'Atelier' },
    { id: 3, articleId: 12, type: 'sortie', quantite: 1, date: '2025-10-05', raison: 'Remplacement Camion GT-316-FG', coutTotal: 0, depot: 'Atelier' },
    { id: 4, articleId: 11, type: 'entree', quantite: 2, date: '2025-10-10', raison: 'Facture 233500 - RURAL MASTER', coutTotal: 88.60, depot: 'Atelier' },
    { id: 5, articleId: 19, type: 'sortie', quantite: 5, date: '2025-10-12', raison: 'Changement huile Tracteur DZ-609-JX', coutTotal: 0, depot: 'Atelier' },
    { id: 6, articleId: 14, type: 'transfer', quantite: 1, date: '2025-10-15', raison: 'Transfert', coutTotal: 0, depot: 'Atelier', depotSource: 'Atelier', depotDestination: 'Porteur 26 T' },
  ]);

  return { mouvementsStock, setMouvementsStock };
};

// 🔧 HOOK INTERVENTIONS
export const useInterventions = () => {
  const [interventions, setInterventions] = useState([
    { id: 1, equipementId: 3, type: 'Révision/Maintenance', date: '2023-10-31', km: 363392, heures: 0, description: 'Entretien atelier', articles: [], statut: 'effectue', coutTotal: 7635.12, depotPrelevement: 'Atelier' },
    { id: 2, equipementId: 1, type: 'Vidange moteur', date: '2025-10-08', km: 0, heures: 0, description: 'Vidange moteur diesel', articles: [{ articleId: 12, quantite: 1, prixUnitaire: 40.80, description: 'Filtre à huile', code: 'HIFSO 8055' }], statut: 'en_cours', coutTotal: 40.80, depotPrelevement: 'Atelier' },
    { id: 3, equipementId: 6, type: 'Maintenance', date: '2025-11-01', km: 0, heures: 3200, description: 'Maintenance complète - révision 3200h', articles: [{ articleId: 14, quantite: 1, prixUnitaire: 15.05, description: 'Séparateur d\'eau', code: 'WY119802-55710' }, { articleId: 16, quantite: 1, prixUnitaire: 14.17, description: 'Filtre à huile', code: 'WY129150-35170' }], statut: 'en_cours', coutTotal: 29.22, depotPrelevement: 'Atelier' },
  ]);

  return { interventions, setInterventions };
};

// 🚨 HOOK DÉFAUTS
export const useDefauts = () => {
  const [defauts, setDefauts] = useState([
    { id: 1, equipementId: 6, accessoireId: 9, type: 'Fuite', severite: 'critique', description: 'Fuite hydraulique sur raccord du bras', localisation: 'Raccord du bras', dateConstatation: '2025-11-08', operateur: 'Jérôme', remarques: 'Liquid jaune observable', photos: [], statut: 'a_traiter', interventionLieeId: null, dateArchivage: null },
    { id: 2, equipementId: 1, accessoireId: null, type: 'Bruit', severite: 'moyen', description: 'Bruit anormal à démarrage moteur', localisation: 'Moteur', dateConstatation: '2025-11-05', operateur: 'Axel', remarques: 'Claquement au démarrage uniquement', photos: [], statut: 'a_traiter', interventionLieeId: null, dateArchivage: null },
    { id: 3, equipementId: 2, accessoireId: null, type: 'Usure', severite: 'moyen', description: 'Plaquettes de frein usées', localisation: 'Système de freinage', dateConstatation: '2025-10-28', operateur: 'Sébastien', remarques: 'À remplacer prochainement', photos: [], statut: 'resolu', interventionLieeId: null, dateArchivage: '2025-11-02' },
  ]);

  return { defauts, setDefauts };
};

// 🎨 HOOK ACCESSOIRES
export const useAccessoires = () => {
  const [accessoiresEquipement, setAccessoiresEquipement] = useState({
    1: [
      { id: 1, nom: 'Carrosserie TEPEMATIC 26T', valeur: 51583, dateAjout: '2023-11-15', description: 'Plateau fixe porte matériel TP', actif: false },
      { id: 2, nom: 'Feux latéraux LED 24V (x4)', valeur: 65.16, dateAjout: '2023-11-22', description: 'Feu latéral orange à LED 24V', actif: false },
    ],
    2: [
      { id: 3, nom: 'Système GPS Tracking', valeur: 2500, dateAjout: '2020-10-15', description: 'Système de géolocalisation et suivi', actif: true },
      { id: 4, nom: 'Sièges ergonomiques (x2)', valeur: 1200, dateAjout: '2021-03-20', description: 'Sièges premium avec suspension pneumatique', actif: true },
    ],
    3: [
      { id: 5, nom: 'Système de freinage ABS', valeur: 3500, dateAjout: '2019-08-22', description: 'ABS intégral semi-remorque', actif: true },
    ],
    4: [],
    5: [],
    6: [
      { id: 9, nom: 'SunBrush mobil TrackFlex 3.0', valeur: 64277.00, dateAjout: '2025-05-14', description: 'SunBrush mobil TrackFlex 3.0 5,5m brush', actif: true },
      { id: 10, nom: 'Système d\'arrosage haute pression', valeur: 8500, dateAjout: '2025-05-27', description: 'Système de nettoyage intégré 200bar', actif: true },
      { id: 11, nom: 'Citerne d\'eau 2000L', valeur: 2000, dateAjout: '2025-05-27', description: 'Réservoir d\'eau pour nettoyage', actif: true },
    ]
  });

  return { accessoires: accessoiresEquipement, setAccessoires: setAccessoiresEquipement };
};

// 📋 HOOK CONSTANTES
export const useConstantes = () => {
  const operateurs = ['Axel', 'Jérôme', 'Sébastien', 'Joffrey', 'Fabien', 'Angelo'];
  const depots = ['Atelier', 'Porteur 26 T', 'Porteur 32 T', 'Semi Remorque'];
  const typesIntervention = [
    'Vidange moteur',
    'Révision complète',
    'Changement pneus',
    'Nettoyage',
    'Maintenance',
    'Contrôle hydraulique',
    'Réparation',
    'Autre'
  ];

  return { operateurs, depots, typesIntervention };
};

// ✨ HOOK GLOBAL - TOUS LES HOOKS
export const useSolaireApp = () => {
  const [equipements, setEquipements] = useEquipements();
  const [articles, setArticles] = useArticles();
  const [mouvementsStock, setMouvementsStock] = useStock();
  const [interventions, setInterventions] = useInterventions();
  const [defauts, setDefauts] = useDefauts();
  const [accessoiresEquipement, setAccessoiresEquipement] = useAccessoires();
  const { operateurs, depots, typesIntervention } = useConstantes();

  return {
    equipements,
    setEquipements,
    articles,
    setArticles,
    mouvementsStock,
    setMouvementsStock,
    interventions,
    setInterventions,
    defauts,
    setDefauts,
    accessoiresEquipement,
    setAccessoiresEquipement,
    operateurs,
    depots,
    typesIntervention
  };
};