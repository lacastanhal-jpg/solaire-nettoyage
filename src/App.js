import React, { useState } from 'react';
import { ChevronDown, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';

export default function SolaireNettoyageFlotte() {
  const [ongletActif, setOngletActif] = useState('accueil');
  const [equipementSelectionne, setEquipementSelectionne] = useState(1);
  
  // ===== ARTICLES =====
  const [articles, setArticles] = useState([
    { id: 1, code: 'BAC5X5', description: 'Barre pour clavette en acier 5x5', fournisseur: 'LE BON ROULEMENT', prixUnitaire: 5.05, stock: 3, stockMin: 2, equipementsAffectes: [] },
    { id: 2, code: 'BAC8X7', description: 'Barre pour clavette en acier 8x7', fournisseur: 'LE BON ROULEMENT', prixUnitaire: 9.07, stock: 3, stockMin: 2, equipementsAffectes: [] },
    { id: 3, code: '388518', description: 'Bague support pont avant', fournisseur: 'RURAL MASTER', prixUnitaire: 12.41, stock: 1, stockMin: 1, equipementsAffectes: [] },
    { id: 4, code: '605670', description: 'Washer 48.0x4.0 thrust', fournisseur: 'RURAL MASTER', prixUnitaire: 5.68, stock: 1, stockMin: 1, equipementsAffectes: [] },
    { id: 5, code: '606540', description: 'Nut M10x1.508 hex', fournisseur: 'RURAL MASTER', prixUnitaire: 2.06, stock: 1, stockMin: 1, equipementsAffectes: [] },
    { id: 6, code: '605669', description: 'Seal O ring 2.62x55.0', fournisseur: 'RURAL MASTER', prixUnitaire: 2.76, stock: 1, stockMin: 1, equipementsAffectes: [] },
    { id: 7, code: '606858', description: 'Grease nipple B M6', fournisseur: 'RURAL MASTER', prixUnitaire: 2.20, stock: 1, stockMin: 1, equipementsAffectes: [] },
    { id: 8, code: '605668', description: 'Dowel bush pillow block', fournisseur: 'RURAL MASTER', prixUnitaire: 3.59, stock: 2, stockMin: 1, equipementsAffectes: [] },
    { id: 9, code: '606739', description: 'Bolt M10x1.50x356.6P hex head', fournisseur: 'RURAL MASTER', prixUnitaire: 2.62, stock: 1, stockMin: 1, equipementsAffectes: [] },
    { id: 10, code: '388497', description: 'Support pont avant', fournisseur: 'RURAL MASTER', prixUnitaire: 53.02, stock: 1, stockMin: 1, equipementsAffectes: [] },
    { id: 11, code: '764617', description: 'Chambre à air 20x108 STI', fournisseur: 'RURAL MASTER', prixUnitaire: 44.30, stock: 3, stockMin: 2, equipementsAffectes: [] },
    { id: 12, code: 'HIFSO 8055', description: 'Filtre à huile', fournisseur: 'V6 AUTOPRO', prixUnitaire: 40.80, stock: 2, stockMin: 1, equipementsAffectes: [1] },
    { id: 13, code: 'HIFSN 916020', description: 'Filtre à gasoil séparateur d\'eau', fournisseur: 'V6 AUTOPRO', prixUnitaire: 34.12, stock: 2, stockMin: 1, equipementsAffectes: [1] },
    { id: 14, code: 'WY119802-55710', description: 'Séparateur d\'eau', fournisseur: 'CLAAS LAGARRIGUE', prixUnitaire: 15.05, stock: 1, stockMin: 1, equipementsAffectes: [6] },
    { id: 15, code: 'WY123907-55810', description: 'Filtre combustible', fournisseur: 'CLAAS LAGARRIGUE', prixUnitaire: 36.88, stock: 1, stockMin: 1, equipementsAffectes: [6] },
    { id: 16, code: 'WY129150-35170', description: 'Filtre à huile', fournisseur: 'CLAAS LAGARRIGUE', prixUnitaire: 14.17, stock: 1, stockMin: 1, equipementsAffectes: [6] },
    { id: 17, code: '44524021', description: 'Filtre TRANS (TTR/TRH 9800) PONT AV', fournisseur: 'CLAAS LAGARRIGUE', prixUnitaire: 31.65, stock: 1, stockMin: 1, equipementsAffectes: [6] },
    { id: 18, code: '44524020', description: 'Filtre HYDRAU PRESSION', fournisseur: 'CLAAS LAGARRIGUE', prixUnitaire: 62.71, stock: 1, stockMin: 1, equipementsAffectes: [6] },
    { id: 19, code: 'BF16', description: 'Huile BF16 (20L)', fournisseur: 'SARL QUIERS', prixUnitaire: 5.07, stock: 40, stockMin: 10, equipementsAffectes: [6] },
  ]);

  // ===== MOUVEMENTS DE STOCK =====
  const [mouvementsStock, setMouvementsStock] = useState([
    { id: 1, articleId: 1, type: 'entree', quantite: 3, date: '2025-09-29', raison: 'Facture 233440 - LE BON ROULEMENT', coutTotal: 15.15 },
    { id: 2, articleId: 2, type: 'entree', quantite: 3, date: '2025-09-29', raison: 'Facture 233440 - LE BON ROULEMENT', coutTotal: 27.20 },
    { id: 3, articleId: 3, type: 'entree', quantite: 1, date: '2025-10-10', raison: 'Facture 202510061701 - RURAL MASTER', coutTotal: 12.41 },
    { id: 4, articleId: 4, type: 'entree', quantite: 1, date: '2025-10-10', raison: 'Facture 202510061701 - RURAL MASTER', coutTotal: 5.68 },
    { id: 5, articleId: 5, type: 'entree', quantite: 1, date: '2025-10-10', raison: 'Facture 202510061701 - RURAL MASTER', coutTotal: 2.06 },
    { id: 6, articleId: 6, type: 'entree', quantite: 1, date: '2025-10-10', raison: 'Facture 202510061701 - RURAL MASTER', coutTotal: 2.76 },
    { id: 7, articleId: 7, type: 'entree', quantite: 1, date: '2025-10-10', raison: 'Facture 202510061701 - RURAL MASTER', coutTotal: 2.20 },
    { id: 8, articleId: 8, type: 'entree', quantite: 2, date: '2025-10-10', raison: 'Facture 202510061701 - RURAL MASTER', coutTotal: 7.18 },
    { id: 9, articleId: 9, type: 'entree', quantite: 1, date: '2025-10-10', raison: 'Facture 202510061701 - RURAL MASTER', coutTotal: 2.62 },
    { id: 10, articleId: 10, type: 'entree', quantite: 1, date: '2025-10-10', raison: 'Facture 202510061701 - RURAL MASTER', coutTotal: 53.02 },
    { id: 11, articleId: 11, type: 'entree', quantite: 3, date: '2025-10-10', raison: 'Facture 202510061701 - RURAL MASTER', coutTotal: 132.90 },
    { id: 12, articleId: 12, type: 'entree', quantite: 2, date: '2024-11-28', raison: 'Bon de livraison 10001646 - V6 AUTOPRO', coutTotal: 81.60 },
    { id: 13, articleId: 13, type: 'entree', quantite: 2, date: '2024-11-28', raison: 'Bon de livraison 10001646 - V6 AUTOPRO', coutTotal: 68.24 },
  ]);

  // ===== ÉQUIPEMENTS =====
  const [equipements, setEquipements] = useState([
    { 
      id: 1, immat: 'GT-316-FG', type: 'Camion Citerne', marque: 'IVECO', modele: 'S-WAY', annee: 2023, km: 0, heures: 0, carburant: 'Diesel', 
      vin: 'ZCFCE62RU00C519482', ptac: 26000, poids: 13190, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 0, valeurActuelle: 133500,
      typeFinancement: 'Location', coutMensuel: 2104, dateDebut: '2023-12-22', dateFin: '2029-12-22', assurance: 80.10, dateContracteTechnique: '2024-12-22',
      notes: 'Contrat de location A1M75094 001'
    },
    { 
      id: 2, immat: 'DX-780-QN', type: 'Tracteur Routier', marque: 'IVECO', modele: 'STRALIS 560', annee: 2015, km: 293992, heures: 0, carburant: 'Diesel',
      vin: 'WJMS2NWH60C329019', ptac: 26000, poids: 8518, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 45000, valeurActuelle: 42000,
      typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2020-09-18', dateFin: '', assurance: 85.00, dateContracteTechnique: '2020-10-17',
      notes: 'STRALIS 560 • Type 6x2'
    },
    { 
      id: 3, immat: 'CZ-022-DP', type: 'Semi-Remorque', marque: 'NICOLAS', modele: 'B3207C', annee: 2002, km: 0, heures: 0, carburant: 'N/A',
      vin: 'VF9B3207C02058032', ptac: 34000, poids: 12550, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 15000, valeurActuelle: 14000,
      typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2018-06-29', dateFin: '', assurance: 120.00, dateContracteTechnique: '2019-08-22',
      notes: 'Semi-Remorque NICOLAS B3207C'
    },
    { 
      id: 4, immat: 'G3-415-BW', type: 'Micro-tracteur', marque: 'FARMTRAC', modele: 'F26VHE14HMNDWF', annee: 2022, km: 0, heures: 0, carburant: 'Essence',
      vin: 'M6SH09RLANF585383', ptac: 1800, poids: 1057, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 12325.00, valeurActuelle: 12325.00,
      typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2022-08-25', dateFin: '', assurance: 0, dateContracteTechnique: '2022-08-25',
      notes: 'TRACTEUR FARMTRAC - Immatriculation 25/08/2022'
    },
    { 
      id: 5, immat: 'GM-843-SW', type: 'Micro-tracteur', marque: 'FARMTRAC', modele: 'F26VHE14HMNDWL', annee: 2023, km: 0, heures: 0, carburant: 'Essence',
      vin: 'M6SH09RLDNF610727', ptac: 1800, poids: 1057, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 12325.00, valeurActuelle: 12325.00,
      typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2023-03-16', dateFin: '', assurance: 0, dateContracteTechnique: '2023-03-16',
      notes: 'TRACTEUR FARMTRAC - Immatriculation 16/03/2023 - Facture RURAL MASTER F0614463062'
    },
    { 
      id: 6, immat: 'DZ-609-JX', type: 'Tracteur', marque: 'ANTONIO CARRARO', modele: 'ERGIT-ST2088965A2', annee: 2016, km: 0, heures: 3170, carburant: 'Agricole',
      vin: 'T20ACATA000P471', ptac: 4800, poids: 2650, proprietaire: 'SOLAIRE NETTOYAGE', valeurAchat: 42000.00, valeurActuelle: 42000.00,
      typeFinancement: 'Achat', coutMensuel: 0, dateDebut: '2025-05-27', dateFin: '', assurance: 0, dateContracteTechnique: '2025-05-27',
      notes: 'TRACTEUR ANTONIO CARRARO MACH 4 CHENILLES - Facture SAINT-MARTIN 00054696'
    },
  ]);

  // ===== ACCESSOIRES PAR ÉQUIPEMENT =====
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

  // ===== INTERVENTIONS =====
  const [interventions, setInterventions] = useState([
    { id: 1, equipementId: 3, type: 'Révision/Maintenance', date: '2023-10-31', km: 363392, heures: 0, description: 'Entretien atelier', articles: [], statut: 'effectue', coutTotal: 7635.12, coutTVA: 1527.02, coutTTC: 9162.14 }
  ]);
  
  const [planMaintenance, setPlanMaintenance] = useState([
    { id: 1, equipementId: 1, type: 'Vidange moteur', seuil: 15000, unite: 'km', prochaine: 15000 },
    { id: 2, equipementId: 1, type: 'Révision complète', seuil: 60000, unite: 'km', prochaine: 60000 },
  ]);

  // ===== ÉTATS FORMULAIRES =====
  const [nouvelleEntreeStock, setNouvelleEntreeStock] = useState({ articleId: '', quantite: '', prixUnitaire: '', raison: '', date: new Date().toISOString().split('T')[0] });
  const [nouveauMouvementSortie, setNouveauMouvementSortie] = useState({ articleId: '', quantite: '', raison: '', date: new Date().toISOString().split('T')[0] });
  const [nouvelleIntervention, setNouvelleIntervention] = useState({ equipementId: '', type: '', date: new Date().toISOString().split('T')[0], km: '', heures: '', description: '', articlesPrevu: [] });
  const [nouvelArticleIntervention, setNouvelArticleIntervention] = useState({ articleId: '', quantite: '' });
  const [nouvelAccessoire, setNouvelAccessoire] = useState({ nom: '', valeur: '', description: '', dateAjout: new Date().toISOString().split('T')[0] });
  const [articleEnEdition, setArticleEnEdition] = useState(null);
  const [articlePourCommande, setArticlePourCommande] = useState(null);
  const [panierCommande, setPanierCommande] = useState([]);
  const [afficherArticlesEquipement, setAfficherArticlesEquipement] = useState(false);
  
  const typesIntervention = ['Vidange moteur', 'Révision complète', 'Changement pneus', 'Nettoyage', 'Maintenance', 'Contrôle hydraulique', 'Réparation', 'Autre'];

  // ===== FONCTIONS STOCK =====
  const enregistrerEntreeStock = () => {
    if (nouvelleEntreeStock.articleId && nouvelleEntreeStock.quantite && nouvelleEntreeStock.prixUnitaire) {
      const quantite = parseInt(nouvelleEntreeStock.quantite);
      const coutTotal = parseFloat(nouvelleEntreeStock.prixUnitaire) * quantite;
      
      setArticles(articles.map(a => a.id === parseInt(nouvelleEntreeStock.articleId) ? { ...a, stock: a.stock + quantite } : a));
      setMouvementsStock([...mouvementsStock, {
        id: mouvementsStock.length + 1,
        articleId: parseInt(nouvelleEntreeStock.articleId),
        type: 'entree',
        quantite: quantite,
        date: nouvelleEntreeStock.date,
        raison: nouvelleEntreeStock.raison,
        coutTotal: coutTotal
      }]);
      setNouvelleEntreeStock({ articleId: '', quantite: '', prixUnitaire: '', raison: '', date: new Date().toISOString().split('T')[0] });
    }
  };

  const enregistrerSortieStock = () => {
    if (nouveauMouvementSortie.articleId && nouveauMouvementSortie.quantite) {
      const article = articles.find(a => a.id === parseInt(nouveauMouvementSortie.articleId));
      const quantite = parseInt(nouveauMouvementSortie.quantite);
      if (article.stock < quantite) { alert('Stock insuffisant!'); return; }
      
      setArticles(articles.map(a => a.id === parseInt(nouveauMouvementSortie.articleId) ? { ...a, stock: a.stock - quantite } : a));
      setMouvementsStock([...mouvementsStock, {
        id: mouvementsStock.length + 1,
        articleId: parseInt(nouveauMouvementSortie.articleId),
        type: 'sortie',
        quantite: quantite,
        date: nouveauMouvementSortie.date,
        raison: nouveauMouvementSortie.raison,
        coutTotal: 0
      }]);
      setNouveauMouvementSortie({ articleId: '', quantite: '', raison: '', date: new Date().toISOString().split('T')[0] });
    }
  };

  // ===== FONCTIONS INTERVENTIONS =====
  const ajouterArticlePrevu = () => {
    if (nouvelArticleIntervention.articleId && nouvelArticleIntervention.quantite) {
      const article = articles.find(a => a.id === parseInt(nouvelArticleIntervention.articleId));
      const quantite = parseInt(nouvelArticleIntervention.quantite);
      if (article.stock < quantite) { alert('Stock insuffisant'); return; }
      
      const nouvelArticleObj = { articleId: parseInt(nouvelArticleIntervention.articleId), quantite, prixUnitaire: article.prixUnitaire, description: article.description, code: article.code };
      setNouvelleIntervention({...nouvelleIntervention, articlesPrevu: [...nouvelleIntervention.articlesPrevu, nouvelArticleObj]});
      setNouvelArticleIntervention({ articleId: '', quantite: '' });
    }
  };

  const supprimerArticlePrevu = (index) => {
    setNouvelleIntervention({...nouvelleIntervention, articlesPrevu: nouvelleIntervention.articlesPrevu.filter((_, i) => i !== index)});
  };

  const creerIntervention = () => {
    if (!nouvelleIntervention.equipementId || !nouvelleIntervention.type) {
      alert('Veuillez sélectionner un équipement et un type');
      return;
    }

    const interventionId = interventions.length > 0 ? Math.max(...interventions.map(i => i.id)) + 1 : 1;
    const coutTotal = nouvelleIntervention.articlesPrevu.reduce((sum, art) => sum + (art.quantite * art.prixUnitaire), 0);
    
    let nouvelStock = articles;
    nouvelleIntervention.articlesPrevu.forEach(art => {
      nouvelStock = nouvelStock.map(a => a.id === art.articleId ? { ...a, stock: a.stock - art.quantite } : a);
    });
    setArticles(nouvelStock);
    
    setInterventions([...interventions, {
      id: interventionId,
      equipementId: parseInt(nouvelleIntervention.equipementId),
      type: nouvelleIntervention.type,
      date: nouvelleIntervention.date,
      km: parseInt(nouvelleIntervention.km) || 0,
      heures: parseInt(nouvelleIntervention.heures) || 0,
      description: nouvelleIntervention.description,
      articles: nouvelleIntervention.articlesPrevu,
      statut: 'en_cours',
      coutTotal: coutTotal
    }]);
    
    setNouvelleIntervention({ equipementId: '', type: '', date: new Date().toISOString().split('T')[0], km: '', heures: '', description: '', articlesPrevu: [] });
  };

  const cloturerIntervention = (interventionId) => {
    setInterventions(interventions.map(i => i.id === interventionId ? { ...i, statut: 'effectue' } : i));
  };

  // ===== FONCTIONS ACCESSOIRES =====
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

  // ===== FONCTION AFFECTATION =====
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

  // ===== FONCTION COPIER COMMANDE =====
  const genererTexteCommande = (article) => {
    const qteACommander = Math.max(0, article.stockMin - article.stock);
    const existant = panierCommande.find(item => item.articleId === article.id);
    if (existant) {
      alert('Article déjà dans le panier !');
      return;
    }
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
      
      // Si c'est le SunBrush (ID 999), afficher les articles du ANTONIO CARRARO (id 6)
      if (selectedId === 999) {
        return articles.filter(a => a.equipementsAffectes.includes(6) || a.equipementsAffectes.includes(999));
      }
      
      // Sinon c'est un équipement normal
      return articles.filter(a => a.equipementsAffectes.includes(selectedId));
    }
    return articles;
  };

  // ===== FONCTION POUR RÉCUPÉRER ÉQUIPEMENTS + ACCESSOIRES ACTIFS =====
  const getEquipementsEtSunbrush = () => {
    const liste = equipements.map(eq => ({
      id: eq.id,
      nom: `${eq.immat} - ${eq.marque} ${eq.modele}`,
      type: 'equipement'
    }));
    
    // Ajouter SEULEMENT les accessoires actifs (cochés)
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
      const articles = groupes[fournisseur];
      
      const tableRows = articles.map(item => `
        <tr>
          <td style="border: 1px solid #d97706; padding: 10px;">${item.article.code}</td>
          <td style="border: 1px solid #d97706; padding: 10px;">${item.article.description}</td>
          <td style="border: 1px solid #d97706; padding: 10px; text-align: center;">${item.qteEditable}</td>
        </tr>
      `).join('');

      const htmlTexte = `<html><body>
<h2 style="color: #1f2937; margin-bottom: 10px;">📧 Commande - ${fournisseur}</h2>
<table style="border-collapse: collapse; width: 100%; max-width: 800px; margin-bottom: 30px;">
  <thead>
    <tr style="background-color: #fed7aa;">
      <th style="border: 1px solid #d97706; padding: 10px; text-align: left; font-weight: bold;">Code</th>
      <th style="border: 1px solid #d97706; padding: 10px; text-align: left; font-weight: bold;">Description</th>
      <th style="border: 1px solid #d97706; padding: 10px; text-align: center; font-weight: bold;">Quantité</th>
    </tr>
  </thead>
  <tbody>
    ${tableRows}
  </tbody>
</table>
</body></html>`;

      const plainText = `COMMANDE - ${fournisseur}

${articles.map(item => `${item.article.code} | ${item.article.description} | ${item.qteEditable}`).join('\n')}`;

      htmlTextes.push(htmlTexte);
      plainTexts.push(plainText);
    });

    const htmlComplet = htmlTextes.join('\n');
    const plainComplet = plainTexts.join('\n\n');

    const blob = new Blob([htmlComplet], { type: 'text/html' });
    const data = [new ClipboardItem({ 'text/html': blob, 'text/plain': new Blob([plainComplet], { type: 'text/plain' }) })];
    
    navigator.clipboard.write(data).then(() => {
      alert('✓ Toutes les commandes copiées (format tableaux) !');
      setPanierCommande([]);
    }).catch(() => {
      navigator.clipboard.writeText(plainComplet);
      alert('✓ Commandes copiées (format texte) !');
      setPanierCommande([]);
    });
  };

  // ===== FONCTIONS ÉDITION STOCK MIN =====
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
  const valeurStockTotal = articles.reduce((sum, a) => sum + (a.stock * a.prixUnitaire), 0);
  const interventionsEnCours = interventions.filter(i => i.statut === 'en_cours');
  const equipSelectionne = equipements.find(e => e.id === equipementSelectionne);
  const accessoiresTotal = (accessoiresEquipement[equipementSelectionne] || []).reduce((sum, a) => sum + a.valeur, 0);
  const valeurEquipementTotal = (equipSelectionne?.valeurActuelle || 0) + accessoiresTotal;
  const articlesAffectesEquipement = articles.filter(a => a.equipementsAffectes.includes(equipementSelectionne));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4">
        <h1 className="text-2xl font-bold">☀️ SOLAIRE NETTOYAGE - Gestion Complète</h1>
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">{articles.length}</div>
                <div className="text-sm">Articles</div>
              </div>
              <div className="bg-green-50 p-4 rounded border border-green-200">
                <div className="text-3xl font-bold text-green-600">{articles.reduce((s,a)=>s+a.stock,0)}</div>
                <div className="text-sm">Pièces stock</div>
              </div>
              <div className="bg-indigo-50 p-4 rounded border border-indigo-200">
                <div className="text-2xl font-bold text-indigo-600">{valeurStockTotal.toFixed(0)}€</div>
                <div className="text-sm">Valeur stock</div>
              </div>
              <div className="bg-purple-50 p-4 rounded border border-purple-200">
                <div className="text-3xl font-bold text-purple-600">{equipements.length}</div>
                <div className="text-sm">Équipements</div>
              </div>
              <div className="bg-orange-50 p-4 rounded border border-orange-200">
                <div className="text-3xl font-bold text-orange-600">{interventionsEnCours.length}</div>
                <div className="text-sm">Interv. en cours</div>
              </div>
            </div>
          </div>
        )}

        {ongletActif === 'fiche' && equipSelectionne && (
          <div className="space-y-6">
            <div className="sticky top-20 z-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {equipements.map(eq => (
                  <button key={eq.id} onClick={() => setEquipementSelectionne(eq.id)} 
                    className={`p-4 rounded-lg font-semibold transition ${equipementSelectionne === eq.id ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' : 'bg-white text-gray-800 border-2 border-gray-200'}`}>
                    <div className="text-xl">{eq.immat}</div>
                    <div className="text-sm mt-1">{eq.marque} {eq.modele}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-yellow-400 text-white p-8 rounded-xl shadow-lg">
              <h2 className="text-5xl font-black mb-2">{equipSelectionne.immat}</h2>
              <p className="text-xl opacity-95">{equipSelectionne.marque} {equipSelectionne.modele}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500">
                <div className="text-blue-600 font-bold text-sm">VALEUR D'ACHAT</div>
                <div className="text-3xl font-black text-blue-600 mt-2">{equipSelectionne.valeurAchat}€</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500">
                <div className="text-green-600 font-bold text-sm">VALEUR ACTUELLE</div>
                <div className="text-3xl font-black text-green-700 mt-2">{equipSelectionne.valeurActuelle}€</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-indigo-500">
                <div className="text-indigo-600 font-bold text-sm">ACCESSOIRES</div>
                <div className="text-3xl font-black text-indigo-700 mt-2">{Math.round(accessoiresTotal)}€</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-orange-500">
                <div className="text-orange-600 font-bold text-sm">VALEUR TOTALE</div>
                <div className="text-3xl font-black text-orange-700 mt-2">{Math.round(valeurEquipementTotal)}€</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-black text-gray-800 mb-4 pb-3 border-b-3 border-purple-500">📦 ARTICLES AFFECTÉS</h3>
              {articlesAffectesEquipement.length === 0 ? (
                <p className="text-gray-500 italic text-center py-4">Aucun article affecté - allez dans Stock pour en affecter</p>
              ) : (
                <div className="space-y-2">
                  {articlesAffectesEquipement.map(a => (
                    <div key={a.id} className="flex justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div>
                        <div className="font-bold text-purple-700">{a.code}</div>
                        <div className="text-sm text-gray-600">{a.description}</div>
                      </div>
                      <div className="text-right font-bold">
                        <div className="text-purple-600">Stock: {a.stock}</div>
                        <div className="text-sm text-gray-600">{a.prixUnitaire}€ u.</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-black text-gray-800 mb-4 pb-3 border-b-3 border-pink-500">🎨 ACCESSOIRES</h3>
              <div className="bg-pink-50 border-2 border-pink-300 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  <input type="text" placeholder="Nom" value={nouvelAccessoire.nom} onChange={(e) => setNouvelAccessoire({...nouvelAccessoire, nom: e.target.value})} className="border-2 border-pink-300 rounded px-3 py-2 outline-none" />
                  <input type="number" step="0.01" placeholder="Valeur €" value={nouvelAccessoire.valeur} onChange={(e) => setNouvelAccessoire({...nouvelAccessoire, valeur: e.target.value})} className="border-2 border-pink-300 rounded px-3 py-2 outline-none" />
                  <input type="text" placeholder="Description" value={nouvelAccessoire.description} onChange={(e) => setNouvelAccessoire({...nouvelAccessoire, description: e.target.value})} className="border-2 border-pink-300 rounded px-3 py-2 col-span-2 outline-none" />
                  <button onClick={() => ajouterAccessoire(equipementSelectionne)} className="bg-pink-500 text-white px-4 py-2 rounded font-bold hover:bg-pink-600">Ajouter</button>
                </div>
              </div>
              {(accessoiresEquipement[equipementSelectionne] || []).length === 0 ? (
                <p className="text-gray-500 italic text-center py-4">Aucun accessoire</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(accessoiresEquipement[equipementSelectionne] || []).map(acc => (
                    <div key={acc.id} className="bg-pink-50 p-4 rounded-lg border-2 border-pink-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          <input 
                            type="checkbox" 
                            checked={acc.actif} 
                            onChange={() => {
                              setAccessoiresEquipement({
                                ...accessoiresEquipement,
                                [equipementSelectionne]: (accessoiresEquipement[equipementSelectionne] || []).map(a => 
                                  a.id === acc.id ? { ...a, actif: !a.actif } : a
                                )
                              });
                            }}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <div className="font-bold text-pink-700">{acc.nom}</div>
                        </div>
                        <div className="text-xl font-black text-green-600">{acc.valeur.toFixed(2)}€</div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{acc.description}</p>
                      <button onClick={() => supprimerAccessoire(equipementSelectionne, acc.id)} className="text-red-600 hover:text-red-900 font-bold text-sm">Supprimer</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {ongletActif === 'articles' && (
          <div className="bg-white p-4 rounded border">
            <h2 className="font-bold mb-3">Articles en stock ({articles.length})</h2>
            <div className="space-y-2">
              {articles.map(a => (
                <div key={a.id} className="flex justify-between p-2 bg-gray-50 rounded">
                  <div><strong>{a.code}</strong> - {a.description}</div>
                  <div className="text-right"><span className={`font-bold ${a.stock <= 2 ? 'text-red-600' : 'text-green-600'}`}>{a.stock}</span> × {a.prixUnitaire}€</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {ongletActif === 'inventaire' && (
          <div className="space-y-4">
            {articleEnEdition && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
                  <h3 className="text-lg font-black text-gray-800 mb-4">✏️ Modifier Stock Minimum</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Code</label>
                      <input type="text" value={articleEnEdition.code} disabled className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                      <input type="text" value={articleEnEdition.description} disabled className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Fournisseur</label>
                      <input type="text" value={articleEnEdition.fournisseur} disabled className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Stock actuel</label>
                      <input type="text" value={articleEnEdition.stock} disabled className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600" />
                    </div>
                    <div className="border-t pt-3">
                      <label className="block text-sm font-bold text-orange-600 mb-1">Stock Minimum *</label>
                      <input type="number" min="0" value={articleEnEdition.stockMinTemp} onChange={(e) => setArticleEnEdition({...articleEnEdition, stockMinTemp: e.target.value})} className="w-full border-2 border-orange-300 rounded px-3 py-2 focus:border-orange-500 outline-none text-lg font-bold" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <button onClick={sauvegarderStockMin} className="flex-1 bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">✓ Sauvegarder</button>
                    <button onClick={annulerEditionStockMin} className="flex-1 bg-gray-400 text-white px-4 py-2 rounded font-bold hover:bg-gray-500">✕ Annuler</button>
                  </div>
                </div>
              </div>
            )}

            {panierCommande.length > 0 && (
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-black mb-4">🛒 Panier de Commande ({panierCommande.length} article{panierCommande.length > 1 ? 's' : ''})</h3>
                <div className="space-y-3 mb-4">
                  {Object.entries(regrouperParFournisseur()).map(([fournisseur, items]) => (
                    <div key={fournisseur} className="bg-white bg-opacity-95 text-gray-800 rounded-lg p-4">
                      <h4 className="font-black text-lg text-blue-600 mb-2">📦 {fournisseur}</h4>
                      <div className="space-y-2">
                        {items.map(item => (
                          <div key={item.articleId} className="flex justify-between items-center bg-blue-50 p-3 rounded border border-blue-200">
                            <div className="flex-1">
                              <div className="font-bold text-blue-700">{item.article.code}</div>
                              <div className="text-sm text-gray-600">{item.article.description}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <input type="number" min="0" value={item.qteEditable} onChange={(e) => mettreAJourQte(item.articleId, e.target.value)} className="w-16 border-2 border-blue-300 rounded px-2 py-1 font-bold text-center" />
                              <div className="text-right min-w-24">
                                <div className="font-bold text-blue-600">{item.article.prixUnitaire}€</div>
                                <div className="text-sm text-green-600 font-bold">{(item.qteEditable * item.article.prixUnitaire).toFixed(2)}€</div>
                              </div>
                              <button onClick={() => supprimerDuPanier(item.articleId)} className="bg-red-500 text-white px-3 py-1 rounded font-bold hover:bg-red-600 text-sm">✕</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={copierToutCommandes} className="flex-1 bg-green-500 text-white px-6 py-3 rounded font-black text-lg hover:bg-green-600">✓ Copier Tout</button>
                  <button onClick={() => setPanierCommande([])} className="flex-1 bg-red-500 text-white px-6 py-3 rounded font-black text-lg hover:bg-red-600">🗑️ Vider Panier</button>
                </div>
              </div>
            )}

            <div className="bg-white p-4 rounded border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-orange-50">
                    <th className="px-2 py-2 text-left">Code</th>
                    <th className="px-2 py-2 text-left">Description</th>
                    <th className="px-2 py-2 text-right">Prix</th>
                    <th className="px-2 py-2 text-center">Stock</th>
                    <th className="px-2 py-2 text-center">Min</th>
                    <th className="px-2 py-2 text-right">Valeur</th>
                    <th className="px-2 py-2 text-center">Statut</th>
                    <th className="px-2 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(a => {
                    const enAlerte = a.stock < a.stockMin;
                    return (
                      <tr key={a.id} className={`border-b ${enAlerte ? 'bg-red-50' : ''}`}>
                        <td className="px-2 py-2 font-semibold text-orange-600">{a.code}</td>
                        <td className="px-2 py-2">{a.description}</td>
                        <td className="px-2 py-2 text-right">{a.prixUnitaire}€</td>
                        <td className={`px-2 py-2 text-center font-bold ${a.stock < a.stockMin ? 'text-red-600' : 'text-green-600'}`}>{a.stock}</td>
                        <td className="px-2 py-2 text-center font-semibold">
                          <button onClick={() => ouvrirEditionStockMin(a)} className="text-blue-600 hover:text-blue-900 font-bold cursor-pointer underline">{a.stockMin}</button>
                        </td>
                        <td className="px-2 py-2 text-right font-bold">{(a.stock * a.prixUnitaire).toFixed(2)}€</td>
                        <td className="px-2 py-2 text-center">
                          {enAlerte ? (
                            <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs font-bold">⚠️ ALERTE</span>
                          ) : (
                            <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-bold">✓ OK</span>
                          )}
                        </td>
                        <td className="px-2 py-2 text-center">
                          <button onClick={() => genererTexteCommande(a)} className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold hover:bg-blue-700 w-full">
                            📧 Commander
                          </button>
                        </td>
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
            <div className="bg-green-50 border-2 border-green-300 p-4 rounded">
              <h3 className="font-bold mb-3">📥 Entrée de stock</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                <select value={nouvelleEntreeStock.articleId} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, articleId: e.target.value})} className="border rounded px-2 py-1">
                  <option value="">Article</option>
                  {articles.map(a => <option key={a.id} value={a.id}>{a.code} - {a.description}</option>)}
                </select>
                <input type="number" placeholder="Qté" value={nouvelleEntreeStock.quantite} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, quantite: e.target.value})} className="border rounded px-2 py-1" />
                <input type="number" step="0.01" placeholder="Prix" value={nouvelleEntreeStock.prixUnitaire} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, prixUnitaire: e.target.value})} className="border rounded px-2 py-1" />
                <input placeholder="Raison" value={nouvelleEntreeStock.raison} onChange={(e) => setNouvelleEntreeStock({...nouvelleEntreeStock, raison: e.target.value})} className="border rounded px-2 py-1" />
                <button onClick={enregistrerEntreeStock} className="bg-green-600 text-white px-3 py-1 rounded font-bold hover:bg-green-700">Entrer</button>
              </div>
            </div>

            <div className="bg-red-50 border-2 border-red-300 p-4 rounded">
              <h3 className="font-bold mb-3">📤 Sortie de stock</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                <select value={nouveauMouvementSortie.articleId} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, articleId: e.target.value})} className="border rounded px-2 py-1">
                  <option value="">Article</option>
                  {articles.map(a => <option key={a.id} value={a.id}>{a.code} - {a.description}</option>)}
                </select>
                <input type="number" placeholder="Qté" value={nouveauMouvementSortie.quantite} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, quantite: e.target.value})} className="border rounded px-2 py-1" />
                <input placeholder="Raison" value={nouveauMouvementSortie.raison} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, raison: e.target.value})} className="border rounded px-2 py-1" />
                <input type="date" value={nouveauMouvementSortie.date} onChange={(e) => setNouveauMouvementSortie({...nouveauMouvementSortie, date: e.target.value})} className="border rounded px-2 py-1" />
                <button onClick={enregistrerSortieStock} className="bg-red-600 text-white px-3 py-1 rounded font-bold hover:bg-red-700">Sortir</button>
              </div>
            </div>

            <div className="bg-white p-4 rounded border">
              <h3 className="font-bold text-lg mb-3">🎯 Affecter articles aux équipements</h3>
              <div className="space-y-2">
                {articles.map(a => {
                  const equipAffectes = equipements.filter(e => a.equipementsAffectes.includes(e.id));
                  const accessoiresActifsAffectes = Object.entries(accessoiresEquipement).flatMap(([eqId, accs]) => 
                    accs.filter(acc => acc.actif && a.equipementsAffectes.includes(999)).map(acc => acc.nom)
                  );
                  const isAffecte = a.equipementsAffectes.length > 0;
                  
                  return (
                    <div key={a.id} className={`flex justify-between items-center p-3 rounded border-2 ${isAffecte ? 'bg-blue-100 border-blue-400' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex-1">
                        <div className="font-semibold">{a.code} - {a.description}</div>
                        <div className="text-xs text-gray-600">Stock: {a.stock} × {isAffecte ? `✓ Affecté à: ${[...equipAffectes.map(e => e.immat), ...accessoiresActifsAffectes].join(', ')}` : 'Non affecté'}</div>
                      </div>
                      <div className="flex gap-1 ml-2 flex-wrap">
                        {equipements.map(e => (
                          <button key={e.id} onClick={() => affecterArticleEquipement(a.id, e.id)} 
                            className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap transition ${a.equipementsAffectes.includes(e.id) ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                            {e.immat}
                          </button>
                        ))}
                        {Object.entries(accessoiresEquipement).map(([eqId, accs]) => 
                          accs.filter(acc => acc.actif).map(acc => (
                            <button key={`acc_${acc.id}`} onClick={() => affecterArticleEquipement(a.id, 999)} 
                              className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap transition ${a.equipementsAffectes.includes(999) ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                              {acc.nom.substring(0, 15)}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {ongletActif === 'equipements' && (
          <div className="bg-white p-4 rounded border">
            <h3 className="font-bold mb-3">Équipements ({equipements.length})</h3>
            {equipements.map(eq => (
              <div key={eq.id} className="p-3 bg-gray-50 rounded mb-2 cursor-pointer hover:bg-orange-50 transition" onClick={() => { setOngletActif('fiche'); setEquipementSelectionne(eq.id); }}>
                <div className="font-semibold text-orange-600">{eq.immat} - {eq.type}</div>
                <div className="text-sm text-gray-600">{eq.marque} {eq.modele} ({eq.annee})</div>
              </div>
            ))}
          </div>
        )}

        {ongletActif === 'interventions' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded border">
              <h3 className="font-bold text-lg mb-3">🔧 Créer intervention</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                <select value={nouvelleIntervention.equipementId} onChange={(e) => setNouvelleIntervention({...nouvelleIntervention, equipementId: e.target.value})} className="border-2 rounded px-2 py-2">
                  <option value="">Équipement ou Accessoire *</option>
                  {getEquipementsEtSunbrush().map(item => <option key={item.id} value={item.id}>{item.nom}</option>)}
                </select>
                <select value={nouvelleIntervention.type} onChange={(e) => setNouvelleIntervention({...nouvelleIntervention, type: e.target.value})} className="border-2 rounded px-2 py-2">
                  <option value="">Type *</option>
                  {typesIntervention.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input type="date" value={nouvelleIntervention.date} onChange={(e) => setNouvelleIntervention({...nouvelleIntervention, date: e.target.value})} className="border-2 rounded px-2 py-2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                <input type="number" placeholder="KM" value={nouvelleIntervention.km} onChange={(e) => setNouvelleIntervention({...nouvelleIntervention, km: e.target.value})} className="border-2 rounded px-2 py-2" />
                <input type="number" placeholder="Heures" value={nouvelleIntervention.heures} onChange={(e) => setNouvelleIntervention({...nouvelleIntervention, heures: e.target.value})} className="border-2 rounded px-2 py-2" />
                <input type="text" placeholder="Description" value={nouvelleIntervention.description} onChange={(e) => setNouvelleIntervention({...nouvelleIntervention, description: e.target.value})} className="border-2 rounded px-2 py-2" />
              </div>
              <div className="bg-blue-50 border-2 border-blue-300 p-3 rounded mb-3">
                <h4 className="font-semibold text-sm mb-2">📦 Articles</h4>
                <div className="mb-2">
                  <button onClick={() => setAfficherArticlesEquipement(!afficherArticlesEquipement)} className={`px-3 py-1 rounded text-xs font-bold mb-2 ${afficherArticlesEquipement ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}>
                    {afficherArticlesEquipement ? '🎯 Articles de l\'équipement' : '📋 Tous les articles'}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                  <select value={nouvelArticleIntervention.articleId} onChange={(e) => setNouvelArticleIntervention({...nouvelArticleIntervention, articleId: e.target.value})} className="border-2 rounded px-2 py-2 text-sm">
                    <option value="">Sélectionner article</option>
                    {getArticlesDisponibles().map(a => <option key={a.id} value={a.id}>{a.code} - {a.description} (Stock: {a.stock})</option>)}
                  </select>
                  <input type="number" min="1" placeholder="Quantité" value={nouvelArticleIntervention.quantite} onChange={(e) => setNouvelArticleIntervention({...nouvelArticleIntervention, quantite: e.target.value})} className="border-2 rounded px-2 py-2 text-sm" />
                  <button onClick={ajouterArticlePrevu} className="bg-blue-600 text-white px-3 py-2 rounded text-sm font-bold col-span-2">+ Ajouter article</button>
                </div>
                {nouvelleIntervention.articlesPrevu.length > 0 && (
                  <div className="bg-white rounded p-2 mb-2 space-y-1 border border-blue-200">
                    {nouvelleIntervention.articlesPrevu.map((art, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded">
                        <div><strong>{art.code}</strong> - {art.quantite}x @ {art.prixUnitaire.toFixed(2)}€</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={creerIntervention} className="w-full bg-orange-500 text-white px-4 py-3 rounded font-bold text-lg hover:bg-orange-600">✓ CRÉER INTERVENTION</button>
            </div>

            {interventionsEnCours.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-2">En cours ({interventionsEnCours.length})</h3>
                {interventionsEnCours.map(i => {
                  const eq = equipements.find(e => e.id === i.equipementId);
                  return (
                    <div key={i.id} className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded mb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg">{i.type}</h4>
                          <p className="text-sm text-gray-600">{eq?.immat} - {i.date}</p>
                        </div>
                        <button onClick={() => cloturerIntervention(i.id)} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold">Terminer</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {interventions.filter(i => i.statut === 'effectue').length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-2">Effectuées</h3>
                {interventions.filter(i => i.statut === 'effectue').map(i => {
                  const eq = equipements.find(e => e.id === i.equipementId);
                  return (
                    <div key={i.id} className="p-4 bg-green-50 rounded mb-3 border border-green-300">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-lg">{i.type}</div>
                          <p className="text-sm text-gray-700"><strong>{eq?.immat}</strong> • {i.date}</p>
                        </div>
                        <div className="text-2xl font-black text-green-600">{(i.coutTotal || 0).toFixed(2)}€</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {ongletActif === 'maintenance' && (
          <div className="bg-white p-4 rounded border">
            <h3 className="font-bold mb-3">Plan de maintenance</h3>
            {planMaintenance.map(pm => {
              const eq = equipements.find(e => e.id === pm.equipementId);
              return (
                <div key={pm.id} className="p-3 bg-gray-50 rounded mb-2">
                  <div className="font-semibold">{eq?.immat} - {pm.type}</div>
                  <div className="text-xs text-gray-600">Seuil: {pm.prochaine} {pm.unite}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
