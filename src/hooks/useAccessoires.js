{\rtf1\ansi\ansicpg1252\cocoartf2865
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ useState, useEffect \} from 'react';\
import \{ supabase \} from '../supabaseClient';\
\
export const useAccessoires = () => \{\
  const [accessoires, setAccessoires] = useState([]);\
  const [loading, setLoading] = useState(true);\
  const [error, setError] = useState(null);\
\
  useEffect(() => \{\
    const chargerAccessoires = async () => \{\
      try \{\
        setLoading(true);\
        const \{ data, error \} = await supabase\
          .from('accessoires')\
          .select('*');\
\
        if (error) throw error;\
        setAccessoires(data || []);\
        setLoading(false);\
      \} catch (err) \{\
        console.error('Erreur chargement accessoires:', err);\
        setError(err.message);\
        setLoading(false);\
      \}\
    \};\
\
    chargerAccessoires();\
  \}, []);\
\
  const ajouterAccessoire = async (accessoire) => \{\
    try \{\
      const \{ data, error \} = await supabase\
        .from('accessoires')\
        .insert([accessoire])\
        .select();\
\
      if (error) throw error;\
      setAccessoires([...accessoires, data[0]]);\
      return data[0];\
    \} catch (err) \{\
      console.error('Erreur ajout accessoire:', err);\
      throw err;\
    \}\
  \};\
\
  const mettreAJourAccessoire = async (id, updates) => \{\
    try \{\
      const \{ data, error \} = await supabase\
        .from('accessoires')\
        .update(updates)\
        .eq('id', id)\
        .select();\
\
      if (error) throw error;\
      setAccessoires(accessoires.map(a => a.id === id ? data[0] : a));\
      return data[0];\
    \} catch (err) \{\
      console.error('Erreur mise \'e0 jour accessoire:', err);\
      throw err;\
    \}\
  \};\
\
  const supprimerAccessoire = async (id) => \{\
    try \{\
      const \{ error \} = await supabase\
        .from('accessoires')\
        .delete()\
        .eq('id', id);\
\
      if (error) throw error;\
      setAccessoires(accessoires.filter(a => a.id !== id));\
    \} catch (err) \{\
      console.error('Erreur suppression accessoire:', err);\
      throw err;\
    \}\
  \};\
\
  const obtenirAccessoiresParEquipement = (equipement_id) => \{\
    return accessoires.filter(a => a.equipement_id === equipement_id);\
  \};\
\
  const obtenirValeurTotalAccessoires = (equipement_id) => \{\
    return accessoires\
      .filter(a => a.equipement_id === equipement_id)\
      .reduce((total, a) => total + (a.valeur || 0), 0);\
  \};\
\
  return \{\
    accessoires,\
    loading,\
    error,\
    ajouterAccessoire,\
    mettreAJourAccessoire,\
    supprimerAccessoire,\
    obtenirAccessoiresParEquipement,\
    obtenirValeurTotalAccessoires,\
    setAccessoires\
  \};\
\};}