{\rtf1\ansi\ansicpg1252\cocoartf2865
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ useState, useEffect \} from 'react';\
import \{ supabase \} from '../supabaseClient';\
\
export const useStock = () => \{\
  const [mouvementsStock, setMouvementsStock] = useState([]);\
  const [stockParDepot, setStockParDepot] = useState([]);\
  const [loading, setLoading] = useState(true);\
  const [error, setError] = useState(null);\
\
  useEffect(() => \{\
    const chargerStock = async () => \{\
      try \{\
        setLoading(true);\
        \
        // Charger les mouvements de stock\
        const \{ data: mouvements, error: errMouvements \} = await supabase\
          .from('mouvements_stock')\
          .select('*');\
\
        // Charger le stock par d\'e9p\'f4t\
        const \{ data: stock, error: errStock \} = await supabase\
          .from('stock_depot')\
          .select('*');\
\
        if (errMouvements) throw errMouvements;\
        if (errStock) throw errStock;\
\
        setMouvementsStock(mouvements || []);\
        setStockParDepot(stock || []);\
        setLoading(false);\
      \} catch (err) \{\
        console.error('Erreur chargement stock:', err);\
        setError(err.message);\
        setLoading(false);\
      \}\
    \};\
\
    chargerStock();\
  \}, []);\
\
  const ajouterMouvement = async (mouvement) => \{\
    try \{\
      const \{ data, error \} = await supabase\
        .from('mouvements_stock')\
        .insert([mouvement])\
        .select();\
\
      if (error) throw error;\
      setMouvementsStock([...mouvementsStock, data[0]]);\
      return data[0];\
    \} catch (err) \{\
      console.error('Erreur ajout mouvement:', err);\
      throw err;\
    \}\
  \};\
\
  const mettreAJourStockDepot = async (article_id, depot_id, quantite) => \{\
    try \{\
      const \{ data, error \} = await supabase\
        .from('stock_depot')\
        .upsert(\
          \{ article_id, depot_id, quantite \},\
          \{ onConflict: 'article_id,depot_id' \}\
        )\
        .select();\
\
      if (error) throw error;\
      setStockParDepot(stockParDepot.map(s => \
        s.article_id === article_id && s.depot_id === depot_id ? data[0] : s\
      ));\
      return data[0];\
    \} catch (err) \{\
      console.error('Erreur mise \'e0 jour stock d\'e9p\'f4t:', err);\
      throw err;\
    \}\
  \};\
\
  const obtenirStockTotal = (article_id) => \{\
    return stockParDepot\
      .filter(s => s.article_id === article_id)\
      .reduce((total, s) => total + (s.quantite || 0), 0);\
  \};\
\
  return \{\
    mouvementsStock,\
    stockParDepot,\
    loading,\
    error,\
    ajouterMouvement,\
    mettreAJourStockDepot,\
    obtenirStockTotal,\
    setMouvementsStock,\
    setStockParDepot\
  \};\
\};}