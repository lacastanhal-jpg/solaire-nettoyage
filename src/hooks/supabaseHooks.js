// ============================================================================
// HOOKS D'INTÉGRATION SUPABASE - Solaire Nettoyage
// Interventions | Défauts | Stock | Accessoires
// Version 1.0 - Intégration complète Supabase
// ============================================================================

import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DEPOTS = ['Atelier', 'Porteur 26T', 'Porteur 32T', 'Semi Remorque'];
const OPERATEURS = ['Axel', 'Jérôme', 'Sébastien', 'Joffrey', 'Fabien', 'Angelo'];
const NIVEAUX_SEVERITE = ['Faible', 'Moyen', 'Critique'];

// ============================================================================
// HOOK useInterventions - Gestion des interventions
// ============================================================================

export const useInterventions = () => {
  const [interventions, setInterventions] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);

  // Récupérer toutes les interventions
  const chargerInterventions = useCallback(async () => {
    setChargement(true);
    setErreur(null);
    try {
      const { data, error } = await supabase
        .from('interventions')
        .select('*')
        .order('date_creation', { ascending: false });

      if (error) throw error;
      setInterventions(data || []);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }, []);

  // Ajouter une intervention
  const ajouterIntervention = useCallback(async (nouvelleIntervention) => {
    try {
      const donnees = {
        ...nouvelleIntervention,
        date_creation: new Date().toISOString(),
        statut: 'En cours',
      };

      const { data, error } = await supabase
        .from('interventions')
        .insert([donnees])
        .select();

      if (error) throw error;
      setInterventions((prev) => [data[0], ...prev]);
      return data[0];
    } catch (err) {
      setErreur(err.message);
      throw err;
    }
  }, []);

  // Mettre à jour une intervention
  const mettreAJourIntervention = useCallback(async (id, modifications) => {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .update(modifications)
        .eq('id', id)
        .select();

      if (error) throw error;
      setInterventions((prev) =>
        prev.map((int) => (int.id === id ? data[0] : int))
      );
      return data[0];
    } catch (err) {
      setErreur(err.message);
      throw err;
    }
  }, []);

  // Supprimer une intervention
  const supprimerIntervention = useCallback(async (id) => {
    try {
      const { error } = await supabase
        .from('interventions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setInterventions((prev) => prev.filter((int) => int.id !== id));
    } catch (err) {
      setErreur(err.message);
      throw err;
    }
  }, []);

  // Ajouter une photo à une intervention
  const ajouterPhotoIntervention = useCallback(async (interventionId, fichierPhoto) => {
    try {
      const nomFichier = `intervention_${interventionId}_${Date.now()}.jpg`;
      const { error: erreurUpload } = await supabase.storage
        .from('interventions_photos')
        .upload(nomFichier, fichierPhoto);

      if (erreurUpload) throw erreurUpload;

      const { data } = supabase.storage
        .from('interventions_photos')
        .getPublicUrl(nomFichier);

      return data.publicUrl;
    } catch (err) {
      setErreur(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    chargerInterventions();
  }, [chargerInterventions]);

  return {
    interventions,
    chargement,
    erreur,
    chargerInterventions,
    ajouterIntervention,
    mettreAJourIntervention,
    supprimerIntervention,
    ajouterPhotoIntervention,
    operateurs: OPERATEURS,
    depots: DEPOTS,
  };
};

// ============================================================================
// HOOK useDefauts - Gestion des défauts et maintenance
// ============================================================================

export const useDefauts = () => {
  const [defauts, setDefauts] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);

  // Récupérer tous les défauts
  const chargerDefauts = useCallback(async () => {
    setChargement(true);
    setErreur(null);
    try {
      const { data, error } = await supabase
        .from('defauts')
        .select('*')
        .order('date_signalement', { ascending: false });

      if (error) throw error;
      setDefauts(data || []);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }, []);

  // Créer un nouveau défaut
  const creerDefaut = useCallback(async (nouveauDefaut) => {
    try {
      const donnees = {
        ...nouveauDefaut,
        date_signalement: new Date().toISOString(),
        statut: 'Ouvert',
      };

      const { data, error } = await supabase
        .from('defauts')
        .insert([donnees])
        .select();

      if (error) throw error;
      setDefauts((prev) => [data[0], ...prev]);
      return data[0];
    } catch (err) {
      setErreur(err.message);
      throw err;
    }
  }, []);

  // Mettre à jour un défaut
  const mettreAJourDefaut = useCallback(async (id, modifications) => {
    try {
      const { data, error } = await supabase
        .from('defauts')
        .update(modifications)
        .eq('id', id)
        .select();

      if (error) throw error;
      setDefauts((prev) =>
        prev.map((def) => (def.id === id ? data[0] : def))
      );
      return data[0];
    } catch (err) {
      setErreur(err.message);
      throw err;
    }
  }, []);

  // Archiver un défaut
  const archiverDefaut = useCallback(async (id) => {
    try {
      const { data, error } = await supabase
        .from('defauts')
        .update({ statut: 'Archivé', date_archivage: new Date().toISOString() })
        .eq('id', id)
        .select();

      if (error) throw error;
      setDefauts((prev) =>
        prev.map((def) => (def.id === id ? data[0] : def))
      );
    } catch (err) {
      setErreur(err.message);
      throw err;
    }
  }, []);

  // Ajouter une photo de défaut
  const ajouterPhotoDefaut = useCallback(async (defautId, fichierPhoto) => {
    try {
      const nomFichier = `defaut_${defautId}_${Date.now()}.jpg`;
      const { error: erreurUpload } = await supabase.storage
        .from('defauts_photos')
        .upload(nomFichier, fichierPhoto);

      if (erreurUpload) throw erreurUpload;

      const { data } = supabase.storage
        .from('defauts_photos')
        .getPublicUrl(nomFichier);

      return data.publicUrl;
    } catch (err) {
      setErreur(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    chargerDefauts();
  }, [chargerDefauts]);

  return {
    defauts,
    chargement,
    erreur,
    chargerDefauts,
    creerDefaut,
    mettreAJourDefaut,
    archiverDefaut,
    ajouterPhotoDefaut,
    niveauxSeverite: NIVEAUX_SEVERITE,
    operateurs: OPERATEURS,
  };
};

// ============================================================================
// HOOK useStock - Gestion du stock multi-dépôts
// ============================================================================

export const useStock = () => {
  const [stock, setStock] = useState({});
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);

  // Récupérer le stock complet
  const chargerStock = useCallback(async () => {
    setChargement(true);
    setErreur(null);
    try {
      const { data, error } = await supabase
        .from('stock_articles')
        .select('*');

      if (error) throw error;

      // Organiser par article et dépôt
      const stockOrganise = {};
      (data || []).forEach((ligne) => {
        if (!stockOrganise[ligne.article_id]) {
          stockOrganise[ligne.article_id] = {};
        }
        stockOrganise[ligne.article_id][ligne.depot] = {
          quantite: ligne.quantite,
          minimum: ligne.minimum,
          dernier_mouvement: ligne.dernier_mouvement,
        };
      });

      setStock(stockOrganise);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }, []);

  // Ajouter une entrée de stock
  const ajouterEntreeStock = useCallback(async (articleId, depot, quantite, motif) => {
    try {
      const donnees = {
        article_id: articleId,
        depot,
        quantite,
        type_mouvement: 'Entrée',
        motif,
        date_mouvement: new Date().toISOString(),
      };

      const { error: erreurMouvement } = await supabase
        .from('mouvements_stock')
        .insert([donnees]);

      if (erreurMouvement) throw erreurMouvement;

      // Mettre à jour le stock
      await mettreAJourStockArticle(articleId, depot, quantite, 'Entrée');
    } catch (err) {
      setErreur(err.message);
      throw err;
    }
  }, []);

  // Retirer du stock
  const retirerStock = useCallback(async (articleId, depot, quantite, motif) => {
    try {
      const donnees = {
        article_id: articleId,
        depot,
        quantite,
        type_mouvement: 'Sortie',
        motif,
        date_mouvement: new Date().toISOString(),
      };

      const { error: erreurMouvement } = await supabase
        .from('mouvements_stock')
        .insert([donnees]);

      if (erreurMouvement) throw erreurMouvement;

      await mettreAJourStockArticle(articleId, depot, -quantite, 'Sortie');
    } catch (err) {
      setErreur(err.message);
      throw err;
    }
  }, []);

  // Transférer entre dépôts
  const transfererStock = useCallback(async (articleId, depotSource, depotDestination, quantite) => {
    try {
      await retirerStock(articleId, depotSource, quantite, `Transfert vers ${depotDestination}`);
      await ajouterEntreeStock(articleId, depotDestination, quantite, `Transfert depuis ${depotSource}`);
    } catch (err) {
      setErreur(err.message);
      throw err;
    }
  }, [retirerStock, ajouterEntreeStock]);

  // Mettre à jour le stock d'un article
  const mettreAJourStockArticle = useCallback(async (articleId, depot, quantiteVariation, type) => {
    try {
      const { data: donneesCourantes, error: erreurLecture } = await supabase
        .from('stock_articles')
        .select('quantite')
        .eq('article_id', articleId)
        .eq('depot', depot)
        .single();

      if (erreurLecture) throw erreurLecture;

      const nouvelleQuantite = Math.max(0, (donneesCourantes?.quantite || 0) + quantiteVariation);

      const { error: erreurUpdate } = await supabase
        .from('stock_articles')
        .update({
          quantite: nouvelleQuantite,
          dernier_mouvement: new Date().toISOString(),
        })
        .eq('article_id', articleId)
        .eq('depot', depot);

      if (erreurUpdate) throw erreurUpdate;

      setStock((prev) => ({
        ...prev,
        [articleId]: {
          ...prev[articleId],
          [depot]: {
            ...prev[articleId]?.[depot],
            quantite: nouvelleQuantite,
            dernier_mouvement: new Date().toISOString(),
          },
        },
      }));
    } catch (err) {
      setErreur(err.message);
      throw err;
    }
  }, []);

  // Modifier le stock minimum
  const modifierStockMinimum = useCallback(async (articleId, depot, nouveauMinimum) => {
    try {
      const { error } = await supabase
        .from('stock_articles')
        .update({ minimum: nouveauMinimum })
        .eq('article_id', articleId)
        .eq('depot', depot);

      if (error) throw error;

      setStock((prev) => ({
        ...prev,
        [articleId]: {
          ...prev[articleId],
          [depot]: {
            ...prev[articleId]?.[depot],
            minimum: nouveauMinimum,
          },
        },
      }));
    } catch (err) {
      setErreur(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    chargerStock();
  }, [chargerStock]);

  return {
    stock,
    chargement,
    erreur,
    chargerStock,
    ajouterEntreeStock,
    retirerStock,
    transfererStock,
    modifierStockMinimum,
    depots: DEPOTS,
  };
};

// ============================================================================
// HOOK useAccessoires - Gestion des accessoires
// ============================================================================

export const useAccessoires = () => {
  const [accessoires, setAccessoires] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);

  // Charger tous les accessoires
  const chargerAccessoires = useCallback(async () => {
    setChargement(true);
    setErreur(null);
    try {
      const { data, error } = await supabase
        .from('accessoires')
        .select('*')
        .order('code', { ascending: true });

      if (error) throw error;
      setAccessoires(data || []);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }, []);

  // Créer un nouvel accessoire
  const creerAccessoire = useCallback(async (nouvelAccessoire) => {
    try {
      const { data, error } = await supabase
        .from('accessoires')
        .insert([nouvelAccessoire])
        .select();

      if (error) throw error;
      setAccessoires((prev) => [...prev, data[0]].sort((a, b) => a.code.localeCompare(b.code)));
      return data[0];
    } catch (err) {
      setErreur(err.message);
      throw err;
    }
  }, []);

  // Modifier un accessoire
  const modifierAccessoire = useCallback(async (id, modifications) => {
    try {
      const { data, error } = await supabase
        .from('accessoires')
        .update(modifications)
        .eq('id', id)
        .select();

      if (error) throw error;
      setAccessoires((prev) =>
        prev.map((acc) => (acc.id === id ? data[0] : acc))
      );
      return data[0];
    } catch (err) {
      setErreur(err.message);
      throw err;
    }
  }, []);

  // Supprimer un accessoire
  const supprimerAccessoire = useCallback(async (id) => {
    try {
      const { error } = await supabase
        .from('accessoires')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAccessoires((prev) => prev.filter((acc) => acc.id !== id));
    } catch (err) {
      setErreur(err.message);
      throw err;
    }
  }, []);

  // Affecter un accessoire à un équipement
  const affecterAccessoireEquipement = useCallback(async (accessoireId, equipementId) => {
    try {
      const { error } = await supabase
        .from('affectations_accessoires')
        .insert([{ accessoire_id: accessoireId, equipement_id: equipementId }]);

      if (error) throw error;
    } catch (err) {
      setErreur(err.message);
      throw err;
    }
  }, []);

  // Retirer l'affectation d'un accessoire
  const retirerAffectationAccessoire = useCallback(async (accessoireId, equipementId) => {
    try {
      const { error } = await supabase
        .from('affectations_accessoires')
        .delete()
        .eq('accessoire_id', accessoireId)
        .eq('equipement_id', equipementId);

      if (error) throw error;
    } catch (err) {
      setErreur(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    chargerAccessoires();
  }, [chargerAccessoires]);

  return {
    accessoires,
    chargement,
    erreur,
    chargerAccessoires,
    creerAccessoire,
    modifierAccessoire,
    supprimerAccessoire,
    affecterAccessoireEquipement,
    retirerAffectationAccessoire,
  };
};

// ============================================================================
// HOOK useSync - Synchronisation Supabase en temps réel
// ============================================================================

export const useSync = () => {
  const [connecte, setConnecte] = useState(false);

  useEffect(() => {
    // Écouter les changements en temps réel
    const abonnements = [];

    abonnements.push(
      supabase
        .channel('interventions_changements')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'interventions' }, () => {
          // Déclencher la mise à jour via React Query ou context
        })
        .subscribe()
    );

    abonnements.push(
      supabase
        .channel('defauts_changements')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'defauts' }, () => {
          // Déclencher la mise à jour
        })
        .subscribe()
    );

    setConnecte(true);

    return () => {
      abonnements.forEach((sub) => sub.unsubscribe());
    };
  }, []);

  return { connecte };
};

// ============================================================================
// Configuration Supabase
// Variables d'environnement requises :
// REACT_APP_SUPABASE_URL=https://votre-projet.supabase.co
// REACT_APP_SUPABASE_ANON_KEY=votre_clé_anonyme
// ============================================================================