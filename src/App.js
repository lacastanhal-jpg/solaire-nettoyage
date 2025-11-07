import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';

export default function SolaireNettoyageFlotte() {
  const [ongletActif, setOngletActif] = useState('accueil');
  const [equipementSelectionne, setEquipementSelectionne] = useState(1);
  const [depotSelectionne, setDepotSelectionne] = useState('Atelier');
  
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const scanningRef = useRef(false);
  const jsQRRef = useRef(null);
  
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
    { id: 3, articleId: 3, type: 'entree', quantite: 1, date: '2025-10-10', raison: 'Facture 202510061701 - RURAL MASTER', coutTotal: 12.41, depot: 'Atelier' },
    { id: 4, articleId: 4, type: 'entree', quantite: 1, date: '2025-10-10', raison: 'Facture 202510061701 - RURAL MASTER', coutTotal: 5.68, depot: 'Atelier' },
    { id: 5, articleId: 5, type: 'entree', quantite: 1, date: '2025-10-10', raison: 'Facture 202510061701 - RURAL MASTER', coutTotal: 2.06, depot: 'Atelier' },
    { id: 6, articleId: 6, type: 'entree', quantite: 1, date: '2025-10-10', raison: 'Facture 202510061701 - RURAL MASTER', coutTotal: 2.76, depot: 'Atelier' },
    { id: 7, articleId: 7, type: 'entree', quantite: 1, date: '2025-10-10', raison: 'Facture 202510061701 - RURAL MASTER', coutTotal: 2.20, depot: 'Atelier' },
    { id: 8, articleId: 8, type: 'entree', quantite: 2, date: '2025-10-10', raison: 'Facture 202510061701 - RURAL MASTER', coutTotal: 7.18, depot: 'Atelier' },
    { id: 9, articleId: 9, type: 'entree', quantite: 1, date: '2025-10-10', raison: 'Facture 202510061701 - RURAL MASTER', coutTotal: 2.62, depot: 'Atelier' },
    { id: 10, articleId: 10, type: 'entree', quantite: 1, date: '2025-10-10', raison: 'Facture 202510061701 - RURAL MASTER', coutTotal: 53.02, depot: 'Atelier' },
    { id: 11, articleId: 11, type: 'entree', quantite: 3, date: '2025-10-10', raison: 'Facture 202510061701 - RURAL MASTER', coutTotal: 132.90, depot: 'Atelier' },
    { id: 12, articleId: 12, type: 'entree', quantite: 2, date: '2024-11-28', raison: 'Bon de livraison 10001646 - V6 AUTOPRO', coutTotal: 81.60, depot: 'Atelier' },
    { id: 13, articleId: 13, type: 'entree', quantite: 2, date: '2024-11-28', raison: 'Bon de livraison 10001646 - V6 AUTOPRO', coutTotal: 68.24, depot: 'Atelier' },
  ]);

  const [equipements, setEquipements] = useState([
    { id: 1, immat: 'GT-316-FG', type: 'Camion Citerne', marque: 'IVECO', modele: 'S-WAY', annee: 2023, km: 0, heures: 0, carburant: 'Diesel', vin: 'ZCFCE62RU00C519482', ptac: 26000, poids: 13190, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 0, valeurActuelle: 133500, typeFinancement: 'Location', coutMensuel: 2104, dateDebut: '2023-12-22', dateFin: '2029-12-22', assurance: 80.10, dateContracteTechnique: '2024-12-22', notes: 'Contrat de location A1M75094 001' },
    { id: 2, immat: 'DX-780-QN', type: 'Tracteur Routier', marque: 'IVECO', modele: 'STRALIS 560', annee: 2015, km: 293992, heures: 0, carburant: 'Diesel', vin: 'WJMS2NWH60C329019', ptac: 26000, poids: 8518, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 45000, valeurActuelle: 42000, typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2020-09-18', dateFin: '', assurance: 85.00, dateContracteTechnique: '2020-10-17', notes: 'STRALIS 560 • Type 6x2' },
    { id: 3, immat: 'CZ-022-DP', type: 'Semi-Remorque', marque: 'NICOLAS', modele: 'B3207C', annee: 2002, km: 0, heures: 0, carburant: 'N/A', vin: 'VF9B3207C02058032', ptac: 34000, poids: 12550, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 15000, valeurActuelle: 14000, typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2018-06-29', dateFin: '', assurance: 120.00, dateContracteTechnique: '2019-08-22', notes: 'Semi-Remorque NICOLAS B3207C' },
    { id: 4, immat: 'G3-415-BW', type: 'Micro-tracteur', marque: 'FARMTRAC', modele: 'F26VHE14HMNDWF', annee: 2022, km: 0, heures: 0, carburant: 'Essence', vin: 'M6SH09RLANF585383', ptac: 1800, poids: 1057, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 12325.00, valeurActuelle: 12325.00, typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2022-08-25', dateFin: '', assurance: 0, dateContracteTechnique: '2022-08-25', notes: 'TRACTEUR FARMTRAC - Immatriculation 25/08/2022' },
    { id: 5, immat: 'GM-843-SW', type: 'Micro-tracteur', marque: 'FARMTRAC', modele: 'F26VHE14HMNDWL', annee: 2023, km: 0, heures: 0, carburant: 'Essence', vin: 'M6SH09RLDNF610727', ptac: 1800, poids: 1057, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 12325.00, valeurActuelle: 12325.00, typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2023-03-16', dateFin: '', assurance: 0, dateContracteTechnique: '2023-03-16', notes: 'TRACTEUR FARMTRAC - Immatriculation 16/03/2023 - Facture RURAL MASTER F0614463062' },
    { id: 6, immat: 'DZ-609-JX', type: 'Tracteur', marque: 'ANTONIO CARRARO', modele: 'ERGIT-ST2088965A2', annee: 2016, km: 0, heures: 3170, carburant: 'Agricole', vin: 'T20ACATA000P471', ptac: 4800, poids: 2650, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 42000.00, valeurActuelle: 42000.00, typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2025-05-27', dateFin: '', assurance: 0, dateContracteTechnique: '2025-05-27', notes: 'TRACTEUR ANTONIO CARRARO MACH 4 CHENILLES - Facture SAINT-MARTIN 00054696' },
  ]);

  const [accessoiresEquipement, setAccessoiresEquipement] = useState({
    1: [
      { id: 1, nom: 'Carrosserie TEPEMATIC 26T', valeur: 51583, dateAjout: '2023-11-15', description: 'Plateau fixe porte matériel TP', actif: false },
      { id: 2, nom: 'Feux latéraux LED 24V (x4)', valeur: 65.16, dateAjout: '2023-11-22', description: 'Feu latéral orange à LED 24V', actif: false },
      { id: 3, nom: 'Marche pied 2 marches', valeur: 98.10, dateAjout: '2023-11-22', description: 'Marche pied 2 marches telescopique', actif: false },
      { id: 4, nom: 'Klaxon 6 trompes Basuri', valeur: 232.50, dateAjout: '2023-12-07', description: 'Klaxon 6 trompes Basuri 20 mélodies', actif: false },
    ],
    4: [
      { id: 6, nom: 'Chargeur COCHET CX19', valeur: 3491.67, dateAjout: '2022-08-20', description: 'Chargeur COCHET CX19 FARMTRAC BENNIE STANDARD 1.20M', actif: false },
      { id: 7, nom: 'Kit Flexible Complet Coupleur', valeur: 48.57, dateAjout: '2022-10-14', description: 'Kit flexible complet coupleur - HYDRODIS', actif: false },
      { id: 8, nom: 'Verin 3PT 30x50 CSE210 EAF460', valeur: 217.54, dateAjout: '2022-10-14', description: 'Verin 3ème point hydraulique 30x50 - HYDRODIS', actif: false },
    ],
    5: [
      { id: 5, nom: 'Chargeur COCHET CX19', valeur: 3491.67, dateAjout: '2023-03-16', description: 'Chargeur COCHET CX19 FARMTRAC BENNIE STANDARD 1.20M', actif: false },
    ],
    6: [
      { id: 9, nom: 'SunBrush mobil TrackFlex 3.0', valeur: 64277.00, dateAjout: '2025-05-14', description: 'SunBrush mobil TrackFlex 3.0 5,5m brush trim 350mm - Cleaning device 5.5m brush - WashTronic control - CAN-Bus joystick - Installation training freight', actif: true },
    ]
  });

  const [interventions, setInterventions] = useState([
    { id: 1, equipementId: 3, type: 'Révision/Maintenance', date: '2023-10-31', km: 363392, heures: 0, description: 'Entretien atelier', articles: [], statut: 'effectue', coutTotal: 7635.12, coutTVA: 1527.02, coutTTC: 9162.14, depotPrelevement: 'Atelier' }
  ]);
  
  const [planMaintenance, setPlanMaintenance] = useState([
    { id: 1, equipementId: 1, type: 'Vidange moteur', seuil: 15000, unite: 'km', prochaine: 15000 },
    { id: 2, equipementId: 1, type: 'Révision complète', seuil: 60000, unite: 'km', prochaine: 60000 },
  ]);

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
  const [scannedArticleId, setScannedArticleId] = useState(null);
  const [jsQRLoaded, setJsQRLoaded] = useState(false);
  const [scanResultat, setScanResultat] = useState(null);
  const [actionScan, setActionScan] = useState(null); // 'entree', 'sortie', 'transfert'
  const [formScanEntree, setFormScanEntree] = useState({ quantite: '', prixUnitaire: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
  const [formScanSortie, setFormScanSortie] = useState({ quantite: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
  const [formScanTransfert, setFormScanTransfert] = useState({ quantite: '', depotSource: 'Atelier', depotDestination: 'Véhicule 1' });
  
  const typesIntervention = ['Vidange moteur', 'Révision complète', 'Changement pneus', 'Nettoyage', 'Maintenance', 'Contrôle hydraulique', 'Réparation', 'Autre'];

  // Charger jsQR depuis CDN avec fallback
  useEffect(() => {
    // Vérifier si déjà chargé
    if (window.jsQR) {
      jsQRRef.current = window.jsQR;
      setJsQRLoaded(true);
      console.log('✅ jsQR déjà dans window');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ jsQR chargé (jsDelivr):', typeof window.jsQR);
      jsQRRef.current = window.jsQR;
      setJsQRLoaded(true);
    };
    
    script.onerror = () => {
      console.warn('jsDelivr échoué, tentative cloudflare...');
      const script2 = document.createElement('script');
      script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsqr/1.4.0/jsQR.min.js';
      script2.async = true;
      script2.onload = () => {
        console.log('✅ jsQR chargé (Cloudflare):', typeof window.jsQR);
        jsQRRef.current = window.jsQR;
        setJsQRLoaded(true);
      };
      script2.onerror = () => console.error('❌ Impossible de charger jsQR');
      document.head.appendChild(script2);
    };
    
    document.head.appendChild(script);
  }, []);

  // Scanner QR en temps réel
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
                // Délai 5 sec entre deux mêmes détections
                if (code.data !== lastDetectedCode || now - lastDetectedTime > 5000) {
                  console.log('✅ QR détecté:', code.data);
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
  }, [afficherScannerQR, scanResultat]);

  const getStockTotal = (article) => {
    return depots.reduce((sum, depot) => sum + (article.stockParDepot[depot] || 0), 0);
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
            id: 999,
            nom: `${acc.nom} (sur ${parentEq?.immat})`,
            type: 'accessoire'
          });
        }
      });
    });
    
    return liste;
  };

  const copierToutCommandes = () => {
    const groupes = regrouperParFournisseur();
    const htmlTextes = [];
    const plainTexts = [];

    Object.keys(groupes).forEach(fournisseur => {
      const items = groupes[fournisseur];
      const tableRows = items.map(item => `<tr><td style="border: 1px solid #d97706; padding: 10px;">${item.article.code}</td><td style="border: 1px solid #d97706; padding: 10px;">${item.article.description}</td><td style="border: 1px solid #d97706; padding: 10px; text-align: center;">${item.qteEditable}</td></tr>`).join('');
      const htmlTexte = `<html><body><h2 style="color: #1f2937;">📧 Commande - ${fournisseur}</h2><table style="border-collapse: collapse; width: 100%;"><thead><tr style="background-color: #fed7aa;"><th style="border: 1px solid #d97706; padding: 10px;">Code</th><th style="border: 1px solid #d97706; padding: 10px;">Description</th><th style="border: 1px solid #d97706; padding: 10px;">Quantité</th></tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
      const plainText = `COMMANDE - ${fournisseur}\n${items.map(item => `${item.article.code} | ${item.article.description} | ${item.qteEditable}`).join('\n')}`;
      htmlTextes.push(htmlTexte);
      plainTexts.push(plainText);
    });

    const htmlComplet = htmlTextes.join('\n');
    const plainComplet = plainTexts.join('\n\n');
    const blob = new Blob([htmlComplet], { type: 'text/html' });
    const data = [new ClipboardItem({ 'text/html': blob, 'text/plain': new Blob([plainComplet], { type: 'text/plain' }) })];
    
    navigator.clipboard.write(data).then(() => {
      alert('✓ Commandes copiées !');
      setPanierCommande([]);
    }).catch(() => {
      navigator.clipboard.writeText(plainComplet);
      alert('✓ Commandes copiées (texte) !');
      setPanierCommande([]);
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
    const htmlContent = `
      <html>
        <head>
          <title>QR Codes Articles</title>
          <style>
            body { font-family: Arial; margin: 10mm; }
            .page { page-break-after: always; }
            .qr-item { display: inline-block; margin: 10px; text-align: center; page-break-inside: avoid; }
            .qr-item img { width: 150px; height: 150px; margin: 10px 0; }
            .qr-code { border: 2px solid #333; padding: 10px; }
            .code { font-weight: bold; font-size: 12px; margin-top: 5px; }
            .description { font-size: 10px; color: #666; }
          </style>
        </head>
        <body>
          <h1>QR Codes Articles - Solaire Nettoyage</h1>
          <p>Généré le: ${new Date().toLocaleString('fr-FR')}</p>
          <div class="page">
            ${articles.map(a => `
              <div class="qr-item">
                <div class="qr-code">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(a.code)}" alt="QR Code ${a.code}">
                </div>
                <div class="code">${a.code}</div>
                <div class="description">${a.description.substring(0, 30)}</div>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;
    
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
        alert('Caméra non disponible. Veuillez utiliser un appareil compatible.');
        setAfficherScannerQR(false);
      }
    }
  };

  const traiterScanQR = (code) => {
    const article = articles.find(a => a.code === code);
    if (article) {
      setScannedArticleId(article.id);
      setScanResultat({ success: true, article, code });
      setActionScan(null);
      console.log('✅ Article trouvé:', article.code);
    } else {
      setScanResultat({ success: false, code });
      setActionScan(null);
      console.log('❌ Article non trouvé:', code);
    }
  };

  const enregistrerEntreeStock = () => {
    if (nouvelleEntreeStock.articleId && nouvelleEntreeStock.quantite && nouvelleEntreeStock.prixUnitaire) {
      const quantite = parseInt(nouvelleEntreeStock.quantite);
      const coutTotal = parseFloat(nouvelleEntreeStock.prixUnitaire) * quantite;
      setArticles(articles.map(a => a.id === parseInt(nouvelleEntreeStock.articleId) ? { ...a, stockParDepot: { ...a.stockParDepot, [nouvelleEntreeStock.depot]: (a.stockParDepot[nouvelleEntreeStock.depot] || 0) + quantite } } : a));
      setMouvementsStock([...mouvementsStock, { id: mouvementsStock.length + 1, articleId: parseInt(nouvelleEntreeStock.articleId), type: 'entree', quantite: quantite, date: nouvelleEntreeStock.date, raison: nouvelleEntreeStock.raison, coutTotal: coutTotal, depot: nouvelleEntreeStock.depot }]);
      setNouvelleEntreeStock({ articleId: '', quantite: '', prixUnitaire: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
    }
  };

  const enregistrerSortieStock = () => {
    if (nouveauMouvementSortie.articleId && nouveauMouvementSortie.quantite) {
      const article = articles.find(a => a.id === parseInt(nouveauMouvementSortie.articleId));
      const quantite = parseInt(nouveauMouvementSortie.quantite);
      if ((article.stockParDepot[nouveauMouvementSortie.depot] || 0) < quantite) { alert('Stock insuffisant!'); return; }
      setArticles(articles.map(a => a.id === parseInt(nouveauMouvementSortie.articleId) ? { ...a, stockParDepot: { ...a.stockParDepot, [nouveauMouvementSortie.depot]: (a.stockParDepot[nouveauMouvementSortie.depot] || 0) - quantite } } : a));
      setMouvementsStock([...mouvementsStock, { id: mouvementsStock.length + 1, articleId: parseInt(nouveauMouvementSortie.articleId), type: 'sortie', quantite: quantite, date: nouveauMouvementSortie.date, raison: nouveauMouvementSortie.raison, coutTotal: 0, depot: nouveauMouvementSortie.depot }]);
      setNouveauMouvementSortie({ articleId: '', quantite: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
    }
  };

  const enregistrerTransfertStock = () => {
    if (nouveauTransfert.articleId && nouveauTransfert.quantite && nouveauTransfert.depotSource !== nouveauTransfert.depotDestination) {
      const article = articles.find(a => a.id === parseInt(nouveauTransfert.articleId));
      const quantite = parseInt(nouveauTransfert.quantite);
      if ((article.stockParDepot[nouveauTransfert.depotSource] || 0) < quantite) { alert('Stock insuffisant!'); return; }
      setArticles(articles.map(a => a.id === parseInt(nouveauTransfert.articleId) ? { ...a, stockParDepot: { ...a.stockParDepot, [nouveauTransfert.depotSource]: (a.stockParDepot[nouveauTransfert.depotSource] || 0) - quantite, [nouveauTransfert.depotDestination]: (a.stockParDepot[nouveauTransfert.depotDestination] || 0) + quantite } } : a));
      setMouvementsStock([...mouvementsStock, { id: mouvementsStock.length + 1, articleId: parseInt(nouveauTransfert.articleId), type: 'transfer', quantite: quantite, date: nouveauTransfert.date, raison: `Transfert de ${nouveauTransfert.depotSource} vers ${nouveauTransfert.depotDestination}`, coutTotal: 0, depotSource: nouveauTransfert.depotSource, depotDestination: nouveauTransfert.depotDestination }]);
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
      nouvelStock = nouvelStock.map(a => a.id === art.articleId ? { ...a, stockParDepot: { ...a.stockParDepot, [nouvelleIntervention.depotPrelevement]: (a.stockParDepot[nouvelleIntervention.depotPrelevement] || 0) - art.quantite } } : a);
    });
    setArticles(nouvelStock);
    setInterventions([...interventions, { id: interventionId, equipementId: parseInt(nouvelleIntervention.equipementId), type: nouvelleIntervention.type, date: nouvelleIntervention.date, km: parseInt(nouvelleIntervention.km) || 0, heures: parseInt(nouvelleIntervention.heures) || 0, description: nouvelleIntervention.description, articles: nouvelleIntervention.articlesPrevu, statut: 'en_cours', coutTotal: coutTotal, depotPrelevement: nouvelleIntervention.depotPrelevement }]);
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

  const valeurStockTotal = articles.reduce((sum, a) => sum + (getStockTotal(a) * a.prixUnitaire), 0);
  const interventionsEnCours = interventions.filter(i => i.statut === 'en_cours');
  const equipSelectionne = equipements.find(e => e.id === equipementSelectionne);
  const accessoiresTotal = (accessoiresEquipement[equipementSelectionne] || []).reduce((sum, a) => sum + a.valeur, 0);
  const valeurEquipementTotal = (equipSelectionne?.valeurActuelle || 0) + accessoiresTotal;
  const articlesAffectesEquipement = articles.filter(a => a.equipementsAffectes.includes(equipementSelectionne));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4">
        <h1 className="text-2xl font-bold">☀️ SOLAIRE NETTOYAGE - Gestion Complète Multi-Dépôts</h1>
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
            { id: 'maintenance', label: '⚙️ Maintenance' },
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
            <div className="bg-indigo-100 border-2 border-indigo-400 p-4 rounded"><h3 className="font-bold mb-3">📱 Scanner QR Code</h3><button onClick={toggleScannerQR} className={`px-4 py-2 rounded font-bold text-white ${afficherScannerQR ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>{afficherScannerQR ? '❌ Fermer Scanner' : '📷 Activer Scanner'}</button>{afficherScannerQR && !scanResultat && (<div className="mt-4"><div className="bg-gray-900 rounded overflow-hidden" style={{maxWidth: '400px'}}><video ref={videoRef} autoPlay playsInline muted style={{width: '100%', display: 'block'}} onLoadedMetadata={() => console.log('✅ Vidéo chargée')} /><canvas ref={canvasRef} style={{display: 'none'}} /></div><div className="mt-3 p-3 bg-indigo-50 rounded border border-indigo-300"><p className="text-sm font-bold text-indigo-700">📊 Statut :</p><p className="text-xs text-indigo-600">• jsQR: {jsQRLoaded ? '✅ Chargé' : '⏳ Chargement...'}</p><p className="text-xs text-indigo-600">• Vidéo: {videoRef.current?.readyState === 4 ? '✅ Active' : '⏳ En cours...'}</p></div><div className="mt-3"><input type="text" placeholder="Entrer code article ou scanner QR" onKeyDown={(e) => {if (e.key === 'Enter' && e.target.value) {traiterScanQR(e.target.value); e.target.value = ''}}} className="w-full border-2 border-indigo-300 rounded px-3 py-2 font-bold" /></div><div className="mt-2 text-sm text-indigo-700 font-semibold">🎯 Scanner actif - Pointez un QR code</div></div>)}{scanResultat && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"><div className="text-center mb-4">{scanResultat.success ? (<><div className="text-4xl mb-2">✅</div><h3 className="text-xl font-black text-green-600">Article détecté !</h3></>) : (<><div className="text-4xl mb-2">❌</div><h3 className="text-xl font-black text-red-600">Article non trouvé</h3></>)}</div>{scanResultat.success && (<><div className="bg-green-50 p-4 rounded-lg mb-4 border-2 border-green-300"><div className="font-bold text-lg text-green-700">{scanResultat.article.code}</div><div className="text-sm text-gray-700 mt-1">{scanResultat.article.description}</div><div className="text-xs text-gray-600 mt-2">Fournisseur: {scanResultat.article.fournisseur}</div><div className="text-xs text-gray-600">Prix: {scanResultat.article.prixUnitaire}€</div><div className="text-sm font-bold text-green-600 mt-2">Stock: {getStockTotal(scanResultat.article)}</div></div>{!actionScan ? (<><div className="grid grid-cols-3 gap-2 mb-4"><button onClick={() => setActionScan('entree')} className="bg-green-600 text-white px-3 py-3 rounded font-bold text-sm hover:bg-green-700">📥 Entrée</button><button onClick={() => setActionScan('sortie')} className="bg-red-600 text-white px-3 py-3 rounded font-bold text-sm hover:bg-red-700">📤 Sortie</button><button onClick={() => setActionScan('transfert')} className="bg-amber-600 text-white px-3 py-3 rounded font-bold text-sm hover:bg-amber-700">🔄 Transfer</button></div></>) : actionScan === 'entree' ? (<div className="bg-green-50 p-4 rounded-lg mb-4 border-2 border-green-300"><h4 className="font-bold text-green-700 mb-3">📥 Entrée de Stock</h4><div className="space-y-2"><input type="number" placeholder="Quantité *" value={formScanEntree.quantite} onChange={(e) => setFormScanEntree({...formScanEntree, quantite: e.target.value})} className="w-full border rounded px-2 py-1" /><input type="number" step="0.01" placeholder="Prix unitaire *" value={formScanEntree.prixUnitaire} onChange={(e) => setFormScanEntree({...formScanEntree, prixUnitaire: e.target.value})} className="w-full border rounded px-2 py-1" /><input placeholder="Raison (facture, BL...)" value={formScanEntree.raison} onChange={(e) => setFormScanEntree({...formScanEntree, raison: e.target.value})} className="w-full border rounded px-2 py-1" /><select value={formScanEntree.depot} onChange={(e) => setFormScanEntree({...formScanEntree, depot: e.target.value})} className="w-full border rounded px-2 py-1">{depots.map(d => <option key={d} value={d}>{d}</option>)}</select><input type="date" value={formScanEntree.date} onChange={(e) => setFormScanEntree({...formScanEntree, date: e.target.value})} className="w-full border rounded px-2 py-1" /></div><div className="flex gap-2 mt-3"><button onClick={enregistrerEntreeStockScan} className="flex-1 bg-green-600 text-white px-3 py-2 rounded font-bold">✓ Valider</button><button onClick={() => setActionScan(null)} className="flex-1 bg-gray-400 text-white px-3 py-2 rounded font-bold">↩️ Retour</button></div></div>) : actionScan === 'sortie' ? (<div className="bg-red-50 p-4 rounded-lg mb-4 border-2 border-red-300"><h4 className="font-bold text-red-700 mb-3">📤 Sortie de Stock</h4><div className="space-y-2"><input type="number" placeholder="Quantité *" value={formScanSortie.quantite} onChange={(e) => setFormScanSortie({...formScanSortie, quantite: e.target.value})} className="w-full border rounded px-2 py-1" /><input placeholder="Raison (intervention, usage...)" value={formScanSortie.raison} onChange={(e) => setFormScanSortie({...formScanSortie, raison: e.target.value})} className="w-full border rounded px-2 py-1" /><select value={formScanSortie.depot} onChange={(e) => setFormScanSortie({...formScanSortie, depot: e.target.value})} className="w-full border rounded px-2 py-1">{depots.map(d => <option key={d} value={d}>{d}</option>)}</select><input type="date" value={formScanSortie.date} onChange={(e) => setFormScanSortie({...formScanSortie, date: e.target.value})} className="w-full border rounded px-2 py-1" /></div><div className="flex gap-2 mt-3"><button onClick={enregistrerSortieStockScan} className="flex-1 bg-red-600 text-white px-3 py-2 rounded font-bold">✓ Valider</button><button onClick={() => setActionScan(null)} className="flex-1 bg-gray-400 text-white px-3 py-2 rounded font-bold">↩️ Retour</button></div></div>) : (<div className="bg-amber-50 p-4 rounded-lg mb-4 border-2 border-amber-300"><h4 className="font-bold text-amber-700 mb-3">🔄 Transfert</h4><div className="space-y-2"><input type="number" placeholder="Quantité *" value={formScanTransfert.quantite} onChange={(e) => setFormScanTransfert({...formScanTransfert, quantite: e.target.value})} className="w-full border rounded px-2 py-1" /><select value={formScanTransfert.depotSource} onChange={(e) => setFormScanTransfert({...formScanTransfert, depotSource: e.target.value})} className="w-full border rounded px-2 py-1"><option value="">Dépôt source</option>{depots.map(d => <option key={d} value={d}>{d}</option>)}</select><select value={formScanTransfert.depotDestination} onChange={(e) => setFormScanTransfert({...formScanTransfert, depotDestination: e.target.value})} className="w-full border rounded px-2 py-1"><option value="">Dépôt destination</option>{depots.map(d => <option key={d} value={d}>{d}</option>)}</select></div><div className="flex gap-2 mt-3"><button onClick={enregistrerTransfertStockScan} className="flex-1 bg-amber-600 text-white px-3 py-2 rounded font-bold">✓ Valider</button><button onClick={() => setActionScan(null)} className="flex-1 bg-gray-400 text-white px-3 py-2 rounded font-bold">↩️ Retour</button></div></div>)}</>)}{!scanResultat.success && (<div className="flex gap-2"><button onClick={() => setScanResultat(null)} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded font-bold">🔄 Rescanner</button><button onClick={() => {setAfficherScannerQR(false); setScanResultat(null);}} className="flex-1 bg-gray-400 text-white px-4 py-2 rounded font-bold">✕ Fermer</button></div>)}</div></div>)}</div>
            <div className="bg-green-50 border-2 border-green-300 p-4 rounded"><h3 className="font-bold mb-3">📥 Entrée - {depotSelectionne}</h3><div className="grid grid-cols-1 md:grid-cols-5 gap-2"><select value={nouvelleEntreeStock.articleId} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, articleId: e.target.value})} className="border rounded px-2 py-1"><option value="">Article</option>{articles.map(a => <option key={a.id} value={a.id}>{a.code}</option>)}</select><input type="number" placeholder="Qté" value={nouvelleEntreeStock.quantite} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, quantite: e.target.value})} className="border rounded px-2 py-1" /><input type="number" step="0.01" placeholder="Prix" value={nouvelleEntreeStock.prixUnitaire} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, prixUnitaire: e.target.value})} className="border rounded px-2 py-1" /><input placeholder="Raison" value={nouvelleEntreeStock.raison} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, raison: e.target.value})} className="border rounded px-2 py-1" /><button onClick={enregistrerEntreeStock} className="bg-green-600 text-white px-3 py-1 rounded font-bold">Entrer</button></div></div>
            <div className="bg-red-50 border-2 border-red-300 p-4 rounded"><h3 className="font-bold mb-3">📤 Sortie - {depotSelectionne}</h3><div className="grid grid-cols-1 md:grid-cols-5 gap-2"><select value={nouveauMouvementSortie.articleId} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, articleId: e.target.value})} className="border rounded px-2 py-1"><option value="">Article</option>{articles.map(a => <option key={a.id} value={a.id}>{a.code}</option>)}</select><input type="number" placeholder="Qté" value={nouveauMouvementSortie.quantite} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, quantite: e.target.value})} className="border rounded px-2 py-1" /><input placeholder="Raison" value={nouveauMouvementSortie.raison} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, raison: e.target.value})} className="border rounded px-2 py-1" /><input type="date" value={nouveauMouvementSortie.date} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, date: e.target.value})} className="border rounded px-2 py-1" /><button onClick={enregistrerSortieStock} className="bg-red-600 text-white px-3 py-1 rounded font-bold">Sortir</button></div></div>
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
                          <button key={e.id} onClick={() => affecterArticleEquipement(a.id, e.id)} 
                            className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap transition ${a.equipementsAffectes.includes(e.id) ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
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
          <div className="bg-white p-4 rounded"><h3 className="font-bold mb-3">Équipements ({equipements.length})</h3>{equipements.map(eq => (<div key={eq.id} className="p-3 bg-gray-50 rounded mb-2 cursor-pointer hover:bg-orange-50" onClick={() => {setOngletActif('fiche'); setEquipementSelectionne(eq.id);}}><div className="font-semibold text-orange-600">{eq.immat} - {eq.type}</div><div className="text-sm text-gray-600">{eq.marque} {eq.modele} ({eq.annee})</div></div>))}</div>
        )}

        {ongletActif === 'interventions' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded border"><h3 className="font-bold text-lg mb-3">🔧 Créer intervention</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                <select value={nouvelleIntervention.equipementId} onChange={(e) => setNouvelleIntervention({...nouvelleIntervention, equipementId: e.target.value})} className="border-2 rounded px-2 py-2"><option value="">Équipement ou Accessoire *</option>{getEquipementsEtSunbrush().map(item => <option key={item.id} value={item.id}>{item.nom}</option>)}</select>
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
                <div className="mb-2"><button onClick={() => setAfficherArticlesEquipement(!afficherArticlesEquipement)} className={`px-3 py-1 rounded text-xs font-bold mb-2 ${afficherArticlesEquipement ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>{afficherArticlesEquipement ? 'Articles équipement' : 'Tous'}</button></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                  <select value={nouvelArticleIntervention.articleId} onChange={(e) => setNouvelArticleIntervention({...nouvelArticleIntervention, articleId: e.target.value})} className="border-2 rounded px-2 py-2 text-sm"><option value="">Article</option>{getArticlesDisponibles().map(a => <option key={a.id} value={a.id}>{a.code} - {a.description} - {a.fournisseur} - {a.prixUnitaire}€ - Stock: {a.stockParDepot[nouvelleIntervention.depotPrelevement] || 0}</option>)}</select>
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
          <div className="bg-white p-4 rounded"><h3 className="font-bold mb-3">Plan de maintenance</h3>{planMaintenance.map(pm => {const eq = equipements.find(e => e.id === pm.equipementId); return (<div key={pm.id} className="p-3 bg-gray-50 rounded mb-2"><div className="font-semibold">{eq?.immat} - {pm.type}</div><div className="text-xs">Seuil: {pm.prochaine} {pm.unite}</div></div>);})}</div>
        )}
      </div>
    </div>
  );
}