import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function SolaireNettoyageFlotte() {
  const [ongletActif, setOngletActif] = useState('accueil');
  const [equipementSelectionne, setEquipementSelectionne] = useState(1);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const scanningRef = useRef(false);
  const jsQRRef = useRef(null);
  const videoIntervention = useRef(null);
  const canvasIntervention = useRef(null);
  const scanningIntervention = useRef(false);
  const fileInputRef = useRef(null);
  
  const [filtreAlerteSeverite, setFiltreAlerteSeverite] = useState('');
  const [filtreAlerteFournisseur, setFiltreAlerteFournisseur] = useState('');
  const [filtreAlerteDepot, setFiltreAlerteDepot] = useState('');
  const [triAlertes, setTriAlertes] = useState('severite');
  const [articleEnDetailsAlerte, setArticleEnDetailsAlerte] = useState(null);
  const [articleEnTransfertAlerte, setArticleEnTransfertAlerte] = useState(null);
  const [articleEnHistoriqueAlerte, setArticleEnHistoriqueAlerte] = useState(null);
  const [transfertRapideData, setTransfertRapideData] = useState({ depotSource: 'Atelier', depotDestination: 'Véhicule 1', quantite: '' });

  const operateurs = ['Axel', 'Jérôme', 'Sébastien', 'Joffrey', 'Fabien', 'Angelo'];
  const depots = ['Atelier', 'Véhicule 1', 'Véhicule 2', 'Véhicule 3'];
  
  const [articles, setArticles] = useState([
    { id: 1, code: 'BAC5X5', description: 'Barre pour clavette en acier 5x5', fournisseur: 'LE BON ROULEMENT', prixUnitaire: 5.05, stockParDepot: { 'Atelier': 3, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 2, equipementsAffectes: [] },
    { id: 2, code: 'BAC8X7', description: 'Barre pour clavette en acier 8x7', fournisseur: 'LE BON ROULEMENT', prixUnitaire: 9.07, stockParDepot: { 'Atelier': 3, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 2, equipementsAffectes: [] },
    { id: 3, code: '388518', description: 'Bague support pont avant', fournisseur: 'RURAL MASTER', prixUnitaire: 12.41, stockParDepot: { 'Atelier': 1, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 1, equipementsAffectes: [] },
    { id: 4, code: '605670', description: 'Washer 48.0x4.0 thrust', fournisseur: 'RURAL MASTER', prixUnitaire: 5.68, stockParDepot: { 'Atelier': 1, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 1, equipementsAffectes: [] },
    { id: 5, code: '606540', description: 'Nut M10x1.508 hex', fournisseur: 'RURAL MASTER', prixUnitaire: 2.06, stockParDepot: { 'Atelier': 1, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 1, equipementsAffectes: [] },
    { id: 6, code: '605669', description: 'Seal O ring 2.62x55.0', fournisseur: 'RURAL MASTER', prixUnitaire: 2.76, stockParDepot: { 'Atelier': 1, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 1, equipementsAffectes: [] },
    { id: 7, code: '606858', description: 'Grease nipple B M6', fournisseur: 'RURAL MASTER', prixUnitaire: 2.20, stockParDepot: { 'Atelier': 1, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 1, equipementsAffectes: [] },
    { id: 8, code: '605668', description: 'Dowel bush pillow block', fournisseur: 'RURAL MASTER', prixUnitaire: 3.59, stockParDepot: { 'Atelier': 2, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 1, equipementsAffectes: [] },
    { id: 9, code: '606739', description: 'Bolt M10x1.50x356.6P hex head', fournisseur: 'RURAL MASTER', prixUnitaire: 2.62, stockParDepot: { 'Atelier': 1, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 1, equipementsAffectes: [] },
    { id: 10, code: '388497', description: 'Support pont avant', fournisseur: 'RURAL MASTER', prixUnitaire: 53.02, stockParDepot: { 'Atelier': 1, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 1, equipementsAffectes: [] },
    { id: 11, code: '764617', description: 'Chambre à air 20x108 STI', fournisseur: 'RURAL MASTER', prixUnitaire: 44.30, stockParDepot: { 'Atelier': 3, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 2, equipementsAffectes: [] },
    { id: 12, code: 'HIFSO 8055', description: 'Filtre à huile', fournisseur: 'V6 AUTOPRO', prixUnitaire: 40.80, stockParDepot: { 'Atelier': 2, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 1, equipementsAffectes: [1] },
    { id: 13, code: 'HIFSN 916020', description: 'Filtre à gasoil séparateur d\'eau', fournisseur: 'V6 AUTOPRO', prixUnitaire: 34.12, stockParDepot: { 'Atelier': 2, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 1, equipementsAffectes: [1] },
    { id: 14, code: 'WY119802-55710', description: 'Séparateur d\'eau', fournisseur: 'CLAAS LAGARRIGUE', prixUnitaire: 15.05, stockParDepot: { 'Atelier': 1, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 1, equipementsAffectes: [6] },
    { id: 15, code: 'WY123907-55810', description: 'Filtre combustible', fournisseur: 'CLAAS LAGARRIGUE', prixUnitaire: 36.88, stockParDepot: { 'Atelier': 1, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 1, equipementsAffectes: [6] },
    { id: 16, code: 'WY129150-35170', description: 'Filtre à huile', fournisseur: 'CLAAS LAGARRIGUE', prixUnitaire: 14.17, stockParDepot: { 'Atelier': 1, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 1, equipementsAffectes: [6] },
    { id: 17, code: '44524021', description: 'Filtre TRANS (TTR/TRH 9800) PONT AV', fournisseur: 'CLAAS LAGARRIGUE', prixUnitaire: 31.65, stockParDepot: { 'Atelier': 1, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 1, equipementsAffectes: [6] },
    { id: 18, code: '44524020', description: 'Filtre HYDRAU PRESSION', fournisseur: 'CLAAS LAGARRIGUE', prixUnitaire: 62.71, stockParDepot: { 'Atelier': 1, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 1, equipementsAffectes: [6] },
    { id: 19, code: 'BF16', description: 'Huile BF16 (20L)', fournisseur: 'SARL QUIERS', prixUnitaire: 5.07, stockParDepot: { 'Atelier': 40, 'Véhicule 1': 0, 'Véhicule 2': 0, 'Véhicule 3': 0 }, stockMin: 10, equipementsAffectes: [6] },
  ]);

  const [mouvementsStock, setMouvementsStock] = useState([
    { id: 1, articleId: 1, type: 'entree', quantite: 3, date: '2025-09-29', raison: 'Facture 233440 - LE BON ROULEMENT', coutTotal: 15.15, depot: 'Atelier' },
    { id: 2, articleId: 2, type: 'entree', quantite: 3, date: '2025-09-29', raison: 'Facture 233440 - LE BON ROULEMENT', coutTotal: 27.20, depot: 'Atelier' },
  ]);

  const [equipements, setEquipements] = useState([
    { id: 1, immat: 'GT-316-FG', type: 'Camion Citerne', marque: 'IVECO', modele: 'S-WAY', annee: 2023, km: 0, heures: 0, carburant: 'Diesel', vin: 'ZCFCE62RU00C519482', ptac: 26000, poids: 13190, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 0, valeurActuelle: 133500, typeFinancement: 'Location', coutMensuel: 2104, dateDebut: '2023-12-22', dateFin: '2029-12-22', assurance: 80.10, dateContracteTechnique: '2024-12-22', notes: 'Contrat de location A1M75094 001' },
    { id: 2, immat: 'DX-780-QN', type: 'Tracteur Routier', marque: 'IVECO', modele: 'STRALIS 560', annee: 2015, km: 293992, heures: 0, carburant: 'Diesel', vin: 'WJMS2NWH60C329019', ptac: 26000, poids: 8518, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 45000, valeurActuelle: 42000, typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2020-09-18', dateFin: '', assurance: 85.00, dateContracteTechnique: '2020-10-17', notes: 'STRALIS 560 • Type 6x2' },
    { id: 3, immat: 'CZ-022-DP', type: 'Semi-Remorque', marque: 'NICOLAS', modele: 'B3207C', annee: 2002, km: 0, heures: 0, carburant: 'N/A', vin: 'VF9B3207C02058032', ptac: 34000, poids: 12550, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 15000, valeurActuelle: 14000, typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2018-06-29', dateFin: '', assurance: 120.00, dateContracteTechnique: '2019-08-22', notes: 'Semi-Remorque NICOLAS B3207C' },
    { id: 4, immat: 'G3-415-BW', type: 'Micro-tracteur', marque: 'FARMTRAC', modele: 'F26VHE14HMNDWF', annee: 2022, km: 0, heures: 0, carburant: 'Essence', vin: 'M6SH09RLANF585383', ptac: 1800, poids: 1057, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 12325.00, valeurActuelle: 12325.00, typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2022-08-25', dateFin: '', assurance: 0, dateContracteTechnique: '2022-08-25', notes: 'TRACTEUR FARMTRAC - Immatriculation 25/08/2022' },
    { id: 5, immat: 'GM-843-SW', type: 'Micro-tracteur', marque: 'FARMTRAC', modele: 'F26VHE14HMNDWL', annee: 2023, km: 0, heures: 0, carburant: 'Essence', vin: 'M6SH09RLDNF610727', ptac: 1800, poids: 1057, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 12325.00, valeurActuelle: 12325.00, typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2023-03-16', dateFin: '', assurance: 0, dateContracteTechnique: '2023-03-16', notes: 'TRACTEUR FARMTRAC - Immatriculation 16/03/2023' },
    { id: 6, immat: 'DZ-609-JX', type: 'Tracteur', marque: 'ANTONIO CARRARO', modele: 'ERGIT-ST2088965A2', annee: 2016, km: 0, heures: 3170, carburant: 'Agricole', vin: 'T20ACATA000P471', ptac: 4800, poids: 2650, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 42000.00, valeurActuelle: 42000.00, typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2025-05-27', dateFin: '', assurance: 0, dateContracteTechnique: '2025-05-27', notes: 'TRACTEUR ANTONIO CARRARO MACH 4 CHENILLES' },
  ]);

  const [nouvelEquipement, setNouvelEquipement] = useState({
    immat: '',
    type: '',
    marque: '',
    modele: '',
    annee: '',
    km: 0,
    heures: 0,
    carburant: '',
    vin: '',
    ptac: 0,
    poids: 0,
    proprietaire: 'SOLAIRE NETTOYAGE',
    valeurAchat: 0,
    valeurActuelle: 0,
    typeFinancement: '',
    coutMensuel: 0,
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: '',
    assurance: 0,
    dateContracteTechnique: '',
    notes: ''
  });

  const [afficherFormulaireEquipement, setAfficherFormulaireEquipement] = useState(false);
  const [equipementEnEdition, setEquipementEnEdition] = useState(null);
  const [modeEdition, setModeEdition] = useState(false);

  const [accessoiresEquipement, setAccessoiresEquipement] = useState({
    1: [
      { id: 1, nom: 'Carrosserie TEPEMATIC 26T', valeur: 51583, dateAjout: '2023-11-15', description: 'Plateau fixe porte matériel TP', actif: false },
      { id: 2, nom: 'Feux latéraux LED 24V (x4)', valeur: 65.16, dateAjout: '2023-11-22', description: 'Feu latéral orange à LED 24V', actif: false },
    ],
    6: [
      { id: 9, nom: 'SunBrush mobil TrackFlex 3.0', valeur: 64277.00, dateAjout: '2025-05-14', description: 'SunBrush mobil TrackFlex 3.0 5,5m brush', actif: true },
    ]
  });

  const [interventions, setInterventions] = useState([
    { id: 1, equipementId: 3, type: 'Révision/Maintenance', date: '2023-10-31', km: 363392, heures: 0, description: 'Entretien atelier', articles: [], statut: 'effectue', coutTotal: 7635.12, depotPrelevement: 'Atelier' }
  ]);

  const [defauts, setDefauts] = useState([
    { id: 1, equipementId: 6, accessoireId: 9, type: 'Fuite', severite: 'critique', description: 'Fuite hydraulique sur raccord du bras', localisation: 'Raccord du bras', dateConstatation: '2025-11-08', operateur: 'Jérôme', remarques: 'Liquid jaune observable', photos: [], statut: 'a_traiter', interventionLieeId: null, dateArchivage: null }
  ]);

  const [nouveauDefaut, setNouveauDefaut] = useState({
    equipementId: '', accessoireId: '', type: 'Fuite', severite: 'moyen', description: '', localisation: '', 
    dateConstatation: new Date().toISOString().split('T')[0], operateur: 'Axel', remarques: '', photosNoms: []
  });

  const [defautSelectionne, setDefautSelectionne] = useState(null);
  const [photosSelectionnees, setPhotosSelectionnees] = useState([]);

  const [nouvelleEntreeStock, setNouvelleEntreeStock] = useState({ articleId: '', quantite: '', prixUnitaire: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
  const [nouveauMouvementSortie, setNouveauMouvementSortie] = useState({ articleId: '', quantite: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
  const [nouveauTransfert, setNouveauTransfert] = useState({ articleId: '', quantite: '', depotSource: 'Atelier', depotDestination: 'Véhicule 1', raison: '', date: new Date().toISOString().split('T')[0] });
  const [nouvelleIntervention, setNouvelleIntervention] = useState({ equipementId: '', type: '', date: new Date().toISOString().split('T')[0], km: '', heures: '', description: '', articlesPrevu: [], depotPrelevement: 'Atelier' });
  const [nouvelArticleIntervention, setNouvelArticleIntervention] = useState({ articleId: '', quantite: '' });
  const [nouvelAccessoire, setNouvelAccessoire] = useState({ nom: '', valeur: '', description: '', dateAjout: new Date().toISOString().split('T')[0] });
  const [articleEnEdition, setArticleEnEdition] = useState(null);
  const [panierCommande, setPanierCommande] = useState([]);
  const [afficherArticlesEquipement, setAfficherArticlesEquipement] = useState(false);
  const [afficherScannerQR, setAfficherScannerQR] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [scanResultat, setScanResultat] = useState(null);
  const [actionScan, setActionScan] = useState(null);
  const [formScanEntree, setFormScanEntree] = useState({ quantite: '', prixUnitaire: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
  const [formScanSortie, setFormScanSortie] = useState({ quantite: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
  const [formScanTransfert, setFormScanTransfert] = useState({ quantite: '', depotSource: 'Atelier', depotDestination: 'Véhicule 1' });
  const [afficherScannerIntervention, setAfficherScannerIntervention] = useState(false);
  const [scanResultatIntervention, setScanResultatIntervention] = useState(null);
  const [quantiteScanIntervention, setQuantiteScanIntervention] = useState('');
  
  const typesIntervention = ['Vidange moteur', 'Révision complète', 'Changement pneus', 'Nettoyage', 'Maintenance', 'Contrôle hydraulique', 'Réparation', 'Autre'];

  useEffect(() => {
    if (window.jsQR) {
      jsQRRef.current = window.jsQR;
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
    script.async = true;
    script.onload = () => {
      jsQRRef.current = window.jsQR;
    };
    document.head.appendChild(script);
  }, []);

  // ✅ FONCTION CRÉER/MODIFIER ÉQUIPEMENT
  const creerOuModifierEquipement = () => {
    if (!nouvelEquipement.immat || !nouvelEquipement.type) {
      alert('⚠️ Immatriculation et Type sont obligatoires!');
      return;
    }

    // Vérifier unicité immatriculation (sauf si c'est l'équipement en édition)
    const immatExiste = equipements.some(e => 
      e.immat === nouvelEquipement.immat && 
      (!modeEdition || e.id !== equipementEnEdition.id)
    );
    
    if (immatExiste) {
      alert('⚠️ Cette immatriculation existe déjà!');
      return;
    }

    if (modeEdition) {
      // MODE ÉDITION: Mettre à jour l'équipement
      setEquipements(equipements.map(e => 
        e.id === equipementEnEdition.id ? {
          id: e.id, // ID inchangé
          immat: nouvelEquipement.immat,
          type: nouvelEquipement.type,
          marque: nouvelEquipement.marque || '',
          modele: nouvelEquipement.modele || '',
          annee: nouvelEquipement.annee ? parseInt(nouvelEquipement.annee) : 0,
          km: nouvelEquipement.km ? parseInt(nouvelEquipement.km) : 0,
          heures: nouvelEquipement.heures ? parseInt(nouvelEquipement.heures) : 0,
          carburant: nouvelEquipement.carburant || '',
          vin: nouvelEquipement.vin || '',
          ptac: nouvelEquipement.ptac ? parseInt(nouvelEquipement.ptac) : 0,
          poids: nouvelEquipement.poids ? parseInt(nouvelEquipement.poids) : 0,
          proprietaire: nouvelEquipement.proprietaire || 'SOLAIRE NETTOYAGE',
          valeurAchat: nouvelEquipement.valeurAchat ? parseFloat(nouvelEquipement.valeurAchat) : 0,
          valeurActuelle: nouvelEquipement.valeurActuelle ? parseFloat(nouvelEquipement.valeurActuelle) : 0,
          typeFinancement: nouvelEquipement.typeFinancement || '',
          coutMensuel: nouvelEquipement.coutMensuel ? parseFloat(nouvelEquipement.coutMensuel) : 0,
          dateDebut: nouvelEquipement.dateDebut || new Date().toISOString().split('T')[0],
          dateFin: nouvelEquipement.dateFin || '',
          assurance: nouvelEquipement.assurance ? parseFloat(nouvelEquipement.assurance) : 0,
          dateContracteTechnique: nouvelEquipement.dateContracteTechnique || '',
          notes: nouvelEquipement.notes || ''
        } : e
      ));
      alert('✅ Équipement modifié avec succès!');
    } else {
      // MODE CRÉATION: Ajouter nouvel équipement
      const nouvelId = equipements.length > 0 ? Math.max(...equipements.map(e => e.id)) + 1 : 1;
      
      const equipement = {
        id: nouvelId,
        immat: nouvelEquipement.immat,
        type: nouvelEquipement.type,
        marque: nouvelEquipement.marque || '',
        modele: nouvelEquipement.modele || '',
        annee: nouvelEquipement.annee ? parseInt(nouvelEquipement.annee) : 0,
        km: nouvelEquipement.km ? parseInt(nouvelEquipement.km) : 0,
        heures: nouvelEquipement.heures ? parseInt(nouvelEquipement.heures) : 0,
        carburant: nouvelEquipement.carburant || '',
        vin: nouvelEquipement.vin || '',
        ptac: nouvelEquipement.ptac ? parseInt(nouvelEquipement.ptac) : 0,
        poids: nouvelEquipement.poids ? parseInt(nouvelEquipement.poids) : 0,
        proprietaire: nouvelEquipement.proprietaire || 'SOLAIRE NETTOYAGE',
        valeurAchat: nouvelEquipement.valeurAchat ? parseFloat(nouvelEquipement.valeurAchat) : 0,
        valeurActuelle: nouvelEquipement.valeurActuelle ? parseFloat(nouvelEquipement.valeurActuelle) : 0,
        typeFinancement: nouvelEquipement.typeFinancement || '',
        coutMensuel: nouvelEquipement.coutMensuel ? parseFloat(nouvelEquipement.coutMensuel) : 0,
        dateDebut: nouvelEquipement.dateDebut || new Date().toISOString().split('T')[0],
        dateFin: nouvelEquipement.dateFin || '',
        assurance: nouvelEquipement.assurance ? parseFloat(nouvelEquipement.assurance) : 0,
        dateContracteTechnique: nouvelEquipement.dateContracteTechnique || '',
        notes: nouvelEquipement.notes || ''
      };

      setEquipements([...equipements, equipement]);
      setAccessoiresEquipement({...accessoiresEquipement, [nouvelId]: []});
      alert('✅ Équipement créé avec succès!');
    }

    // Réinitialiser formulaire et fermer
    setNouvelEquipement({
      immat: '',
      type: '',
      marque: '',
      modele: '',
      annee: '',
      km: 0,
      heures: 0,
      carburant: '',
      vin: '',
      ptac: 0,
      poids: 0,
      proprietaire: 'SOLAIRE NETTOYAGE',
      valeurAchat: 0,
      valeurActuelle: 0,
      typeFinancement: '',
      coutMensuel: 0,
      dateDebut: new Date().toISOString().split('T')[0],
      dateFin: '',
      assurance: 0,
      dateContracteTechnique: '',
      notes: ''
    });

    setEquipementEnEdition(null);
    setModeEdition(false);
    setAfficherFormulaireEquipement(false);
  };

  // ✅ FONCTION OUVRIR ÉDITION
  const ouvrirEditionEquipement = (equipement) => {
    setEquipementEnEdition(equipement);
    setModeEdition(true);
    setNouvelEquipement({
      immat: equipement.immat,
      type: equipement.type,
      marque: equipement.marque,
      modele: equipement.modele,
      annee: equipement.annee,
      km: equipement.km,
      heures: equipement.heures,
      carburant: equipement.carburant,
      vin: equipement.vin,
      ptac: equipement.ptac,
      poids: equipement.poids,
      proprietaire: equipement.proprietaire,
      valeurAchat: equipement.valeurAchat,
      valeurActuelle: equipement.valeurActuelle,
      typeFinancement: equipement.typeFinancement,
      coutMensuel: equipement.coutMensuel,
      dateDebut: equipement.dateDebut,
      dateFin: equipement.dateFin,
      assurance: equipement.assurance,
      dateContracteTechnique: equipement.dateContracteTechnique,
      notes: equipement.notes
    });
    setAfficherFormulaireEquipement(true);
  };

  // ✅ FONCTION ANNULER ÉDITION
  const annulerEditionEquipement = () => {
    setEquipementEnEdition(null);
    setModeEdition(false);
    setNouvelEquipement({
      immat: '',
      type: '',
      marque: '',
      modele: '',
      annee: '',
      km: 0,
      heures: 0,
      carburant: '',
      vin: '',
      ptac: 0,
      poids: 0,
      proprietaire: 'SOLAIRE NETTOYAGE',
      valeurAchat: 0,
      valeurActuelle: 0,
      typeFinancement: '',
      coutMensuel: 0,
      dateDebut: new Date().toISOString().split('T')[0],
      dateFin: '',
      assurance: 0,
      dateContracteTechnique: '',
      notes: ''
    });
    setAfficherFormulaireEquipement(false);
  };

  const gererSelectionPhotos = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setPhotosSelectionnees(prev => [...prev, { nom: file.name, base64 }]);
        setNouveauDefaut(prev => ({ 
          ...prev, 
          photosNoms: [...prev.photosNoms, { nom: file.name, base64 }] 
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const supprimerPhotoSelectionnee = (index) => {
    const newPhotos = photosSelectionnees.filter((_, i) => i !== index);
    setPhotosSelectionnees(newPhotos);
    setNouveauDefaut(prev => ({ ...prev, photosNoms: newPhotos }));
  };

  const getStockTotal = (article) => {
    return depots.reduce((sum, depot) => sum + (article.stockParDepot[depot] || 0), 0);
  };

  const declareDefaut = () => {
    if (!nouveauDefaut.equipementId || !nouveauDefaut.type || !nouveauDefaut.description) {
      alert('Équipement, type et description requis');
      return;
    }

    const newDefaut = {
      id: defauts.length > 0 ? Math.max(...defauts.map(d => d.id)) + 1 : 1,
      equipementId: parseInt(nouveauDefaut.equipementId),
      accessoireId: nouveauDefaut.accessoireId ? parseInt(nouveauDefaut.accessoireId) : null,
      type: nouveauDefaut.type,
      severite: nouveauDefaut.severite,
      description: nouveauDefaut.description,
      localisation: nouveauDefaut.localisation,
      dateConstatation: nouveauDefaut.dateConstatation,
      operateur: nouveauDefaut.operateur,
      remarques: nouveauDefaut.remarques,
      photos: photosSelectionnees,
      statut: 'a_traiter',
      interventionLieeId: null,
      dateArchivage: null
    };

    setDefauts([...defauts, newDefaut]);
    setNouveauDefaut({ equipementId: '', accessoireId: '', type: 'Fuite', severite: 'moyen', description: '', localisation: '', dateConstatation: new Date().toISOString().split('T')[0], operateur: 'Axel', remarques: '', photosNoms: [] });
    setPhotosSelectionnees([]);
    alert('✅ Défaut signalé!');
  };

  const resoudreDefaut = (defautId) => {
    setDefauts(defauts.map(d => d.id === defautId ? { ...d, statut: 'resolu', dateArchivage: new Date().toISOString().split('T')[0] } : d));
  };

  const creerInterventionDepuisDefaut = (defaut) => {
    setNouvelleIntervention({
      equipementId: defaut.accessoireId ? '999' : defaut.equipementId.toString(),
      type: 'Réparation',
      date: new Date().toISOString().split('T')[0],
      km: '',
      heures: '',
      description: `Réparation - ${defaut.type}: ${defaut.description}`,
      articlesPrevu: [],
      depotPrelevement: 'Atelier'
    });
    setOngletActif('interventions');
    alert('✅ Intervention pré-remplie depuis le défaut');
  };

  const traiterScanQR = useCallback((code) => {
    const article = articles.find(a => a.code === code);
    if (article) {
      setScanResultat({ success: true, article, code });
      setActionScan(null);
    } else {
      setScanResultat({ success: false, code });
      setActionScan(null);
    }
  }, [articles]);

  const getArticlesDisponiblesCallback = useCallback(() => {
    if (afficherArticlesEquipement && nouvelleIntervention.equipementId) {
      const selectedId = parseInt(nouvelleIntervention.equipementId);
      if (selectedId === 999) {
        return articles.filter(a => a.equipementsAffectes.includes(6) || a.equipementsAffectes.includes(999));
      }
      return articles.filter(a => a.equipementsAffectes.includes(selectedId));
    }
    return articles;
  }, [articles, afficherArticlesEquipement, nouvelleIntervention.equipementId]);

  const traiterScanQRIntervention = useCallback((code) => {
    const article = getArticlesDisponiblesCallback().find(a => a.code === code);
    if (article) {
      setScanResultatIntervention({ article, code });
    } else {
      alert(`Article non trouvé: ${code}`);
    }
  }, [getArticlesDisponiblesCallback]);

  useEffect(() => {
    if (!afficherScannerQR || !videoRef.current || !canvasRef.current || scanResultat) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let lastDetectedCode = null;
    let lastDetectedTime = 0;
    const tick = () => {
      try {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;
          if (videoWidth > 0 && videoHeight > 0) {
            canvas.width = videoWidth;
            canvas.height = videoHeight;
            ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
            const imageData = ctx.getImageData(0, 0, videoWidth, videoHeight);
            const jsQR = jsQRRef.current || window.jsQR;
            if (jsQR && typeof jsQR === 'function') {
              const code = jsQR(imageData.data, videoWidth, videoHeight);
              if (code && code.data) {
                const now = Date.now();
                if (code.data !== lastDetectedCode || now - lastDetectedTime > 5000) {
                  lastDetectedCode = code.data;
                  lastDetectedTime = now;
                  traiterScanQR(code.data);
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Erreur scan:', err);
      }
      scanningRef.current = requestAnimationFrame(tick);
    };
    scanningRef.current = requestAnimationFrame(tick);
    return () => {
      if (scanningRef.current) cancelAnimationFrame(scanningRef.current);
    };
  }, [afficherScannerQR, scanResultat, traiterScanQR]);

  useEffect(() => {
    if (!afficherScannerIntervention || !videoIntervention.current || !canvasIntervention.current || scanResultatIntervention) return;
    const canvas = canvasIntervention.current;
    const video = videoIntervention.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let lastDetectedCode = null;
    let lastDetectedTime = 0;
    const tick = () => {
      try {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;
          if (videoWidth > 0 && videoHeight > 0) {
            canvas.width = videoWidth;
            canvas.height = videoHeight;
            ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
            const imageData = ctx.getImageData(0, 0, videoWidth, videoHeight);
            const jsQR = jsQRRef.current || window.jsQR;
            if (jsQR && typeof jsQR === 'function') {
              const code = jsQR(imageData.data, videoWidth, videoHeight);
              if (code && code.data) {
                const now = Date.now();
                if (code.data !== lastDetectedCode || now - lastDetectedTime > 5000) {
                  lastDetectedCode = code.data;
                  lastDetectedTime = now;
                  traiterScanQRIntervention(code.data);
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Erreur scan intervention:', err);
      }
      scanningIntervention.current = requestAnimationFrame(tick);
    };
    scanningIntervention.current = requestAnimationFrame(tick);
    return () => {
      if (scanningIntervention.current) cancelAnimationFrame(scanningIntervention.current);
    };
  }, [afficherScannerIntervention, scanResultatIntervention, traiterScanQRIntervention]);

  const calculerAlertes = () => {
    const alertes = articles.map(article => {
      const total = getStockTotal(article);
      let severite = null;

      if (total === article.stockMin) {
        severite = 'critique';
      }
      else if (total < article.stockMin * 1.5) {
        severite = 'attention';
      }
      else if (depots.some(depot => article.stockParDepot[depot] === 0)) {
        severite = 'vigilance';
      }

      if (severite) {
        return {
          ...article,
          severite,
          depotsVides: depots.filter(d => article.stockParDepot[d] === 0),
          total
        };
      }
      return null;
    }).filter(a => a !== null);

    return alertes;
  };

  const appliquerFiltresAlertes = (alertes) => {
    let filtrées = alertes;

    if (filtreAlerteSeverite) {
      filtrées = filtrées.filter(a => a.severite === filtreAlerteSeverite);
    }
    if (filtreAlerteFournisseur) {
      filtrées = filtrées.filter(a => a.fournisseur === filtreAlerteFournisseur);
    }
    if (filtreAlerteDepot) {
      filtrées = filtrées.filter(a => a.depotsVides.includes(filtreAlerteDepot));
    }

    if (triAlertes === 'severite') {
      filtrées.sort((a, b) => {
        const ordre = { 'critique': 0, 'attention': 1, 'vigilance': 2 };
        return ordre[a.severite] - ordre[b.severite];
      });
    } else if (triAlertes === 'stock') {
      filtrées.sort((a, b) => a.total - b.total);
    } else if (triAlertes === 'nom') {
      filtrées.sort((a, b) => a.code.localeCompare(b.code));
    }

    return filtrées;
  };

  const alertesTotales = calculerAlertes();
  const alertesCritiques = alertesTotales.filter(a => a.severite === 'critique');
  const alertesAttention = alertesTotales.filter(a => a.severite === 'attention');
  const alertesVigilance = alertesTotales.filter(a => a.severite === 'vigilance');
  const alertesFiltrees = appliquerFiltresAlertes(alertesTotales);

  const effectuerTransfertRapide = () => {
    if (!transfertRapideData.quantite || transfertRapideData.depotSource === transfertRapideData.depotDestination) {
      alert('Quantité et dépôts différents requis');
      return;
    }
    const quantite = parseInt(transfertRapideData.quantite);
    if ((articleEnTransfertAlerte.stockParDepot[transfertRapideData.depotSource] || 0) < quantite) {
      alert('Stock insuffisant!');
      return;
    }
    setArticles(articles.map(a => a.id === articleEnTransfertAlerte.id ? { ...a, stockParDepot: { ...a.stockParDepot, [transfertRapideData.depotSource]: (a.stockParDepot[transfertRapideData.depotSource] || 0) - quantite, [transfertRapideData.depotDestination]: (a.stockParDepot[transfertRapideData.depotDestination] || 0) + quantite } } : a));
    setMouvementsStock([...mouvementsStock, { id: mouvementsStock.length + 1, articleId: articleEnTransfertAlerte.id, type: 'transfer', quantite, date: new Date().toISOString().split('T')[0], raison: `Transfert rapide alerte`, coutTotal: 0, depotSource: transfertRapideData.depotSource, depotDestination: transfertRapideData.depotDestination }]);
    alert(`✅ ${quantite} ${articleEnTransfertAlerte.code} transférés!`);
    setArticleEnTransfertAlerte(null);
    setTransfertRapideData({ depotSource: 'Atelier', depotDestination: 'Véhicule 1', quantite: '' });
  };

  const ajouterArticlePrevuScan = () => {
    if (!quantiteScanIntervention) {
      alert('Quantité requise');
      return;
    }
    const article = scanResultatIntervention.article;
    const quantite = parseInt(quantiteScanIntervention);
    const stockDispo = article.stockParDepot[nouvelleIntervention.depotPrelevement] || 0;
    
    if (stockDispo < quantite) {
      alert(`Stock insuffisant! Disponible: ${stockDispo}`);
      return;
    }

    setArticles(articles.map(a => a.id === article.id ? { ...a, stockParDepot: { ...a.stockParDepot, [nouvelleIntervention.depotPrelevement]: stockDispo - quantite } } : a));

    setNouvelleIntervention({
      ...nouvelleIntervention, 
      articlesPrevu: [...nouvelleIntervention.articlesPrevu, { 
        articleId: article.id, 
        quantite, 
        prixUnitaire: article.prixUnitaire, 
        description: article.description, 
        code: article.code,
        articleScanned: true
      }]
    });

    setScanResultatIntervention(null);
    setQuantiteScanIntervention('');
  };

  const toggleScannerIntervention = async () => {
    if (afficherScannerIntervention) {
      if (videoIntervention.current && videoIntervention.current.srcObject) {
        videoIntervention.current.srcObject.getTracks().forEach(track => track.stop());
      }
      setAfficherScannerIntervention(false);
    } else {
      setAfficherScannerIntervention(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoIntervention.current) {
          videoIntervention.current.srcObject = stream;
        }
      } catch (err) {
        alert('Caméra non disponible');
        setAfficherScannerIntervention(false);
      }
    }
  };

  const genererTexteCommande = (article) => {
    const qteACommander = Math.max(0, article.stockMin - getStockTotal(article));
    const existant = panierCommande.find(item => item.articleId === article.id);
    if (existant) { alert('Article déjà dans le panier !'); return; }
    setPanierCommande([...panierCommande, { articleId: article.id, qteEditable: qteACommander, article }]);
  };

  const supprimerDuPanier = (articleId) => {
    setPanierCommande(panierCommande.filter(item => item.articleId !== articleId));
  };

  const mettreAJourQte = (articleId, qte) => {
    setPanierCommande(panierCommande.map(item => 
      item.articleId === articleId ? { ...item, qteEditable: parseInt(qte) || 0 } : item
    ));
  };

  const regrouperParFournisseur = () => {
    const groupes = {};
    panierCommande.forEach(item => {
      const fournisseur = item.article.fournisseur;
      if (!groupes[fournisseur]) groupes[fournisseur] = [];
      groupes[fournisseur].push(item);
    });
    return groupes;
  };

  const getArticlesDisponibles = () => {
    if (afficherArticlesEquipement && nouvelleIntervention.equipementId) {
      const selectedId = parseInt(nouvelleIntervention.equipementId);
      if (selectedId === 999) {
        return articles.filter(a => a.equipementsAffectes.includes(6) || a.equipementsAffectes.includes(999));
      }
      return articles.filter(a => a.equipementsAffectes.includes(selectedId));
    }
    return articles;
  };

  const getEquipementsEtSunbrush = () => {
    const liste = equipements.map(eq => ({
      id: eq.id,
      nom: `${eq.immat} - ${eq.marque} ${eq.modele}`,
      type: 'equipement'
    }));
    Object.entries(accessoiresEquipement).forEach(([eqId, accs]) => {
      accs.forEach(acc => {
        if (acc.actif) {
          const parentEq = equipements.find(e => e.id === parseInt(eqId));
          liste.push({
            id: parseInt(eqId),
            nom: `${acc.nom} (sur ${parentEq?.immat})`,
            type: 'accessoire',
            accessoireId: acc.id
          });
        }
      });
    });
    return liste;
  };

  const copierToutCommandes = () => {
    const groupes = regrouperParFournisseur();
    const plainTexts = [];
    Object.keys(groupes).forEach(fournisseur => {
      const items = groupes[fournisseur];
      const plainText = `COMMANDE - ${fournisseur}\n${items.map(item => `${item.article.code} | ${item.article.description} | ${item.qteEditable}`).join('\n')}`;
      plainTexts.push(plainText);
    });
    const plainComplet = plainTexts.join('\n\n');
    navigator.clipboard.writeText(plainComplet).then(() => {
      alert('✓ Commandes copiées !');
      setPanierCommande([]);
    }).catch(() => {
      alert('Erreur copie');
    });
  };

  const ouvrirEditionStockMin = (article) => {
    setArticleEnEdition({ ...article, stockMinTemp: article.stockMin });
  };

  const sauvegarderStockMin = () => {
    if (articleEnEdition && articleEnEdition.stockMinTemp >= 0) {
      setArticles(articles.map(a => 
        a.id === articleEnEdition.id ? { ...a, stockMin: parseInt(articleEnEdition.stockMinTemp) } : a
      ));
      setArticleEnEdition(null);
    }
  };

  const annulerEditionStockMin = () => {
    setArticleEnEdition(null);
  };

  const genererQRCodesPDF = () => {
    const htmlContent = `<html><head><title>QR Codes</title><style>body { font-family: Arial; margin: 10mm; } .qr-item { display: inline-block; margin: 10px; text-align: center; } .qr-item img { width: 150px; height: 150px; } .code { font-weight: bold; font-size: 12px; }</style></head><body><h1>QR Codes Articles</h1><p>Généré le: ${new Date().toLocaleString('fr-FR')}</p>${articles.map(a => `<div class="qr-item"><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(a.code)}" alt="QR ${a.code}"><div class="code">${a.code}</div></div>`).join('')}</body></html>`;
    const newWindow = window.open();
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  };

  const toggleScannerQR = async () => {
    if (afficherScannerQR) {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
      }
      setAfficherScannerQR(false);
    } else {
      setAfficherScannerQR(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setVideoStream(stream);
      } catch (err) {
        alert('Caméra non disponible');
        setAfficherScannerQR(false);
      }
    }
  };

  const enregistrerEntreeStockScan = () => {
    if (!formScanEntree.quantite || !formScanEntree.prixUnitaire) { alert('Quantité et prix requis'); return; }
    const quantite = parseInt(formScanEntree.quantite);
    const coutTotal = parseFloat(formScanEntree.prixUnitaire) * quantite;
    setArticles(articles.map(a => a.id === scanResultat.article.id ? { ...a, stockParDepot: { ...a.stockParDepot, [formScanEntree.depot]: (a.stockParDepot[formScanEntree.depot] || 0) + quantite } } : a));
    setMouvementsStock([...mouvementsStock, { id: mouvementsStock.length + 1, articleId: scanResultat.article.id, type: 'entree', quantite, date: formScanEntree.date, raison: formScanEntree.raison, coutTotal, depot: formScanEntree.depot }]);
    alert(`✅ +${quantite} ${scanResultat.article.code}`);
    setScanResultat(null);
    setActionScan(null);
    setFormScanEntree({ quantite: '', prixUnitaire: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
  };

  const enregistrerSortieStockScan = () => {
    if (!formScanSortie.quantite) { alert('Quantité requise'); return; }
    const quantite = parseInt(formScanSortie.quantite);
    if ((scanResultat.article.stockParDepot[formScanSortie.depot] || 0) < quantite) { alert('Stock insuffisant!'); return; }
    setArticles(articles.map(a => a.id === scanResultat.article.id ? { ...a, stockParDepot: { ...a.stockParDepot, [formScanSortie.depot]: (a.stockParDepot[formScanSortie.depot] || 0) - quantite } } : a));
    setMouvementsStock([...mouvementsStock, { id: mouvementsStock.length + 1, articleId: scanResultat.article.id, type: 'sortie', quantite, date: formScanSortie.date, raison: formScanSortie.raison, coutTotal: 0, depot: formScanSortie.depot }]);
    alert(`✅ -${quantite} ${scanResultat.article.code}`);
    setScanResultat(null);
    setActionScan(null);
    setFormScanSortie({ quantite: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
  };

  const enregistrerTransfertStockScan = () => {
    if (!formScanTransfert.quantite || formScanTransfert.depotSource === formScanTransfert.depotDestination) { alert('Quantité et dépôts différents requis'); return; }
    const quantite = parseInt(formScanTransfert.quantite);
    if ((scanResultat.article.stockParDepot[formScanTransfert.depotSource] || 0) < quantite) { alert('Stock insuffisant!'); return; }
    setArticles(articles.map(a => a.id === scanResultat.article.id ? { ...a, stockParDepot: { ...a.stockParDepot, [formScanTransfert.depotSource]: (a.stockParDepot[formScanTransfert.depotSource] || 0) - quantite, [formScanTransfert.depotDestination]: (a.stockParDepot[formScanTransfert.depotDestination] || 0) + quantite } } : a));
    setMouvementsStock([...mouvementsStock, { id: mouvementsStock.length + 1, articleId: scanResultat.article.id, type: 'transfer', quantite, date: new Date().toISOString().split('T')[0], raison: `Transfert`, coutTotal: 0, depotSource: formScanTransfert.depotSource, depotDestination: formScanTransfert.depotDestination }]);
    alert(`✅ ${quantite} ${scanResultat.article.code}`);
    setScanResultat(null);
    setActionScan(null);
    setFormScanTransfert({ quantite: '', depotSource: 'Atelier', depotDestination: 'Véhicule 1' });
  };

  const enregistrerEntreeStock = () => {
    if (nouvelleEntreeStock.articleId && nouvelleEntreeStock.quantite && nouvelleEntreeStock.prixUnitaire) {
      const quantite = parseInt(nouvelleEntreeStock.quantite);
      const coutTotal = parseFloat(nouvelleEntreeStock.prixUnitaire) * quantite;
      setArticles(articles.map(a => a.id === parseInt(nouvelleEntreeStock.articleId) ? { ...a, stockParDepot: { ...a.stockParDepot, [nouvelleEntreeStock.depot]: (a.stockParDepot[nouvelleEntreeStock.depot] || 0) + quantite } } : a));
      setMouvementsStock([...mouvementsStock, { id: mouvementsStock.length + 1, articleId: parseInt(nouvelleEntreeStock.articleId), type: 'entree', quantite, date: nouvelleEntreeStock.date, raison: nouvelleEntreeStock.raison, coutTotal, depot: nouvelleEntreeStock.depot }]);
      setNouvelleEntreeStock({ articleId: '', quantite: '', prixUnitaire: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
    }
  };

  const enregistrerSortieStock = () => {
    if (nouveauMouvementSortie.articleId && nouveauMouvementSortie.quantite) {
      const article = articles.find(a => a.id === parseInt(nouveauMouvementSortie.articleId));
      const quantite = parseInt(nouveauMouvementSortie.quantite);
      if ((article.stockParDepot[nouveauMouvementSortie.depot] || 0) < quantite) { alert('Stock insuffisant!'); return; }
      setArticles(articles.map(a => a.id === parseInt(nouveauMouvementSortie.articleId) ? { ...a, stockParDepot: { ...a.stockParDepot, [nouveauMouvementSortie.depot]: (a.stockParDepot[nouveauMouvementSortie.depot] || 0) - quantite } } : a));
      setMouvementsStock([...mouvementsStock, { id: mouvementsStock.length + 1, articleId: parseInt(nouveauMouvementSortie.articleId), type: 'sortie', quantite, date: nouveauMouvementSortie.date, raison: nouveauMouvementSortie.raison, coutTotal: 0, depot: nouveauMouvementSortie.depot }]);
      setNouveauMouvementSortie({ articleId: '', quantite: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
    }
  };

  const enregistrerTransfertStock = () => {
    if (nouveauTransfert.articleId && nouveauTransfert.quantite && nouveauTransfert.depotSource !== nouveauTransfert.depotDestination) {
      const article = articles.find(a => a.id === parseInt(nouveauTransfert.articleId));
      const quantite = parseInt(nouveauTransfert.quantite);
      if ((article.stockParDepot[nouveauTransfert.depotSource] || 0) < quantite) { alert('Stock insuffisant!'); return; }
      setArticles(articles.map(a => a.id === parseInt(nouveauTransfert.articleId) ? { ...a, stockParDepot: { ...a.stockParDepot, [nouveauTransfert.depotSource]: (a.stockParDepot[nouveauTransfert.depotSource] || 0) - quantite, [nouveauTransfert.depotDestination]: (a.stockParDepot[nouveauTransfert.depotDestination] || 0) + quantite } } : a));
      setMouvementsStock([...mouvementsStock, { id: mouvementsStock.length + 1, articleId: parseInt(nouveauTransfert.articleId), type: 'transfer', quantite, date: nouveauTransfert.date, raison: `Transfert`, coutTotal: 0, depotSource: nouveauTransfert.depotSource, depotDestination: nouveauTransfert.depotDestination }]);
      setNouveauTransfert({ articleId: '', quantite: '', depotSource: 'Atelier', depotDestination: 'Véhicule 1', raison: '', date: new Date().toISOString().split('T')[0] });
    }
  };

  const ajouterArticlePrevu = () => {
    if (nouvelArticleIntervention.articleId && nouvelArticleIntervention.quantite) {
      const article = articles.find(a => a.id === parseInt(nouvelArticleIntervention.articleId));
      const quantite = parseInt(nouvelArticleIntervention.quantite);
      if ((article.stockParDepot[nouvelleIntervention.depotPrelevement] || 0) < quantite) { alert('Stock insuffisant'); return; }
      setNouvelleIntervention({...nouvelleIntervention, articlesPrevu: [...nouvelleIntervention.articlesPrevu, { articleId: parseInt(nouvelArticleIntervention.articleId), quantite, prixUnitaire: article.prixUnitaire, description: article.description, code: article.code }]});
      setNouvelArticleIntervention({ articleId: '', quantite: '' });
    }
  };

  const supprimerArticlePrevu = (index) => {
    setNouvelleIntervention({...nouvelleIntervention, articlesPrevu: nouvelleIntervention.articlesPrevu.filter((_, i) => i !== index)});
  };

  const creerIntervention = () => {
    if (!nouvelleIntervention.equipementId || !nouvelleIntervention.type) { alert('Veuillez sélectionner un équipement et un type'); return; }
    const interventionId = interventions.length > 0 ? Math.max(...interventions.map(i => i.id)) + 1 : 1;
    const coutTotal = nouvelleIntervention.articlesPrevu.reduce((sum, art) => sum + (art.quantite * art.prixUnitaire), 0);
    let nouvelStock = articles;
    nouvelleIntervention.articlesPrevu.forEach(art => {
      if (!art.articleScanned) {
        nouvelStock = nouvelStock.map(a => a.id === art.articleId ? { ...a, stockParDepot: { ...a.stockParDepot, [nouvelleIntervention.depotPrelevement]: (a.stockParDepot[nouvelleIntervention.depotPrelevement] || 0) - art.quantite } } : a);
      }
    });
    setArticles(nouvelStock);
    setInterventions([...interventions, { id: interventionId, equipementId: parseInt(nouvelleIntervention.equipementId), type: nouvelleIntervention.type, date: nouvelleIntervention.date, km: parseInt(nouvelleIntervention.km) || 0, heures: parseInt(nouvelleIntervention.heures) || 0, description: nouvelleIntervention.description, articles: nouvelleIntervention.articlesPrevu, statut: 'en_cours', coutTotal, depotPrelevement: nouvelleIntervention.depotPrelevement }]);
    setNouvelleIntervention({ equipementId: '', type: '', date: new Date().toISOString().split('T')[0], km: '', heures: '', description: '', articlesPrevu: [], depotPrelevement: 'Atelier' });
  };

  const cloturerIntervention = (interventionId) => {
    setInterventions(interventions.map(i => i.id === interventionId ? { ...i, statut: 'effectue' } : i));
  };

  const ajouterAccessoire = (equipementId) => {
    if (nouvelAccessoire.nom && nouvelAccessoire.valeur) {
      const nouveauxAccessoires = [...(accessoiresEquipement[equipementId] || []), { id: Date.now(), ...nouvelAccessoire, valeur: parseFloat(nouvelAccessoire.valeur) }];
      setAccessoiresEquipement({ ...accessoiresEquipement, [equipementId]: nouveauxAccessoires });
      setNouvelAccessoire({ nom: '', valeur: '', description: '', dateAjout: new Date().toISOString().split('T')[0] });
    }
  };

  const supprimerAccessoire = (equipementId, accessoireId) => {
    setAccessoiresEquipement({ ...accessoiresEquipement, [equipementId]: (accessoiresEquipement[equipementId] || []).filter(a => a.id !== accessoireId) });
  };

  const affecterArticleEquipement = (articleId, equipementId) => {
    setArticles(articles.map(a => {
      if (a.id === articleId) {
        const eqId = parseInt(equipementId);
        return a.equipementsAffectes.includes(eqId) 
          ? { ...a, equipementsAffectes: a.equipementsAffectes.filter(e => e !== eqId) }
          : { ...a, equipementsAffectes: [...a.equipementsAffectes, eqId] };
      }
      return a;
    }));
  };

  const exporterPDF = () => {
    const eqInterventions = interventions.filter(i => i.equipementId === equipements.find(e => e.id === equipementSelectionne)?.id);
    const eqDefauts = defauts.filter(d => d.equipementId === equipements.find(e => e.id === equipementSelectionne)?.id);
    const eqAccessoires = accessoiresEquipement[equipementSelectionne] || [];
    const coutTotal = eqInterventions.filter(i => i.statut === 'effectue').reduce((sum, i) => sum + (i.coutTotal || 0), 0);
    const equipSelectionne = equipements.find(e => e.id === equipementSelectionne);

    let html = `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Statistiques ${equipSelectionne?.immat}</title>
          <style>
            body { font-family: Arial; margin: 20px; color: #333; }
            h1 { color: #6B46C1; border-bottom: 3px solid #6B46C1; padding-bottom: 10px; }
            h2 { color: #7C3AED; margin-top: 25px; border-left: 5px solid #7C3AED; padding-left: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #7C3AED; color: white; }
            tr:nth-child(even) { background-color: #f9f5ff; }
            .summary { background-color: #f0e6ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
            .summary-box { background: white; padding: 10px; border-left: 4px solid #7C3AED; }
            .total { font-weight: bold; color: #6B46C1; }
            .date { font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>📊 STATISTIQUES ÉQUIPEMENT</h1>
          <p><strong>Équipement:</strong> ${equipSelectionne?.immat} - ${equipSelectionne?.marque} ${equipSelectionne?.modele}</p>
          <p><strong>Générée le:</strong> ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>

          <div class="summary">
            <div class="summary-grid">
              <div class="summary-box">
                <p><strong>Interventions:</strong> ${eqInterventions.length}</p>
                <p class="date">${eqInterventions.filter(i => i.statut === 'effectue').length} effectuées</p>
              </div>
              <div class="summary-box">
                <p><strong>Défauts:</strong> ${eqDefauts.length}</p>
                <p class="date">${eqDefauts.filter(d => d.statut === 'resolu').length} résolus</p>
              </div>
              <div class="summary-box">
                <p><strong>Accessoires:</strong> ${eqAccessoires.length}</p>
                <p class="date">Valeur: ${eqAccessoires.reduce((s, a) => s + a.valeur, 0).toFixed(2)}€</p>
              </div>
              <div class="summary-box">
                <p class="total">💰 TOTAL INTERVENTIONS: ${coutTotal.toFixed(2)}€</p>
              </div>
            </div>
          </div>

          ${eqInterventions.length > 0 ? `
            <h2>🔧 INTERVENTIONS (${eqInterventions.length})</h2>
            <table>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>KM</th>
                <th>Coût</th>
                <th>Statut</th>
              </tr>
              ${eqInterventions.map(i => `
                <tr>
                  <td>${i.date}</td>
                  <td>${i.type}</td>
                  <td>${i.km}</td>
                  <td>${i.coutTotal}€</td>
                  <td>${i.statut === 'effectue' ? '✅ Effectuée' : '⏳ En cours'}</td>
                </tr>
              `).join('')}
            </table>
          ` : ''}

          ${eqDefauts.length > 0 ? `
            <h2>🚨 DÉFAUTS (${eqDefauts.length})</h2>
            <table>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Sévérité</th>
                <th>Opérateur</th>
                <th>Statut</th>
              </tr>
              ${eqDefauts.map(d => `
                <tr>
                  <td>${d.dateConstatation}</td>
                  <td>${d.type}</td>
                  <td>${d.severite === 'critique' ? '🔴 Critique' : d.severite === 'moyen' ? '🟠 Moyen' : '🟡 Mineur'}</td>
                  <td>${d.operateur}</td>
                  <td>${d.statut === 'resolu' ? '✅ Résolu' : '⏳ À traiter'}</td>
                </tr>
              `).join('')}
            </table>
          ` : ''}

          ${eqAccessoires.length > 0 ? `
            <h2>🎨 ACCESSOIRES (${eqAccessoires.length})</h2>
            <table>
              <tr>
                <th>Nom</th>
                <th>Valeur</th>
                <th>Date</th>
                <th>Statut</th>
              </tr>
              ${eqAccessoires.map(a => `
                <tr>
                  <td>${a.nom}</td>
                  <td>${a.valeur.toFixed(2)}€</td>
                  <td>${a.dateAjout}</td>
                  <td>${a.actif ? '✅ Actif' : '❌ Inactif'}</td>
                </tr>
              `).join('')}
            </table>
          ` : ''}

          <p style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">Document généré par Solaire Nettoyage</p>
        </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  const exporterCSV = () => {
    const equipSelectionne = equipements.find(e => e.id === equipementSelectionne);
    const eqInterventions = interventions.filter(i => i.equipementId === equipSelectionne?.id);
    const eqDefauts = defauts.filter(d => d.equipementId === equipSelectionne?.id);

    let csv = `SOLAIRE NETTOYAGE - EXPORT STATISTIQUES\n`;
    csv += `Équipement,${equipSelectionne?.immat} - ${equipSelectionne?.marque} ${equipSelectionne?.modele}\n`;
    csv += `Généré le,${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR')}\n\n`;

    csv += `INTERVENTIONS\n`;
    csv += `ID,Date,Type,KM,Heures,Description,Coût,Statut,Dépôt\n`;
    eqInterventions.forEach(i => {
      csv += `${i.id},"${i.date}","${i.type}",${i.km},${i.heures},"${i.description}",${i.coutTotal},"${i.statut}","${i.depotPrelevement}"\n`;
    });

    csv += `\n\nDÉFAUTS\n`;
    csv += `ID,Date,Type,Sévérité,Description,Opérateur,Localisation,Statut,Date Résolution\n`;
    eqDefauts.forEach(d => {
      csv += `${d.id},"${d.dateConstatation}","${d.type}","${d.severite}","${d.description}","${d.operateur}","${d.localisation}","${d.statut}","${d.dateArchivage || 'N/A'}"\n`;
    });

    csv += `\n\nRÉSUMÉ\n`;
    csv += `Interventions totales,${eqInterventions.length}\n`;
    csv += `Interventions effectuées,${eqInterventions.filter(i => i.statut === 'effectue').length}\n`;
    csv += `Coût total interventions,${eqInterventions.filter(i => i.statut === 'effectue').reduce((sum, i) => sum + (i.coutTotal || 0), 0).toFixed(2)}€\n`;
    csv += `Défauts totaux,${eqDefauts.length}\n`;
    csv += `Défauts résolus,${eqDefauts.filter(d => d.statut === 'resolu').length}\n`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `Statistiques_${equipSelectionne?.immat}_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    alert('✅ CSV téléchargé!');
  };

  const valeurStockTotal = articles.reduce((sum, a) => sum + (getStockTotal(a) * a.prixUnitaire), 0);
  const interventionsEnCours = interventions.filter(i => i.statut === 'en_cours');
  const equipSelectionne = equipements.find(e => e.id === equipementSelectionne);
  const accessoiresTotal = (accessoiresEquipement[equipementSelectionne] || []).reduce((sum, a) => sum + a.valeur, 0);
  const valeurEquipementTotal = (equipSelectionne?.valeurActuelle || 0) + accessoiresTotal;
  const articlesAffectesEquipement = articles.filter(a => a.equipementsAffectes.includes(equipementSelectionne));

  const defautsATraiter = defauts.filter(d => d.statut === 'a_traiter');
  const defautsCritiques = defautsATraiter.filter(d => d.severite === 'critique');
  const defautsAtention = defautsATraiter.filter(d => d.severite === 'moyen');
  const defautsMineur = defautsATraiter.filter(d => d.severite === 'mineur');
  const defautsArchives = defauts.filter(d => d.statut === 'resolu');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4">
        <h1 className="text-2xl font-bold">☀️ SOLAIRE NETTOYAGE - V1.4+ Équipements</h1>
        <p className="text-yellow-100 text-sm">Flotte • Stock • Maintenance • Interventions • Fiches matériel</p>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 overflow-x-auto">
        <div className="flex">
          {[
            { id: 'accueil', label: '📊 Accueil' },
            { id: 'fiche', label: `📋 Fiche matériel (${equipements.length})` },
            { id: 'articles', label: '📦 Articles (19)' },
            { id: 'inventaire', label: '📊 Inventaire' },
            { id: 'stock', label: '📥 Stock' },
            { id: 'equipements', label: `🚛 Équipements (${equipements.length})` },
            { id: 'interventions', label: `🔧 Interventions (${interventions.length})` },
            { id: 'maintenance', label: `⚙️ Maintenance (${defautsATraiter.length})` },
            { id: 'alertes', label: '🚨 Alertes' },
            { id: 'statistiques', label: '📈 Stats' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setOngletActif(tab.id)} className={`px-4 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${ongletActif === tab.id ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-600'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {ongletActif === 'accueil' && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-4 rounded border border-blue-200"><div className="text-3xl font-bold text-blue-600">{articles.length}</div><div className="text-sm">Articles</div></div>
            <div className="bg-green-50 p-4 rounded border border-green-200"><div className="text-3xl font-bold text-green-600">{articles.reduce((s,a)=>s+getStockTotal(a),0)}</div><div className="text-sm">Pièces total</div></div>
            <div className="bg-indigo-50 p-4 rounded border border-indigo-200"><div className="text-2xl font-bold text-indigo-600">{valeurStockTotal.toFixed(0)}€</div><div className="text-sm">Valeur stock</div></div>
            <div className="bg-purple-50 p-4 rounded border border-purple-200"><div className="text-3xl font-bold text-purple-600">{equipements.length}</div><div className="text-sm">Équipements</div></div>
            <div className="bg-orange-50 p-4 rounded border border-orange-200"><div className="text-3xl font-bold text-orange-600">{interventionsEnCours.length}</div><div className="text-sm">Interv. en cours</div></div>
            <div className="bg-red-50 p-4 rounded border border-red-200"><div className="text-3xl font-bold text-red-600">{defautsCritiques.length}</div><div className="text-sm">🔴 Défauts critiques</div></div>
          </div>
        )}

        {ongletActif === 'articles' && (
          <div className="bg-white p-4 rounded border"><h2 className="font-bold mb-3">Articles ({articles.length})</h2><button onClick={genererQRCodesPDF} className="mb-4 bg-purple-600 text-white px-4 py-2 rounded font-bold hover:bg-purple-700">📋 Générer QR Codes PDF</button><div className="space-y-2">{articles.map(a => (<div key={a.id} className="flex justify-between p-2 bg-gray-50 rounded"><div><strong>{a.code}</strong> - {a.description}</div><div className="text-right"><span className={getStockTotal(a) <= 2 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>{getStockTotal(a)}</span> × {a.prixUnitaire}€</div></div>))}</div></div>
        )}

        {ongletActif === 'inventaire' && (
          <div className="space-y-4">
            {articleEnEdition && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
                  <h3 className="text-lg font-black text-gray-800 mb-4">✏️ Modifier Stock Minimum</h3>
                  <div className="space-y-3">
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Code</label><input type="text" value={articleEnEdition.code} disabled className="w-full border rounded px-3 py-2 bg-gray-100" /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Description</label><input type="text" value={articleEnEdition.description} disabled className="w-full border rounded px-3 py-2 bg-gray-100" /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Stock total</label><input type="text" value={getStockTotal(articleEnEdition)} disabled className="w-full border rounded px-3 py-2 bg-gray-100" /></div>
                    <div className="border-t pt-3"><label className="block text-sm font-bold text-orange-600 mb-1">Stock Minimum *</label><input type="number" min="0" value={articleEnEdition.stockMinTemp} onChange={(e) => setArticleEnEdition({...articleEnEdition, stockMinTemp: e.target.value})} className="w-full border-2 border-orange-300 rounded px-3 py-2 outline-none text-lg font-bold" /></div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <button onClick={sauvegarderStockMin} className="flex-1 bg-green-600 text-white px-4 py-2 rounded font-bold">✓ Sauvegarder</button>
                    <button onClick={annulerEditionStockMin} className="flex-1 bg-gray-400 text-white px-4 py-2 rounded font-bold">✕ Annuler</button>
                  </div>
                </div>
              </div>
            )}

            {panierCommande.length > 0 && (
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-black mb-4">🛒 Panier ({panierCommande.length})</h3>
                <div className="space-y-3 mb-4">{Object.entries(regrouperParFournisseur()).map(([fournisseur, items]) => (
                  <div key={fournisseur} className="bg-white bg-opacity-95 text-gray-800 rounded-lg p-4">
                    <h4 className="font-black text-lg text-blue-600 mb-2">📦 {fournisseur}</h4>
                    <div className="space-y-2">{items.map(item => (
                      <div key={item.articleId} className="flex justify-between items-center bg-blue-50 p-3 rounded border border-blue-200">
                        <div className="flex-1"><div className="font-bold text-blue-700">{item.article.code}</div><div className="text-sm">{item.article.description}</div></div>
                        <div className="flex items-center gap-3">
                          <input type="number" min="0" value={item.qteEditable} onChange={(e) => mettreAJourQte(item.articleId, e.target.value)} className="w-16 border-2 border-blue-300 rounded px-2 py-1 font-bold text-center" />
                          <div className="text-right min-w-20"><div className="font-bold text-blue-600">{item.article.prixUnitaire}€</div><div className="text-sm text-green-600">{(item.qteEditable * item.article.prixUnitaire).toFixed(2)}€</div></div>
                          <button onClick={() => supprimerDuPanier(item.articleId)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">✕</button>
                        </div>
                      </div>
                    ))}</div>
                  </div>
                ))}</div>
                <div className="flex gap-2">
                  <button onClick={copierToutCommandes} className="flex-1 bg-green-500 text-white px-6 py-3 rounded font-black hover:bg-green-600">✓ Copier Tout</button>
                  <button onClick={() => setPanierCommande([])} className="flex-1 bg-red-500 text-white px-6 py-3 rounded font-black hover:bg-red-600">🗑️ Vider</button>
                </div>
              </div>
            )}

            <div className="bg-white p-4 rounded border overflow-x-auto">
              <h2 className="font-black text-xl mb-4">📊 INVENTAIRE - Stocks par Dépôt</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-100 to-yellow-100">
                    <th className="px-3 py-3 text-left font-bold">Code</th>
                    <th className="px-3 py-3 text-left font-bold">Description</th>
                    <th className="px-3 py-3 text-right font-bold">Prix</th>
                    {depots.map(depot => (<th key={depot} className="px-3 py-3 text-center font-bold bg-white border-l">{depot}</th>))}
                    <th className="px-3 py-3 text-center font-bold bg-green-50">Total</th>
                    <th className="px-3 py-3 text-center font-bold">Min</th>
                    <th className="px-3 py-3 text-right font-bold">Valeur</th>
                    <th className="px-3 py-3 text-center font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(a => {
                    const total = getStockTotal(a);
                    const enAlerte = total < a.stockMin;
                    return (
                      <tr key={a.id} className={`border-b ${enAlerte ? 'bg-red-50' : ''}`}>
                        <td className="px-3 py-3 font-bold text-orange-600">{a.code}</td>
                        <td className="px-3 py-3 text-sm">{a.description}</td>
                        <td className="px-3 py-3 text-right">{a.prixUnitaire}€</td>
                        {depots.map(depot => (<td key={depot} className="px-3 py-3 text-center font-bold border-l"><span className={`px-2 py-1 rounded text-xs ${a.stockParDepot[depot] === 0 ? 'bg-gray-100' : a.stockParDepot[depot] <= 2 ? 'bg-orange-200' : 'bg-green-200'}`}>{a.stockParDepot[depot] || 0}</span></td>))}
                        <td className="px-3 py-3 text-center font-black bg-green-50 text-green-700">{total}</td>
                        <td className="px-3 py-3 text-center"><button onClick={() => ouvrirEditionStockMin(a)} className="text-blue-600 hover:underline font-bold">{a.stockMin}</button></td>
                        <td className="px-3 py-3 text-right font-bold">{(total * a.prixUnitaire).toFixed(2)}€</td>
                        <td className="px-3 py-3 text-center"><button onClick={() => genererTexteCommande(a)} className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold w-full">📧</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {ongletActif === 'stock' && (
          <div className="space-y-6">
            <div className="bg-indigo-100 border-2 border-indigo-400 p-4 rounded"><h3 className="font-bold mb-3">📱 Scanner QR Code</h3><button onClick={toggleScannerQR} className={`px-4 py-2 rounded font-bold text-white ${afficherScannerQR ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>{afficherScannerQR ? '❌ Fermer Scanner' : '📷 Activer Scanner'}</button>{afficherScannerQR && !scanResultat && (<div className="mt-4"><div className="bg-gray-900 rounded overflow-hidden" style={{maxWidth: '400px'}}><video ref={videoRef} autoPlay playsInline muted style={{width: '100%', display: 'block'}} /><canvas ref={canvasRef} style={{display: 'none'}} /></div><div className="mt-3"><input type="text" placeholder="Entrer code article ou scanner QR" onKeyDown={(e) => {if (e.key === 'Enter' && e.target.value) {traiterScanQR(e.target.value); e.target.value = ''}}} className="w-full border-2 border-indigo-300 rounded px-3 py-2 font-bold" /></div><div className="mt-2 text-sm text-indigo-700 font-semibold">🎯 Scanner actif</div></div>)}{scanResultat && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"><div className="text-center mb-4">{scanResultat.success ? (<><div className="text-4xl mb-2">✅</div><h3 className="text-xl font-black text-green-600">Article détecté !</h3></>) : (<><div className="text-4xl mb-2">❌</div><h3 className="text-xl font-black text-red-600">Article non trouvé</h3></>)}</div>{scanResultat.success && (<><div className="bg-green-50 p-4 rounded-lg mb-4 border-2 border-green-300"><div className="font-bold text-lg text-green-700">{scanResultat.article.code}</div><div className="text-sm text-gray-700 mt-1">{scanResultat.article.description}</div><div className="text-xs text-gray-600 mt-2">Fournisseur: {scanResultat.article.fournisseur}</div><div className="text-sm font-bold text-green-600 mt-2">Stock: {getStockTotal(scanResultat.article)}</div></div>{!actionScan ? (<><div className="grid grid-cols-3 gap-2 mb-4"><button onClick={() => setActionScan('entree')} className="bg-green-600 text-white px-3 py-3 rounded font-bold text-sm hover:bg-green-700">📥 Entrée</button><button onClick={() => setActionScan('sortie')} className="bg-red-600 text-white px-3 py-3 rounded font-bold text-sm hover:bg-red-700">📤 Sortie</button><button onClick={() => setActionScan('transfert')} className="bg-amber-600 text-white px-3 py-3 rounded font-bold text-sm hover:bg-amber-700">🔄 Transfer</button></div></>) : actionScan === 'entree' ? (<div className="bg-green-50 p-4 rounded-lg mb-4 border-2 border-green-300"><h4 className="font-bold text-green-700 mb-3">📥 Entrée de Stock</h4><div className="space-y-2"><input type="number" placeholder="Quantité *" value={formScanEntree.quantite} onChange={(e) => setFormScanEntree({...formScanEntree, quantite: e.target.value})} className="w-full border rounded px-2 py-1" /><input type="number" step="0.01" placeholder="Prix unitaire *" value={formScanEntree.prixUnitaire} onChange={(e) => setFormScanEntree({...formScanEntree, prixUnitaire: e.target.value})} className="w-full border rounded px-2 py-1" /><input placeholder="Raison" value={formScanEntree.raison} onChange={(e) => setFormScanEntree({...formScanEntree, raison: e.target.value})} className="w-full border rounded px-2 py-1" /><select value={formScanEntree.depot} onChange={(e) => setFormScanEntree({...formScanEntree, depot: e.target.value})} className="w-full border rounded px-2 py-1">{depots.map(d => <option key={d} value={d}>{d}</option>)}</select><input type="date" value={formScanEntree.date} onChange={(e) => setFormScanEntree({...formScanEntree, date: e.target.value})} className="w-full border rounded px-2 py-1" /></div><div className="flex gap-2 mt-3"><button onClick={enregistrerEntreeStockScan} className="flex-1 bg-green-600 text-white px-3 py-2 rounded font-bold">✓ Valider</button><button onClick={() => setActionScan(null)} className="flex-1 bg-gray-400 text-white px-3 py-2 rounded font-bold">↩️ Retour</button></div></div>) : actionScan === 'sortie' ? (<div className="bg-red-50 p-4 rounded-lg mb-4 border-2 border-red-300"><h4 className="font-bold text-red-700 mb-3">📤 Sortie de Stock</h4><div className="space-y-2"><input type="number" placeholder="Quantité *" value={formScanSortie.quantite} onChange={(e) => setFormScanSortie({...formScanSortie, quantite: e.target.value})} className="w-full border rounded px-2 py-1" /><input placeholder="Raison" value={formScanSortie.raison} onChange={(e) => setFormScanSortie({...formScanSortie, raison: e.target.value})} className="w-full border rounded px-2 py-1" /><select value={formScanSortie.depot} onChange={(e) => setFormScanSortie({...formScanSortie, depot: e.target.value})} className="w-full border rounded px-2 py-1">{depots.map(d => <option key={d} value={d}>{d}</option>)}</select><input type="date" value={formScanSortie.date} onChange={(e) => setFormScanSortie({...formScanSortie, date: e.target.value})} className="w-full border rounded px-2 py-1" /></div><div className="flex gap-2 mt-3"><button onClick={enregistrerSortieStockScan} className="flex-1 bg-red-600 text-white px-3 py-2 rounded font-bold">✓ Valider</button><button onClick={() => setActionScan(null)} className="flex-1 bg-gray-400 text-white px-3 py-2 rounded font-bold">↩️ Retour</button></div></div>) : (<div className="bg-amber-50 p-4 rounded-lg mb-4 border-2 border-amber-300"><h4 className="font-bold text-amber-700 mb-3">🔄 Transfert</h4><div className="space-y-2"><input type="number" placeholder="Quantité *" value={formScanTransfert.quantite} onChange={(e) => setFormScanTransfert({...formScanTransfert, quantite: e.target.value})} className="w-full border rounded px-2 py-1" /><select value={formScanTransfert.depotSource} onChange={(e) => setFormScanTransfert({...formScanTransfert, depotSource: e.target.value})} className="w-full border rounded px-2 py-1">{depots.map(d => <option key={d} value={d}>{d}</option>)}</select><select value={formScanTransfert.depotDestination} onChange={(e) => setFormScanTransfert({...formScanTransfert, depotDestination: e.target.value})} className="w-full border rounded px-2 py-1">{depots.map(d => <option key={d} value={d}>{d}</option>)}</select></div><div className="flex gap-2 mt-3"><button onClick={enregistrerTransfertStockScan} className="flex-1 bg-amber-600 text-white px-3 py-2 rounded font-bold">✓ Valider</button><button onClick={() => setActionScan(null)} className="flex-1 bg-gray-400 text-white px-3 py-2 rounded font-bold">↩️ Retour</button></div></div>)}</>)}{!scanResultat.success && (<div className="flex gap-2"><button onClick={() => setScanResultat(null)} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded font-bold">🔄 Rescanner</button><button onClick={() => {setAfficherScannerQR(false); setScanResultat(null);}} className="flex-1 bg-gray-400 text-white px-4 py-2 rounded font-bold">✕ Fermer</button></div>)}</div></div>)}</div>
            <div className="bg-green-50 border-2 border-green-300 p-4 rounded"><h3 className="font-bold mb-3">📥 Entrée</h3><div className="grid grid-cols-1 md:grid-cols-5 gap-2"><select value={nouvelleEntreeStock.articleId} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, articleId: e.target.value})} className="border rounded px-2 py-1"><option value="">Article</option>{articles.map(a => <option key={a.id} value={a.id}>{a.code}</option>)}</select><input type="number" placeholder="Qté" value={nouvelleEntreeStock.quantite} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, quantite: e.target.value})} className="border rounded px-2 py-1" /><input type="number" step="0.01" placeholder="Prix" value={nouvelleEntreeStock.prixUnitaire} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, prixUnitaire: e.target.value})} className="border rounded px-2 py-1" /><input placeholder="Raison" value={nouvelleEntreeStock.raison} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, raison: e.target.value})} className="border rounded px-2 py-1" /><button onClick={enregistrerEntreeStock} className="bg-green-600 text-white px-3 py-1 rounded font-bold">Entrer</button></div></div>
            <div className="bg-red-50 border-2 border-red-300 p-4 rounded"><h3 className="font-bold mb-3">📤 Sortie</h3><div className="grid grid-cols-1 md:grid-cols-5 gap-2"><select value={nouveauMouvementSortie.articleId} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, articleId: e.target.value})} className="border rounded px-2 py-1"><option value="">Article</option>{articles.map(a => <option key={a.id} value={a.id}>{a.code}</option>)}</select><input type="number" placeholder="Qté" value={nouveauMouvementSortie.quantite} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, quantite: e.target.value})} className="border rounded px-2 py-1" /><input placeholder="Raison" value={nouveauMouvementSortie.raison} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, raison: e.target.value})} className="border rounded px-2 py-1" /><input type="date" value={nouveauMouvementSortie.date} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, date: e.target.value})} className="border rounded px-2 py-1" /><button onClick={enregistrerSortieStock} className="bg-red-600 text-white px-3 py-1 rounded font-bold">Sortir</button></div></div>
            <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded"><h3 className="font-bold mb-3">🔄 Transfert</h3><div className="grid grid-cols-1 md:grid-cols-6 gap-2"><select value={nouveauTransfert.articleId} onChange={(e) => setNouveauTransfert({...nouveauTransfert, articleId: e.target.value})} className="border rounded px-2 py-1"><option value="">Article</option>{articles.map(a => <option key={a.id} value={a.id}>{a.code}</option>)}</select><select value={nouveauTransfert.depotSource} onChange={(e) => setNouveauTransfert({...nouveauTransfert, depotSource: e.target.value})} className="border rounded px-2 py-1">{depots.map(d => <option key={d} value={d}>{d}</option>)}</select><select value={nouveauTransfert.depotDestination} onChange={(e) => setNouveauTransfert({...nouveauTransfert, depotDestination: e.target.value})} className="border rounded px-2 py-1">{depots.map(d => <option key={d} value={d}>{d}</option>)}</select><input type="number" placeholder="Qté" value={nouveauTransfert.quantite} onChange={(e) => setNouveauTransfert({...nouveauTransfert, quantite: e.target.value})} className="border rounded px-2 py-1" /><input placeholder="Note" value={nouveauTransfert.raison} onChange={(e) => setNouveauTransfert({...nouveauTransfert, raison: e.target.value})} className="border rounded px-2 py-1" /><button onClick={enregistrerTransfertStock} className="bg-amber-600 text-white px-3 py-1 rounded font-bold">Transférer</button></div></div>
            <div className="bg-white p-4 rounded border">
              <h3 className="font-bold text-lg mb-3">🎯 Affecter articles aux équipements</h3>
              <div className="space-y-2">
                {articles.map(a => {
                  const equipAffectes = equipements.filter(e => a.equipementsAffectes.includes(e.id));
                  const isAffecte = a.equipementsAffectes.length > 0;
                  return (
                    <div key={a.id} className={`flex justify-between items-center p-3 rounded border-2 ${isAffecte ? 'bg-blue-100 border-blue-400' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex-1">
                        <div className="font-semibold">{a.code} - {a.description}</div>
                        <div className="text-xs text-gray-600">Stock total: {getStockTotal(a)} × {isAffecte ? `✓ Affecté à: ${equipAffectes.map(e => e.immat).join(', ')}` : 'Non affecté'}</div>
                      </div>
                      <div className="flex gap-1 ml-2 flex-wrap">
                        {equipements.map(e => (
                          <button key={e.id} onClick={() => affecterArticleEquipement(a.id, e.id)} className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap transition ${a.equipementsAffectes.includes(e.id) ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                            {e.immat}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {ongletActif === 'fiche' && equipSelectionne && (
          <div className="space-y-6">
            <div className="sticky top-20 z-20"><div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory" style={{scrollBehavior: 'smooth'}}>{equipements.map(eq => (<button key={eq.id} onClick={() => setEquipementSelectionne(eq.id)} className={`px-4 py-4 rounded-lg font-semibold transition whitespace-nowrap snap-center flex-shrink-0 ${equipementSelectionne === eq.id ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' : 'bg-white text-gray-800 border-2 border-gray-200'}`}><div className="text-lg">{eq.immat}</div><div className="text-sm mt-1">{eq.marque} {eq.modele}</div></button>))}</div></div>
            <div className="bg-gradient-to-br from-orange-500 to-yellow-400 text-white p-8 rounded-xl shadow-lg"><h2 className="text-5xl font-black mb-2">{equipSelectionne.immat}</h2><p className="text-xl">{equipSelectionne.marque} {equipSelectionne.modele}</p></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500"><div className="text-blue-600 font-bold text-sm">VALEUR D'ACHAT</div><div className="text-3xl font-black text-blue-600 mt-2">{equipSelectionne.valeurAchat}€</div></div>
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500"><div className="text-green-600 font-bold text-sm">VALEUR ACTUELLE</div><div className="text-3xl font-black text-green-700 mt-2">{equipSelectionne.valeurActuelle}€</div></div>
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-indigo-500"><div className="text-indigo-600 font-bold text-sm">ACCESSOIRES</div><div className="text-3xl font-black text-indigo-700 mt-2">{Math.round(accessoiresTotal)}€</div></div>
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-orange-500"><div className="text-orange-600 font-bold text-sm">VALEUR TOTALE</div><div className="text-3xl font-black text-orange-700 mt-2">{Math.round(valeurEquipementTotal)}€</div></div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6"><h3 className="text-lg font-black text-gray-800 mb-4 pb-3 border-b-3 border-purple-500">📦 ARTICLES AFFECTÉS</h3>{articlesAffectesEquipement.length === 0 ? <p className="text-gray-500 italic">Aucun article affecté</p> : <div className="space-y-2">{articlesAffectesEquipement.map(a => (<div key={a.id} className="flex justify-between p-3 bg-purple-50 rounded-lg border"><div><div className="font-bold text-purple-700">{a.code}</div><div className="text-sm text-gray-600">{a.description}</div></div><div className="text-right"><div className="text-purple-600 font-bold">Total: {getStockTotal(a)}</div><div className="text-sm">{a.prixUnitaire}€ u.</div></div></div>))}</div>}</div>
            <div className="bg-white rounded-xl shadow-md p-6"><h3 className="text-lg font-black text-gray-800 mb-4 pb-3 border-b-3 border-pink-500">🎨 ACCESSOIRES</h3><div className="bg-pink-50 border-2 border-pink-300 p-4 rounded-lg mb-4"><div className="grid grid-cols-1 md:grid-cols-5 gap-2"><input type="text" placeholder="Nom" value={nouvelAccessoire.nom} onChange={(e) => setNouvelAccessoire({...nouvelAccessoire, nom: e.target.value})} className="border-2 border-pink-300 rounded px-3 py-2" /><input type="number" step="0.01" placeholder="Valeur €" value={nouvelAccessoire.valeur} onChange={(e) => setNouvelAccessoire({...nouvelAccessoire, valeur: e.target.value})} className="border-2 border-pink-300 rounded px-3 py-2" /><input type="text" placeholder="Description" value={nouvelAccessoire.description} onChange={(e) => setNouvelAccessoire({...nouvelAccessoire, description: e.target.value})} className="border-2 border-pink-300 rounded px-3 py-2 col-span-2" /><button onClick={() => ajouterAccessoire(equipementSelectionne)} className="bg-pink-500 text-white px-4 py-2 rounded font-bold">Ajouter</button></div></div>{(accessoiresEquipement[equipementSelectionne] || []).length === 0 ? <p className="text-gray-500">Aucun accessoire</p> : <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{(accessoiresEquipement[equipementSelectionne] || []).map(acc => (<div key={acc.id} className="bg-pink-50 p-4 rounded-lg border-2 border-pink-200"><div className="flex justify-between items-start mb-2"><div className="flex items-center gap-2 flex-1"><input type="checkbox" checked={acc.actif} onChange={() => setAccessoiresEquipement({...accessoiresEquipement, [equipementSelectionne]: (accessoiresEquipement[equipementSelectionne] || []).map(a => a.id === acc.id ? {...a, actif: !a.actif} : a)})} className="w-4 h-4" /><div className="font-bold text-pink-700">{acc.nom}</div></div><div className="text-xl font-black text-green-600">{acc.valeur.toFixed(2)}€</div></div><p className="text-sm text-gray-700 mb-2">{acc.description}</p><button onClick={() => supprimerAccessoire(equipementSelectionne, acc.id)} className="text-red-600 font-bold text-sm">Supprimer</button></div>))}</div>}</div>
          </div>
        )}

        {ongletActif === 'equipements' && (
          <div className="space-y-6">
            {/* FORMULAIRE CRÉATION/ÉDITION ÉQUIPEMENT */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-4 border-blue-400 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black text-blue-700">
                  {modeEdition ? `✏️ MODIFIER ÉQUIPEMENT - ${equipementEnEdition?.immat}` : '🚛 CRÉER NOUVEL ÉQUIPEMENT'}
                </h3>
                <button 
                  onClick={() => modeEdition ? annulerEditionEquipement() : setAfficherFormulaireEquipement(!afficherFormulaireEquipement)}
                  className={`px-4 py-2 rounded font-bold text-white ${afficherFormulaireEquipement ? 'bg-red-600' : 'bg-blue-600'}`}
                >
                  {afficherFormulaireEquipement ? '✕ Fermer' : '➕ Ouvrir'}
                </button>
              </div>

              {afficherFormulaireEquipement && (
                <div className="bg-white p-6 rounded-lg space-y-4">
                  
                  {/* SECTION 1 - INFO DE BASE */}
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
                    <h4 className="font-bold text-blue-700 mb-3">📋 INFOS DE BASE</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700">Immatriculation *</label>
                        <input 
                          type="text" 
                          placeholder="Ex: GT-316-FG" 
                          value={nouvelEquipement.immat}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, immat: e.target.value})}
                          className="w-full border-2 border-blue-300 rounded px-3 py-2 mt-1 font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Type *</label>
                        <select 
                          value={nouvelEquipement.type}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, type: e.target.value})}
                          className="w-full border-2 border-blue-300 rounded px-3 py-2 mt-1"
                        >
                          <option value="">Sélectionner type</option>
                          <option value="Camion Citerne">Camion Citerne</option>
                          <option value="Tracteur Routier">Tracteur Routier</option>
                          <option value="Semi-Remorque">Semi-Remorque</option>
                          <option value="Micro-tracteur">Micro-tracteur</option>
                          <option value="Tracteur">Tracteur</option>
                          <option value="Camion Plateau">Camion Plateau</option>
                          <option value="Remorque">Remorque</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Marque</label>
                        <input 
                          type="text" 
                          placeholder="Ex: IVECO" 
                          value={nouvelEquipement.marque}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, marque: e.target.value})}
                          className="w-full border-2 border-blue-300 rounded px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Modèle</label>
                        <input 
                          type="text" 
                          placeholder="Ex: S-WAY" 
                          value={nouvelEquipement.modele}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, modele: e.target.value})}
                          className="w-full border-2 border-blue-300 rounded px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Année</label>
                        <input 
                          type="number" 
                          placeholder="Ex: 2023" 
                          value={nouvelEquipement.annee}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, annee: e.target.value})}
                          className="w-full border-2 border-blue-300 rounded px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">VIN</label>
                        <input 
                          type="text" 
                          placeholder="Numéro VIN" 
                          value={nouvelEquipement.vin}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, vin: e.target.value})}
                          className="w-full border-2 border-blue-300 rounded px-3 py-2 mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2 - TECHNIQUE */}
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                    <h4 className="font-bold text-green-700 mb-3">⚙️ TECHNIQUE</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700">Carburant</label>
                        <select 
                          value={nouvelEquipement.carburant}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, carburant: e.target.value})}
                          className="w-full border-2 border-green-300 rounded px-3 py-2 mt-1"
                        >
                          <option value="">Sélectionner</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Essence">Essence</option>
                          <option value="Agricole">Agricole</option>
                          <option value="N/A">N/A</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">PTAC (kg)</label>
                        <input 
                          type="number" 
                          placeholder="26000" 
                          value={nouvelEquipement.ptac}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, ptac: e.target.value})}
                          className="w-full border-2 border-green-300 rounded px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Poids (kg)</label>
                        <input 
                          type="number" 
                          placeholder="13190" 
                          value={nouvelEquipement.poids}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, poids: e.target.value})}
                          className="w-full border-2 border-green-300 rounded px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Kilométrage initial</label>
                        <input 
                          type="number" 
                          placeholder="0" 
                          value={nouvelEquipement.km}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, km: e.target.value})}
                          className="w-full border-2 border-green-300 rounded px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Heures initial</label>
                        <input 
                          type="number" 
                          placeholder="0" 
                          value={nouvelEquipement.heures}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, heures: e.target.value})}
                          className="w-full border-2 border-green-300 rounded px-3 py-2 mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3 - VALEURS */}
                  <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
                    <h4 className="font-bold text-purple-700 mb-3">💰 VALEURS</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700">Valeur achat (€)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="0" 
                          value={nouvelEquipement.valeurAchat}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, valeurAchat: e.target.value})}
                          className="w-full border-2 border-purple-300 rounded px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Valeur actuelle (€)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="0" 
                          value={nouvelEquipement.valeurActuelle}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, valeurActuelle: e.target.value})}
                          className="w-full border-2 border-purple-300 rounded px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Assurance (€/mois)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="0" 
                          value={nouvelEquipement.assurance}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, assurance: e.target.value})}
                          className="w-full border-2 border-purple-300 rounded px-3 py-2 mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4 - FINANCEMENT */}
                  <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-400">
                    <h4 className="font-bold text-yellow-700 mb-3">📝 FINANCEMENT</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700">Type financement</label>
                        <select 
                          value={nouvelEquipement.typeFinancement}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, typeFinancement: e.target.value})}
                          className="w-full border-2 border-yellow-400 rounded px-3 py-2 mt-1"
                        >
                          <option value="">Sélectionner</option>
                          <option value="Achat">Achat</option>
                          <option value="Location">Location</option>
                          <option value="Crédit">Crédit</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Coût mensuel (€)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="0" 
                          value={nouvelEquipement.coutMensuel}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, coutMensuel: e.target.value})}
                          className="w-full border-2 border-yellow-400 rounded px-3 py-2 mt-1"
                        />
                      </div>
                      <div></div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Date début</label>
                        <input 
                          type="date" 
                          value={nouvelEquipement.dateDebut}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, dateDebut: e.target.value})}
                          className="w-full border-2 border-yellow-400 rounded px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Date fin</label>
                        <input 
                          type="date" 
                          value={nouvelEquipement.dateFin}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, dateFin: e.target.value})}
                          className="w-full border-2 border-yellow-400 rounded px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Date contrôle technique</label>
                        <input 
                          type="date" 
                          value={nouvelEquipement.dateContracteTechnique}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, dateContracteTechnique: e.target.value})}
                          className="w-full border-2 border-yellow-400 rounded px-3 py-2 mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5 - INFOS OPÉRATIONNELLES */}
                  <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-400">
                    <h4 className="font-bold text-orange-700 mb-3">🏢 INFOS OPÉRATIONNELLES</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700">Propriétaire</label>
                        <input 
                          type="text" 
                          placeholder="SOLAIRE NETTOYAGE" 
                          value={nouvelEquipement.proprietaire}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, proprietaire: e.target.value})}
                          className="w-full border-2 border-orange-400 rounded px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Notes</label>
                        <input 
                          type="text" 
                          placeholder="Notes..." 
                          value={nouvelEquipement.notes}
                          onChange={(e) => setNouvelEquipement({...nouvelEquipement, notes: e.target.value})}
                          className="w-full border-2 border-orange-400 rounded px-3 py-2 mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* BOUTONS CRÉER/SAUVEGARDER */}
                  <div className="flex gap-2">
                    <button 
                      onClick={creerOuModifierEquipement}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-lg font-black text-lg hover:from-blue-700 hover:to-indigo-700 transition"
                    >
                      {modeEdition ? '💾 SAUVEGARDER MODIFICATIONS' : '✅ CRÉER ÉQUIPEMENT'}
                    </button>
                    {modeEdition && (
                      <button 
                        onClick={annulerEditionEquipement}
                        className="flex-1 bg-gray-500 text-white px-6 py-4 rounded-lg font-black text-lg hover:bg-gray-600 transition"
                      >
                        ❌ ANNULER
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* LISTE DES ÉQUIPEMENTS */}
            <div className="bg-white p-4 rounded border">
              <h2 className="font-black text-xl mb-4">🚛 Équipements ({equipements.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipements.map(eq => (
                  <div 
                    key={eq.id} 
                    className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-300 hover:shadow-lg transition cursor-pointer"
                    onClick={() => {setOngletActif('fiche'); setEquipementSelectionne(eq.id);}}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-xl font-black text-orange-600">{eq.immat}</div>
                        <div className="text-sm text-gray-700"><strong>{eq.type}</strong></div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-gray-600">{eq.marque}</div>
                        <div className="text-gray-600">{eq.modele}</div>
                        <div className="text-gray-500">({eq.annee})</div>
                      </div>
                    </div>
                    <div className="border-t pt-2 mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="text-gray-600">💰 <strong>{eq.valeurActuelle}€</strong></div>
                      <div className="text-gray-600">⛽ {eq.carburant || 'N/A'}</div>
                      <div className="text-gray-600">📍 {eq.proprietaire}</div>
                      <div className="text-gray-600">📅 {eq.dateDebut}</div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={(e) => {e.stopPropagation(); setOngletActif('fiche'); setEquipementSelectionne(eq.id);}}
                        className="flex-1 bg-orange-500 text-white px-3 py-2 rounded font-bold text-sm hover:bg-orange-600"
                      >
                        👁️ Voir fiche
                      </button>
                      <button 
                        onClick={(e) => {e.stopPropagation(); ouvrirEditionEquipement(eq);}}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded font-bold text-sm hover:bg-blue-700"
                      >
                        ✏️ Éditer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {ongletActif === 'interventions' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded border"><h3 className="font-bold text-lg mb-3">🔧 Créer intervention</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                <select value={nouvelleIntervention.equipementId} onChange={(e) => setNouvelleIntervention({...nouvelleIntervention, equipementId: e.target.value})} className="border-2 rounded px-2 py-2"><option value="">Équipement *</option>{getEquipementsEtSunbrush().map(item => <option key={item.id} value={item.id}>{item.nom}</option>)}</select>
                <select value={nouvelleIntervention.type} onChange={(e) => setNouvelleIntervention({...nouvelleIntervention, type: e.target.value})} className="border-2 rounded px-2 py-2"><option value="">Type *</option>{typesIntervention.map(t => <option key={t} value={t}>{t}</option>)}</select>
                <input type="date" value={nouvelleIntervention.date} onChange={(e) => setNouvelleIntervention({...nouvelleIntervention, date: e.target.value})} className="border-2 rounded px-2 py-2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                <input type="number" placeholder="KM" value={nouvelleIntervention.km} onChange={(e) => setNouvelleIntervention({...nouvelleIntervention, km: e.target.value})} className="border-2 rounded px-2 py-2" />
                <input type="number" placeholder="Heures" value={nouvelleIntervention.heures} onChange={(e) => setNouvelleIntervention({...nouvelleIntervention, heures: e.target.value})} className="border-2 rounded px-2 py-2" />
                <input type="text" placeholder="Description" value={nouvelleIntervention.description} onChange={(e) => setNouvelleIntervention({...nouvelleIntervention, description: e.target.value})} className="border-2 rounded px-2 py-2" />
              </div>
              <div className="bg-purple-50 border-2 border-purple-300 p-3 rounded mb-3">
                <h4 className="font-semibold text-sm mb-2">📍 Dépôt de prélèvement</h4>
                <select value={nouvelleIntervention.depotPrelevement} onChange={(e) => setNouvelleIntervention({...nouvelleIntervention, depotPrelevement: e.target.value})} className="w-full border-2 border-purple-300 rounded px-3 py-2 mb-2">{depots.map(d => <option key={d} value={d}>{d}</option>)}</select>
              </div>
              <div className="bg-blue-50 border-2 border-blue-300 p-3 rounded mb-3">
                <h4 className="font-semibold text-sm mb-2">📦 Articles</h4>
                <div className="mb-2 flex gap-2"><button onClick={() => setAfficherArticlesEquipement(!afficherArticlesEquipement)} className={`px-3 py-1 rounded text-xs font-bold ${afficherArticlesEquipement ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>{afficherArticlesEquipement ? 'Équipement' : 'Tous'}</button><button onClick={toggleScannerIntervention} className={`px-3 py-1 rounded text-xs font-bold ${afficherScannerIntervention ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white'}`}>{afficherScannerIntervention ? 'Fermer' : 'Scanner'}</button></div>
                {afficherScannerIntervention && !scanResultatIntervention && (<div className="mb-3 bg-indigo-50 p-3 rounded border border-indigo-200"><div className="bg-gray-900 rounded overflow-hidden mb-2" style={{maxWidth: '100%', height: '200px'}}><video ref={videoIntervention} autoPlay playsInline muted style={{width: '100%', height: '100%', display: 'block'}} /><canvas ref={canvasIntervention} style={{display: 'none'}} /></div><p className="text-xs text-indigo-600 font-semibold">🎯 Pointez un QR code</p></div>)}
                {scanResultatIntervention && (<div className="mb-3 bg-green-50 p-3 rounded border-2 border-green-300"><div className="font-bold text-green-700 mb-2">{scanResultatIntervention.article.code} - {scanResultatIntervention.article.description}</div><div className="flex gap-2 items-end"><input type="number" min="1" placeholder="Quantité *" value={quantiteScanIntervention} onChange={(e) => setQuantiteScanIntervention(e.target.value)} className="flex-1 border-2 border-green-300 rounded px-2 py-1 font-bold text-center" /><button onClick={ajouterArticlePrevuScan} className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold">➕ Ajouter</button><button onClick={() => {setScanResultatIntervention(null); setQuantiteScanIntervention('');}} className="bg-gray-400 text-white px-3 py-1 rounded text-sm">✕</button></div></div>)}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                  <select value={nouvelArticleIntervention.articleId} onChange={(e) => setNouvelArticleIntervention({...nouvelArticleIntervention, articleId: e.target.value})} className="border-2 rounded px-2 py-2 text-sm"><option value="">Article</option>{getArticlesDisponibles().map(a => <option key={a.id} value={a.id}>{a.code} - {a.prixUnitaire}€</option>)}</select>
                  <input type="number" min="1" placeholder="Quantité" value={nouvelArticleIntervention.quantite} onChange={(e) => setNouvelArticleIntervention({...nouvelArticleIntervention, quantite: e.target.value})} className="border-2 rounded px-2 py-2 text-sm" />
                  <button onClick={ajouterArticlePrevu} className="bg-blue-600 text-white px-3 py-2 rounded text-sm font-bold col-span-2">+ Ajouter</button>
                </div>
                {nouvelleIntervention.articlesPrevu.length > 0 && (<div className="bg-white rounded p-2 mb-2 space-y-1 border"><div className="text-xs font-bold mb-2">Prévus:</div>{nouvelleIntervention.articlesPrevu.map((art, idx) => (<div key={idx} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded"><div><strong>{art.code}</strong> - {art.quantite}x @ {art.prixUnitaire.toFixed(2)}€</div><button onClick={() => supprimerArticlePrevu(idx)} className="text-red-600">✕</button></div>))}</div>)}
              </div>
              <button onClick={creerIntervention} className="w-full bg-orange-500 text-white px-4 py-3 rounded font-bold text-lg">✓ CRÉER INTERVENTION</button>
            </div>
            {interventionsEnCours.length > 0 && (<div><h3 className="font-bold text-lg mb-2">En cours ({interventionsEnCours.length})</h3>{interventionsEnCours.map(i => {const eq = equipements.find(e => e.id === i.equipementId); return (<div key={i.id} className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded mb-3"><div className="flex justify-between items-start"><div><h4 className="font-bold text-lg">{i.type}</h4><p className="text-sm">{eq?.immat} - {i.date}</p></div><button onClick={() => cloturerIntervention(i.id)} className="bg-green-600 text-white px-4 py-2 rounded font-bold">Terminer</button></div></div>);})}</div>)}
            {interventions.filter(i => i.statut === 'effectue').length > 0 && (<div><h3 className="font-bold text-lg mb-2">Effectuées</h3>{interventions.filter(i => i.statut === 'effectue').map(i => {const eq = equipements.find(e => e.id === i.equipementId); return (<div key={i.id} className="p-4 bg-green-50 rounded mb-3 border"><div className="flex justify-between"><div><div className="font-bold text-lg">{i.type}</div><p className="text-sm"><strong>{eq?.immat}</strong> • {i.date}</p></div><div className="text-2xl font-black text-green-600">{(i.coutTotal || 0).toFixed(2)}€</div></div></div>);})}</div>)}
          </div>
        )}

        {ongletActif === 'maintenance' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 p-6 rounded-xl">
              <h2 className="text-2xl font-black text-red-700 mb-4">🚨 DÉCLARER UN DÉFAUT</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Équipement *</label>
                    <select value={nouveauDefaut.equipementId} onChange={(e) => setNouveauDefaut({...nouveauDefaut, equipementId: e.target.value, accessoireId: ''})} className="w-full border-2 border-red-300 rounded px-3 py-2 font-semibold">
                      <option value="">Sélectionner équipement</option>
                      {equipements.map(eq => <option key={eq.id} value={eq.id}>{eq.immat} - {eq.marque}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Accessoire (optionnel)</label>
                    <select value={nouveauDefaut.accessoireId} onChange={(e) => setNouveauDefaut({...nouveauDefaut, accessoireId: e.target.value})} className="w-full border-2 border-red-300 rounded px-3 py-2">
                      <option value="">Aucun accessoire</option>
                      {nouveauDefaut.equipementId && accessoiresEquipement[parseInt(nouveauDefaut.equipementId)]?.map(acc => <option key={acc.id} value={acc.id}>{acc.nom}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Type de défaut *</label>
                    <select value={nouveauDefaut.type} onChange={(e) => setNouveauDefaut({...nouveauDefaut, type: e.target.value})} className="w-full border-2 rounded px-3 py-2 font-semibold">
                      <option value="Fuite">Fuite</option>
                      <option value="Bruit">Bruit anormal</option>
                      <option value="Usure">Usure</option>
                      <option value="Cassure">Cassure/Casse</option>
                      <option value="Dysfonctionnement">Dysfonctionnement</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Sévérité *</label>
                    <select value={nouveauDefaut.severite} onChange={(e) => setNouveauDefaut({...nouveauDefaut, severite: e.target.value})} className="w-full border-2 rounded px-3 py-2 font-semibold">
                      <option value="mineur">🟢 Mineur</option>
                      <option value="moyen">🟠 Moyen</option>
                      <option value="critique">🔴 Critique</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Opérateur *</label>
                    <select value={nouveauDefaut.operateur} onChange={(e) => setNouveauDefaut({...nouveauDefaut, operateur: e.target.value})} className="w-full border-2 rounded px-3 py-2 font-semibold">
                      {operateurs.map(op => <option key={op} value={op}>{op}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description détaillée *</label>
                  <textarea value={nouveauDefaut.description} onChange={(e) => setNouveauDefaut({...nouveauDefaut, description: e.target.value})} placeholder="Ex: Fuite hydraulique..." className="w-full border-2 border-red-300 rounded px-3 py-2 h-20 font-semibold" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Localisation sur équipement</label>
                    <input type="text" value={nouveauDefaut.localisation} onChange={(e) => setNouveauDefaut({...nouveauDefaut, localisation: e.target.value})} placeholder="Ex: Raccord du bras..." className="w-full border-2 rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Date constatation</label>
                    <input type="date" value={nouveauDefaut.dateConstatation} onChange={(e) => setNouveauDefaut({...nouveauDefaut, dateConstatation: e.target.value})} className="w-full border-2 rounded px-3 py-2" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Remarques additionnelles</label>
                  <textarea value={nouveauDefaut.remarques} onChange={(e) => setNouveauDefaut({...nouveauDefaut, remarques: e.target.value})} placeholder="Infos supplémentaires..." className="w-full border-2 rounded px-3 py-2 h-16" />
                </div>

                <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded">
                  <label className="block text-sm font-bold text-blue-700 mb-2">📸 Joindre photos (multiples)</label>
                  <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 text-white px-4 py-2 rounded font-bold mb-3">+ Ajouter photos</button>
                  <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={gererSelectionPhotos} style={{display: 'none'}} />
                  {photosSelectionnees.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Photos sélectionnées ({photosSelectionnees.length}):</p>
                      {photosSelectionnees.map((photo, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border">
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{photo.nom}</p>
                            <img src={photo.base64} alt={photo.nom} className="mt-1 h-16 rounded border" />
                          </div>
                          <button onClick={() => supprimerPhotoSelectionnee(idx)} className="text-red-600 font-bold">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={declareDefaut} className="w-full bg-red-600 text-white px-6 py-4 rounded-lg font-black text-lg hover:bg-red-700">🚨 DÉCLARER DÉFAUT</button>
              </div>
            </div>

            {/* DÉFAUTS À TRAITER */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-800">📋 DÉFAUTS À TRAITER</h2>

              {defautsCritiques.length > 0 && (
                <div className="bg-red-50 border-4 border-red-600 p-4 rounded-lg">
                  <h3 className="text-xl font-black text-red-700 mb-3">🔴 CRITIQUES ({defautsCritiques.length})</h3>
                  <div className="space-y-3">
                    {defautsCritiques.map(d => {
                      const eq = equipements.find(e => e.id === d.equipementId);
                      const acc = d.accessoireId ? Object.values(accessoiresEquipement).flat().find(a => a.id === d.accessoireId) : null;
                      return (
                        <div key={d.id} className="bg-white rounded-lg p-4 border-2 border-red-300">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-black text-lg text-red-700">{d.type}</h4>
                              <p className="text-sm text-gray-600">{eq?.immat} {acc ? `- ${acc.nom}` : ''}</p>
                            </div>
                            <button onClick={() => setDefautSelectionne(d)} className="bg-blue-600 text-white px-3 py-1 rounded font-bold text-sm">👁️ Détails</button>
                          </div>
                          <p className="text-sm mb-3">{d.description}</p>
                          <p className="text-xs text-gray-500 mb-2">Signalé par <strong>{d.operateur}</strong> le {d.dateConstatation}</p>
                          <div className="flex gap-2">
                            <button onClick={() => creerInterventionDepuisDefaut(d)} className="flex-1 bg-orange-600 text-white px-3 py-2 rounded font-bold text-sm">🔧 Créer intervention</button>
                            <button onClick={() => resoudreDefaut(d.id)} className="flex-1 bg-green-600 text-white px-3 py-2 rounded font-bold text-sm">✓ Résolu</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {defautsAtention.length > 0 && (
                <div className="bg-orange-50 border-4 border-orange-500 p-4 rounded-lg">
                  <h3 className="text-xl font-black text-orange-700 mb-3">🟠 MOYENS ({defautsAtention.length})</h3>
                  <div className="space-y-3">
                    {defautsAtention.map(d => {
                      const eq = equipements.find(e => e.id === d.equipementId);
                      const acc = d.accessoireId ? Object.values(accessoiresEquipement).flat().find(a => a.id === d.accessoireId) : null;
                      return (
                        <div key={d.id} className="bg-white rounded-lg p-4 border-2 border-orange-300">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-black text-lg text-orange-700">{d.type}</h4>
                              <p className="text-sm text-gray-600">{eq?.immat} {acc ? `- ${acc.nom}` : ''}</p>
                            </div>
                            <button onClick={() => setDefautSelectionne(d)} className="bg-blue-600 text-white px-3 py-1 rounded font-bold text-sm">👁️ Détails</button>
                          </div>
                          <p className="text-sm mb-3">{d.description}</p>
                          <p className="text-xs text-gray-500 mb-2">Signalé par <strong>{d.operateur}</strong> le {d.dateConstatation}</p>
                          <div className="flex gap-2">
                            <button onClick={() => creerInterventionDepuisDefaut(d)} className="flex-1 bg-orange-600 text-white px-3 py-2 rounded font-bold text-sm">🔧 Créer intervention</button>
                            <button onClick={() => resoudreDefaut(d.id)} className="flex-1 bg-green-600 text-white px-3 py-2 rounded font-bold text-sm">✓ Résolu</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {defautsMineur.length > 0 && (
                <div className="bg-yellow-50 border-4 border-yellow-500 p-4 rounded-lg">
                  <h3 className="text-xl font-black text-yellow-700 mb-3">🟡 MINEURS ({defautsMineur.length})</h3>
                  <div className="space-y-3">
                    {defautsMineur.map(d => {
                      const eq = equipements.find(e => e.id === d.equipementId);
                      const acc = d.accessoireId ? Object.values(accessoiresEquipement).flat().find(a => a.id === d.accessoireId) : null;
                      return (
                        <div key={d.id} className="bg-white rounded-lg p-4 border-2 border-yellow-300">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-black text-lg text-yellow-700">{d.type}</h4>
                              <p className="text-sm text-gray-600">{eq?.immat} {acc ? `- ${acc.nom}` : ''}</p>
                            </div>
                            <button onClick={() => setDefautSelectionne(d)} className="bg-blue-600 text-white px-3 py-1 rounded font-bold text-sm">👁️ Détails</button>
                          </div>
                          <p className="text-sm mb-3">{d.description}</p>
                          <p className="text-xs text-gray-500 mb-2">Signalé par <strong>{d.operateur}</strong> le {d.dateConstatation}</p>
                          <div className="flex gap-2">
                            <button onClick={() => creerInterventionDepuisDefaut(d)} className="flex-1 bg-orange-600 text-white px-3 py-2 rounded font-bold text-sm">🔧 Créer intervention</button>
                            <button onClick={() => resoudreDefaut(d.id)} className="flex-1 bg-green-600 text-white px-3 py-2 rounded font-bold text-sm">✓ Résolu</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {defautsATraiter.length === 0 && (
                <div className="bg-green-50 border-4 border-green-500 p-6 rounded-lg text-center">
                  <p className="text-2xl font-black text-green-700">✅ AUCUN DÉFAUT À TRAITER</p>
                </div>
              )}
            </div>

            {defautsArchives.length > 0 && (
              <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg">
                <h3 className="text-xl font-black text-green-700 mb-3">✅ DÉFAUTS RÉSOLUS ({defautsArchives.length})</h3>
                <div className="space-y-2">
                  {defautsArchives.map(d => {
                    const eq = equipements.find(e => e.id === d.equipementId);
                    return (
                      <div key={d.id} className="bg-white rounded p-3 border-l-4 border-green-500 flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{d.type} - {eq?.immat}</p>
                          <p className="text-xs text-gray-500">Résolu le {d.dateArchivage}</p>
                        </div>
                        <button onClick={() => setDefautSelectionne(d)} className="bg-gray-600 text-white px-3 py-1 rounded font-bold text-sm">👁️ Voir</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {ongletActif === 'alertes' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-red-700">🚨 ALERTES STOCKS INTELLIGENTES</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 border-4 border-red-600 p-6 rounded-xl cursor-pointer hover:shadow-lg transition" onClick={() => { setFiltreAlerteSeverite('critique'); setFiltreAlerteFournisseur(''); setFiltreAlerteDepot(''); }}>
                <p className="text-xs text-red-600 font-bold">🔴 CRITIQUES</p>
                <p className="text-5xl font-black text-red-600 mt-2">{alertesCritiques.length}</p>
                <p className="text-sm text-red-700 mt-2">⚡ Action immédiate!</p>
              </div>
              <div className="bg-orange-50 border-4 border-orange-500 p-6 rounded-xl cursor-pointer hover:shadow-lg transition" onClick={() => { setFiltreAlerteSeverite('attention'); setFiltreAlerteFournisseur(''); setFiltreAlerteDepot(''); }}>
                <p className="text-xs text-orange-600 font-bold">🟠 ATTENTION</p>
                <p className="text-5xl font-black text-orange-600 mt-2">{alertesAttention.length}</p>
                <p className="text-sm text-orange-700 mt-2">⏳ À court terme</p>
              </div>
              <div className="bg-yellow-50 border-4 border-yellow-500 p-6 rounded-xl cursor-pointer hover:shadow-lg transition" onClick={() => { setFiltreAlerteSeverite('vigilance'); setFiltreAlerteFournisseur(''); setFiltreAlerteDepot(''); }}>
                <p className="text-xs text-yellow-600 font-bold">🟡 VIGILANCE</p>
                <p className="text-5xl font-black text-yellow-600 mt-2">{alertesVigilance.length}</p>
                <p className="text-sm text-yellow-700 mt-2">👁️ À surveiller</p>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-lg">
              <h3 className="font-bold mb-3">🔍 FILTRES & TRI</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700">Sévérité</label>
                  <select value={filtreAlerteSeverite} onChange={(e) => setFiltreAlerteSeverite(e.target.value)} className="w-full border-2 rounded px-2 py-1 text-sm">
                    <option value="">Tous</option>
                    <option value="critique">🔴 Critique</option>
                    <option value="attention">🟠 Attention</option>
                    <option value="vigilance">🟡 Vigilance</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">Fournisseur</label>
                  <select value={filtreAlerteFournisseur} onChange={(e) => setFiltreAlerteFournisseur(e.target.value)} className="w-full border-2 rounded px-2 py-1 text-sm">
                    <option value="">Tous</option>
                    {[...new Set(articles.map(a => a.fournisseur))].map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">Dépôt vide</label>
                  <select value={filtreAlerteDepot} onChange={(e) => setFiltreAlerteDepot(e.target.value)} className="w-full border-2 rounded px-2 py-1 text-sm">
                    <option value="">Tous</option>
                    {depots.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">Tri</label>
                  <select value={triAlertes} onChange={(e) => setTriAlertes(e.target.value)} className="w-full border-2 rounded px-2 py-1 text-sm">
                    <option value="severite">Par sévérité</option>
                    <option value="stock">Stock faible</option>
                    <option value="nom">Alphabétique</option>
                  </select>
                </div>
                <div>
                  <button onClick={() => { setFiltreAlerteSeverite(''); setFiltreAlerteFournisseur(''); setFiltreAlerteDepot(''); }} className="w-full bg-blue-600 text-white px-3 py-1 rounded font-bold text-sm mt-5 hover:bg-blue-700">Réinitialiser</button>
                </div>
              </div>
            </div>

            {alertesFiltrees.length === 0 ? (
              <div className="bg-green-50 border-4 border-green-500 p-6 rounded-lg text-center">
                <p className="text-2xl font-black text-green-700">✅ AUCUNE ALERTE!</p>
                <p className="text-green-600 mt-2">Tous les stocks sont corrects 🎉</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alertesFiltrees.map(article => {
                  const barrePourcent = (article.total / article.stockMin) * 100;
                  const couleurSeverite = article.severite === 'critique' ? 'border-red-500 bg-red-50' : article.severite === 'attention' ? 'border-orange-500 bg-orange-50' : 'border-yellow-500 bg-yellow-50';
                  const icone = article.severite === 'critique' ? '🔴' : article.severite === 'attention' ? '🟠' : '🟡';

                  return (
                    <div key={article.id} className={`border-l-4 ${couleurSeverite} p-4 rounded-lg`}>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="font-bold text-lg">{article.code}</p>
                          <p className="text-sm text-gray-600">{article.description}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-600 mb-1">STOCK GLOBAL</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-300 rounded-full h-3 overflow-hidden">
                              <div 
                                style={{width: `${Math.min(barrePourcent, 100)}%`}} 
                                className={`h-full ${article.severite === 'critique' ? 'bg-red-600' : article.severite === 'attention' ? 'bg-orange-600' : 'bg-yellow-600'}`}
                              />
                            </div>
                            <p className="font-black text-sm">{article.total}/{article.stockMin}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-600 mb-1">DÉPÔTS</p>
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            {depots.map(d => (
                              <p key={d} className={`${article.stockParDepot[d] === 0 ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                                {d.substring(0, 3)}: {article.stockParDepot[d] || 0}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-600 mb-1">INFOS</p>
                          <p className="text-sm"><strong>{article.fournisseur}</strong></p>
                          <p className="text-sm">{article.prixUnitaire}€ u.</p>
                          <p className="font-bold mt-1">{icone} {article.severite.toUpperCase()}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => genererTexteCommande(article)} className="bg-green-600 text-white px-3 py-2 rounded font-bold text-sm hover:bg-green-700">
                          🛒 Commander
                        </button>
                        <button onClick={() => setArticleEnTransfertAlerte(article)} className="bg-blue-600 text-white px-3 py-2 rounded font-bold text-sm hover:bg-blue-700">
                          🔄 Transférer
                        </button>
                        <button onClick={() => setArticleEnDetailsAlerte(article)} className="bg-gray-600 text-white px-3 py-2 rounded font-bold text-sm hover:bg-gray-700">
                          👁️ Détails
                        </button>
                        <button onClick={() => setArticleEnHistoriqueAlerte(article)} className="bg-purple-600 text-white px-3 py-2 rounded font-bold text-sm hover:bg-purple-700">
                          📊 Historique
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {ongletActif === 'statistiques' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-purple-700">📈 STATISTIQUES ÉQUIPEMENTS</h2>

            <div className="bg-white p-4 rounded border-2 border-purple-300">
              <label className="block text-sm font-bold text-gray-700 mb-2">Sélectionner équipement</label>
              <select 
                value={equipementSelectionne} 
                onChange={(e) => setEquipementSelectionne(parseInt(e.target.value))}
                className="w-full border-2 border-purple-400 rounded px-3 py-2 font-bold text-lg"
              >
                {equipements.map(eq => (
                  <option key={eq.id} value={eq.id}>
                    {eq.immat} - {eq.marque} {eq.modele}
                  </option>
                ))}
              </select>
            </div>

            {equipSelectionne && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 border-4 border-purple-500 p-6 rounded-xl">
                  <h3 className="text-2xl font-black text-purple-700 mb-4">📊 RÉSUMÉ - {equipSelectionne.immat}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border-2 border-purple-300">
                      <p className="text-xs text-gray-600 font-bold">INTERVENTIONS</p>
                      <p className="text-3xl font-black text-purple-600">{interventions.filter(i => i.equipementId === equipSelectionne.id).length}</p>
                      <p className="text-sm text-gray-700">{interventions.filter(i => i.equipementId === equipSelectionne.id && i.statut === 'effectue').length} effectuées</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border-2 border-red-300">
                      <p className="text-xs text-gray-600 font-bold">DÉFAUTS</p>
                      <p className="text-3xl font-black text-red-600">{defauts.filter(d => d.equipementId === equipSelectionne.id).length}</p>
                      <p className="text-sm text-gray-700">{defauts.filter(d => d.equipementId === equipSelectionne.id && d.statut === 'resolu').length} résolus</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border-2 border-green-300">
                      <p className="text-xs text-gray-600 font-bold">ACCESSOIRES</p>
                      <p className="text-3xl font-black text-green-600">{(accessoiresEquipement[equipSelectionne.id] || []).length}</p>
                      <p className="text-sm text-gray-700">{accessoiresTotal.toFixed(0)}€ total</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
                      <p className="text-xs text-gray-600 font-bold">COÛT INTERVENTIONS</p>
                      <p className="text-3xl font-black text-blue-600">{interventions.filter(i => i.equipementId === equipSelectionne.id && i.statut === 'effectue').reduce((sum, i) => sum + (i.coutTotal || 0), 0).toFixed(0)}€</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => exporterPDF()} className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-black hover:bg-red-700">
                    📄 Exporter PDF
                  </button>
                  <button onClick={() => exporterCSV()} className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-black hover:bg-green-700">
                    📊 Exporter CSV
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODALES */}
        {articleEnTransfertAlerte && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-black text-blue-700 mb-4">🔄 TRANSFERT RAPIDE</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded border-2 border-blue-300">
                  <p className="font-bold text-blue-700">{articleEnTransfertAlerte.code}</p>
                  <p className="text-sm text-gray-600">{articleEnTransfertAlerte.description}</p>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700">Dépôt source *</label>
                  <select value={transfertRapideData.depotSource} onChange={(e) => setTransfertRapideData({...transfertRapideData, depotSource: e.target.value})} className="w-full border-2 rounded px-3 py-2 mt-1">
                    {depots.map(d => <option key={d} value={d}>{d} (Stock: {articleEnTransfertAlerte.stockParDepot[d] || 0})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700">Dépôt destination *</label>
                  <select value={transfertRapideData.depotDestination} onChange={(e) => setTransfertRapideData({...transfertRapideData, depotDestination: e.target.value})} className="w-full border-2 rounded px-3 py-2 mt-1">
                    {depots.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700">Quantité *</label>
                  <input type="number" min="1" value={transfertRapideData.quantite} onChange={(e) => setTransfertRapideData({...transfertRapideData, quantite: e.target.value})} className="w-full border-2 rounded px-3 py-2 mt-1" />
                </div>
                <div className="flex gap-2">
                  <button onClick={effectuerTransfertRapide} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">✓ Transférer</button>
                  <button onClick={() => setArticleEnTransfertAlerte(null)} className="flex-1 bg-gray-400 text-white px-4 py-2 rounded font-bold">Annuler</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {articleEnDetailsAlerte && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-black">📋 DÉTAILS</h2>
                <button onClick={() => setArticleEnDetailsAlerte(null)} className="text-2xl">✕</button>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded border-2">
                  <p className="text-xs text-gray-600 font-bold">CODE</p>
                  <p className="font-bold text-lg">{articleEnDetailsAlerte.code}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-bold">DESCRIPTION</p>
                  <p className="font-semibold">{articleEnDetailsAlerte.description}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-bold">FOURNISSEUR</p>
                  <p className="font-semibold">{articleEnDetailsAlerte.fournisseur}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-bold">PRIX UNITAIRE</p>
                  <p className="font-bold text-green-600">{articleEnDetailsAlerte.prixUnitaire}€</p>
                </div>
                <div className="border-t pt-3">
                  <p className="text-xs text-gray-600 font-bold mb-2">STOCK PAR DÉPÔT</p>
                  <div className="space-y-1">
                    {depots.map(d => (
                      <div key={d} className="flex justify-between p-2 bg-gray-100 rounded">
                        <span className="font-semibold">{d}:</span>
                        <span className="font-bold">{articleEnDetailsAlerte.stockParDepot[d] || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded border-2 border-blue-300">
                  <p className="text-xs text-gray-600 font-bold">STOCK TOTAL</p>
                  <p className="text-2xl font-black text-blue-600">{getStockTotal(articleEnDetailsAlerte)}</p>
                  <p className="text-xs text-blue-700 mt-1">Minimum: {articleEnDetailsAlerte.stockMin}</p>
                </div>
                <button onClick={() => setArticleEnDetailsAlerte(null)} className="w-full bg-gray-600 text-white px-4 py-2 rounded font-bold">Fermer</button>
              </div>
            </div>
          </div>
        )}

        {articleEnHistoriqueAlerte && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-black">📊 HISTORIQUE</h2>
                <button onClick={() => setArticleEnHistoriqueAlerte(null)} className="text-2xl">✕</button>
              </div>
              <div className="bg-gray-50 p-3 rounded border-2 mb-4">
                <p className="font-bold">{articleEnHistoriqueAlerte.code}</p>
                <p className="text-sm text-gray-600">{articleEnHistoriqueAlerte.description}</p>
              </div>
              <div className="space-y-2">
                {mouvementsStock.filter(m => m.articleId === articleEnHistoriqueAlerte.id).length === 0 ? (
                  <p className="text-gray-500 italic">Aucun mouvement</p>
                ) : (
                  mouvementsStock.filter(m => m.articleId === articleEnHistoriqueAlerte.id).map(m => (
                    <div key={m.id} className={`p-3 rounded border-l-4 ${m.type === 'entree' ? 'bg-green-50 border-green-500' : m.type === 'sortie' ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold">{m.type === 'entree' ? '📥 Entrée' : m.type === 'sortie' ? '📤 Sortie' : '🔄 Transfert'}</p>
                          <p className="text-xs text-gray-600">{m.date} • {m.raison}</p>
                        </div>
                        <p className="font-black text-lg">{m.type === 'transfer' ? '→' : m.type === 'entree' ? '+' : '-'} {m.quantite}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button onClick={() => setArticleEnHistoriqueAlerte(null)} className="w-full bg-gray-600 text-white px-4 py-2 rounded font-bold mt-4">Fermer</button>
            </div>
          </div>
        )}

        {defautSelectionne && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-black">📋 DÉTAILS DÉFAUT</h2>
                <button onClick={() => setDefautSelectionne(null)} className="text-2xl">✕</button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-bold">TYPE</p>
                      <p className="text-lg font-black">{defautSelectionne.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold">SÉVÉRITÉ</p>
                      <p className="text-lg font-black">{defautSelectionne.severite === 'critique' ? '🔴' : defautSelectionne.severite === 'moyen' ? '🟠' : '🟡'} {defautSelectionne.severite.toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold">ÉQUIPEMENT</p>
                      <p className="font-semibold">{equipements.find(e => e.id === defautSelectionne.equipementId)?.immat}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold">OPÉRATEUR</p>
                      <p className="font-semibold">{defautSelectionne.operateur}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 font-bold mb-1">DESCRIPTION</p>
                  <p className="bg-blue-50 border-2 border-blue-300 p-3 rounded font-semibold">{defautSelectionne.description}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 font-bold mb-1">LOCALISATION</p>
                  <p className="font-semibold">{defautSelectionne.localisation || 'Non spécifiée'}</p>
                </div>

                {defautSelectionne.remarques && (
                  <div>
                    <p className="text-xs text-gray-500 font-bold mb-1">REMARQUES</p>
                    <p className="bg-yellow-50 border-2 border-yellow-300 p-3 rounded">{defautSelectionne.remarques}</p>
                  </div>
                )}

                {defautSelectionne.photos && defautSelectionne.photos.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 font-bold mb-2">📸 PHOTOS ({defautSelectionne.photos.length})</p>
                    <div className="grid grid-cols-2 gap-3">
                      {defautSelectionne.photos.map((photo, idx) => (
                        <div key={idx} className="border-2 border-gray-300 rounded-lg overflow-hidden">
                          <img 
                            src={photo.base64} 
                            alt={photo.nom} 
                            className="w-full h-auto object-cover"
                          />
                          <p className="text-xs text-center font-semibold text-gray-700 p-1 bg-gray-100">{photo.nom}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-100 p-3 rounded text-sm">
                  <p><strong>Date constatation:</strong> {defautSelectionne.dateConstatation}</p>
                  <p><strong>Statut:</strong> {defautSelectionne.statut === 'a_traiter' ? '⏳ À traiter' : '✅ Résolu'}</p>
                  {defautSelectionne.dateArchivage && <p><strong>Date résolution:</strong> {defautSelectionne.dateArchivage}</p>}
                </div>

                <button onClick={() => setDefautSelectionne(null)} className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg font-black">Fermer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}