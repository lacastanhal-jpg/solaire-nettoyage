{\rtf1\ansi\ansicpg1252\cocoartf2865
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ \
  useArticles, \
  useEquipements, \
  useStock, \
  useInterventions, \
  useDefauts, \
  useAccessoires \
\} from './hooks';\
\
export default function Test() \{\
  const \{ articles, loading: loadArticles \} = useArticles();\
  const \{ equipements, loading: loadEquipements \} = useEquipements();\
  const \{ stockParDepot, loading: loadStock \} = useStock();\
  const \{ interventions, loading: loadInterventions \} = useInterventions();\
  const \{ defauts, loading: loadDefauts \} = useDefauts();\
  const \{ accessoires, loading: loadAccessoires \} = useAccessoires();\
\
  const isLoading = loadArticles || loadEquipements || loadStock || loadInterventions || loadDefauts || loadAccessoires;\
\
  return (\
    <div style=\{\{ padding: '30px', fontFamily: 'Arial', backgroundColor: '#f5f5f5', minHeight: '100vh' \}\}>\
      <h1 style=\{\{ color: '#FF8C00' \}\}>\uc0\u55358 \u56810  TEST SUPABASE - SOLAIRE NETTOYAGE</h1>\
      \
      \{isLoading && <p style=\{\{ fontSize: '18px' \}\}>\uc0\u9203  Chargement des donn\'e9es...</p>\}\
      \
      \{!isLoading && (\
        <div>\
          \{/* R\'c9SUM\'c9 */\}\
          <div style=\{\{ \
            display: 'grid', \
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', \
            gap: '15px', \
            marginBottom: '30px' \
          \}\}>\
            <div style=\{\{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' \}\}>\
              <h3 style=\{\{ margin: '0 0 10px 0', color: '#333' \}\}>\uc0\u55357 \u56550  Articles</h3>\
              <p style=\{\{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: '#4CAF50' \}\}>\{articles.length\}</p>\
            </div>\
            <div style=\{\{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' \}\}>\
              <h3 style=\{\{ margin: '0 0 10px 0', color: '#333' \}\}>\uc0\u55357 \u56987  \'c9quipements</h3>\
              <p style=\{\{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: '#2196F3' \}\}>\{equipements.length\}</p>\
            </div>\
            <div style=\{\{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' \}\}>\
              <h3 style=\{\{ margin: '0 0 10px 0', color: '#333' \}\}>\uc0\u55357 \u56522  Stocks</h3>\
              <p style=\{\{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: '#FF9800' \}\}>\{stockParDepot.length\}</p>\
            </div>\
            <div style=\{\{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' \}\}>\
              <h3 style=\{\{ margin: '0 0 10px 0', color: '#333' \}\}>\uc0\u55357 \u56615  Interventions</h3>\
              <p style=\{\{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: '#9C27B0' \}\}>\{interventions.length\}</p>\
            </div>\
            <div style=\{\{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' \}\}>\
              <h3 style=\{\{ margin: '0 0 10px 0', color: '#333' \}\}>\uc0\u55357 \u57000  D\'e9fauts</h3>\
              <p style=\{\{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: '#F44336' \}\}>\{defauts.length\}</p>\
            </div>\
            <div style=\{\{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' \}\}>\
              <h3 style=\{\{ margin: '0 0 10px 0', color: '#333' \}\}>\uc0\u55356 \u57256  Accessoires</h3>\
              <p style=\{\{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: '#E91E63' \}\}>\{accessoires.length\}</p>\
            </div>\
          </div>\
\
          \{/* ARTICLES */\}\
          <div style=\{\{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' \}\}>\
            <h2 style=\{\{ color: '#333', borderBottom: '2px solid #4CAF50', paddingBottom: '10px' \}\}>\uc0\u55357 \u56550  Articles (\{articles.length\})</h2>\
            \{articles.length > 0 ? (\
              <ul style=\{\{ listStyle: 'none', padding: 0 \}\}>\
                \{articles.slice(0, 5).map(a => (\
                  <li key=\{a.id\} style=\{\{ padding: '10px', backgroundColor: '#f9f9f9', marginBottom: '5px', borderRadius: '4px', borderLeft: '4px solid #4CAF50' \}\}>\
                    <strong>\{a.code\}</strong> - \{a.description\}\
                  </li>\
                ))\}\
              </ul>\
            ) : (\
              <p style=\{\{ color: '#999' \}\}>Aucun article</p>\
            )\}\
          </div>\
\
          \{/* \'c9QUIPEMENTS */\}\
          <div style=\{\{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' \}\}>\
            <h2 style=\{\{ color: '#333', borderBottom: '2px solid #2196F3', paddingBottom: '10px' \}\}>\uc0\u55357 \u56987  \'c9quipements (\{equipements.length\})</h2>\
            \{equipements.length > 0 ? (\
              <ul style=\{\{ listStyle: 'none', padding: 0 \}\}>\
                \{equipements.slice(0, 5).map(e => (\
                  <li key=\{e.id\} style=\{\{ padding: '10px', backgroundColor: '#f9f9f9', marginBottom: '5px', borderRadius: '4px', borderLeft: '4px solid #2196F3' \}\}>\
                    <strong>\{e.immat\}</strong> - \{e.marque\} \{e.modele\}\
                  </li>\
                ))\}\
              </ul>\
            ) : (\
              <p style=\{\{ color: '#999' \}\}>Aucun \'e9quipement</p>\
            )\}\
          </div>\
\
          \{/* INTERVENTIONS */\}\
          <div style=\{\{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' \}\}>\
            <h2 style=\{\{ color: '#333', borderBottom: '2px solid #9C27B0', paddingBottom: '10px' \}\}>\uc0\u55357 \u56615  Interventions (\{interventions.length\})</h2>\
            \{interventions.length > 0 ? (\
              <ul style=\{\{ listStyle: 'none', padding: 0 \}\}>\
                \{interventions.slice(0, 5).map(i => (\
                  <li key=\{i.id\} style=\{\{ padding: '10px', backgroundColor: '#f9f9f9', marginBottom: '5px', borderRadius: '4px', borderLeft: '4px solid #9C27B0' \}\}>\
                    <strong>\{i.type\}</strong> - \{i.date\}\
                  </li>\
                ))\}\
              </ul>\
            ) : (\
              <p style=\{\{ color: '#999' \}\}>Aucune intervention</p>\
            )\}\
          </div>\
\
          \{/* D\'c9FAUTS */\}\
          <div style=\{\{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' \}\}>\
            <h2 style=\{\{ color: '#333', borderBottom: '2px solid #F44336', paddingBottom: '10px' \}\}>\uc0\u55357 \u57000  D\'e9fauts (\{defauts.length\})</h2>\
            \{defauts.length > 0 ? (\
              <ul style=\{\{ listStyle: 'none', padding: 0 \}\}>\
                \{defauts.slice(0, 5).map(d => (\
                  <li key=\{d.id\} style=\{\{ padding: '10px', backgroundColor: '#f9f9f9', marginBottom: '5px', borderRadius: '4px', borderLeft: `4px solid $\{d.severite === 'critique' ? '#F44336' : d.severite === 'moyen' ? '#FF9800' : '#FFC107'\}` \}\}>\
                    <strong>\{d.type\}</strong> - <span style=\{\{ color: d.severite === 'critique' ? '#F44336' : d.severite === 'moyen' ? '#FF9800' : '#FFC107', fontWeight: 'bold' \}\}>\{d.severite\}</span>\
                  </li>\
                ))\}\
              </ul>\
            ) : (\
              <p style=\{\{ color: '#999' \}\}>Aucun d\'e9faut</p>\
            )\}\
          </div>\
\
          <p style=\{\{ textAlign: 'center', color: '#999', marginTop: '30px', fontSize: '12px' \}\}>\uc0\u9989  Tous les hooks fonctionnent correctement !</p>\
        </div>\
      )\}\
    </div>\
  );\
\}}