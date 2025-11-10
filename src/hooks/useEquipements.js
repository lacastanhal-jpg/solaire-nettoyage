{\rtf1\ansi\ansicpg1252\cocoartf2865
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ useState, useEffect \} from 'react';\
import \{ supabase \} from '../supabaseClient';\
\
export const useEquipements = () => \{\
  const [equipements, setEquipements] = useState([]);\
  const [loading, setLoading] = useState(true);\
  const [error, setError] = useState(null);\
\
  useEffect(() => \{\
    const chargerEquipements = async () => \{\
      try \{\
        setLoading(true);\
        const \{ data, error \} = await supabase\
          .from('equipements')\
          .select('*');\
\
        if (error) throw error;\
        if (data) \{\
          setEquipements(data);\
        \}\
        setLoading(false);\
      \} catch (err) \{\
        console.error('Erreur chargement \'e9quipements:', err);\
        setError(err.message);\
        setLoading(false);\
      \}\
    \};\
\
    chargerEquipements();\
  \}, []);\
\
  const ajouterEquipement = async (equipement) => \{\
    try \{\
      const \{ data, error \} = await supabase\
        .from('equipements')\
        .insert([equipement])\
        .select();\
\
      if (error) throw error;\
      setEquipements([...equipements, data[0]]);\
      return data[0];\
    \} catch (err) \{\
      console.error('Erreur ajout \'e9quipement:', err);\
      throw err;\
    \}\
  \};\
\
  const mettreAJourEquipement = async (id, updates) => \{\
    try \{\
      const \{ data, error \} = await supabase\
        .from('equipements')\
        .update(updates)\
        .eq('id', id)\
        .select();\
\
      if (error) throw error;\
      setEquipements(equipements.map(e => e.id === id ? data[0] : e));\
      return data[0];\
    \} catch (err) \{\
      console.error('Erreur mise \'e0 jour \'e9quipement:', err);\
      throw err;\
    \}\
  \};\
\
  const supprimerEquipement = async (id) => \{\
    try \{\
      const \{ error \} = await supabase\
        .from('equipements')\
        .delete()\
        .eq('id', id);\
\
      if (error) throw error;\
      setEquipements(equipements.filter(e => e.id !== id));\
    \} catch (err) \{\
      console.error('Erreur suppression \'e9quipement:', err);\
      throw err;\
    \}\
  \};\
\
  return \{\
    equipements,\
    loading,\
    error,\
    ajouterEquipement,\
    mettreAJourEquipement,\
    supprimerEquipement,\
    setEquipements\
  \};\
\};}