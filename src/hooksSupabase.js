import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase.from('articles').select('*');
        if (error) throw error;
        setArticles(data || []);
      } catch (err) {
        console.error('Erreur articles:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();

    // ✅ REALTIME: Écouter les changements
    const subscription = supabase
      .channel('articles_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, (payload) => {
        console.log('Articles changés:', payload);
        fetchArticles();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  return { articles, setArticles, loading };
};

export const useEquipements = () => {
  const [equipements, setEquipements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipements = async () => {
      try {
        const { data, error } = await supabase.from('equipements').select('*');
        if (error) throw error;
        setEquipements(data || []);
      } catch (err) {
        console.error('Erreur équipements:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipements();

    const subscription = supabase
      .channel('equipements_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'equipements' }, () => {
        fetchEquipements();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  return { equipements, setEquipements, loading };
};

export const useStock = () => {
  const [mouvementsStock, setMouvementsStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMouvements = async () => {
      try {
        const { data, error } = await supabase.from('mouvements_stock').select('*');
        if (error) throw error;
        setMouvementsStock(data || []);
      } catch (err) {
        console.error('Erreur mouvements:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMouvements();

    const subscription = supabase
      .channel('stock_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mouvements_stock' }, () => {
        fetchMouvements();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  return { mouvementsStock, setMouvementsStock, loading };
};

export const useInterventions = () => {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const { data, error } = await supabase.from('interventions').select('*');
        if (error) throw error;
        setInterventions(data || []);
      } catch (err) {
        console.error('Erreur interventions:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterventions();

    const subscription = supabase
      .channel('interventions_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'interventions' }, () => {
        fetchInterventions();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  return { interventions, setInterventions, loading };
};

export const useDefauts = () => {
  const [defauts, setDefauts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDefauts = async () => {
      try {
        const { data, error } = await supabase.from('defauts').select('*');
        if (error) throw error;
        setDefauts(data || []);
      } catch (err) {
        console.error('Erreur défauts:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDefauts();

    const subscription = supabase
      .channel('defauts_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'defauts' }, () => {
        fetchDefauts();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  return { defauts, setDefauts, loading };
};

export const useAccessoires = () => {
  const [accessoires, setAccessoires] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessoires = async () => {
      try {
        const { data, error } = await supabase.from('accessoires').select('*');
        if (error) throw error;
        const grouped = {};
        data?.forEach(acc => {
          const eqId = acc.equipement_id;
          if (!grouped[eqId]) grouped[eqId] = [];
          grouped[eqId].push(acc);
        });
        setAccessoires(grouped);
      } catch (err) {
        console.error('Erreur accessoires:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessoires();

    const subscription = supabase
      .channel('accessoires_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'accessoires' }, () => {
        fetchAccessoires();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  return { accessoires, setAccessoires, loading };
};

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
