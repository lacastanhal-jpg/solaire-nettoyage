{\rtf1\ansi\ansicpg1252\cocoartf2865
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww33660\viewh18160\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ useState, useEffect \} from 'react';\
import \{ supabase \} from '../supabaseClient';\
\
export const useDefauts = () => \{\
  const [defauts, setDefauts] = useState([]);\
  const [loading, setLoading] = useState(true);\
  const [error, setError] = useState(null);\
\
  useEffect(() => \{\
    const chargerDefauts = async () => \{\
      try \{\
        setLoading(true);\
        const \{ data, error \} = await supabase\
          .from('defauts')\
          .select(`\
            *,\
            photos_defauts (\
              *\
            )\
          `);\
\
        if (error) throw error;\
        setDefauts(data || []);\
        setLoading(false);\
      \} catch (err) \{\
        console.error('Erreur chargement d\'e9fauts:', err);\
        setError(err.message);\
        setLoading(false);\
      \}\
    \};\
\
    chargerDefauts();\
  \}, []);\
\
  const ajouterDefaut = async (defaut) => \{\
    try \{\
      const \{ data, error \} = await supabase\
        .from('defauts')\
        .insert([defaut])\
        .select();\
\
      if (error) throw error;\
      setDefauts([...defauts, data[0]]);\
      return data[0];\
    \} catch (err) \{\
      console.error('Erreur ajout d\'e9faut:', err);\
      throw err;\
    \}\
  \};\
\
  const mettreAJourDefaut = async (id, updates) => \{\
    try \{\
      const \{ data, error \} = await supabase\
        .from('defauts')\
        .update(updates)\
        .eq('id', id)\
        .select();\
\
      if (error) throw error;\
      setDefauts(defauts.map(d => d.id === id ? data[0] : d));\
      return data[0];\
    \} catch (err) \{\
      console.error('Erreur mise \'e0 jour d\'e9faut:', err);\
      throw err;\
    \}\
  \};\
\
  const ajouterPhotoDefaut = async (defaut_id, photo_url) => \{\
    try \{\
      const \{ data, error \} = await supabase\
        .from('photos_defauts')\
        .insert([\{ defaut_id, photo_url \}])\
        .select();\
\
      if (error) throw error;\
      return data[0];\
    \} catch (err) \{\
      console.error('Erreur ajout photo:', err);\
      throw err;\
    \}\
  \};\
\
  const obtenirDefautsCritiques = () => \{\
    return defauts.filter(d => d.severite === 'critique' && d.statut === 'a_traiter');\
  \};\
\
  return \{\
    defauts,\
    loading,\
    error,\
    ajouterDefaut,\
    mettreAJourDefaut,\
    ajouterPhotoDefaut,\
    obtenirDefautsCritiques,\
    setDefauts\
  \};\
\};}