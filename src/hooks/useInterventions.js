{\rtf1\ansi\ansicpg1252\cocoartf2865
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ useState, useEffect \} from 'react';\
import \{ supabase \} from '../supabaseClient';\
\
export const useInterventions = () => \{\
  const [interventions, setInterventions] = useState([]);\
  const [loading, setLoading] = useState(true);\
  const [error, setError] = useState(null);\
\
  useEffect(() => \{\
    const chargerInterventions = async () => \{\
      try \{\
        setLoading(true);\
        const \{ data, error \} = await supabase\
          .from('interventions')\
          .select(`\
            *,\
            intervention_articles (\
              *,\
              articles (*)\
            )\
          `);\
\
        if (error) throw error;\
        setInterventions(data || []);\
        setLoading(false);\
      \} catch (err) \{\
        console.error('Erreur chargement interventions:', err);\
        setError(err.message);\
        setLoading(false);\
      \}\
    \};\
\
    chargerInterventions();\
  \}, []);\
\
  const ajouterIntervention = async (intervention) => \{\
    try \{\
      const \{ data, error \} = await supabase\
        .from('interventions')\
        .insert([intervention])\
        .select();\
\
      if (error) throw error;\
      setInterventions([...interventions, data[0]]);\
      return data[0];\
    \} catch (err) \{\
      console.error('Erreur ajout intervention:', err);\
      throw err;\
    \}\
  \};\
\
  const mettreAJourIntervention = async (id, updates) => \{\
    try \{\
      const \{ data, error \} = await supabase\
        .from('interventions')\
        .update(updates)\
        .eq('id', id)\
        .select();\
\
      if (error) throw error;\
      setInterventions(interventions.map(i => i.id === id ? data[0] : i));\
      return data[0];\
    \} catch (err) \{\
      console.error('Erreur mise \'e0 jour intervention:', err);\
      throw err;\
    \}\
  \};\
\
  const ajouterArticleIntervention = async (article_intervention) => \{\
    try \{\
      const \{ data, error \} = await supabase\
        .from('intervention_articles')\
        .insert([article_intervention])\
        .select();\
\
      if (error) throw error;\
      return data[0];\
    \} catch (err) \{\
      console.error('Erreur ajout article intervention:', err);\
      throw err;\
    \}\
  \};\
\
  return \{\
    interventions,\
    loading,\
    error,\
    ajouterIntervention,\
    mettreAJourIntervention,\
    ajouterArticleIntervention,\
    setInterventions\
  \};\
\};}