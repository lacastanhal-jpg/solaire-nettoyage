/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback } from 'react';

const SUPABASE_URL = 'https://dxzzwxjgsifivlqqlwuz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4enp3eGpnc2lmaXZscXFsd3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MDE5NjksImV4cCI6MjA3ODI3Nzk2OX0.UFER1C0Hud0JUuBfBLRHzIj-C2UHE0_o3ES3-D8L-XE';

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
    console.error('Erreur:', err);
    return null;
  }
};

export default function SolaireNettoyageV22() {
  const [operateurConnecte, setOperateurConnecte] = useState(null);
  const [listeOperateurs, setListeOperateurs] = useState([]);
  const [afficherConnexion, setAfficherConnexion] = useState(true);
  const [ongletActif, setOngletActif] = useState('accueil');
  const [chargementEnCours, setChargementEnCours] = useState(true);

  const [articles, setArticles] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [defauts, setDefauts] = useState([]);
  const [accessoiresEquipement, setAccessoiresEquipement] = useState({});
  const [activiteLog, setActiviteLog] = useState([]);

  const [equipementSelectionne, setEquipementSelectionne] = useState(1);
  const [articleEnEdition, setArticleEnEdition] = useState(null);
  const [panierCommande, setPanierCommande] = useState([]);

  const [afficherFormulaireArticle, setAfficherFormulaireArticle] = useState(false);
  const [nouvelArticleForm, setNouvelArticleForm] = useState({ code: '', description: '', fournisseur: '', prixUnitaire: 0, stockMin: 0 });
  const [modeEditionArticle, setModeEditionArticle] = useState(false);
  const [articleFormEnEdition, setArticleFormEnEdition] = useState(null);

  const [afficherFormulaireEquipement, setAfficherFormulaireEquipement] = useState(false);
  const [nouvelEquipement, setNouvelEquipement] = useState({
    immat: '', type: '', marque: '', modele: '', annee: '', km: 0, heures: 0, carburant: '', vin: '',
    ptac: 0, poids: 0, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 0, valeurActuelle: 0,
    typeFinancement: '', coutMensuel: 0, dateDebut: new Date().toISOString().split('T')[0],
    dateFin: null, assurance: 0, dateContracteTechnique: '', notes: ''
  });
  const [modeEdition, setModeEdition] = useState(false);
  const [equipementEnEdition, setEquipementEnEdition] = useState(null);

  const [nouvelleEntreeStock, setNouvelleEntreeStock] = useState({ articleId: '', quantite: '', prixUnitaire: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
  const [nouveauMouvementSortie, setNouveauMouvementSortie] = useState({ articleId: '', quantite: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
  const [nouveauTransfert, setNouveauTransfert] = useState({ articleId: '', quantite: '', depotSource: 'Atelier', depotDestination: 'Porteur 26 T', raison: '', date: new Date().toISOString().split('T')[0] });

  const [nouvelleIntervention, setNouvelleIntervention] = useState({ equipementId: '', type: '', date: new Date().toISOString().split('T')[0], km: '', heures: '', description: '', articlesPrevu: [], depotPrelevement: 'Atelier' });
  const [nouvelArticleIntervention, setNouvelArticleIntervention] = useState({ articleId: '', quantite: '' });

  const [nouvelAccessoire, setNouvelAccessoire] = useState({ nom: '', valeur: '', description: '', dateAjout: new Date().toISOString().split('T')[0] });

  const [nouveauDefaut, setNouveauDefaut] = useState({ equipementId: '', accessoireId: '', type: 'Fuite', severite: 'moyen', description: '', localisation: '', dateConstatation: new Date().toISOString().split('T')[0], operateur: 'Axel', remarques: '', photosNoms: [] });
  const [defautSelectionne, setDefautSelectionne] = useState(null);
  const [photosSelectionnees, setPhotosSelectionnees] = useState([]);

  const [filtreAlerteSeverite, setFiltreAlerteSeverite] = useState('');
  const [filtreAlerteFournisseur, setFiltreAlerteFournisseur] = useState('');
  const [filtreAlerteDepot, setFiltreAlerteDepot] = useState('');
  const [triAlertes, setTriAlertes] = useState('severite');
  const [articleEnTransfertAlerte, setArticleEnTransfertAlerte] = useState(null);
  const [transfertRapideData, setTransfertRapideData] = useState({ depotSource: 'Atelier', depotDestination: 'Porteur 26 T', quantite: '' });

  const depots = ['Atelier', 'Porteur 26 T', 'Porteur 32 T', 'Semi Remorque'];
  const typesIntervention = ['Vidange moteur', 'Révision complète', 'Changement pneus', 'Nettoyage', 'Maintenance', 'Contrôle hydraulique', 'Réparation', 'Autre'];

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scanningRef = useRef(false);
  const jsQRRef = useRef(null);

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

  useEffect(() => {
    const chargerOperateurs = async () => {
      const data = await apiSupabase('operateurs', 'GET', null, '?select=*');
      if (data) setListeOperateurs(data);
    };
    chargerOperateurs();
  }, []);

  const chargerDonnees = useCallback(async () => {
    try {
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

      const equipData = await apiSupabase('equipements', 'GET', null, '?select=*');
      if (equipData) setEquipements(equipData);

      const accData = await apiSupabase('accessoires', 'GET', null, '?select=*');
      if (accData && equipData) {
        const acc = {};
        equipData.forEach(eq => { acc[eq.id] = accData.filter(a => a.equipement_id === eq.id); });
        setAccessoiresEquipement(acc);
      }

      const interData = await apiSupabase('interventions', 'GET', null, '?select=*');
      setInterventions(interData || []);

      const defautData = await apiSupabase('defauts', 'GET', null, '?select=*');
      setDefauts(defautData || []);

      const activiteData = await apiSupabase('activite_log', 'GET', null, '?select=*&order=created_at.desc&limit=100');
      setActiviteLog(activiteData || []);

      setChargementEnCours(false);
    } catch (err) {
      console.error('Erreur:', err);
      setChargementEnCours(false);
    }
  }, []);

  useEffect(() => {
    if (operateurConnecte && !afficherConnexion) {
      chargerDonnees();
    }
  }, [operateurConnecte, afficherConnexion, chargerDonnees]);

  const tracerActivite = async (action, detail) => {
    if (!operateurConnecte) return;
    await apiSupabase('activite_log', 'POST', {
      operateur_id: operateurConnecte.id,
      action,
      detail,
      created_at: new Date().toISOString()
    });
    const activiteData = await apiSupabase('activite_log', 'GET', null, '?select=*&order=created_at.desc&limit=100');
    setActiviteLog(activiteData || []);
  };

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

  if (afficherConnexion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-orange-600 mb-2">☀️ SOLAIRE</h1>
            <p className="text-gray-600 font-semibold">Nettoyage - V22</p>
          </div>
          <div className="space-y-3">
            <p className="text-center font-bold text-gray-700 mb-4">Sélectionner opérateur :</p>
            {listeOperateurs.map(op => (
              <button key={op.id} onClick={() => connecterOperateur(op)} className="w-full py-4 rounded-lg font-black text-lg text-white transition hover:shadow-lg" style={{ backgroundColor: op.couleur || '#FF6B35' }}>
                👤 {op.nom}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (chargementEnCours) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">☀️</div>
          <p className="font-black text-xl text-gray-800">Chargement...</p>
        </div>
      </div>
    );
  }

  const getStockTotal = (article) => depots.reduce((sum, depot) => sum + (article.stockParDepot?.[depot] || 0), 0);
  
  const creerArticle = async () => {
    if (!nouvelArticleForm.code || !nouvelArticleForm.description) { alert('Code et description requis'); return; }
    const newArticle = {
      code: nouvelArticleForm.code,
      description: nouvelArticleForm.description,
      fournisseur: nouvelArticleForm.fournisseur,
      prix_unitaire: parseFloat(nouvelArticleForm.prixUnitaire),
      stock_min: parseInt(nouvelArticleForm.stockMin)
    };
    await apiSupabase('articles', 'POST', newArticle);
    setNouvelArticleForm({ code: '', description: '', fournisseur: '', prixUnitaire: 0, stockMin: 0 });
    setAfficherFormulaireArticle(false);
    chargerDonnees();
    tracerActivite('CRÉER_ARTICLE', `Article ${nouvelArticleForm.code} créé`);
  };

  const creerEquipement = async () => {
    if (!nouvelEquipement.immat || !nouvelEquipement.type) { alert('Immat et type requis'); return; }
    const newEq = {
      immat: nouvelEquipement.immat,
      type: nouvelEquipement.type,
      marque: nouvelEquipement.marque,
      modele: nouvelEquipement.modele,
      annee: nouvelEquipement.annee ? parseInt(nouvelEquipement.annee) : null,
      km: nouvelEquipement.km ? parseInt(nouvelEquipement.km) : 0,
      heures: nouvelEquipement.heures ? parseInt(nouvelEquipement.heures) : 0,
      carburant: nouvelEquipement.carburant,
      vin: nouvelEquipement.vin,
      ptac: nouvelEquipement.ptac ? parseInt(nouvelEquipement.ptac) : 0,
      poids: nouvelEquipement.poids ? parseInt(nouvelEquipement.poids) : 0,
      proprietaire: nouvelEquipement.proprietaire,
      valeur_achat: parseFloat(nouvelEquipement.valeurAchat),
      valeur_actuelle: parseFloat(nouvelEquipement.valeurActuelle),
      type_financement: nouvelEquipement.typeFinancement,
      cout_mensuel: parseFloat(nouvelEquipement.coutMensuel),
      date_debut: nouvelEquipement.dateDebut,
      date_fin: nouvelEquipement.dateFin,
      assurance: parseFloat(nouvelEquipement.assurance),
      date_controle_technique: nouvelEquipement.dateContracteTechnique,
      notes: nouvelEquipement.notes
    };
    await apiSupabase('equipements', 'POST', newEq);
    setNouvelEquipement({ immat: '', type: '', marque: '', modele: '', annee: '', km: 0, heures: 0, carburant: '', vin: '', ptac: 0, poids: 0, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 0, valeurActuelle: 0, typeFinancement: '', coutMensuel: 0, dateDebut: new Date().toISOString().split('T')[0], dateFin: null, assurance: 0, dateContracteTechnique: '', notes: '' });
    setAfficherFormulaireEquipement(false);
    chargerDonnees();
    tracerActivite('CRÉER_ÉQUIPEMENT', `Équipement ${nouvelEquipement.immat} créé`);
  };

  const enregistrerEntreeStock = async () => {
    if (!nouvelleEntreeStock.articleId || !nouvelleEntreeStock.quantite) return;
    const quantite = parseInt(nouvelleEntreeStock.quantite);
    const article = articles.find(a => a.id === parseInt(nouvelleEntreeStock.articleId));
    if (!article) return;
    
    const newStock = (article.stockParDepot[nouvelleEntreeStock.depot] || 0) + quantite;
    await apiSupabase('stock_depot', 'PATCH', { quantite: newStock }, `?article_id=eq.${article.id}&depot=eq.${nouvelleEntreeStock.depot}`);
    
    await apiSupabase('mouvements_stock', 'POST', {
      article_id: article.id,
      type: 'entree',
      quantite,
      date_mouvement: nouvelleEntreeStock.date,
      raison: nouvelleEntreeStock.raison,
      cout_total: quantite * parseFloat(nouvelleEntreeStock.prixUnitaire),
      depot_source: nouvelleEntreeStock.depot,
      operateur_id: operateurConnecte.id
    });

    setNouvelleEntreeStock({ articleId: '', quantite: '', prixUnitaire: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
    chargerDonnees();
    tracerActivite('ENTRÉE_STOCK', `+${quantite} ${article.code} à ${nouvelleEntreeStock.depot}`);
  };

  const enregistrerSortieStock = async () => {
    if (!nouveauMouvementSortie.articleId || !nouveauMouvementSortie.quantite) return;
    const quantite = parseInt(nouveauMouvementSortie.quantite);
    const article = articles.find(a => a.id === parseInt(nouveauMouvementSortie.articleId));
    if (!article) return;
    
    const stockActuel = article.stockParDepot[nouveauMouvementSortie.depot] || 0;
    if (stockActuel < quantite) { alert('Stock insuffisant'); return; }
    
    const newStock = stockActuel - quantite;
    await apiSupabase('stock_depot', 'PATCH', { quantite: newStock }, `?article_id=eq.${article.id}&depot=eq.${nouveauMouvementSortie.depot}`);
    
    await apiSupabase('mouvements_stock', 'POST', {
      article_id: article.id,
      type: 'sortie',
      quantite,
      date_mouvement: nouveauMouvementSortie.date,
      raison: nouveauMouvementSortie.raison,
      cout_total: 0,
      depot_source: nouveauMouvementSortie.depot,
      operateur_id: operateurConnecte.id
    });

    setNouveauMouvementSortie({ articleId: '', quantite: '', raison: '', date: new Date().toISOString().split('T')[0], depot: 'Atelier' });
    chargerDonnees();
    tracerActivite('SORTIE_STOCK', `-${quantite} ${article.code} de ${nouveauMouvementSortie.depot}`);
  };

  const enregistrerTransfertStock = async () => {
    if (!nouveauTransfert.articleId || !nouveauTransfert.quantite) return;
    const quantite = parseInt(nouveauTransfert.quantite);
    const article = articles.find(a => a.id === parseInt(nouveauTransfert.articleId));
    if (!article) return;
    
    const stockSource = article.stockParDepot[nouveauTransfert.depotSource] || 0;
    if (stockSource < quantite) { alert('Stock insuffisant'); return; }
    
    await apiSupabase('stock_depot', 'PATCH', { quantite: stockSource - quantite }, `?article_id=eq.${article.id}&depot=eq.${nouveauTransfert.depotSource}`);
    
    const stockDest = article.stockParDepot[nouveauTransfert.depotDestination] || 0;
    await apiSupabase('stock_depot', 'PATCH', { quantite: stockDest + quantite }, `?article_id=eq.${article.id}&depot=eq.${nouveauTransfert.depotDestination}`);
    
    await apiSupabase('mouvements_stock', 'POST', {
      article_id: article.id,
      type: 'transfert',
      quantite,
      date_mouvement: nouveauTransfert.date,
      raison: `Transfert de ${nouveauTransfert.depotSource} vers ${nouveauTransfert.depotDestination}`,
      cost_total: 0,
      depot_source: nouveauTransfert.depotSource,
      depot_destination: nouveauTransfert.depotDestination,
      operateur_id: operateurConnecte.id
    });

    setNouveauTransfert({ articleId: '', quantite: '', depotSource: 'Atelier', depotDestination: 'Porteur 26 T', raison: '', date: new Date().toISOString().split('T')[0] });
    chargerDonnees();
    tracerActivite('TRANSFERT_STOCK', `Transfert ${quantite} ${article.code}`);
  };

  const creerIntervention = async () => {
    if (!nouvelleIntervention.equipementId || !nouvelleIntervention.type) { alert('Équipement et type requis'); return; }
    const intervention = {
      equipement_id: parseInt(nouvelleIntervention.equipementId),
      type: nouvelleIntervention.type,
      date_intervention: nouvelleIntervention.date,
      km: nouvelleIntervention.km ? parseInt(nouvelleIntervention.km) : 0,
      heures: nouvelleIntervention.heures ? parseInt(nouvelleIntervention.heures) : 0,
      description: nouvelleIntervention.description,
      statut: 'en_cours',
      cout_total: 0,
      depot_prelevement: nouvelleIntervention.depotPrelevement,
      operateur_id: operateurConnecte.id
    };
    await apiSupabase('interventions', 'POST', intervention);
    setNouvelleIntervention({ equipementId: '', type: '', date: new Date().toISOString().split('T')[0], km: '', heures: '', description: '', articlesPrevu: [], depotPrelevement: 'Atelier' });
    chargerDonnees();
    tracerActivite('CRÉER_INTERVENTION', `Intervention ${nouvelleIntervention.type} créée`);
  };

  const declareDefaut = async () => {
    if (!nouveauDefaut.equipementId || !nouveauDefaut.type || !nouveauDefaut.description) { alert('Infos requises'); return; }
    const defaut = {
      equipement_id: parseInt(nouveauDefaut.equipementId),
      accessoire_id: nouveauDefaut.accessoireId ? parseInt(nouveauDefaut.accessoireId) : null,
      type: nouveauDefaut.type,
      severite: nouveauDefaut.severite,
      description: nouveauDefaut.description,
      localisation: nouveauDefaut.localisation,
      date_constatation: nouveauDefaut.dateConstatation,
      operateur_id: operateurConnecte.id,
      remarques: nouveauDefaut.remarques,
      statut: 'a_traiter'
    };
    await apiSupabase('defauts', 'POST', defaut);
    setNouveauDefaut({ equipementId: '', accessoireId: '', type: 'Fuite', severite: 'moyen', description: '', localisation: '', dateConstatation: new Date().toISOString().split('T')[0], operateur: 'Axel', remarques: '', photosNoms: [] });
    setPhotosSelectionnees([]);
    chargerDonnees();
    tracerActivite('DÉCLARER_DÉFAUT', `Défaut ${nouveauDefaut.type} déclaré`);
  };

  const equipSelectionne = equipements.find(e => e.id === equipementSelectionne);
  const valeurStockTotal = articles.reduce((sum, a) => sum + (getStockTotal(a) * a.prix_unitaire), 0);
  const interventionsEnCours = interventions.filter(i => i.statut === 'en_cours');
  const defautsATraiter = defauts.filter(d => d.statut === 'a_traiter');
  const defautsCritiques = defautsATraiter.filter(d => d.severite === 'critique');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 sticky top-0 z-20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">☀️ SOLAIRE NETTOYAGE V22</h1>
            <p className="text-yellow-100 text-sm">Supabase • Multi-Opérateurs</p>
          </div>
          <div className="text-right">
            <div className="font-bold">👤 {operateurConnecte?.nom}</div>
            <button onClick={deconnecter} className="mt-1 bg-white text-orange-600 px-3 py-1 rounded font-bold text-sm">↪️ Déconnexion</button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-16 z-10 overflow-x-auto">
        <div className="flex">
          {['accueil', 'fiche', 'articles', 'inventaire', 'stock', 'equipements', 'interventions', 'maintenance', 'alertes', 'statistiques', 'activite'].map(tab => (
            <button key={tab} onClick={() => setOngletActif(tab)} className={`px-4 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${ongletActif === tab ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-600'}`}>
              {tab === 'accueil' && '📊 Accueil'}
              {tab === 'fiche' && '📋 Fiche'}
              {tab === 'articles' && '📦 Articles'}
              {tab === 'inventaire' && '📊 Inventaire'}
              {tab === 'stock' && '📥 Stock'}
              {tab === 'equipements' && '🚛 Équipements'}
              {tab === 'interventions' && '🔧 Interventions'}
              {tab === 'maintenance' && '⚙️ Maintenance'}
              {tab === 'alertes' && '🚨 Alertes'}
              {tab === 'statistiques' && '📈 Stats'}
              {tab === 'activite' && '📜 Activité'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {ongletActif === 'accueil' && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-4 rounded border"><div className="text-3xl font-bold text-blue-600">{articles.length}</div><div>Articles</div></div>
            <div className="bg-green-50 p-4 rounded border"><div className="text-3xl font-bold text-green-600">{articles.reduce((s,a)=>s+getStockTotal(a),0)}</div><div>Stock total</div></div>
            <div className="bg-indigo-50 p-4 rounded border"><div className="text-2xl font-bold text-indigo-600">{Math.round(valeurStockTotal)}</div><div>€ valeur</div></div>
            <div className="bg-purple-50 p-4 rounded border"><div className="text-3xl font-bold text-purple-600">{equipements.length}</div><div>Équipements</div></div>
            <div className="bg-red-50 p-4 rounded border"><div className="text-3xl font-bold text-red-600">{defautsCritiques.length}</div><div>Défauts critiques</div></div>
          </div>
        )}

        {ongletActif === 'articles' && (
          <div className="space-y-4">
            <button onClick={() => { setAfficherFormulaireArticle(!afficherFormulaireArticle); setModeEditionArticle(false); }} className="bg-purple-600 text-white px-4 py-2 rounded font-bold">
              {afficherFormulaireArticle ? '✕ Fermer' : '➕ Créer article'}
            </button>
            {afficherFormulaireArticle && (
              <div className="bg-purple-50 border-2 border-purple-300 p-4 rounded space-y-2">
                <input placeholder="Code *" value={nouvelArticleForm.code} onChange={(e) => setNouvelArticleForm({...nouvelArticleForm, code: e.target.value})} className="w-full border rounded px-2 py-1" />
                <input placeholder="Description *" value={nouvelArticleForm.description} onChange={(e) => setNouvelArticleForm({...nouvelArticleForm, description: e.target.value})} className="w-full border rounded px-2 py-1" />
                <input placeholder="Fournisseur" value={nouvelArticleForm.fournisseur} onChange={(e) => setNouvelArticleForm({...nouvelArticleForm, fournisseur: e.target.value})} className="w-full border rounded px-2 py-1" />
                <input type="number" placeholder="Prix" step="0.01" value={nouvelArticleForm.prixUnitaire} onChange={(e) => setNouvelArticleForm({...nouvelArticleForm, prixUnitaire: e.target.value})} className="w-full border rounded px-2 py-1" />
                <input type="number" placeholder="Stock min" value={nouvelArticleForm.stockMin} onChange={(e) => setNouvelArticleForm({...nouvelArticleForm, stockMin: e.target.value})} className="w-full border rounded px-2 py-1" />
                <button onClick={creerArticle} className="w-full bg-purple-600 text-white px-4 py-2 rounded font-bold">✅ Créer</button>
              </div>
            )}
            <div className="space-y-2">
              {articles.map(a => (
                <div key={a.id} className="flex justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded border">
                  <div><div className="font-bold">{a.code}</div><div className="text-sm">{a.description}</div></div>
                  <div className="text-right"><div className="font-bold">{getStockTotal(a)}</div><div className="text-sm">{a.prix_unitaire}€</div></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {ongletActif === 'stock' && (
          <div className="space-y-4">
            <div className="bg-green-50 border-2 border-green-300 p-4 rounded">
              <h3 className="font-bold mb-2">📥 Entrée</h3>
              <div className="space-y-2">
                <select value={nouvelleEntreeStock.articleId} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, articleId: e.target.value})} className="w-full border rounded px-2 py-1">
                  <option value="">Article</option>
                  {articles.map(a => <option key={a.id} value={a.id}>{a.code}</option>)}
                </select>
                <input type="number" placeholder="Quantité" value={nouvelleEntreeStock.quantite} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, quantite: e.target.value})} className="w-full border rounded px-2 py-1" />
                <input type="number" placeholder="Prix unitaire" step="0.01" value={nouvelleEntreeStock.prixUnitaire} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, prixUnitaire: e.target.value})} className="w-full border rounded px-2 py-1" />
                <input placeholder="Raison" value={nouvelleEntreeStock.raison} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, raison: e.target.value})} className="w-full border rounded px-2 py-1" />
                <select value={nouvelleEntreeStock.depot} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, depot: e.target.value})} className="w-full border rounded px-2 py-1">
                  {depots.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <button onClick={enregistrerEntreeStock} className="w-full bg-green-600 text-white px-4 py-2 rounded font-bold">Entrer</button>
              </div>
            </div>

            <div className="bg-red-50 border-2 border-red-300 p-4 rounded">
              <h3 className="font-bold mb-2">📤 Sortie</h3>
              <div className="space-y-2">
                <select value={nouveauMouvementSortie.articleId} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, articleId: e.target.value})} className="w-full border rounded px-2 py-1">
                  <option value="">Article</option>
                  {articles.map(a => <option key={a.id} value={a.id}>{a.code}</option>)}
                </select>
                <input type="number" placeholder="Quantité" value={nouveauMouvementSortie.quantite} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, quantite: e.target.value})} className="w-full border rounded px-2 py-1" />
                <input placeholder="Raison" value={nouveauMouvementSortie.raison} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, raison: e.target.value})} className="w-full border rounded px-2 py-1" />
                <select value={nouveauMouvementSortie.depot} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, depot: e.target.value})} className="w-full border rounded px-2 py-1">
                  {depots.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <button onClick={enregistrerSortieStock} className="w-full bg-red-600 text-white px-4 py-2 rounded font-bold">Sortir</button>
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded">
              <h3 className="font-bold mb-2">🔄 Transfert</h3>
              <div className="space-y-2">
                <select value={nouveauTransfert.articleId} onChange={(e) => setNouveauTransfert({...nouveauTransfert, articleId: e.target.value})} className="w-full border rounded px-2 py-1">
                  <option value="">Article</option>
                  {articles.map(a => <option key={a.id} value={a.id}>{a.code}</option>)}
                </select>
                <select value={nouveauTransfert.depotSource} onChange={(e) => setNouveauTransfert({...nouveauTransfert, depotSource: e.target.value})} className="w-full border rounded px-2 py-1">
                  {depots.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={nouveauTransfert.depotDestination} onChange={(e) => setNouveauTransfert({...nouveauTransfert, depotDestination: e.target.value})} className="w-full border rounded px-2 py-1">
                  {depots.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input type="number" placeholder="Quantité" value={nouveauTransfert.quantite} onChange={(e) => setNouveauTransfert({...nouveauTransfert, quantite: e.target.value})} className="w-full border rounded px-2 py-1" />
                <button onClick={enregistrerTransfertStock} className="w-full bg-amber-600 text-white px-4 py-2 rounded font-bold">Transférer</button>
              </div>
            </div>
          </div>
        )}

        {ongletActif === 'equipements' && (
          <div className="space-y-4">
            <button onClick={() => setAfficherFormulaireEquipement(!afficherFormulaireEquipement)} className="bg-blue-600 text-white px-4 py-2 rounded font-bold">
              {afficherFormulaireEquipement ? '✕ Fermer' : '➕ Créer équipement'}
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {equipements.map(eq => (
                <div key={eq.id} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded border-2">
                  <div className="text-xl font-bold text-orange-600">{eq.immat}</div>
                  <div className="text-sm">{eq.type}</div>
                  <div className="text-sm text-gray-600">{eq.marque} {eq.modele}</div>
                  <div className="mt-2 text-sm"><div>💰 {eq.valeur_actuelle}€</div></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {ongletActif === 'interventions' && (
          <div className="space-y-4">
            <button onClick={() => {}} className="bg-orange-600 text-white px-4 py-2 rounded font-bold">
              ➕ Créer intervention
            </button>
            <div className="space-y-2">
              {interventions.map(i => (
                <div key={i.id} className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-500">
                  <div className="font-bold">{i.type}</div>
                  <div className="text-sm">{i.date_intervention}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {ongletActif === 'maintenance' && (
          <div className="space-y-4">
            <button onClick={() => {}} className="bg-red-600 text-white px-4 py-2 rounded font-bold">
              🚨 Déclarer défaut
            </button>
            <div className="space-y-2">
              {defauts.map(d => (
                <div key={d.id} className="p-3 bg-red-50 rounded border-l-4 border-red-500">
                  <div className="font-bold">{d.type}</div>
                  <div className="text-sm">{d.description}</div>
                  <div className="text-xs">{d.severite}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {ongletActif === 'activite' && (
          <div className="space-y-2">
            {activiteLog.map(log => {
              const op = listeOperateurs.find(o => o.id === log.operateur_id);
              return (
                <div key={log.id} className="p-3 bg-gray-50 rounded border-l-4 border-orange-400">
                  <div className="font-bold">{log.action}</div>
                  <div className="text-sm">{log.detail}</div>
                  <div className="text-xs text-gray-500">👤 {op?.nom}</div>
                </div>
              );
            })}
          </div>
        )}

        {!['accueil', 'articles', 'stock', 'equipements', 'interventions', 'maintenance', 'activite'].includes(ongletActif) && (
          <div className="bg-blue-50 border-2 border-blue-300 p-6 rounded text-center">
            <p className="text-gray-600">Onglet {ongletActif} - À intégrer</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
        <span className="animate-pulse">🟢</span>
        Supabase OK
      </div>
    </div>
  );
}