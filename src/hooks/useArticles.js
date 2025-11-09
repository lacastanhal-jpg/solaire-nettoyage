import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const chargerArticles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('articles')
          .select('*');

        if (error) throw error;
        if (data && data.length > 0) {
          setArticles(data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Erreur chargement articles:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    chargerArticles();
  }, []);

  const ajouterArticle = async (article) => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .insert([article])
        .select();

      if (error) throw error;
      setArticles([...articles, data[0]]);
      return data[0];
    } catch (err) {
      console.error('Erreur ajout article:', err);
      throw err;
    }
  };

  const mettreAJourArticle = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      setArticles(articles.map(a => a.id === id ? data[0] : a));
      return data[0];
    } catch (err) {
      console.error('Erreur mise à jour article:', err);
      throw err;
    }
  };

  return {
    articles,
    loading,
    error,
    ajouterArticle,
    mettreAJourArticle,
    setArticles
  };
};
