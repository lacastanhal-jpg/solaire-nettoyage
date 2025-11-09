/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback } from 'react';

// ============================================
// SUPABASE API REST
// ============================================

const SUPABASE_URL = 'https://dxzzwxjgsifivlqqlwuz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4enp3eGpnc2lmaXZscXFsd3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MDE5NjksImV4cCI6MjA3ODI3Nzk2OX0.UFER1C0Hud0JUuBfBLRHzIj-C2UHE0_o3ES3-D8L-XE';

const apiSupabase = async (table, method = 'GET', body = null, filters = '') => {
  const url = `${SUPABASE_URL}/rest/v1/${table}${filters}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  };
  if (body) options.body = JSON.stringify(body);
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Erreur: ${response.status}`);
    return response.status !== 204 ? await response.json() : null;
  } catch (err) {
    console.error('Erreur Supabase:', err);
    return null;
  }
};

export default function SolaireNettoyageFlotte() {
  // ÉTATS CONNEXION
  const [operateurConnecte, setOperateurConnecte] = useState(null);
  const [listeOperateurs, setListeOperateurs] = useState([]);
  const [afficherConnexion, setAfficherConnexion] = useState(true);
  const [chargementInitial, setChargementInitial] = useState(true);

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
  const [transfertRapideData, setTransfertRapideData] = useState({ depotSource: 'Atelier', depotDestination: 'Porteur 26 T', quantite: '' });

  const operateurs = ['Axel', 'Jérôme', 'Sébastien', 'Joffrey', 'Fabien', 'Angelo'];
  const depots = ['Atelier', 'Porteur 26 T', 'Porteur 32 T', 'Semi Remorque'];
  
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

  const [mouvementsStock, setMouvementsStock] = useState([
    { id: 1, articleId: 1, type: 'entree', quantite: 3, date: '2025-09-29', raison: 'Facture 233440 - LE BON ROULEMENT', coutTotal: 15.15, depot: 'Atelier' },
    { id: 2, articleId: 2, type: 'entree', quantite: 3, date: '2025-09-29', raison: 'Facture 233440 - LE BON ROULEMENT', coutTotal: 27.20, depot: 'Atelier' },
  ]);

  const [equipements, setEquipements] = useState([
    { id: 1, immat: 'GT-316-FG', type: 'Camion Porteur', marque: 'IVECO', modele: 'S-WAY', annee: 2023, km: 0, heures: 0, carburant: 'Diesel', vin: 'ZCFCE62RU00C519482', ptac: 26000, poids: 13190, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 0, valeurActuelle: 133500, typeFinancement: 'Location', coutMensuel: 2104, dateDebut: '2023-12-22', dateFin: '2029-12-22', assurance: 80.10, dateContracteTechnique: '2024-12-22', notes: 'Contrat de location A1M75094 001' },
    { id: 2, immat: 'DX-780-QN', type: 'Tracteur Routier', marque: 'IVECO', modele: 'STRALIS 560', annee: 2015, km: 293992, heures: 0, carburant: 'Diesel', vin: 'WJMS2NWH60C329019', ptac: 26000, poids: 8518, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 45000, valeurActuelle: 42000, typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2020-09-18', dateFin: '', assurance: 85.00, dateContracteTechnique: '2020-10-17', notes: 'STRALIS 560 • Type 6x2' },
    { id: 3, immat: 'CZ-022-DP', type: 'Semi-Remorque', marque: 'NICOLAS', modele: 'B3207C', annee: 2002, km: 0, heures: 0, carburant: 'N/A', vin: 'VF9B3207C02058032', ptac: 34000, poids: 12550, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 15000, valeurActuelle: 14000, typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2018-06-29', dateFin: '', assurance: 120.00, dateContracteTechnique: '2019-08-22', notes: 'Semi-Remorque NICOLAS B3207C' },
    { id: 4, immat: 'G3-415-BW', type: 'Micro-tracteur', marque: 'FARMTRAC', modele: 'F26VHE14HMNDWF', annee: 2022, km: 0, heures: 0, carburant: 'Essence', vin: 'M6SH09RLANF585383', ptac: 1800, poids: 1057, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 12325.00, valeurActuelle: 12325.00, typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2022-08-25', dateFin: '', assurance: 0, dateContracteTechnique: '2022-08-25', notes: 'TRACTEUR FARMTRAC - Immatriculation 25/08/2022' },
    { id: 5, immat: 'GM-843-SW', type: 'Micro-tracteur', marque: 'FARMTRAC', modele: 'F26VHE14HMNDWL', annee: 2023, km: 0, heures: 0, carburant: 'Essence', vin: 'M6SH09RLDNF610727', ptac: 1800, poids: 1057, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 12325.00, valeurActuelle: 12325.00, typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2023-03-16', dateFin: '', assurance: 0, dateContracteTechnique: '2023-03-16', notes: 'TRACTEUR FARMTRAC - Immatriculation 16/03/2023' },
    { id: 6, immat: 'DZ-609-JX', type: 'Tracteur', marque: 'ANTONIO CARRARO', modele: 'ERGIT-ST2088965A2', annee: 2016, km: 0, heures: 3170, carburant: 'Agricole', vin: 'T20ACATA000P471', ptac: 4800, poids: 2650, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 42000.00, valeurActuelle: 42000.00, typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2025-05-27', dateFin: '', assurance: 0, dateContracteTechnique: '2025-05-27', notes: 'TRACTEUR ANTONIO CARRARO MACH 4 CHENILLES' },
  ]);

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

  // AUTRES ÉTATS (COMPLETS DE V21)
  const [nouvelDefaut, setNouvelDefaut] = useState({ equipementId: '', accessoireId: '', type: 'Fuite', severite: 'moyen', description: '', localisation: '', dateConstatation: new Date().toISOString().split('T')[0], operateur: 'Axel', remarques: '', photosNoms: [] });
  const [defautSelectionne, setDefautSelectionne] = useState(null);
  const [photosSelectionnees, setPhotosSelectionnees] = useState([]);
  const [nouvelleEntreeStock, setNouvelleEntreeStock] = useState({ articleId: '', quantite: '', prixUnitaire: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
  const [nouveauMouvementSortie, setNouveauMouvementSortie] = useState({ articleId: '', quantite: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
  const [nouveauTransfert, setNouveauTransfert] = useState({ articleId: '', quantite: '', depotSource: 'Atelier', depotDestination: 'Porteur 26 T', raison: '', date: new Date().toISOString().split('T')[0] });
  const [nouvelleIntervention, setNouvelleIntervention] = useState({ equipementId: '', type: '', date: new Date().toISOString().split('T')[0], km: '', heures: '', description: '', articlesPrevu: [], depotPrelevement: 'Atelier' });
  const [nouvelArticleIntervention, setNouvelArticleIntervention] = useState({ articleId: '', quantite: '' });
  const [nouvelAccessoire, setNouvelAccessoire] = useState({ nom: '', valeur: '', description: '', dateAjout: new Date().toISOString().split('T')[0] });
  const [articleEnEdition, setArticleEnEdition] = useState(null);
  const [panierCommande, setPanierCommande] = useState([]);
  const [afficherArticlesEquipement, setAfficherArticlesEquipement] = useState(false);
  const [afficherScannerQR, setAfficherScannerQR] = useState(false);
  const [scanResultat, setScanResultat] = useState(null);
  const [actionScan, setActionScan] = useState(null);
  const [formScanEntree, setFormScanEntree] = useState({ quantite: '', prixUnitaire: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
  const [formScanSortie, setFormScanSortie] = useState({ quantite: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
  const [formScanTransfert, setFormScanTransfert] = useState({ quantite: '', depotSource: 'Atelier', depotDestination: 'Porteur 26 T' });
  const [afficherScannerIntervention, setAfficherScannerIntervention] = useState(false);
  const [scanResultatIntervention, setScanResultatIntervention] = useState(null);
  const [quantiteScanIntervention, setQuantiteScanIntervention] = useState('');
  const [afficherFormulaireEquipement, setAfficherFormulaireEquipement] = useState(false);
  const [equipementEnEdition, setEquipementEnEdition] = useState(null);
  const [modeEdition, setModeEdition] = useState(false);
  const [afficherFormulaireArticle, setAfficherFormulaireArticle] = useState(false);
  const [articleFormEnEdition, setArticleFormEnEdition] = useState(null);
  const [modeEditionArticle, setModeEditionArticle] = useState(false);
  const [nouvelArticleForm, setNouvelArticleForm] = useState({ code: '', description: '', fournisseur: '', prixUnitaire: 0, stockMin: 0 });
  const [nouvelEquipement, setNouvelEquipement] = useState({ immat: '', type: '', marque: '', modele: '', annee: '', km: 0, heures: 0, carburant: '', vin: '', ptac: 0, poids: 0, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 0, valeurActuelle: 0, typeFinancement: '', coutMensuel: 0, dateDebut: new Date().toISOString().split('T')[0], dateFin: '', assurance: 0, dateContracteTechnique: '', notes: '' });
  const [videoStream, setVideoStream] = useState(null);
  const typesIntervention = ['Vidange moteur', 'Révision complète', 'Changement pneus', 'Nettoyage', 'Maintenance', 'Contrôle hydraulique', 'Réparation', 'Autre'];

  // CHARGER OPÉRATEURS
  useEffect(() => {
    const chargerOp = async () => {
      const data = await apiSupabase('operateurs', 'GET', null, '?select=*');
      if (data) setListeOperateurs(data);
      setChargementInitial(false);
    };
    chargerOp();
  }, []);

  // TRACER ACTIVITÉ
  const tracerActivite = async (action, detail) => {
    if (!operateurConnecte) return;
    try {
      await apiSupabase('activite_log', 'POST', {
        operateur_id: operateurConnecte.id,
        action,
        detail,
        created_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Erreur trace:', err);
    }
  };

  // CONNEXION / DÉCONNEXION
  const connecterOperateur = (op) => {
    setOperateurConnecte(op);
    setAfficherConnexion(false);
    setTimeout(() => tracerActivite('CONNEXION', `${op.nom} connecté`), 300);
  };

  const deconnecter = async () => {
    if (operateurConnecte) {
      await tracerActivite('DÉCONNEXION', `${operateurConnecte.nom} déconnecté`);
    }
    setOperateurConnecte(null);
    setAfficherConnexion(true);
  };

  // ÉCRAN CONNEXION
  if (afficherConnexion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-4xl font-black text-orange-600 mb-2 text-center">☀️ SOLAIRE</h1>
          <p className="text-gray-600 font-semibold text-center">Nettoyage - Multi-Opérateurs V22</p>
          <div className="space-y-3 mt-8">
            <p className="text-center font-bold text-gray-700">Sélectionner opérateur :</p>
            {listeOperateurs.map(op => (
              <button key={op.id} onClick={() => connecterOperateur(op)} className="w-full py-4 rounded-lg font-black text-lg text-white transition hover:shadow-lg transform hover:scale-105" style={{ backgroundColor: op.couleur || '#FF6B35' }}>
                👤 {op.nom}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (chargementInitial) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center"><div className="text-4xl mb-4 animate-pulse">☀️</div><p className="font-black text-xl">Chargement...</p></div>
      </div>
    );
  }

  // FONCTIONS V21 COMPLÈTES
  const getStockTotal = (article) => depots.reduce((sum, depot) => sum + (article.stockParDepot[depot] || 0), 0);
  const calculerAlertes = () => {
    return articles.map(article => {
      const total = getStockTotal(article);
      let severite = null;
      if (total === article.stockMin) severite = 'critique';
      else if (total < article.stockMin * 1.5) severite = 'attention';
      else if (depots.some(depot => article.stockParDepot[depot] === 0)) severite = 'vigilance';
      if (severite) return { ...article, severite, depotsVides: depots.filter(d => article.stockParDepot[d] === 0), total };
      return null;
    }).filter(a => a !== null);
  };

  const appliquerFiltresAlertes = (alertes) => {
    let filtrées = alertes;
    if (filtreAlerteSeverite) filtrées = filtrées.filter(a => a.severite === filtreAlerteSeverite);
    if (filtreAlerteFournisseur) filtrées = filtrées.filter(a => a.fournisseur === filtreAlerteFournisseur);
    if (filtreAlerteDepot) filtrées = filtrées.filter(a => a.depotsVides.includes(filtreAlerteDepot));
    if (triAlertes === 'severite') {
      filtrées.sort((a, b) => { const ordre = { 'critique': 0, 'attention': 1, 'vigilance': 2 }; return ordre[a.severite] - ordre[b.severite]; });
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

  // RENDER V21 COMPLET
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">☀️ SOLAIRE NETTOYAGE - V22 Supabase</h1>
            <p className="text-yellow-100 text-sm">Flotte • Stock • Maintenance • Interventions • Fiches matériel</p>
          </div>
          <div className="text-right">
            <div className="font-bold">👤 {operateurConnecte?.nom}</div>
            <button onClick={deconnecter} className="mt-1 bg-white text-orange-600 px-3 py-1 rounded font-bold text-sm">↪️ Déconnexion</button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 overflow-x-auto">
        <div className="flex">
          {[
            { id: 'accueil', label: '📊 Accueil' },
            { id: 'fiche', label: `📋 Fiche (${equipements.length})` },
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
            <div className="bg-red-50 p-4 rounded border border-red-200"><div className="text-3xl font-bold text-red-600">{defautsCritiques.length}</div><div className="text-sm">🔴 Critiques</div></div>
          </div>
        )}

        {ongletActif === 'fiche' && equipSelectionne && (
          <div className="space-y-6">
            <div className="sticky top-20 z-20 flex gap-3 overflow-x-auto pb-2">
              {equipements.map(eq => (
                <button key={eq.id} onClick={() => setEquipementSelectionne(eq.id)} className={`px-4 py-4 rounded-lg font-semibold whitespace-nowrap ${equipementSelectionne === eq.id ? 'bg-orange-600 text-white' : 'bg-white border-2 border-gray-200'}`}>
                  {eq.immat}<br/><span className="text-sm">{eq.marque} {eq.modele}</span>
                </button>
              ))}
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-yellow-400 text-white p-8 rounded-xl shadow-lg">
              <h2 className="text-5xl font-black mb-2">{equipSelectionne.immat}</h2>
              <p className="text-xl">{equipSelectionne.marque} {equipSelectionne.modele}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500"><p className="text-blue-600 font-bold text-sm">VALEUR ACHAT</p><p className="text-3xl font-black text-blue-600 mt-2">{equipSelectionne.valeurAchat}€</p></div>
              <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500"><p className="text-green-600 font-bold text-sm">VALEUR ACTUELLE</p><p className="text-3xl font-black text-green-700 mt-2">{equipSelectionne.valeurActuelle}€</p></div>
              <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-indigo-500"><p className="text-indigo-600 font-bold text-sm">ACCESSOIRES</p><p className="text-3xl font-black text-indigo-700 mt-2">{Math.round(accessoiresTotal)}€</p></div>
              <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-orange-500"><p className="text-orange-600 font-bold text-sm">VALEUR TOTALE</p><p className="text-3xl font-black text-orange-700 mt-2">{Math.round(valeurEquipementTotal)}€</p></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md"><h3 className="text-lg font-black mb-4 pb-3 border-b-3 border-purple-500">📦 ARTICLES AFFECTÉS</h3>{articlesAffectesEquipement.length === 0 ? <p className="text-gray-500">Aucun article</p> : <div className="space-y-2">{articlesAffectesEquipement.map(a => (<div key={a.id} className="flex justify-between p-3 bg-purple-50 rounded-lg"><div><div className="font-bold text-purple-700">{a.code}</div><div className="text-sm">{a.description}</div></div><div className="text-right"><div className="text-purple-600 font-bold">{getStockTotal(a)}</div></div></div>))}</div>}</div>
            <div className="bg-white p-6 rounded-xl shadow-md"><h3 className="text-lg font-black mb-4 pb-3 border-b-3 border-pink-500">🎨 ACCESSOIRES</h3>{(accessoiresEquipement[equipementSelectionne] || []).length === 0 ? <p className="text-gray-500">Aucun</p> : <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{(accessoiresEquipement[equipementSelectionne] || []).map(acc => (<div key={acc.id} className="bg-pink-50 p-4 rounded-lg border-2 border-pink-200"><div className="flex justify-between items-start mb-2"><div className="font-bold text-pink-700">{acc.nom}</div><div className="text-xl font-black text-green-600">{acc.valeur}€</div></div><p className="text-sm text-gray-700">{acc.description}</p></div>))}</div>}</div>
          </div>
        )}

        {ongletActif === 'articles' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded border"><h2 className="font-black text-xl mb-4">📦 Articles ({articles.length})</h2><div className="space-y-2">{articles.map(a => (<div key={a.id} className="flex justify-between p-3 bg-gray-50 rounded border"><div><div className="font-bold text-orange-600">{a.code}</div><div className="text-sm">{a.description}</div><div className="text-xs text-gray-500 mt-1">{a.fournisseur} • {a.prixUnitaire}€ • Min: {a.stockMin}</div></div><div className="text-right"><div className={`font-bold ${getStockTotal(a) <= 2 ? 'text-red-600' : 'text-green-600'}`}>{getStockTotal(a)}</div></div></div>))}</div></div>
          </div>
        )}

        {ongletActif === 'inventaire' && (
          <div className="bg-white p-4 rounded border overflow-x-auto"><h2 className="font-black text-xl mb-4">📊 INVENTAIRE</h2><table className="w-full text-sm"><thead><tr className="bg-orange-100"><th className="px-3 py-3 text-left font-bold">Code</th><th className="px-3 py-3 text-left font-bold">Description</th><th className="px-3 py-3 text-right">Prix</th>{depots.map(depot => (<th key={depot} className="px-3 py-3 text-center font-bold">{depot}</th>))}<th className="px-3 py-3 text-center font-bold bg-green-50">Total</th><th className="px-3 py-3 text-center font-bold">Min</th></tr></thead><tbody>{articles.map(a => {const total = getStockTotal(a); const enAlerte = total < a.stockMin; return (<tr key={a.id} className={enAlerte ? 'bg-red-50' : ''}><td className="px-3 py-3 font-bold text-orange-600">{a.code}</td><td className="px-3 py-3 text-sm">{a.description}</td><td className="px-3 py-3 text-right">{a.prixUnitaire}€</td>{depots.map(depot => (<td key={depot} className="px-3 py-3 text-center font-bold"><span className={`px-2 py-1 rounded text-xs ${a.stockParDepot[depot] === 0 ? 'bg-gray-100' : a.stockParDepot[depot] <= 2 ? 'bg-orange-200' : 'bg-green-200'}`}>{a.stockParDepot[depot] || 0}</span></td>))}<td className="px-3 py-3 text-center font-black bg-green-50 text-green-700">{total}</td><td className="px-3 py-3 text-center">{a.stockMin}</td></tr>);})}</tbody></table></div>
        )}

        {ongletActif === 'stock' && (
          <div className="space-y-4">
            <div className="bg-green-50 border-2 border-green-300 p-4 rounded"><h3 className="font-bold mb-3">📥 Entrée</h3><div className="grid grid-cols-1 md:grid-cols-5 gap-2"><select value={nouvelleEntreeStock.articleId} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, articleId: e.target.value})} className="border rounded px-2 py-1"><option>Article</option>{articles.map(a => <option key={a.id} value={a.id}>{a.code}</option>)}</select><input type="number" placeholder="Qté" value={nouvelleEntreeStock.quantite} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, quantite: e.target.value})} className="border rounded px-2 py-1" /><input type="number" placeholder="Prix" value={nouvelleEntreeStock.prixUnitaire} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, prixUnitaire: e.target.value})} className="border rounded px-2 py-1" /><input placeholder="Raison" value={nouvelleEntreeStock.raison} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, raison: e.target.value})} className="border rounded px-2 py-1" /><button className="bg-green-600 text-white px-3 py-1 rounded font-bold">Entrer</button></div></div>
            <div className="bg-red-50 border-2 border-red-300 p-4 rounded"><h3 className="font-bold mb-3">📤 Sortie</h3><div className="grid grid-cols-1 md:grid-cols-5 gap-2"><select value={nouveauMouvementSortie.articleId} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, articleId: e.target.value})} className="border rounded px-2 py-1"><option>Article</option>{articles.map(a => <option key={a.id} value={a.id}>{a.code}</option>)}</select><input type="number" placeholder="Qté" value={nouveauMouvementSortie.quantite} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, quantite: e.target.value})} className="border rounded px-2 py-1" /><input placeholder="Raison" value={nouveauMouvementSortie.raison} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, raison: e.target.value})} className="border rounded px-2 py-1" /><input type="date" value={nouveauMouvementSortie.date} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, date: e.target.value})} className="border rounded px-2 py-1" /><button className="bg-red-600 text-white px-3 py-1 rounded font-bold">Sortir</button></div></div>
            <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded"><h3 className="font-bold mb-3">🔄 Transfert</h3><div className="grid grid-cols-1 md:grid-cols-6 gap-2"><select value={nouveauTransfert.articleId} onChange={(e) => setNouveauTransfert({...nouveauTransfert, articleId: e.target.value})} className="border rounded px-2 py-1"><option>Article</option>{articles.map(a => <option key={a.id} value={a.id}>{a.code}</option>)}</select><select value={nouveauTransfert.depotSource} onChange={(e) => setNouveauTransfert({...nouveauTransfert, depotSource: e.target.value})} className="border rounded px-2 py-1">{depots.map(d => <option key={d} value={d}>{d}</option>)}</select><select value={nouveauTransfert.depotDestination} onChange={(e) => setNouveauTransfert({...nouveauTransfert, depotDestination: e.target.value})} className="border rounded px-2 py-1">{depots.map(d => <option key={d} value={d}>{d}</option>)}</select><input type="number" placeholder="Qté" value={nouveauTransfert.quantite} onChange={(e) => setNouveauTransfert({...nouveauTransfert, quantite: e.target.value})} className="border rounded px-2 py-1" /><input placeholder="Note" value={nouveauTransfert.raison} onChange={(e) => setNouveauTransfert({...nouveauTransfert, raison: e.target.value})} className="border rounded px-2 py-1" /><button className="bg-amber-600 text-white px-3 py-1 rounded font-bold">Transférer</button></div></div>
          </div>
        )}

        {ongletActif === 'equipements' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded border"><h2 className="font-black text-xl mb-4">🚛 Équipements ({equipements.length})</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{equipements.map(eq => (<div key={eq.id} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-300"><div className="text-xl font-black text-orange-600">{eq.immat}</div><div className="text-sm text-gray-700 mt-1"><strong>{eq.type}</strong></div><div className="text-sm text-gray-600">{eq.marque} {eq.modele}</div><div className="mt-3 text-sm"><div>💰 {eq.valeurActuelle}€</div><div>⛽ {eq.carburant}</div><div>📅 {eq.annee}</div></div></div>))}</div></div>
          </div>
        )}

        {ongletActif === 'interventions' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded border"><h2 className="font-black text-xl mb-4">🔧 Interventions ({interventions.length})</h2><div className="space-y-3">{interventions.map(i => {const eq = equipements.find(e => e.id === i.equipementId); return (<div key={i.id} className={`p-3 rounded border-l-4 ${i.statut === 'effectue' ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-500'}`}><div className="font-bold">{i.type}</div><div className="text-sm text-gray-600">{eq?.immat} • {i.date_intervention}</div><div className="text-sm mt-2"><span className={`px-2 py-1 rounded text-xs font-bold ${i.statut === 'effectue' ? 'bg-green-200' : 'bg-yellow-200'}`}>{i.statut === 'effectue' ? '✅ Effectuée' : '⏳ En cours'}</span></div></div>);})}</div></div>
          </div>
        )}

        {ongletActif === 'maintenance' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded border"><h2 className="font-black text-xl mb-4">⚙️ Maintenance - Défauts ({defauts.length})</h2>
              {defautsCritiques.length > 0 && (
                <div className="bg-red-50 border-4 border-red-600 p-4 rounded-lg mb-4">
                  <h3 className="text-xl font-black text-red-700 mb-3">🔴 CRITIQUES ({defautsCritiques.length})</h3>
                  <div className="space-y-3">{defautsCritiques.map(d => {const eq = equipements.find(e => e.id === d.equipementId); return (<div key={d.id} className="bg-white rounded p-4 border-2 border-red-300"><div className="font-bold text-lg text-red-700">{d.type}</div><div className="text-sm text-gray-600">{eq?.immat}</div><div className="text-sm text-gray-600 mt-1">{d.description}</div><div className="text-xs text-gray-500 mt-1">Signalé par {d.operateur}</div></div>);})}</div>
                </div>
              )}
              {defautsAtention.length > 0 && (
                <div className="bg-orange-50 border-4 border-orange-500 p-4 rounded-lg mb-4">
                  <h3 className="text-xl font-black text-orange-700 mb-3">🟠 MOYENS ({defautsAtention.length})</h3>
                  <div className="space-y-3">{defautsAtention.map(d => {const eq = equipements.find(e => e.id === d.equipementId); return (<div key={d.id} className="bg-white rounded p-4 border-2 border-orange-300"><div className="font-bold text-orange-700">{d.type}</div><div className="text-sm">{eq?.immat}</div><div className="text-sm text-gray-600">{d.description}</div></div>);})}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {ongletActif === 'alertes' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 border-4 border-red-600 p-6 rounded-xl cursor-pointer hover:shadow-lg"><p className="text-xs text-red-600 font-bold">🔴 CRITIQUES</p><p className="text-5xl font-black text-red-600 mt-2">{alertesCritiques.length}</p></div>
              <div className="bg-orange-50 border-4 border-orange-500 p-6 rounded-xl cursor-pointer hover:shadow-lg"><p className="text-xs text-orange-600 font-bold">🟠 ATTENTION</p><p className="text-5xl font-black text-orange-600 mt-2">{alertesAttention.length}</p></div>
              <div className="bg-yellow-50 border-4 border-yellow-500 p-6 rounded-xl cursor-pointer hover:shadow-lg"><p className="text-xs text-yellow-600 font-bold">🟡 VIGILANCE</p><p className="text-5xl font-black text-yellow-600 mt-2">{alertesVigilance.length}</p></div>
            </div>
            <div className="bg-white p-4 rounded border">
              <h2 className="font-black text-xl mb-4">🚨 Alertes Stocks</h2>
              {alertesFiltrees.length === 0 ? (
                <div className="bg-green-50 border-4 border-green-500 p-6 rounded-lg text-center"><p className="text-2xl font-black text-green-700">✅ AUCUNE ALERTE!</p></div>
              ) : (
                <div className="space-y-3">{alertesFiltrees.map(article => (<div key={article.id} className="border-l-4 bg-gray-50 p-4 rounded"><div className="font-bold text-lg">{article.code}</div><div className="text-sm text-gray-600">{article.description}</div><div className="text-sm mt-2">{article.fournisseur} • {article.total}/{article.stockMin}</div></div>))}</div>
              )}
            </div>
          </div>
        )}

        {ongletActif === 'statistiques' && (
          <div className="bg-white p-6 rounded border">
            <h2 className="font-black text-2xl mb-4">📈 Statistiques</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded border"><p className="text-sm font-bold">Total Articles</p><p className="text-3xl font-black text-blue-600">{articles.length}</p></div>
              <div className="bg-green-50 p-4 rounded border"><p className="text-sm font-bold">Pièces Total</p><p className="text-3xl font-black text-green-600">{articles.reduce((s,a)=>s+getStockTotal(a),0)}</p></div>
              <div className="bg-purple-50 p-4 rounded border"><p className="text-sm font-bold">Équipements</p><p className="text-3xl font-black text-purple-600">{equipements.length}</p></div>
              <div className="bg-orange-50 p-4 rounded border"><p className="text-sm font-bold">Interventions</p><p className="text-3xl font-black text-orange-600">{interventions.length}</p></div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg font-bold flex items-center gap-2">
        <span className="animate-pulse">🟢</span>
        Supabase V22
      </div>
    </div>
  );
}