// ============================================================================
// supabaseOperations.js - Service CRUD complet Supabase
// Solaire Nettoyage - Toutes les opérations de base de données
// Version 2.0 - Complète
// ============================================================================

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================================
// SERVICE ARTICLES
// ============================================================================

export const ArticlesService = {
  // Récupérer tous les articles
  obtenirTous: async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('code', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Récupérer un article par ID
  obtenirParId: async (id) => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  // Récupérer un article par code
  obtenirParCode: async (code) => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('code', code)
      .single();
    if (error) throw error;
    return data;
  },

  // Créer un article
  creer: async (nouvelArticle) => {
    const { data, error } = await supabase
      .from('articles')
      .insert([
        {
          code: nouvelArticle.code,
          description: nouvelArticle.description,
          fournisseur: nouvelArticle.fournisseur || null,
          prix_unitaire: nouvelArticle.prix_unitaire || 0,
          stock_min: nouvelArticle.stock_min || 0,
        },
      ])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Modifier un article
  modifier: async (id, modifications) => {
    const { data, error } = await supabase
      .from('articles')
      .update({
        ...modifications,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Supprimer un article
  supprimer: async (id) => {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // Rechercher articles par terme
  rechercher: async (terme) => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .or(`code.ilike.%${terme}%,description.ilike.%${terme}%`);
    if (error) throw error;
    return data;
  },
};

// ============================================================================
// SERVICE STOCK ARTICLES
// ============================================================================

export const StockService = {
  // Récupérer tout le stock
  obtenirTout: async () => {
    const { data, error } = await supabase
      .from('stock_articles')
      .select(`
        *,
        article:articles(*),
        depot:depots(*)
      `)
      .order('article_id', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Récupérer le stock par dépôt
  obtenirParDepot: async (depotId) => {
    const { data, error } = await supabase
      .from('stock_articles')
      .select(`
        *,
        article:articles(*)
      `)
      .eq('depot_id', depotId)
      .order('article_id', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Récupérer le stock d'un article
  obtenirArticle: async (articleId) => {
    const { data, error } = await supabase
      .from('stock_articles')
      .select(`
        *,
        depot:depots(*)
      `)
      .eq('article_id', articleId);
    if (error) throw error;
    return data;
  },

  // Récupérer stock d'un article dans un dépôt
  obtenirParArticleEtDepot: async (articleId, depotId) => {
    const { data, error } = await supabase
      .from('stock_articles')
      .select('*')
      .eq('article_id', articleId)
      .eq('depot_id', depotId)
      .single();
    if (error) throw error;
    return data;
  },

  // Initialiser le stock pour un nouvel article
  initialiser: async (articleId, depotId, quantite = 0, minimum = 0) => {
    const { data, error } = await supabase
      .from('stock_articles')
      .insert([
        {
          article_id: articleId,
          depot_id: depotId,
          quantite,
          minimum,
          dernier_mouvement: new Date().toISOString(),
        },
      ])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Mettre à jour la quantité
  mettreAJourQuantite: async (articleId, depotId, nouvelleQuantite) => {
    const { data, error } = await supabase
      .from('stock_articles')
      .update({
        quantite: nouvelleQuantite,
        dernier_mouvement: new Date().toISOString(),
      })
      .eq('article_id', articleId)
      .eq('depot_id', depotId)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Modifier le minimum
  modifierMinimum: async (articleId, depotId, nouveauMinimum) => {
    const { data, error } = await supabase
      .from('stock_articles')
      .update({ minimum: nouveauMinimum })
      .eq('article_id', articleId)
      .eq('depot_id', depotId)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Ajouter en stock
  ajouter: async (articleId, depotId, quantite, motif) => {
    // Enregistrer le mouvement
    await MouvementsStockService.creer({
      article_id: articleId,
      depot_id: depotId,
      type_mouvement: 'Entrée',
      quantite,
      motif,
    });

    // Mettre à jour le stock
    const stockActuel = await StockService.obtenirParArticleEtDepot(articleId, depotId);
    return StockService.mettreAJourQuantite(
      articleId,
      depotId,
      stockActuel.quantite + quantite
    );
  },

  // Retirer du stock
  retirer: async (articleId, depotId, quantite, motif) => {
    // Enregistrer le mouvement
    await MouvementsStockService.creer({
      article_id: articleId,
      depot_id: depotId,
      type_mouvement: 'Sortie',
      quantite,
      motif,
    });

    // Mettre à jour le stock
    const stockActuel = await StockService.obtenirParArticleEtDepot(articleId, depotId);
    const nouvelleQuantite = Math.max(0, stockActuel.quantite - quantite);
    return StockService.mettreAJourQuantite(articleId, depotId, nouvelleQuantite);
  },

  // Transférer entre dépôts
  transferer: async (articleId, depotSource, depotDestination, quantite) => {
    await StockService.retirer(articleId, depotSource, quantite, `Transfert vers dépôt ${depotDestination}`);
    return StockService.ajouter(articleId, depotDestination, quantite, `Transfert depuis dépôt ${depotSource}`);
  },

  // Vue des alertes stock
  obtenirAlertes: async () => {
    const { data, error } = await supabase
      .from('vue_stock_article')
      .select('*')
      .neq('etat_stock', 'Normal');
    if (error) throw error;
    return data;
  },
};

// ============================================================================
// SERVICE MOUVEMENTS STOCK
// ============================================================================

export const MouvementsStockService = {
  // Récupérer tous les mouvements
  obtenirTous: async () => {
    const { data, error } = await supabase
      .from('mouvements_stock')
      .select(`
        *,
        article:articles(code, description),
        depot:depots(nom)
      `)
      .order('date_mouvement', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Créer un mouvement
  creer: async (mouvement) => {
    const { data, error } = await supabase
      .from('mouvements_stock')
      .insert([mouvement])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Historique d'un article
  historiqueArticle: async (articleId) => {
    const { data, error } = await supabase
      .from('mouvements_stock')
      .select(`
        *,
        depot:depots(nom)
      `)
      .eq('article_id', articleId)
      .order('date_mouvement', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Historique d'un dépôt
  historiqueDepot: async (depotId) => {
    const { data, error } = await supabase
      .from('mouvements_stock')
      .select(`
        *,
        article:articles(code, description)
      `)
      .eq('depot_id', depotId)
      .order('date_mouvement', { ascending: false });
    if (error) throw error;
    return data;
  },
};

// ============================================================================
// SERVICE ÉQUIPEMENTS
// ============================================================================

export const EquipementsService = {
  // Récupérer tous les équipements
  obtenirTous: async () => {
    const { data, error } = await supabase
      .from('equipements')
      .select(`
        *,
        type:types_equipements(nom),
        localisation:depots(nom)
      `)
      .order('code', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Récupérer un équipement par ID
  obtenirParId: async (id) => {
    const { data, error } = await supabase
      .from('equipements')
      .select(`
        *,
        type:types_equipements(nom),
        localisation:depots(nom)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  // Créer un équipement
  creer: async (nouvelEquipement) => {
    const { data, error } = await supabase
      .from('equipements')
      .insert([
        {
          code: nouvelEquipement.code,
          nom: nouvelEquipement.nom,
          type_equipement_id: nouvelEquipement.type_equipement_id,
          marque: nouvelEquipement.marque || null,
          modele: nouvelEquipement.modele || null,
          numero_serie: nouvelEquipement.numero_serie || null,
          date_acquisition: nouvelEquipement.date_acquisition || null,
          etat: nouvelEquipement.etat || 'Opérationnel',
          localisation_depot_id: nouvelEquipement.localisation_depot_id || null,
          description: nouvelEquipement.description || null,
        },
      ])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Modifier un équipement
  modifier: async (id, modifications) => {
    const { data, error } = await supabase
      .from('equipements')
      .update({
        ...modifications,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Supprimer un équipement
  supprimer: async (id) => {
    const { error } = await supabase
      .from('equipements')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // Récupérer par type
  obtenirParType: async (typeId) => {
    const { data, error } = await supabase
      .from('equipements')
      .select(`
        *,
        localisation:depots(nom)
      `)
      .eq('type_equipement_id', typeId);
    if (error) throw error;
    return data;
  },
};

// ============================================================================
// SERVICE TYPES ÉQUIPEMENTS
// ============================================================================

export const TypesEquipementsService = {
  // Récupérer tous les types
  obtenirTous: async () => {
    const { data, error } = await supabase
      .from('types_equipements')
      .select('*')
      .order('nom', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Créer un type
  creer: async (nom, description) => {
    const { data, error } = await supabase
      .from('types_equipements')
      .insert([{ nom, description }])
      .select();
    if (error) throw error;
    return data[0];
  },
};

// ============================================================================
// SERVICE ACCESSOIRES
// ============================================================================

export const AccessoiresService = {
  // Récupérer tous les accessoires
  obtenirTous: async () => {
    const { data, error } = await supabase
      .from('accessoires')
      .select('*')
      .order('code', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Créer un accessoire
  creer: async (nouvelAccessoire) => {
    const { data, error } = await supabase
      .from('accessoires')
      .insert([
        {
          code: nouvelAccessoire.code,
          nom: nouvelAccessoire.nom,
          description: nouvelAccessoire.description || null,
          quantite_disponible: nouvelAccessoire.quantite_disponible || 0,
        },
      ])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Modifier un accessoire
  modifier: async (id, modifications) => {
    const { data, error } = await supabase
      .from('accessoires')
      .update({
        ...modifications,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Supprimer un accessoire
  supprimer: async (id) => {
    const { error } = await supabase
      .from('accessoires')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // Affecter à un équipement
  affecterEquipement: async (accessoireId, equipementId) => {
    const { data, error } = await supabase
      .from('affectations_accessoires')
      .insert([
        {
          accessoire_id: accessoireId,
          equipement_id: equipementId,
        },
      ])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Retirer affectation
  retirerAffectation: async (accessoireId, equipementId) => {
    const { error } = await supabase
      .from('affectations_accessoires')
      .delete()
      .eq('accessoire_id', accessoireId)
      .eq('equipement_id', equipementId);
    if (error) throw error;
    return true;
  },

  // Récupérer accessoires d'un équipement
  obtenirParEquipement: async (equipementId) => {
    const { data, error } = await supabase
      .from('affectations_accessoires')
      .select('accessoire:accessoires(*)')
      .eq('equipement_id', equipementId);
    if (error) throw error;
    return data.map((a) => a.accessoire);
  },
};

// ============================================================================
// SERVICE AFFECTATIONS ARTICLES-ÉQUIPEMENTS
// ============================================================================

export const AffectationsService = {
  // Affecter un article à un équipement
  affecter: async (articleId, equipementId) => {
    const { data, error } = await supabase
      .from('affectations_articles_equipements')
      .insert([
        {
          article_id: articleId,
          equipement_id: equipementId,
        },
      ])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Retirer affectation
  retirer: async (articleId, equipementId) => {
    const { error } = await supabase
      .from('affectations_articles_equipements')
      .delete()
      .eq('article_id', articleId)
      .eq('equipement_id', equipementId);
    if (error) throw error;
    return true;
  },

  // Articles d'un équipement
  obtenirArticlesEquipement: async (equipementId) => {
    const { data, error } = await supabase
      .from('affectations_articles_equipements')
      .select('article:articles(*)')
      .eq('equipement_id', equipementId);
    if (error) throw error;
    return data.map((a) => a.article);
  },

  // Équipements d'un article
  obtenirEquipementsArticle: async (articleId) => {
    const { data, error } = await supabase
      .from('affectations_articles_equipements')
      .select('equipement:equipements(*)')
      .eq('article_id', articleId);
    if (error) throw error;
    return data.map((a) => a.equipement);
  },
};

// ============================================================================
// SERVICE OPÉRATEURS
// ============================================================================

export const OperateursService = {
  // Récupérer tous les opérateurs
  obtenirTous: async () => {
    const { data, error } = await supabase
      .from('operateurs')
      .select('*')
      .eq('actif', true)
      .order('nom', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Créer un opérateur
  creer: async (nouvelOperateur) => {
    const { data, error } = await supabase
      .from('operateurs')
      .insert([nouvelOperateur])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Modifier un opérateur
  modifier: async (id, modifications) => {
    const { data, error } = await supabase
      .from('operateurs')
      .update(modifications)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },
};

// ============================================================================
// SERVICE DÉPÔTS
// ============================================================================

export const DepotsService = {
  // Récupérer tous les dépôts
  obtenirTous: async () => {
    const { data, error } = await supabase
      .from('depots')
      .select('*')
      .order('nom', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Créer un dépôt
  creer: async (nom, description) => {
    const { data, error } = await supabase
      .from('depots')
      .insert([{ nom, description }])
      .select();
    if (error) throw error;
    return data[0];
  },
};

// ============================================================================
// SERVICE INTERVENTIONS
// ============================================================================

export const InterventionsService = {
  // Récupérer toutes les interventions
  obtenirTous: async () => {
    const { data, error } = await supabase
      .from('interventions')
      .select(`
        *,
        equipement:equipements(nom, code),
        operateur:operateurs(nom),
        depot:depots(nom)
      `)
      .order('date_intervention', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Créer une intervention
  creer: async (nouvelleIntervention) => {
    const { data, error } = await supabase
      .from('interventions')
      .insert([
        {
          code: nouvelleIntervention.code,
          description: nouvelleIntervention.description,
          equipement_id: nouvelleIntervention.equipement_id,
          operateur_id: nouvelleIntervention.operateur_id,
          depot_id: nouvelleIntervention.depot_id,
          date_intervention: nouvelleIntervention.date_intervention,
          duree_heures: nouvelleIntervention.duree_heures || null,
          statut: nouvelleIntervention.statut || 'En cours',
          notes: nouvelleIntervention.notes || null,
        },
      ])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Modifier une intervention
  modifier: async (id, modifications) => {
    const { data, error } = await supabase
      .from('interventions')
      .update({
        ...modifications,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Supprimer une intervention
  supprimer: async (id) => {
    const { error } = await supabase
      .from('interventions')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // Ajouter un article à une intervention
  ajouterArticle: async (interventionId, articleId, quantiteUtilisee) => {
    const { data, error } = await supabase
      .from('intervention_articles')
      .insert([
        {
          intervention_id: interventionId,
          article_id: articleId,
          quantite_utilisee: quantiteUtilisee,
        },
      ])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Articles d'une intervention
  obtenirArticles: async (interventionId) => {
    const { data, error } = await supabase
      .from('intervention_articles')
      .select('article:articles(*), quantite_utilisee')
      .eq('intervention_id', interventionId);
    if (error) throw error;
    return data;
  },
};

// ============================================================================
// SERVICE DÉFAUTS
// ============================================================================

export const DefautsService = {
  // Récupérer tous les défauts
  obtenirTous: async () => {
    const { data, error } = await supabase
      .from('defauts')
      .select(`
        *,
        equipement:equipements(nom, code),
        operateur:operateurs(nom),
        severite:niveaux_severite(nom)
      `)
      .order('date_signalement', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Défauts actifs
  obtenirActifs: async () => {
    const { data, error } = await supabase
      .from('vue_defauts_actifs')
      .select('*');
    if (error) throw error;
    return data;
  },

  // Créer un défaut
  creer: async (nouveauDefaut) => {
    const { data, error } = await supabase
      .from('defauts')
      .insert([
        {
          code: nouveauDefaut.code,
          description: nouveauDefaut.description,
          equipement_id: nouveauDefaut.equipement_id,
          operateur_id: nouveauDefaut.operateur_id,
          niveau_severite_id: nouveauDefaut.niveau_severite_id,
          statut: nouveauDefaut.statut || 'Ouvert',
        },
      ])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Modifier un défaut
  modifier: async (id, modifications) => {
    const { data, error } = await supabase
      .from('defauts')
      .update({
        ...modifications,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Archiver un défaut
  archiver: async (id) => {
    return DefautsService.modifier(id, {
      statut: 'Archivé',
      date_archivage: new Date().toISOString(),
    });
  },

  // Supprimer un défaut
  supprimer: async (id) => {
    const { error } = await supabase
      .from('defauts')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },
};

// ============================================================================
// SERVICE RAVITAILLEMENTS (CARBURANTS)
// ============================================================================

export const RavitaillementsService = {
  // Récupérer tous les ravitaillements
  obtenirTous: async () => {
    const { data, error } = await supabase
      .from('ravitaillements')
      .select(`
        *,
        equipement:equipements(nom, code),
        operateur:operateurs(nom),
        depot:depots(nom)
      `)
      .order('date_ravitaillement', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Créer un ravitaillement
  creer: async (nouveauRavitaillement) => {
    const { data, error } = await supabase
      .from('ravitaillements')
      .insert([
        {
          equipement_id: nouveauRavitaillement.equipement_id,
          volume_litres: nouveauRavitaillement.volume_litres,
          date_ravitaillement: nouveauRavitaillement.date_ravitaillement,
          prix_total: nouveauRavitaillement.prix_total || null,
          kilométrage_km: nouveauRavitaillement.kilométrage_km || null,
          operateur_id: nouveauRavitaillement.operateur_id || null,
          depot_id: nouveauRavitaillement.depot_id || null,
          notes: nouveauRavitaillement.notes || null,
        },
      ])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Ravitaillements d'un équipement
  obtenirParEquipement: async (equipementId) => {
    const { data, error } = await supabase
      .from('ravitaillements')
      .select('*')
      .eq('equipement_id', equipementId)
      .order('date_ravitaillement', { ascending: false });
    if (error) throw error;
    return data;
  },
};

// ============================================================================
// SERVICE CONSOMMATIONS
// ============================================================================

export const ConsommationsService = {
  // Récupérer toutes les consommations
  obtenirTous: async () => {
    const { data, error } = await supabase
      .from('consommations')
      .select('*, equipement:equipements(nom, code)')
      .order('date_debut', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Créer une consommation
  creer: async (nouvelleConsommation) => {
    const { data, error } = await supabase
      .from('consommations')
      .insert([nouvelleConsommation])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Consommations d'un équipement
  obtenirParEquipement: async (equipementId) => {
    const { data, error } = await supabase
      .from('consommations')
      .select('*')
      .eq('equipement_id', equipementId)
      .order('date_debut', { ascending: false });
    if (error) throw error;
    return data;
  },
};

// ============================================================================
// SERVICE MAINTENANCE PRÉVUE
// ============================================================================

export const MaintenancePrevueService = {
  // Récupérer tous les plans maintenance
  obtenirTous: async () => {
    const { data, error } = await supabase
      .from('maintenance_prevue')
      .select('*, equipement:equipements(nom, code)')
      .eq('actif', true)
      .order('prochaine_prevue', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Créer un plan maintenance
  creer: async (nouveauPlan) => {
    const { data, error } = await supabase
      .from('maintenance_prevue')
      .insert([
        {
          code: nouveauPlan.code,
          equipement_id: nouveauPlan.equipement_id,
          type_maintenance: nouveauPlan.type_maintenance,
          description: nouveauPlan.description,
          frequence_jours: nouveauPlan.frequence_jours || null,
          actif: true,
        },
      ])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Plans d'un équipement
  obtenirParEquipement: async (equipementId) => {
    const { data, error } = await supabase
      .from('maintenance_prevue')
      .select('*')
      .eq('equipement_id', equipementId)
      .eq('actif', true);
    if (error) throw error;
    return data;
  },

  // Marquer comme réalisée
  marquerRealisee: async (id) => {
    const maintenanceActuelle = await MaintenancePrevueService.obtenirParId(id);
    const prochaineDate = maintenanceActuelle.frequence_jours
      ? new Date(Date.now() + maintenanceActuelle.frequence_jours * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]
      : null;

    const { data, error } = await supabase
      .from('maintenance_prevue')
      .update({
        dernière_realisation: new Date().toISOString().split('T')[0],
        prochaine_prevue: prochaineDate,
      })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Récupérer par ID
  obtenirParId: async (id) => {
    const { data, error } = await supabase
      .from('maintenance_prevue')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================================================
// SERVICE NIVEAUX SÉVÉRITÉ
// ============================================================================

export const NiveauxSeveriteService = {
  // Récupérer tous les niveaux
  obtenirTous: async () => {
    const { data, error } = await supabase
      .from('niveaux_severite')
      .select('*')
      .order('niveau', { ascending: true });
    if (error) throw error;
    return data;
  },
};

// ============================================================================
// SERVICE STOCKAGE (Photos)
// ============================================================================

export const StockageService = {
  // Uploader une photo intervention
  uploaderPhotoIntervention: async (fichier, nomIntervention) => {
    const nomFichier = `${nomIntervention}_${Date.now()}.jpg`;
    const { error: erreurUpload } = await supabase.storage
      .from('interventions_photos')
      .upload(nomFichier, fichier);
    if (erreurUpload) throw erreurUpload;

    const { data } = supabase.storage
      .from('interventions_photos')
      .getPublicUrl(nomFichier);
    return data.publicUrl;
  },

  // Uploader une photo défaut
  uploaderPhotoDefaut: async (fichier, nomDefaut) => {
    const nomFichier = `${nomDefaut}_${Date.now()}.jpg`;
    const { error: erreurUpload } = await supabase.storage
      .from('defauts_photos')
      .upload(nomFichier, fichier);
    if (erreurUpload) throw erreurUpload;

    const { data } = supabase.storage
      .from('defauts_photos')
      .getPublicUrl(nomFichier);
    return data.publicUrl;
  },

  // Supprimer une photo
  supprimerPhoto: async (bucket, cheminFichier) => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([cheminFichier]);
    if (error) throw error;
    return true;
  },
};

export default {
  Articles: ArticlesService,
  Stock: StockService,
  MouvementsStock: MouvementsStockService,
  Equipements: EquipementsService,
  TypesEquipements: TypesEquipementsService,
  Accessoires: AccessoiresService,
  Affectations: AffectationsService,
  Operateurs: OperateursService,
  Depots: DepotsService,
  Interventions: InterventionsService,
  Defauts: DefautsService,
  Ravitaillements: RavitaillementsService,
  Consommations: ConsommationsService,
  MaintenancePrevue: MaintenancePrevueService,
  NiveauxSeverite: NiveauxSeveriteService,
  Stockage: StockageService,
};