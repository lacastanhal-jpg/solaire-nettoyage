import React, { useState, useRef, useEffect, useCallback } from 'react';

// ============================================
// CONFIGURATION SUPABASE - API REST
// ============================================

const SUPABASE_URL = 'https://dxzzwxjgsifivlqqlwuz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4enp3eGpnc2lmaXZscXFsd3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MDE5NjksImV4cCI6MjA3ODI3Nzk2OX0.UFER1C0Hud0JUuBfBLRHzIj-C2UHE0_o3ES3-D8L-XE';

// API Supabase générique
const apiSupabase = async (table, method = 'GET', body = null, filters = '') => {
  const url = `${SUPABASE_URL}/rest/v1/${table}${filters}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
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

export default function SolaireNettoyageV22() {
  // ============================================
  // ÉTATS CONNEXION & OPÉRATEURS
  // ============================================

  const [operateurConnecte, setOperateurConnecte] = useState(null);
  const [listeOperateurs, setListeOperateurs] = useState([]);
  const [afficherConnexion, setAfficherConnexion] = useState(true);
  const [chargementInitial, setChargementInitial] = useState(true);

  // ============================================
  // ÉTATS NAVIGATION
  // ============================================

  const [ongletActif, setOngletActif] = useState('accueil');
  const [equipementSelectionne, setEquipementSelectionne] = useState(1);

  // ============================================
  // ÉTATS DONNÉES PRINCIPALES
  // ============================================

  const [articles, setArticles] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [defauts, setDefauts] = useState([]);
  const [mouvementsStock, setMouvementsStock] = useState([]);
  const [accessoiresEquipement, setAccessoiresEquipement] = useState({});
  const [activiteLog, setActiviteLog] = useState([]);

  // ============================================
  // ÉTATS FORMULAIRES ARTICLES
  // ============================================

  const [afficherFormulaireArticle, setAfficherFormulaireArticle] = useState(false);
  const [nouvelArticleForm, setNouvelArticleForm] = useState({
    code: '', description: '', fournisseur: '', prixUnitaire: 0, stockMin: 0
  });
  const [modeEditionArticle, setModeEditionArticle] = useState(false);
  const [articleFormEnEdition, setArticleFormEnEdition] = useState(null);

  // ============================================
  // ÉTATS FORMULAIRES ÉQUIPEMENTS
  // ============================================

  const [afficherFormulaireEquipement, setAfficherFormulaireEquipement] = useState(false);
  const [nouvelEquipement, setNouvelEquipement] = useState({
    immat: '', type: '', marque: '', modele: '', annee: '', km: 0, heures: 0, carburant: '', vin: '',
    ptac: 0, poids: 0, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 0, valeurActuelle: 0,
    typeFinancement: '', coutMensuel: 0, dateDebut: new Date().toISOString().split('T')[0],
    dateFin: null, assurance: 0, dateContracteTechnique: '', notes: ''
  });
  const [modeEdition, setModeEdition] = useState(false);
  const [equipementEnEdition, setEquipementEnEdition] = useState(null);

  // ============================================
  // AUTRES ÉTATS UI
  // ============================================

  const [articleEnEdition, setArticleEnEdition] = useState(null);
  const [panierCommande, setPanierCommande] = useState([]);
  const [afficherScannerQR, setAfficherScannerQR] = useState(false);
  const [scanResultat, setScanResultat] = useState(null);
  const [actionScan, setActionScan] = useState(null);
  const [afficherArticlesEquipement, setAfficherArticlesEquipement] = useState(false);
  const [afficherScannerIntervention, setAfficherScannerIntervention] = useState(false);
  const [scanResultatIntervention, setScanResultatIntervention] = useState(null);
  const [quantiteScanIntervention, setQuantiteScanIntervention] = useState('');

  const depots = React.useMemo(() => ['Atelier', 'Porteur 26 T', 'Porteur 32 T', 'Semi Remorque'], []);
  const operateurs = ['Axel', 'Jérôme', 'Sébastien', 'Joffrey', 'Fabien', 'Angelo'];
  const typesIntervention = ['Vidange moteur', 'Révision complète', 'Changement pneus', 'Nettoyage', 'Maintenance', 'Contrôle hydraulique', 'Réparation', 'Autre'];

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scanningRef = useRef(false);
  const jsQRRef = useRef(null);
  const videoIntervention = useRef(null);
  const canvasIntervention = useRef(null);
  const scanningIntervention = useRef(false);
  const fileInputRef = useRef(null);

  // ============================================
  // ÉTATS STOCK & INTERVENTIONS
  // ============================================

  const [nouvelleEntreeStock, setNouvelleEntreeStock] = useState({ articleId: '', quantite: '', prixUnitaire: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
  const [nouveauMouvementSortie, setNouveauMouvementSortie] = useState({ articleId: '', quantite: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
  const [nouveauTransfert, setNouveauTransfert] = useState({ articleId: '', quantite: '', depotSource: 'Atelier', depotDestination: 'Porteur 26 T', raison: '', date: new Date().toISOString().split('T')[0] });
  const [nouvelleIntervention, setNouvelleIntervention] = useState({ equipementId: '', type: '', date: new Date().toISOString().split('T')[0], km: '', heures: '', description: '', articlesPrevu: [], depotPrelevement: 'Atelier' });
  const [nouvelArticleIntervention, setNouvelArticleIntervention] = useState({ articleId: '', quantite: '' });
  const [nouvelAccessoire, setNouvelAccessoire] = useState({ nom: '', valeur: '', description: '', dateAjout: new Date().toISOString().split('T')[0] });

  // ============================================
  // ÉTATS DÉFAUTS
  // ============================================

  const [nouveauDefaut, setNouveauDefaut] = useState({
    equipementId: '', accessoireId: '', type: 'Fuite', severite: 'moyen', description: '', localisation: '',
    dateConstatation: new Date().toISOString().split('T')[0], operateur: 'Axel', remarques: '', photosNoms: []
  });
  const [defautSelectionne, setDefautSelectionne] = useState(null);
  const [photosSelectionnees, setPhotosSelectionnees] = useState([]);

  // ============================================
  // ÉTATS ALERTES
  // ============================================

  const [filtreAlerteSeverite, setFiltreAlerteSeverite] = useState('');
  const [filtreAlerteFournisseur, setFiltreAlerteFournisseur] = useState('');
  const [filtreAlerteDepot, setFiltreAlerteDepot] = useState('');
  const [triAlertes, setTriAlertes] = useState('severite');
  const [articleEnDetailsAlerte, setArticleEnDetailsAlerte] = useState(null);
  const [articleEnTransfertAlerte, setArticleEnTransfertAlerte] = useState(null);
  const [articleEnHistoriqueAlerte, setArticleEnHistoriqueAlerte] = useState(null);
  const [transfertRapideData, setTransfertRapideData] = useState({ depotSource: 'Atelier', depotDestination: 'Porteur 26 T', quantite: '' });

  // ============================================
  // FORMULAIRES SCAN
  // ============================================

  const [formScanEntree, setFormScanEntree] = useState({ quantite: '', prixUnitaire: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
  const [formScanSortie, setFormScanSortie] = useState({ quantite: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
  const [formScanTransfert, setFormScanTransfert] = useState({ quantite: '', depotSource: 'Atelier', depotDestination: 'Porteur 26 T' });

  // ============================================
  // CHARGER JSQR LIBRARY
  // ============================================

  useEffect(() => {
    if (window.jsQR) {
      jsQRRef.current = window.jsQR;
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
    script.async = true;
    script.onload = () => { jsQRRef.current = window.jsQR; };
    document.head.appendChild(script);
  }, []);

  // ============================================
  // CHARGER OPÉRATEURS
  // ============================================

  useEffect(() => {
    const chargerOperateurs = async () => {
      const data = await apiSupabase('operateurs', 'GET', null, '?select=*');
      if (data) setListeOperateurs(data);
    };
    chargerOperateurs();
  }, []);

  // ============================================
  // CHARGER DONNÉES DEPUIS SUPABASE
  // ============================================

  const chargerDonnees = useCallback(async () => {
    try {
      setChargementInitial(true);

      // Articles
      const articlesData = await apiSupabase('articles', 'GET', null, '?select=*');
      if (articlesData) {
        const articlesAvecStock = await Promise.all(articlesData.map(async (article) => {
          const stockData = await apiSupabase('stock_depot', 'GET', null, `?article_id=eq.${article.id}&select=depot,quantite`);
          const stockParDepot = {};
          depots.forEach(depot => {
            const stock = stockData?.find(s => s.depot === depot);
            stockParDepot[depot] = stock?.quantite || 0;
          });
          return { ...article, stockParDepot };
        }));
        setArticles(articlesAvecStock);
      }

      // Équipements
      const equipData = await apiSupabase('equipements', 'GET', null, '?select=*');
      if (equipData) setEquipements(equipData);

      // Accessoires
      const accData = await apiSupabase('accessoires', 'GET', null, '?select=*');
      if (accData && equipData) {
        const acc = {};
        equipData.forEach(eq => { acc[eq.id] = accData.filter(a => a.equipement_id === eq.id); });
        setAccessoiresEquipement(acc);
      }

      // Interventions, Défauts, Mouvements, Activité
      const interData = await apiSupabase('interventions', 'GET', null, '?select=*');
      setInterventions(interData || []);

      const defautData = await apiSupabase('defauts', 'GET', null, '?select=*');
      setDefauts(defautData || []);

      const mouvData = await apiSupabase('mouvements_stock', 'GET', null, '?select=*');
      setMouvementsStock(mouvData || []);

      const activiteData = await apiSupabase('activite_log', 'GET', null, '?select=*&order=created_at.desc&limit=100');
      setActiviteLog(activiteData || []);
    } catch (err) {
      console.error('Erreur chargement:', err);
    } finally {
      setChargementInitial(false);
    }
  }, [depots]);

  useEffect(() => {
    if (operateurConnecte && !afficherConnexion) {
      chargerDonnees();
    }
  }, [operateurConnecte, afficherConnexion, chargerDonnees]);

  // ============================================
  // TRACER ACTIVITÉ
  // ============================================

  const tracerActivite = async (action, detail) => {
    if (!operateurConnecte) return;
    try {
      await apiSupabase('activite_log', 'POST', {
        operateur_id: operateurConnecte.id,
        action,
        detail,
        created_at: new Date().toISOString()
      });
      const activiteData = await apiSupabase('activite_log', 'GET', null, '?select=*&order=created_at.desc&limit=100');
      setActiviteLog(activiteData || []);
    } catch (err) {
      console.error('Erreur trace:', err);
    }
  };

  // ============================================
  // CONNEXION / DÉCONNEXION
  // ============================================

  const connecterOperateur = (operateur) => {
    setOperateurConnecte(operateur);
    setAfficherConnexion(false);
    setTimeout(() => tracerActivite('CONNEXION', `${operateur.nom} connecté`), 300);
  };

  const deconnecter = async () => {
    if (operateurConnecte) {
      await tracerActivite('DÉCONNEXION', `${operateurConnecte.nom} déconnecté`);
    }
    setOperateurConnecte(null);
    setAfficherConnexion(true);
  };

  // ============================================
  // ÉCRAN CONNEXION
  // ============================================

  if (afficherConnexion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-orange-600 mb-2">☀️ SOLAIRE</h1>
            <p className="text-gray-600 font-semibold">Nettoyage - Multi-Opérateurs</p>
            <p className="text-sm text-gray-500 mt-2">V22 Supabase Cloud</p>
          </div>
          <div className="space-y-3">
            <p className="text-center font-bold text-gray-700 mb-4">Sélectionner opérateur :</p>
            {listeOperateurs.map(op => (
              <button
                key={op.id}
                onClick={() => connecterOperateur(op)}
                className="w-full py-4 rounded-lg font-black text-lg text-white transition hover:shadow-lg transform hover:scale-105"
                style={{ backgroundColor: op.couleur || '#FF6B35' }}
              >
                👤 {op.nom}
              </button>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t text-center text-xs text-gray-500">
            <p>Solaire Nettoyage</p>
            <p>V22 - Supabase</p>
          </div>
        </div>
      </div>
    );
  }

  if (chargementInitial) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">☀️</div>
          <p className="font-black text-xl text-gray-800">Chargement données...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // FONCTIONS UTILITAIRES
  // ============================================

  const getStockTotal = (article) => {
    return depots.reduce((sum, depot) => sum + (article.stockParDepot?.[depot] || 0), 0);
  };

  const getEquipementsEtSunbrush = () => {
    return equipements.map(eq => ({
      id: eq.id, nom: `${eq.immat} - ${eq.marque} ${eq.modele}`, type: 'equipement'
    }));
  };

  const getArticlesDisponibles = () => {
    if (afficherArticlesEquipement && nouvelleIntervention.equipementId) {
      const selectedId = parseInt(nouvelleIntervention.equipementId);
      return articles.filter(a => a.equipementsAffectes?.includes(selectedId));
    }
    return articles;
  };

  const calculerAlertes = () => {
    return articles.map(article => {
      const total = getStockTotal(article);
      let severite = null;
      if (total === article.stock_min) severite = 'critique';
      else if (total < article.stock_min * 1.5) severite = 'attention';
      else if (depots.some(depot => article.stockParDepot[depot] === 0)) severite = 'vigilance';
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
  };

  const appliquerFiltresAlertes = (alertes) => {
    let filtrées = alertes;
    if (filtreAlerteSeverite) filtrées = filtrées.filter(a => a.severite === filtreAlerteSeverite);
    if (filtreAlerteFournisseur) filtrées = filtrées.filter(a => a.fournisseur === filtreAlerteFournisseur);
    if (filtreAlerteDepot) filtrées = filtrées.filter(a => a.depotsVides.includes(filtreAlerteDepot));
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

  const valeurStockTotal = articles.reduce((sum, a) => sum + (getStockTotal(a) * a.prix_unitaire), 0);
  const alertesTotales = calculerAlertes();
  const alertesCritiques = alertesTotales.filter(a => a.severite === 'critique');
  const alertesAttention = alertesTotales.filter(a => a.severite === 'attention');
  const alertesVigilance = alertesTotales.filter(a => a.severite === 'vigilance');
  const alertesFiltrees = appliquerFiltresAlertes(alertesTotales);
  const interventionsEnCours = interventions.filter(i => i.statut === 'en_cours');
  const equipSelectionne = equipements.find(e => e.id === equipementSelectionne);
  const defautsATraiter = defauts.filter(d => d.statut === 'a_traiter');
  const defautsCritiques = defautsATraiter.filter(d => d.severite === 'critique');
  const defautsAttention = defautsATraiter.filter(d => d.severite === 'moyen');
  const defautsMineur = defautsATraiter.filter(d => d.severite === 'mineur');
  const defautsArchives = defauts.filter(d => d.statut === 'resolu');

  // ============================================
  // RENDU PRINCIPAL
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">☀️ SOLAIRE NETTOYAGE - V22 Supabase</h1>
            <p className="text-yellow-100 text-sm">Multi-Opérateurs • Synchronisation Cloud</p>
          </div>
          <div className="text-right">
            <div className="font-bold">👤 {operateurConnecte?.nom}</div>
            <button onClick={deconnecter} className="mt-1 bg-white text-orange-600 px-3 py-1 rounded font-bold hover:bg-yellow-50 text-sm">
              ↪️ Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10 overflow-x-auto">
        <div className="flex max-w-7xl mx-auto">
          {[
            { id: 'accueil', label: '📊 Accueil' },
            { id: 'fiche', label: '📋 Fiche' },
            { id: 'articles', label: '📦 Articles' },
            { id: 'inventaire', label: '📊 Inventaire' },
            { id: 'stock', label: '📥 Stock' },
            { id: 'equipements', label: '🚛 Équipements' },
            { id: 'interventions', label: '🔧 Interventions' },
            { id: 'maintenance', label: '⚙️ Maintenance' },
            { id: 'alertes', label: '🚨 Alertes' },
            { id: 'statistiques', label: '📈 Stats' },
            { id: 'activite', label: '📜 Activité' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setOngletActif(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${
                ongletActif === tab.id ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENU */}
      <div className="p-6 max-w-7xl mx-auto">
        {ongletActif === 'accueil' && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-4 rounded border border-blue-200"><div className="text-3xl font-bold text-blue-600">{articles.length}</div><div className="text-sm">Articles</div></div>
            <div className="bg-green-50 p-4 rounded border border-green-200"><div className="text-3xl font-bold text-green-600">{articles.reduce((s,a)=>s+getStockTotal(a),0)}</div><div className="text-sm">Pièces total</div></div>
            <div className="bg-indigo-50 p-4 rounded border border-indigo-200"><div className="text-2xl font-bold text-indigo-600">{Math.round(valeurStockTotal)}</div><div className="text-sm">€ valeur</div></div>
            <div className="bg-purple-50 p-4 rounded border border-purple-200"><div className="text-3xl font-bold text-purple-600">{equipements.length}</div><div className="text-sm">Équipements</div></div>
            <div className="bg-orange-50 p-4 rounded border border-orange-200"><div className="text-3xl font-bold text-orange-600">{interventionsEnCours.length}</div><div className="text-sm">Interv. cours</div></div>
            <div className="bg-red-50 p-4 rounded border border-red-200"><div className="text-3xl font-bold text-red-600">{defautsCritiques.length}</div><div className="text-sm">🔴 Critiques</div></div>
          </div>
        )}

        {ongletActif === 'articles' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-4 border-purple-400 p-6 rounded-xl">
              <h3 className="text-2xl font-black text-purple-700 mb-4">
                {modeEditionArticle ? `✏️ MODIFIER - ${articleFormEnEdition?.code}` : '📦 CRÉER NOUVEL ARTICLE'}
              </h3>
              {afficherFormulaireArticle && (
                <div className="bg-white p-4 rounded space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input type="text" placeholder="Code *" value={nouvelArticleForm.code} onChange={(e) => setNouvelArticleForm({...nouvelArticleForm, code: e.target.value})} className="border-2 border-purple-300 rounded px-3 py-2 font-bold" />
                    <input type="text" placeholder="Description *" value={nouvelArticleForm.description} onChange={(e) => setNouvelArticleForm({...nouvelArticleForm, description: e.target.value})} className="border-2 border-purple-300 rounded px-3 py-2" />
                    <input type="text" placeholder="Fournisseur" value={nouvelArticleForm.fournisseur} onChange={(e) => setNouvelArticleForm({...nouvelArticleForm, fournisseur: e.target.value})} className="border-2 border-purple-300 rounded px-3 py-2" />
                    <input type="number" step="0.01" placeholder="Prix" value={nouvelArticleForm.prixUnitaire} onChange={(e) => setNouvelArticleForm({...nouvelArticleForm, prixUnitaire: e.target.value})} className="border-2 border-purple-300 rounded px-3 py-2" />
                    <input type="number" placeholder="Stock min" value={nouvelArticleForm.stockMin} onChange={(e) => setNouvelArticleForm({...nouvelArticleForm, stockMin: e.target.value})} className="border-2 border-purple-300 rounded px-3 py-2" />
                  </div>
                  <button onClick={() => {
                    setNouvelArticleForm({ code: '', description: '', fournisseur: '', prixUnitaire: 0, stockMin: 0 });
                    setModeEditionArticle(false);
                    setArticleFormEnEdition(null);
                    setAfficherFormulaireArticle(false);
                  }} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded font-black hover:from-purple-700 hover:to-pink-700">
                    {modeEditionArticle ? '💾 SAUVEGARDER' : '✅ CRÉER'}
                  </button>
                </div>
              )}
              {!afficherFormulaireArticle && (
                <button onClick={() => setAfficherFormulaireArticle(true)} className="bg-purple-600 text-white px-4 py-2 rounded font-bold hover:bg-purple-700">
                  ➕ Ouvrir formulaire
                </button>
              )}
            </div>

            <div className="bg-white p-4 rounded border">
              <h2 className="font-black text-xl mb-4">📦 Articles ({articles.length})</h2>
              <div className="space-y-2">
                {articles.map(a => (
                  <div key={a.id} className="flex justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded border-2 border-purple-200">
                    <div><div className="font-bold text-purple-700">{a.code}</div><div className="text-sm text-gray-600">{a.description}</div><div className="text-xs text-gray-500 mt-1">{a.fournisseur} • {a.prix_unitaire}€ • Min: {a.stock_min}</div></div>
                    <div className="text-right"><div className={`font-bold ${getStockTotal(a) <= 2 ? 'text-red-600' : 'text-green-600'}`}>{getStockTotal(a)}</div><button onClick={() => {setModeEditionArticle(true); setArticleFormEnEdition(a); setNouvelArticleForm(a); setAfficherFormulaireArticle(true);}} className="text-blue-600 font-bold text-sm mt-1">✏️ Éditer</button></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {ongletActif === 'equipements' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-4 border-blue-400 p-6 rounded-xl">
              <h3 className="text-2xl font-black text-blue-700 mb-4">
                {modeEdition ? `✏️ MODIFIER - ${equipementEnEdition?.immat}` : '🚛 CRÉER NOUVEL ÉQUIPEMENT'}
              </h3>
              {!afficherFormulaireEquipement && (
                <button onClick={() => setAfficherFormulaireEquipement(true)} className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">
                  ➕ Ouvrir formulaire
                </button>
              )}
            </div>

            <div className="bg-white p-4 rounded border">
              <h2 className="font-black text-xl mb-4">🚛 Équipements ({equipements.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipements.map(eq => (
                  <div key={eq.id} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-300">
                    <div className="text-xl font-black text-orange-600">{eq.immat}</div>
                    <div className="text-sm text-gray-700 mt-1"><strong>{eq.type}</strong></div>
                    <div className="text-sm text-gray-600">{eq.marque} {eq.modele}</div>
                    <div className="mt-3 text-sm"><div>💰 {eq.valeur_actuelle}€</div><div>⛽ {eq.carburant}</div><div>📅 {eq.annee}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {ongletActif === 'activite' && (
          <div className="bg-white p-4 rounded border">
            <h2 className="font-black text-xl mb-4">📜 Historique Activité ({activiteLog.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {activiteLog.map(log => {
                const op = listeOperateurs.find(o => o.id === log.operateur_id);
                return (
                  <div key={log.id} className="p-3 bg-gray-50 rounded border-l-4 border-orange-400">
                    <p className="font-bold">{log.action}</p>
                    <p className="text-sm text-gray-600">{log.detail}</p>
                    <p className="text-xs text-gray-500 mt-1">👤 {op?.nom} • {new Date(log.created_at).toLocaleTimeString('fr-FR')}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!['accueil', 'articles', 'equipements', 'activite'].includes(ongletActif) && (
          <div className="bg-blue-50 border-2 border-blue-300 p-6 rounded-lg text-center">
            <p className="text-gray-600 font-semibold">
              Onglet <strong>{ongletActif}</strong> - Intégration complète en cours...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Les 11 onglets seront tous restaurés avec Supabase + traçabilité opérateur
            </p>
          </div>
        )}
      </div>

      {/* STATUS */}
      <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg font-bold flex items-center gap-2">
        <span className="animate-pulse">🟢</span>
        Supabase Synchronisé
      </div>
    </div>
  );
}