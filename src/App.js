import React, { useState, useEffect, useCallback } from 'react';

// ============================================
// CONFIGURATION SUPABASE - API REST ONLY
// ============================================

const SUPABASE_URL = 'https://dxzzwxjgsifivlqqlwuz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4enp3eGpnc2lmaXZscXFsd3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MDE5NjksImV4cCI6MjA3ODI3Nzk2OX0.UFER1C0Hud0JUuBfBLRHzIj-C2UHE0_o3ES3-D8L-XE';

// Fonction API générique
const apiSupabase = async (table, method = 'GET', body = null, filters = '') => {
  const url = `${SUPABASE_URL}/rest/v1/${table}${filters}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  };

  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
    return response.status !== 204 ? await response.json() : null;
  } catch (err) {
    console.error('Erreur Supabase:', err);
    return null;
  }
};

export default function SolaireNettoyageV22() {
  // ============================================
  // ÉTATS PRINCIPAUX
  // ============================================

  const [operateurConnecte, setOperateurConnecte] = useState(null);
  const [listeOperateurs, setListeOperateurs] = useState([]);
  const [afficherConnexion, setAfficherConnexion] = useState(true);
  const [ongletActif, setOngletActif] = useState('accueil');

  // Données principales
  const [articles, setArticles] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [defauts, setDefauts] = useState([]);
  const [activiteLog, setActiviteLog] = useState([]);

  // États UI
  const [equipementSelectionne] = useState(1);
  const [chargementEnCours, setChargementEnCours] = useState(true);
  const [statusSync, setStatusSync] = useState('Connexion...');

  const depots = React.useMemo(() => ['Atelier', 'Porteur 26 T', 'Porteur 32 T', 'Semi Remorque'], []);

  // ============================================
  // CHARGER OPÉRATEURS AU DÉMARRAGE
  // ============================================

  useEffect(() => {
    const chargerOperateurs = async () => {
      const data = await apiSupabase('operateurs', 'GET', null, '?select=*');
      if (data) {
        setListeOperateurs(data);
        setStatusSync('Opérateurs chargés');
      }
    };
    chargerOperateurs();
  }, []);

  // ============================================
  // CHARGER DONNÉES DEPUIS SUPABASE
  // ============================================

  const chargerDonnees = useCallback(async () => {
    try {
      setChargementEnCours(true);
      setStatusSync('Chargement...');

      // Charger articles
      const articlesData = await apiSupabase('articles', 'GET', null, '?select=*');
      if (articlesData) {
        const articlesAvecStock = await Promise.all(articlesData.map(async (article) => {
          const stockData = await apiSupabase('stock_depot', 'GET', null, `?article_id=eq.${article.id}&select=depot,quantite`);
          
          const stockParDepot = {};
          depots.forEach(depot => {
            const stock = stockData?.find(s => s.depot === depot);
            stockParDepot[depot] = stock?.quantite || 0;
          });
          
          return { ...article, stockParDepot };
        }));
        setArticles(articlesAvecStock);
      }

      // Charger équipements
      const equipData = await apiSupabase('equipements', 'GET', null, '?select=*');
      if (equipData) {
        setEquipements(equipData);
      }

      // Charger interventions
      const interData = await apiSupabase('interventions', 'GET', null, '?select=*');
      setInterventions(interData || []);

      // Charger défauts
      const defautData = await apiSupabase('defauts', 'GET', null, '?select=*');
      setDefauts(defautData || []);

      // Charger historique activité
      const activiteData = await apiSupabase('activite_log', 'GET', null, '?select=*&order=created_at.desc&limit=50');
      setActiviteLog(activiteData || []);

      setStatusSync('✅ Synchro OK');
    } catch (err) {
      console.error('Erreur chargement:', err);
      setStatusSync('⚠️ Erreur');
    } finally {
      setChargementEnCours(false);
    }
  }, [depots]);

  useEffect(() => {
    if (operateurConnecte && !afficherConnexion) {
      chargerDonnees();
    }
  }, [operateurConnecte, afficherConnexion, chargerDonnees]);

  // ============================================
  // TRACER ACTIVITÉ
  // ============================================

  const tracerActivite = async (action, detail) => {
    if (!operateurConnecte) return;
    
    try {
      await apiSupabase('activite_log', 'POST', {
        operateur_id: operateurConnecte.id,
        action,
        detail,
        created_at: new Date().toISOString()
      });
      
      // Recharger l'historique
      const activiteData = await apiSupabase('activite_log', 'GET', null, '?select=*&order=created_at.desc&limit=50');
      setActiviteLog(activiteData || []);
    } catch (err) {
      console.error('Erreur trace:', err);
    }
  };

  // ============================================
  // CONNEXION OPÉRATEUR
  // ============================================

  const connecterOperateur = (operateur) => {
    setOperateurConnecte(operateur);
    setAfficherConnexion(false);
    setTimeout(() => {
      tracerActivite('CONNEXION', `${operateur.nom} connecté à l'application`);
    }, 500);
  };

  const deconnecter = async () => {
    if (operateurConnecte) {
      await tracerActivite('DÉCONNEXION', `${operateurConnecte.nom} déconnecté`);
    }
    setOperateurConnecte(null);
    setAfficherConnexion(true);
  };

  // ============================================
  // ÉCRAN CONNEXION
  // ============================================

  if (afficherConnexion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-orange-600 mb-2">☀️ SOLAIRE</h1>
            <p className="text-gray-600 font-semibold">Nettoyage - Multi-Opérateurs</p>
            <p className="text-sm text-gray-500 mt-2">V22 Supabase Cloud</p>
          </div>

          <div className="space-y-3">
            <p className="text-center font-bold text-gray-700 mb-4">Sélectionner opérateur :</p>
            {listeOperateurs.length > 0 ? (
              listeOperateurs.map(op => (
                <button
                  key={op.id}
                  onClick={() => connecterOperateur(op)}
                  className="w-full py-4 rounded-lg font-black text-lg text-white transition hover:shadow-lg transform hover:scale-105"
                  style={{ backgroundColor: op.couleur || '#FF6B35' }}
                >
                  👤 {op.nom}
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Chargement opérateurs...</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t text-center text-xs text-gray-500">
            <p>Solaire Nettoyage</p>
            <p>Synchronisation Supabase REST API</p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // ÉCRAN CHARGEMENT
  // ============================================

  if (chargementEnCours) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">☀️</div>
          <p className="font-black text-xl text-gray-800">Chargement données Supabase...</p>
          <p className="text-sm text-gray-500 mt-2">{statusSync}</p>
        </div>
      </div>
    );
  }

  // ============================================
  // FONCTIONS UTILITAIRES
  // ============================================

  const equipSelectionne = equipements.find(e => e.id === equipementSelectionne);
  const getStockTotal = (article) => {
    return depots.reduce((sum, depot) => sum + (article.stockParDepot?.[depot] || 0), 0);
  };

  const defautsCritiques = defauts.filter(d => d.statut === 'a_traiter' && d.severite === 'critique');
  const interventionsEnCours = interventions.filter(i => i.statut === 'en_cours');

  // ============================================
  // RENDU PRINCIPAL
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sticky top-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black">☀️ SOLAIRE NETTOYAGE V22</h1>
            <p className="text-orange-100 text-sm">Synchronisation Supabase REST - Multi-Opérateurs</p>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">
              👤 {operateurConnecte?.nom}
            </div>
            <button
              onClick={deconnecter}
              className="mt-2 bg-white text-orange-600 px-4 py-2 rounded font-bold hover:bg-orange-50 transition text-sm"
            >
              ↪️ Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* NAVIGATION ONGLETS */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10 overflow-x-auto">
        <div className="flex max-w-7xl mx-auto">
          {[
            { id: 'accueil', label: '📊 Accueil' },
            { id: 'articles', label: '📦 Articles' },
            { id: 'equipements', label: '🚛 Équipements' },
            { id: 'interventions', label: '🔧 Interventions' },
            { id: 'defauts', label: '⚙️ Maintenance' },
            { id: 'activite', label: '📜 Activité' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setOngletActif(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 whitespace-nowrap transition ${
                ongletActif === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENU */}
      <div className="p-6 max-w-7xl mx-auto">
        {ongletActif === 'accueil' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">{articles.length}</div>
                <div className="text-sm text-gray-600">Articles</div>
              </div>
              <div className="bg-green-50 p-4 rounded border border-green-200">
                <div className="text-3xl font-bold text-green-600">{articles.reduce((s, a) => s + getStockTotal(a), 0)}</div>
                <div className="text-sm text-gray-600">Pièces total</div>
              </div>
              <div className="bg-purple-50 p-4 rounded border border-purple-200">
                <div className="text-3xl font-bold text-purple-600">{equipements.length}</div>
                <div className="text-sm text-gray-600">Équipements</div>
              </div>
              <div className="bg-orange-50 p-4 rounded border border-orange-200">
                <div className="text-3xl font-bold text-orange-600">{interventionsEnCours.length}</div>
                <div className="text-sm text-gray-600">Interv. en cours</div>
              </div>
              <div className="bg-red-50 p-4 rounded border border-red-200">
                <div className="text-3xl font-bold text-red-600">{defautsCritiques.length}</div>
                <div className="text-sm text-gray-600">🔴 Critiques</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded border">
              <h3 className="font-bold mb-3">ℹ️ Status Supabase</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-3 rounded border border-green-300">
                  <p className="text-sm text-gray-600">Connexion</p>
                  <p className="font-bold text-green-600">🟢 Active</p>
                </div>
                <div className="bg-blue-50 p-3 rounded border border-blue-300">
                  <p className="text-sm text-gray-600">Données</p>
                  <p className="font-bold text-blue-600">✅ Synchro</p>
                </div>
                <div className="bg-purple-50 p-3 rounded border border-purple-300">
                  <p className="text-sm text-gray-600">Opérateur</p>
                  <p className="font-bold text-purple-600">👤 {operateurConnecte?.nom}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {ongletActif === 'articles' && (
          <div className="bg-white p-4 rounded border">
            <h2 className="font-black text-xl mb-4">📦 Articles ({articles.length})</h2>
            <div className="space-y-2">
              {articles.map(a => (
                <div key={a.id} className="flex justify-between p-3 bg-gray-50 rounded border">
                  <div className="flex-1">
                    <div className="font-bold text-orange-600">{a.code}</div>
                    <div className="text-sm text-gray-600">{a.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Fournisseur: {a.fournisseur || 'N/A'} • 💰 {a.prix_unitaire}€
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{getStockTotal(a)}</div>
                    <div className="text-xs text-gray-500">pièces</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {ongletActif === 'equipements' && (
          <div className="bg-white p-4 rounded border">
            <h2 className="font-black text-xl mb-4">🚛 Équipements ({equipements.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {equipements.map(eq => (
                <div key={eq.id} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-300">
                  <div className="text-xl font-black text-orange-600">{eq.immat}</div>
                  <div className="text-sm text-gray-700 mt-1"><strong>{eq.type}</strong></div>
                  <div className="text-sm text-gray-600">{eq.marque} {eq.modele}</div>
                  <div className="mt-3 text-sm space-y-1">
                    <div>💰 Valeur: {eq.valeur_actuelle}€</div>
                    <div>⛽ Carburant: {eq.carburant}</div>
                    <div>📅 Année: {eq.annee}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {ongletActif === 'interventions' && (
          <div className="bg-white p-4 rounded border">
            <h2 className="font-black text-xl mb-4">🔧 Interventions ({interventions.length})</h2>
            <div className="space-y-3">
              {interventions.length > 0 ? (
                interventions.map(i => {
                  const eq = equipements.find(e => e.id === i.equipement_id);
                  return (
                    <div key={i.id} className={`p-3 rounded border-l-4 ${i.statut === 'effectue' ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-500'}`}>
                      <div className="font-bold">{i.type}</div>
                      <div className="text-sm text-gray-600">{eq?.immat} • {i.date_intervention}</div>
                      <div className="text-xs text-gray-500 mt-1">{i.description}</div>
                      <div className="text-sm mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${i.statut === 'effectue' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                          {i.statut === 'effectue' ? '✅ Effectuée' : '⏳ En cours'}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 italic">Aucune intervention</p>
              )}
            </div>
          </div>
        )}

        {ongletActif === 'defauts' && (
          <div className="bg-white p-4 rounded border">
            <h2 className="font-black text-xl mb-4">⚙️ Maintenance - Défauts ({defauts.length})</h2>
            <div className="space-y-3">
              {defauts.length > 0 ? (
                defauts.map(d => {
                  const eq = equipements.find(e => e.id === d.equipement_id);
                  const couleur = d.severite === 'critique' ? 'border-red-500 bg-red-50' : d.severite === 'moyen' ? 'border-orange-500 bg-orange-50' : 'border-yellow-500 bg-yellow-50';
                  return (
                    <div key={d.id} className={`p-3 rounded border-l-4 ${couleur}`}>
                      <div className="font-bold">{d.type}</div>
                      <div className="text-sm text-gray-600">{eq?.immat} • {d.date_constatation}</div>
                      <div className="text-sm text-gray-600 mt-1">{d.description}</div>
                      <div className="text-xs text-gray-500 mt-1">Opérateur: {d.operateur_id || 'N/A'}</div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 italic">Aucun défaut</p>
              )}
            </div>
          </div>
        )}

        {ongletActif === 'activite' && (
          <div className="bg-white p-4 rounded border">
            <h2 className="font-black text-xl mb-4">📜 Historique Activité ({activiteLog.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {activiteLog.length > 0 ? (
                activiteLog.map(log => {
                  const op = listeOperateurs.find(o => o.id === log.operateur_id);
                  return (
                    <div key={log.id} className="p-3 bg-gray-50 rounded border-l-4 border-orange-400">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-800">{log.action}</p>
                          <p className="text-sm text-gray-600">{log.detail}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            👤 {op?.nom} • {new Date(log.created_at).toLocaleTimeString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 italic">Aucune activité</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* STATUS SUPABASE */}
      <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg font-bold flex items-center gap-2 text-sm">
        <span className="animate-pulse">🟢</span>
        {statusSync}
      </div>
    </div>
  );
}