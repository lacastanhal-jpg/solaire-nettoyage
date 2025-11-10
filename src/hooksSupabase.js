{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // src/hooksSupabase.js\
// \uc0\u9989  HOOKS SUPABASE - Tous les modules\
\
import \{ useState, useEffect \} from 'react';\
import \{ supabase \} from './supabaseClient';\
\
// \uc0\u55357 \u56550  ARTICLES\
export const useArticles = () => \{\
  const [articles, setArticles] = useState([]);\
  const [loading, setLoading] = useState(true);\
\
  useEffect(() => \{\
    const fetchArticles = async () => \{\
      try \{\
        const \{ data, error \} = await supabase\
          .from('articles')\
          .select('*');\
        \
        if (error) throw error;\
        setArticles(data || []);\
      \} catch (err) \{\
        console.error('Erreur articles:', err.message);\
        setArticles([]);\
      \} finally \{\
        setLoading(false);\
      \}\
    \};\
\
    fetchArticles();\
  \}, []);\
\
  return \{ articles, setArticles, loading \};\
\};\
\
// \uc0\u55357 \u56987  \'c9QUIPEMENTS\
export const useEquipements = () => \{\
  const [equipements, setEquipements] = useState([]);\
  const [loading, setLoading] = useState(true);\
\
  useEffect(() => \{\
    const fetchEquipements = async () => \{\
      try \{\
        const \{ data, error \} = await supabase\
          .from('equipements')\
          .select('*');\
        \
        if (error) throw error;\
        setEquipements(data || []);\
      \} catch (err) \{\
        console.error('Erreur \'e9quipements:', err.message);\
        setEquipements([]);\
      \} finally \{\
        setLoading(false);\
      \}\
    \};\
\
    fetchEquipements();\
  \}, []);\
\
  return \{ equipements, setEquipements, loading \};\
\};\
\
// \uc0\u55357 \u56549  STOCK\
export const useStock = () => \{\
  const [mouvementsStock, setMouvementsStock] = useState([]);\
  const [loading, setLoading] = useState(true);\
\
  useEffect(() => \{\
    const fetchMouvements = async () => \{\
      try \{\
        const \{ data, error \} = await supabase\
          .from('mouvements_stock')\
          .select('*');\
        \
        if (error) throw error;\
        setMouvementsStock(data || []);\
      \} catch (err) \{\
        console.error('Erreur mouvements:', err.message);\
        setMouvementsStock([]);\
      \} finally \{\
        setLoading(false);\
      \}\
    \};\
\
    fetchMouvements();\
  \}, []);\
\
  return \{ mouvementsStock, setMouvementsStock, loading \};\
\};\
\
// \uc0\u55357 \u56615  INTERVENTIONS\
export const useInterventions = () => \{\
  const [interventions, setInterventions] = useState([]);\
  const [loading, setLoading] = useState(true);\
\
  useEffect(() => \{\
    const fetchInterventions = async () => \{\
      try \{\
        const \{ data, error \} = await supabase\
          .from('interventions')\
          .select('*');\
        \
        if (error) throw error;\
        setInterventions(data || []);\
      \} catch (err) \{\
        console.error('Erreur interventions:', err.message);\
        setInterventions([]);\
      \} finally \{\
        setLoading(false);\
      \}\
    \};\
\
    fetchInterventions();\
  \}, []);\
\
  return \{ interventions, setInterventions, loading \};\
\};\
\
// \uc0\u55357 \u57000  D\'c9FAUTS\
export const useDefauts = () => \{\
  const [defauts, setDefauts] = useState([]);\
  const [loading, setLoading] = useState(true);\
\
  useEffect(() => \{\
    const fetchDefauts = async () => \{\
      try \{\
        const \{ data, error \} = await supabase\
          .from('defauts')\
          .select('*');\
        \
        if (error) throw error;\
        setDefauts(data || []);\
      \} catch (err) \{\
        console.error('Erreur d\'e9fauts:', err.message);\
        setDefauts([]);\
      \} finally \{\
        setLoading(false);\
      \}\
    \};\
\
    fetchDefauts();\
  \}, []);\
\
  return \{ defauts, setDefauts, loading \};\
\};\
\
// \uc0\u55356 \u57256  ACCESSOIRES\
export const useAccessoires = () => \{\
  const [accessoires, setAccessoires] = useState(\{\});\
  const [loading, setLoading] = useState(true);\
\
  useEffect(() => \{\
    const fetchAccessoires = async () => \{\
      try \{\
        const \{ data, error \} = await supabase\
          .from('accessoires')\
          .select('*');\
        \
        if (error) throw error;\
        \
        // Grouper par equipement_id\
        const grouped = \{\};\
        data?.forEach(acc => \{\
          const eqId = acc.equipement_id;\
          if (!grouped[eqId]) grouped[eqId] = [];\
          grouped[eqId].push(acc);\
        \});\
        \
        setAccessoires(grouped);\
      \} catch (err) \{\
        console.error('Erreur accessoires:', err.message);\
        setAccessoires(\{\});\
      \} finally \{\
        setLoading(false);\
      \}\
    \};\
\
    fetchAccessoires();\
  \}, []);\
\
  return \{ accessoires, setAccessoires, loading \};\
\};\
\
// \uc0\u55357 \u56523  CONSTANTES (donn\'e9es statiques)\
export const useConstantes = () => \{\
  const operateurs = ['Axel', 'J\'e9r\'f4me', 'S\'e9bastien', 'Joffrey', 'Fabien', 'Angelo'];\
  const depots = ['Atelier', 'Porteur 26 T', 'Porteur 32 T', 'Semi Remorque'];\
  const typesIntervention = [\
    'Vidange moteur',\
    'R\'e9vision compl\'e8te',\
    'Changement pneus',\
    'Nettoyage',\
    'Maintenance',\
    'Contr\'f4le hydraulique',\
    'R\'e9paration',\
    'Autre'\
  ];\
\
  return \{ operateurs, depots, typesIntervention \};\
\};}