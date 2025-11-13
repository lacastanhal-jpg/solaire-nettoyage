import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Package, Wrench, Home, FileText, Settings, AlertTriangle, Plus, Edit2, Trash2, ChevronDown, ChevronRight, Search, Filter, Calendar, Save, X, Upload, ShoppingCart, Fuel, ClipboardList, BarChart3, Bell, TrendingUp, Users, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Image, Star, DollarSign, Percent, Activity, Hammer, Truck, Cpu, Droplet, Bot, Package2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://nnxqphqoavkqjqyovdpl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ueHFwaHFvYXZrcWpxeW92ZHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNjU4MjQsImV4cCI6MjA1MTk0MTgyNH0.HBqnle6yusr0edHFp3vYQBXe1t7nVZVW-fXLW2N2xPc';
const supabase = createClient(supabaseUrl, supabaseKey);

// Données initiales
const articlesInitiaux = [
  { id: '1', code: 'ROUE001', description: 'Roue de rechange nacelle', stockMin: 2, prix: 450, fournisseur: 'RURAL MASTER', stocks: { 'Atelier': 3, 'Porteur 26T': 1, 'Porteur 32T': 0, 'Semi Remorque': 1 } },
  { id: '2', code: 'BATT001', description: 'Batterie 12V nacelle', stockMin: 4, prix: 280, fournisseur: 'V6 AUTOPRO', stocks: { 'Atelier': 5, 'Porteur 26T': 2, 'Porteur 32T': 1, 'Semi Remorque': 2 } },
  { id: '3', code: 'HUIL001', description: 'Huile hydraulique 5L', stockMin: 10, prix: 85, fournisseur: 'LE BON ROULEMENT', stocks: { 'Atelier': 12, 'Porteur 26T': 3, 'Porteur 32T': 2, 'Semi Remorque': 3 } },
  { id: '4', code: 'FILTR001', description: 'Filtre hydraulique', stockMin: 5, prix: 120, fournisseur: 'CLAAS LAGARRIGUE', stocks: { 'Atelier': 8, 'Porteur 26T': 1, 'Porteur 32T': 1, 'Semi Remorque': 1 } },
  { id: '5', code: 'COURR001', description: 'Courroie de transmission', stockMin: 3, prix: 195, fournisseur: 'SARL QUIERS', stocks: { 'Atelier': 4, 'Porteur 26T': 1, 'Porteur 32T': 0, 'Semi Remorque': 1 } },
  { id: '6', code: 'ROUL001', description: 'Roulement à billes 60x90', stockMin: 6, prix: 75, fournisseur: 'LE BON ROULEMENT', stocks: { 'Atelier': 7, 'Porteur 26T': 2, 'Porteur 32T': 1, 'Semi Remorque': 2 } },
  { id: '7', code: 'JOINT001', description: 'Joint torique hydraulique', stockMin: 20, prix: 15, fournisseur: 'V6 AUTOPRO', stocks: { 'Atelier': 25, 'Porteur 26T': 5, 'Porteur 32T': 5, 'Semi Remorque': 5 } },
  { id: '8', code: 'LAMP001', description: 'Lampe LED travail', stockMin: 8, prix: 65, fournisseur: 'RURAL MASTER', stocks: { 'Atelier': 10, 'Porteur 26T': 2, 'Porteur 32T': 2, 'Semi Remorque': 2 } },
  { id: '9', code: 'FLEX001', description: 'Flexible hydraulique 2m', stockMin: 4, prix: 145, fournisseur: 'CLAAS LAGARRIGUE', stocks: { 'Atelier': 5, 'Porteur 26T': 1, 'Porteur 32T': 1, 'Semi Remorque': 1 } },
  { id: '10', code: 'GRAISS001', description: 'Graisse multifonction 1kg', stockMin: 12, prix: 25, fournisseur: 'SARL QUIERS', stocks: { 'Atelier': 15, 'Porteur 26T': 3, 'Porteur 32T': 3, 'Semi Remorque': 3 } },
  { id: '11', code: 'PNEU001', description: 'Pneu tracteur avant', stockMin: 2, prix: 680, fournisseur: 'RURAL MASTER', stocks: { 'Atelier': 3, 'Porteur 26T': 0, 'Porteur 32T': 0, 'Semi Remorque': 1 } },
  { id: '12', code: 'CHAIN001', description: 'Chaîne de sécurité', stockMin: 6, prix: 55, fournisseur: 'LE BON ROULEMENT', stocks: { 'Atelier': 8, 'Porteur 26T': 2, 'Porteur 32T': 2, 'Semi Remorque': 2 } },
  { id: '13', code: 'FUSIB001', description: 'Boîte de fusibles assortis', stockMin: 3, prix: 35, fournisseur: 'V6 AUTOPRO', stocks: { 'Atelier': 4, 'Porteur 26T': 1, 'Porteur 32T': 1, 'Semi Remorque': 1 } },
  { id: '14', code: 'ANTIF001', description: 'Antigel circuit 5L', stockMin: 8, prix: 42, fournisseur: 'SARL QUIERS', stocks: { 'Atelier': 10, 'Porteur 26T': 2, 'Porteur 32T': 2, 'Semi Remorque': 2 } },
  { id: '15', code: 'BACHE001', description: 'Bâche de protection 4x6m', stockMin: 4, prix: 125, fournisseur: 'RURAL MASTER', stocks: { 'Atelier': 5, 'Porteur 26T': 1, 'Porteur 32T': 1, 'Semi Remorque': 1 } },
  { id: '16', code: 'SANG001', description: 'Sangle arrimage 5T', stockMin: 10, prix: 38, fournisseur: 'CLAAS LAGARRIGUE', stocks: { 'Atelier': 12, 'Porteur 26T': 3, 'Porteur 32T': 3, 'Semi Remorque': 4 } },
  { id: '17', code: 'COFF001', description: 'Coffret outillage complet', stockMin: 2, prix: 450, fournisseur: 'LE BON ROULEMENT', stocks: { 'Atelier': 3, 'Porteur 26T': 1, 'Porteur 32T': 1, 'Semi Remorque': 0 } },
  { id: '18', code: 'NETT001', description: 'Produit nettoyage panneaux 20L', stockMin: 15, prix: 95, fournisseur: 'V6 AUTOPRO', stocks: { 'Atelier': 20, 'Porteur 26T': 5, 'Porteur 32T': 5, 'Semi Remorque': 5 } },
  { id: '19', code: 'BROSS001', description: 'Brosse rotative rechange', stockMin: 4, prix: 220, fournisseur: 'SARL QUIERS', stocks: { 'Atelier': 5, 'Porteur 26T': 1, 'Porteur 32T': 1, 'Semi Remorque': 1 } }
];

const equipmentsInitiaux = [
  { id: '1', nom: 'Camion IVECO 26T', type: 'Camion Porteur', immatriculation: 'AB-123-CD', statut: 'Actif', derniereRevision: '2024-10-15', prochaineRevision: '2025-01-15', kilometrage: 45000 },
  { id: '2', nom: 'Camion IVECO 32T', type: 'Camion Porteur', immatriculation: 'EF-456-GH', statut: 'Actif', derniereRevision: '2024-09-20', prochaineRevision: '2024-12-20', kilometrage: 52000 },
  { id: '3', nom: 'Nacelle Spider 30m', type: 'Nacelle', immatriculation: 'NAC-001', statut: 'Actif', heuresService: 1250, derniereRevision: '2024-11-01', prochaineRevision: '2025-02-01' },
  { id: '4', nom: 'Groupe Électrogène 50kVA', type: 'Groupe électrogène', immatriculation: 'GE-001', statut: 'Maintenance', heuresService: 850, derniereRevision: '2024-08-15', prochaineRevision: '2024-11-15' },
  { id: '5', nom: 'Osmoseur Mobile 1000L', type: 'Osmoseur', immatriculation: 'OSM-001', statut: 'Actif', capacite: '1000L/h', derniereRevision: '2024-10-01', prochaineRevision: '2025-01-01' },
  { id: '6', nom: 'Robot Nettoyage RB-2000', type: 'Robot nettoyage', immatriculation: 'ROB-001', statut: 'Actif', heuresService: 450, derniereRevision: '2024-11-10', prochaineRevision: '2025-02-10' }
];

// Hook personnalisé pour Supabase avec fallback localStorage
const useSupabaseData = (table, localStorageKey, initialData = []) => {
  const [data, setData] = useState(() => {
    const localData = localStorage.getItem(localStorageKey);
    return localData ? JSON.parse(localData) : initialData;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  // Charger depuis Supabase
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: supabaseData, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setData(supabaseData || initialData);
      localStorage.setItem(localStorageKey, JSON.stringify(supabaseData || initialData));
      setIsOnline(true);
    } catch (err) {
      console.error(`Erreur chargement ${table}:`, err);
      setError(err.message);
      setIsOnline(false);
      // Utiliser localStorage en fallback
    } finally {
      setLoading(false);
    }
  }, [table, localStorageKey, initialData]);

  // Ajouter un élément
  const addItem = async (item) => {
    const newItem = { ...item, id: Date.now().toString(), created_at: new Date().toISOString() };
    
    try {
      const { data: insertedData, error } = await supabase
        .from(table)
        .insert([newItem])
        .select()
        .single();

      if (error) throw error;

      setData(prev => [insertedData, ...prev]);
      localStorage.setItem(localStorageKey, JSON.stringify([insertedData, ...data]));
      return insertedData;
    } catch (err) {
      console.error('Erreur ajout:', err);
      // Fallback localStorage
      setData(prev => [newItem, ...prev]);
      localStorage.setItem(localStorageKey, JSON.stringify([newItem, ...data]));
      return newItem;
    }
  };

  // Mettre à jour un élément
  const updateItem = async (id, updates) => {
    try {
      const { data: updatedData, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setData(prev => prev.map(item => item.id === id ? updatedData : item));
      localStorage.setItem(localStorageKey, JSON.stringify(
        data.map(item => item.id === id ? updatedData : item)
      ));
      return updatedData;
    } catch (err) {
      console.error('Erreur mise à jour:', err);
      // Fallback localStorage
      const updated = { ...data.find(item => item.id === id), ...updates };
      setData(prev => prev.map(item => item.id === id ? updated : item));
      localStorage.setItem(localStorageKey, JSON.stringify(
        data.map(item => item.id === id ? updated : item)
      ));
      return updated;
    }
  };

  // Supprimer un élément
  const deleteItem = async (id) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      setData(prev => prev.filter(item => item.id !== id));
      localStorage.setItem(localStorageKey, JSON.stringify(
        data.filter(item => item.id !== id)
      ));
    } catch (err) {
      console.error('Erreur suppression:', err);
      // Fallback localStorage
      setData(prev => prev.filter(item => item.id !== id));
      localStorage.setItem(localStorageKey, JSON.stringify(
        data.filter(item => item.id !== id)
      ));
    }
  };

  // Synchronisation au montage
  useEffect(() => {
    fetchData();
    
    // Écouter les changements temps réel
    const subscription = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setData(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setData(prev => prev.map(item => 
            item.id === payload.new.id ? payload.new : item
          ));
        } else if (payload.eventType === 'DELETE') {
          setData(prev => prev.filter(item => item.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchData, table]);

  return {
    data,
    loading,
    error,
    isOnline,
    addItem,
    updateItem,
    deleteItem,
    refreshData: fetchData
  };
};

// Composant principal
export default function App() {
  // États pour la navigation
  const [activeTab, setActiveTab] = useState('accueil');
  const [expandedSections, setExpandedSections] = useState({});
  
  // Référence pour le scanner QR
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');
  
  // États pour les modaux
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showDefautModal, setShowDefautModal] = useState(false);
  const [showFuelModal, setShowFuelModal] = useState(false);
  
  // États pour l'édition
  const [editingArticle, setEditingArticle] = useState(null);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [editingIntervention, setEditingIntervention] = useState(null);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  
  // États pour les filtres et recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepot, setSelectedDepot] = useState('tous');
  const [selectedEquipmentType, setSelectedEquipmentType] = useState('tous');
  const [dateFilter, setDateFilter] = useState('');
  
  // Hooks Supabase pour chaque table
  // NOUVEAU (correspondant à vos tables Supabase)
const articlesHook = useSupabaseData('articles', 'articles', articlesInitiaux);
const equipmentsHook = useSupabaseData('equipements', 'equipements', equipmentsInitiaux);
const interventionsHook = useSupabaseData('interventions', 'interventions', []);
const maintenancesHook = useSupabaseData('maintenance_prevue', 'maintenances', []); // ← votre table
const defautsHook = useSupabaseData('defauts', 'defauts', []);
const ravitaillementsHook = useSupabaseData('ravitaillements', 'ravitaillements', []);
const mouvementsStockHook = useSupabaseData('mouvements_stock', 'mouvementsStock', []);
  
  // Panier de commande
  const [panier, setPanier] = useState(() => {
    const saved = localStorage.getItem('panierCommande');
    return saved ? JSON.parse(saved) : [];
  });

  // Dépôts disponibles
  const depots = ['Atelier', 'Porteur 26T', 'Porteur 32T', 'Semi Remorque'];
  
  // Types d'équipements
  const typesEquipements = [
    'Camion Porteur', 'Nacelle', 'Groupe électrogène', 
    'Osmoseur', 'Robot nettoyage', 'Accessoire',
    'Remorque', 'Tracteur', 'Citerne', 'Karcher',
    'Aspirateur', 'Outillage'
  ];
  
  // Opérateurs
  const operateurs = ['Axel', 'Jérôme', 'Sébastien', 'Joffrey', 'Fabien', 'Angelo'];

  // Données de formulaires
  const [articleForm, setArticleForm] = useState({
    code: '', description: '', stockMin: '', prix: '', fournisseur: ''
  });
  
  const [equipmentForm, setEquipmentForm] = useState({
    nom: '', type: '', immatriculation: '', statut: 'Actif', 
    kilometrage: '', heuresService: '', derniereRevision: '', prochaineRevision: ''
  });
  
  const [interventionForm, setInterventionForm] = useState({
    titre: '', description: '', date: new Date().toISOString().split('T')[0],
    equipementId: '', operateur: '', duree: '', statut: 'En cours', articlesUtilises: []
  });
  
  const [fuelForm, setFuelForm] = useState({
    date: new Date().toISOString().slice(0, 16), equipementId: '', 
    litres: '', kilometrageActuel: '', kilometresParcourus: '', 
    cout: '', lieu: '', operateur: ''
  });
  
  const [defautForm, setDefautForm] = useState({
    titre: '', description: '', equipementId: '', severite: '', operateur: ''
  });

  // Fonctions de gestion du panier
  const ajouterAuPanier = (article) => {
    const newPanier = [...panier];
    const existing = newPanier.find(item => item.id === article.id);
    
    if (existing) {
      existing.quantiteCommande = (existing.quantiteCommande || 0) + 1;
    } else {
      newPanier.push({
        ...article,
        quantiteCommande: 1
      });
    }
    
    setPanier(newPanier);
    localStorage.setItem('panierCommande', JSON.stringify(newPanier));
  };

  const viderPanier = () => {
    setPanier([]);
    localStorage.removeItem('panierCommande');
  };

  const genererCommande = () => {
    const commande = panier.map(item => ({
      code: item.code,
      description: item.description,
      quantite: item.quantiteCommande,
      fournisseur: item.fournisseur,
      prix: item.prix
    }));
    
    const blob = new Blob([JSON.stringify(commande, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commande_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    viderPanier();
    alert('Commande générée avec succès !');
  };

  // Fonction de scan QR
  const startQRScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
        scanQRCode();
      }
    } catch (err) {
      console.error('Erreur accès caméra:', err);
      alert('Impossible d\'accéder à la caméra');
    }
  };

  const stopQRScan = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
    setScanResult('');
  };

  const scanQRCode = () => {
    if (!scanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Simulation du scan QR
      const simulatedResult = Math.random() > 0.8 ? 'ARTICLE:ROUE001' : null;
      
      if (simulatedResult) {
        setScanResult(simulatedResult);
        handleQRCodeResult(simulatedResult);
        stopQRScan();
      } else {
        requestAnimationFrame(scanQRCode);
      }
    } else {
      requestAnimationFrame(scanQRCode);
    }
  };

  const handleQRCodeResult = (result) => {
    const parts = result.split(':');
    if (parts[0] === 'ARTICLE' && parts[1]) {
      const article = articlesHook.data.find(a => a.code === parts[1]);
      if (article) {
        setEditingArticle(article);
        setShowArticleModal(true);
      }
    }
  };

  // Calculs des statistiques
  const calculateStats = () => {
    const totalArticles = articlesHook.data.length;
    const totalEquipments = equipmentsHook.data.length;
    const activeEquipments = equipmentsHook.data.filter(e => e.statut === 'Actif').length;
    const maintenancesDuMois = maintenancesHook.data.filter(m => {
      const date = new Date(m.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
    
    const articlesEnAlerte = articlesHook.data.filter(article => {
      const stockTotal = Object.values(article.stocks || {}).reduce((a, b) => a + b, 0);
      return stockTotal < article.stockMin;
    }).length;
    
    const interventionsDuMois = interventionsHook.data.filter(i => {
      const date = new Date(i.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    return {
      totalArticles,
      totalEquipments,
      activeEquipments,
      maintenancesDuMois,
      articlesEnAlerte,
      interventionsDuMois
    };
  };

  const stats = calculateStats();

  // Handlers pour les formulaires
  const handleArticleSubmit = () => {
    const articleData = {
      ...articleForm,
      stockMin: parseInt(articleForm.stockMin),
      prix: parseFloat(articleForm.prix),
      stocks: editingArticle?.stocks || depots.reduce((acc, depot) => ({...acc, [depot]: 0}), {})
    };
    
    if (editingArticle) {
      articlesHook.updateItem(editingArticle.id, articleData);
    } else {
      articlesHook.addItem(articleData);
    }
    
    setShowArticleModal(false);
    setEditingArticle(null);
    setArticleForm({ code: '', description: '', stockMin: '', prix: '', fournisseur: '' });
  };
  
  const handleEquipmentSubmit = () => {
    const equipmentData = {
      ...equipmentForm,
      kilometrage: equipmentForm.kilometrage ? parseInt(equipmentForm.kilometrage) : null,
      heuresService: equipmentForm.heuresService ? parseInt(equipmentForm.heuresService) : null
    };
    
    if (editingEquipment) {
      equipmentsHook.updateItem(editingEquipment.id, equipmentData);
    } else {
      equipmentsHook.addItem(equipmentData);
    }
    
    setShowEquipmentModal(false);
    setEditingEquipment(null);
    setEquipmentForm({
      nom: '', type: '', immatriculation: '', statut: 'Actif',
      kilometrage: '', heuresService: '', derniereRevision: '', prochaineRevision: ''
    });
  };
  
  const handleInterventionSubmit = () => {
    const equipment = equipmentsHook.data.find(e => e.id === interventionForm.equipementId);
    const interventionData = {
      ...interventionForm,
      equipementNom: equipment?.nom,
      duree: parseFloat(interventionForm.duree)
    };
    
    interventionsHook.addItem(interventionData);
    setShowInterventionModal(false);
    setEditingIntervention(null);
    setInterventionForm({
      titre: '', description: '', date: new Date().toISOString().split('T')[0],
      equipementId: '', operateur: '', duree: '', statut: 'En cours', articlesUtilises: []
    });
  };
  
  const handleFuelSubmit = () => {
    const equipment = equipmentsHook.data.find(e => e.id === fuelForm.equipementId);
    const ravitaillementData = {
      ...fuelForm,
      equipementNom: equipment?.nom,
      litres: parseFloat(fuelForm.litres),
      kilometrageActuel: parseInt(fuelForm.kilometrageActuel),
      kilometresParcourus: parseInt(fuelForm.kilometresParcourus),
      cout: parseFloat(fuelForm.cout)
    };
    
    ravitaillementsHook.addItem(ravitaillementData);
    setShowFuelModal(false);
    setFuelForm({
      date: new Date().toISOString().slice(0, 16), equipementId: '',
      litres: '', kilometrageActuel: '', kilometresParcourus: '',
      cout: '', lieu: '', operateur: ''
    });
  };
  
  const handleDefautSubmit = () => {
    const equipment = equipmentsHook.data.find(e => e.id === defautForm.equipementId);
    const defautData = {
      ...defautForm,
      date: new Date().toISOString(),
      equipementNom: equipment?.nom,
      photos: [],
      resolu: false
    };
    
    defautsHook.addItem(defautData);
    setShowDefautModal(false);
    setDefautForm({ titre: '', description: '', equipementId: '', severite: '', operateur: '' });
  };

  // Rendu de l'interface
  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête avec statut Supabase */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Solaire Nettoyage</h1>
              <p className="text-sm opacity-90">Gestion des Stocks et Équipements</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {articlesHook.isOnline ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-sm">Connecté Supabase</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Mode hors ligne</span>
                </>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm">{new Date().toLocaleDateString('fr-FR')}</p>
              <p className="text-xs opacity-75">V2.1 SUPABASE</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation par onglets */}
      <nav className="bg-white shadow-md sticky top-0 z-40 overflow-x-auto">
        <div className="flex space-x-1 p-2">
          {[
            { id: 'accueil', label: 'Accueil', icon: Home },
            { id: 'fiche', label: 'Fiche', icon: FileText },
            { id: 'articles', label: 'Articles', icon: Package },
            { id: 'inventaire', label: 'Inventaire', icon: ClipboardList },
            { id: 'stock', label: 'Stock', icon: Package2 },
            { id: 'equipements', label: 'Équipements', icon: Wrench },
            { id: 'interventions', label: 'Interventions', icon: Hammer },
            { id: 'maintenance', label: 'Maintenance', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="p-4 pb-20">
        {/* Onglet Accueil */}
        {activeTab === 'accueil' && (
          <div className="space-y-6">
            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-8 h-8 text-blue-500" />
                  <span className="text-2xl font-bold">{stats.totalArticles}</span>
                </div>
                <p className="text-sm text-gray-600">Articles</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <Wrench className="w-8 h-8 text-green-500" />
                  <span className="text-2xl font-bold">{stats.activeEquipments}</span>
                </div>
                <p className="text-sm text-gray-600">Équipements actifs</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  <span className="text-2xl font-bold">{stats.articlesEnAlerte}</span>
                </div>
                <p className="text-sm text-gray-600">Alertes stock</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <Hammer className="w-8 h-8 text-purple-500" />
                  <span className="text-2xl font-bold">{stats.interventionsDuMois}</span>
                </div>
                <p className="text-sm text-gray-600">Interv. ce mois</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <Settings className="w-8 h-8 text-red-500" />
                  <span className="text-2xl font-bold">{stats.maintenancesDuMois}</span>
                </div>
                <p className="text-sm text-gray-600">Maint. ce mois</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <Fuel className="w-8 h-8 text-orange-500" />
                  <span className="text-2xl font-bold">{ravitaillementsHook.data.length}</span>
                </div>
                <p className="text-sm text-gray-600">Ravitaillements</p>
              </div>
            </div>

            {/* Alertes */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-red-500" />
                Alertes et Notifications
              </h3>
              <div className="space-y-2">
                {articlesHook.data.filter(a => {
                  const total = Object.values(a.stocks || {}).reduce((acc, val) => acc + val, 0);
                  return total < a.stockMin;
                }).map(article => (
                  <div key={article.id} className="flex items-center p-2 bg-red-50 rounded">
                    <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-sm">
                      Stock faible: {article.description} ({Object.values(article.stocks || {}).reduce((a, b) => a + b, 0)}/{article.stockMin})
                    </span>
                  </div>
                ))}
                
                {equipmentsHook.data.filter(e => {
                  const prochaine = new Date(e.prochaineRevision);
                  const today = new Date();
                  const diffDays = Math.ceil((prochaine - today) / (1000 * 60 * 60 * 24));
                  return diffDays <= 30 && diffDays >= 0;
                }).map(equipment => (
                  <div key={equipment.id} className="flex items-center p-2 bg-yellow-50 rounded">
                    <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-sm">
                      Révision proche: {equipment.nom} ({new Date(equipment.prochaineRevision).toLocaleDateString('fr-FR')})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setShowInterventionModal(true)}
                  className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Hammer className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm">Nouvelle Intervention</span>
                </button>
                
                <button
                  onClick={startQRScan}
                  className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Camera className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm">Scanner QR</span>
                </button>
                
                <button
                  onClick={() => setShowFuelModal(true)}
                  className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <Fuel className="w-8 h-8 text-orange-600 mb-2" />
                  <span className="text-sm">Ravitaillement</span>
                </button>
                
                <button
                  onClick={() => setShowDefautModal(true)}
                  className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
                  <span className="text-sm">Signaler Défaut</span>
                </button>
              </div>
            </div>

            {/* Graphiques de suivi */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Consommation Carburant
                </h3>
                <div className="space-y-2">
                  {equipmentsHook.data.filter(e => e.type === 'Camion Porteur').map(camion => {
                    const ravitaillements = ravitaillementsHook.data.filter(r => r.equipementId === camion.id);
                    const totalLitres = ravitaillements.reduce((acc, r) => acc + (r.litres || 0), 0);
                    const totalKm = ravitaillements.reduce((acc, r) => acc + (r.kilometresParcourus || 0), 0);
                    const consommation = totalKm > 0 ? ((totalLitres / totalKm) * 100).toFixed(1) : 0;
                    
                    return (
                      <div key={camion.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{camion.nom}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{consommation} L/100km</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                consommation > 40 ? 'bg-red-500' : 
                                consommation > 30 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min((consommation / 50) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-purple-500" />
                  Activité Récente
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {[...interventionsHook.data, ...maintenancesHook.data]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={`${item.type}-${item.id}`} className="flex items-center p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.description || item.titre}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.date).toLocaleDateString('fr-FR')} - {item.operateur || 'N/A'}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Fiche */}
        {activeTab === 'fiche' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Informations Entreprise</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Raison sociale</p>
                  <p className="font-medium">Solaire Nettoyage</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Adresse</p>
                  <p className="font-medium">Vaureilles, France</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Flotte</p>
                  <p className="font-medium">6 véhicules</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Opérateurs</p>
                  <p className="font-medium">6 personnes</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Dépôts</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {depots.map((depot, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded">
                    <MapPin className="w-5 h-5 text-blue-500 mr-3" />
                    <div>
                      <p className="font-medium">{depot}</p>
                      <p className="text-sm text-gray-600">
                        {articlesHook.data.reduce((acc, article) => 
                          acc + (article.stocks?.[depot] || 0), 0
                        )} articles en stock
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Équipe</h2>
              <div className="grid md:grid-cols-3 gap-3">
                {operateurs.map((operateur, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded">
                    <Users className="w-5 h-5 text-green-500 mr-3" />
                    <p className="font-medium">{operateur}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Onglet Articles */}
        {activeTab === 'articles' && (
          <div className="space-y-4">
            {/* En-tête avec recherche et actions */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un article..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border rounded-lg flex-1"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowArticleModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel Article
                  </button>
                  <button
                    onClick={startQRScan}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Scanner
                  </button>
                </div>
              </div>
            </div>

            {/* Panier de commande */}
            {panier.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Panier de commande ({panier.length} articles)
                  </h3>
                  <div className="space-x-2">
                    <button
                      onClick={genererCommande}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Générer Commande
                    </button>
                    <button
                      onClick={viderPanier}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Vider
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  {panier.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.description}</span>
                      <span>Qté: {item.quantiteCommande}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Liste des articles */}
            <div className="grid gap-4">
              {articlesHook.data
                .filter(article => 
                  article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  article.code.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(article => {
                  const stockTotal = Object.values(article.stocks || {}).reduce((a, b) => a + b, 0);
                  const isLowStock = stockTotal < article.stockMin;
                  
                  return (
                    <div key={article.id} className="bg-white rounded-lg shadow-md p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{article.code}</h3>
                          <p className="text-gray-600">{article.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingArticle(article);
                              setArticleForm({
                                code: article.code,
                                description: article.description,
                                stockMin: article.stockMin.toString(),
                                prix: article.prix.toString(),
                                fournisseur: article.fournisseur
                              });
                              setShowArticleModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => articlesHook.deleteItem(article.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Stock Total</p>
                          <p className={`font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                            {stockTotal} / {article.stockMin}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Prix</p>
                          <p className="font-medium">{article.prix}€</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Fournisseur</p>
                          <p className="font-medium">{article.fournisseur}</p>
                        </div>
                        <div>
                          {isLowStock && (
                            <button
                              onClick={() => ajouterAuPanier(article)}
                              className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 flex items-center"
                            >
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              Commander
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Détail des stocks par dépôt */}
                      <div className="border-t pt-3">
                        <p className="text-sm font-medium mb-2">Stocks par dépôt:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {depots.map(depot => (
                            <div key={depot} className="text-sm">
                              <span className="text-gray-600">{depot}:</span>
                              <span className="ml-2 font-medium">{article.stocks?.[depot] || 0}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Onglet Inventaire */}
        {activeTab === 'inventaire' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">Inventaire Complet</h2>
              
              <div className="mb-4">
                <select
                  value={selectedDepot}
                  onChange={(e) => setSelectedDepot(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="tous">Tous les dépôts</option>
                  {depots.map(depot => (
                    <option key={depot} value={depot}>{depot}</option>
                  ))}
                </select>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Code</th>
                      <th className="text-left p-2">Description</th>
                      <th className="text-center p-2">Stock Min</th>
                      {selectedDepot === 'tous' ? (
                        <>
                          {depots.map(depot => (
                            <th key={depot} className="text-center p-2">{depot}</th>
                          ))}
                          <th className="text-center p-2">Total</th>
                        </>
                      ) : (
                        <th className="text-center p-2">Quantité</th>
                      )}
                      <th className="text-center p-2">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articlesHook.data.map(article => {
                      const stockTotal = Object.values(article.stocks || {}).reduce((a, b) => a + b, 0);
                      const isLowStock = stockTotal < article.stockMin;
                      
                      return (
                        <tr key={article.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{article.code}</td>
                          <td className="p-2">{article.description}</td>
                          <td className="p-2 text-center">{article.stockMin}</td>
                          {selectedDepot === 'tous' ? (
                            <>
                              {depots.map(depot => (
                                <td key={depot} className="p-2 text-center">
                                  {article.stocks?.[depot] || 0}
                                </td>
                              ))}
                              <td className="p-2 text-center font-bold">{stockTotal}</td>
                            </>
                          ) : (
                            <td className="p-2 text-center">
                              {article.stocks?.[selectedDepot] || 0}
                            </td>
                          )}
                          <td className="p-2 text-center">
                            {isLowStock ? (
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                Alerte
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                OK
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Stock */}
        {activeTab === 'stock' && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Entrée de stock */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Plus className="w-4 h-4 mr-2 text-green-500" />
                  Entrée Stock
                </h3>
                <div className="space-y-2">
                  <select className="w-full px-3 py-2 border rounded">
                    <option>Sélectionner article</option>
                    {articlesHook.data.map(a => (
                      <option key={a.id} value={a.id}>{a.description}</option>
                    ))}
                  </select>
                  <select className="w-full px-3 py-2 border rounded">
                    <option>Sélectionner dépôt</option>
                    {depots.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <input type="number" placeholder="Quantité" className="w-full px-3 py-2 border rounded" />
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Valider Entrée
                  </button>
                </div>
              </div>
              
              {/* Sortie de stock */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <X className="w-4 h-4 mr-2 text-red-500" />
                  Sortie Stock
                </h3>
                <div className="space-y-2">
                  <select className="w-full px-3 py-2 border rounded">
                    <option>Sélectionner article</option>
                    {articlesHook.data.map(a => (
                      <option key={a.id} value={a.id}>{a.description}</option>
                    ))}
                  </select>
                  <select className="w-full px-3 py-2 border rounded">
                    <option>Sélectionner dépôt</option>
                    {depots.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <input type="number" placeholder="Quantité" className="w-full px-3 py-2 border rounded" />
                  <button className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    Valider Sortie
                  </button>
                </div>
              </div>
              
              {/* Transfert entre dépôts */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-blue-500" />
                  Transfert
                </h3>
                <div className="space-y-2">
                  <select className="w-full px-3 py-2 border rounded">
                    <option>Article à transférer</option>
                    {articlesHook.data.map(a => (
                      <option key={a.id} value={a.id}>{a.description}</option>
                    ))}
                  </select>
                  <select className="w-full px-3 py-2 border rounded">
                    <option>Dépôt source</option>
                    {depots.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <select className="w-full px-3 py-2 border rounded">
                    <option>Dépôt destination</option>
                    {depots.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <input type="number" placeholder="Quantité" className="w-full px-3 py-2 border rounded" />
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Transférer
                  </button>
                </div>
              </div>
              
              {/* État des stocks */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-purple-500" />
                  État Global
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Articles total:</span>
                    <span className="font-medium">{articlesHook.data.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">En alerte:</span>
                    <span className="font-medium text-red-600">{stats.articlesEnAlerte}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Mouvements jour:</span>
                    <span className="font-medium">{mouvementsStockHook.data.filter(m => {
                      const date = new Date(m.date);
                      const today = new Date();
                      return date.toDateString() === today.toDateString();
                    }).length}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Historique des mouvements */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold mb-3">Historique des Mouvements</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Article</th>
                      <th className="text-left p-2">Dépôt</th>
                      <th className="text-center p-2">Quantité</th>
                      <th className="text-left p-2">Opérateur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mouvementsStockHook.data.slice(0, 10).map(mouvement => (
                      <tr key={mouvement.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{new Date(mouvement.date).toLocaleDateString('fr-FR')}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            mouvement.type === 'entree' ? 'bg-green-100 text-green-700' :
                            mouvement.type === 'sortie' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {mouvement.type}
                          </span>
                        </td>
                        <td className="p-2">{mouvement.articleNom}</td>
                        <td className="p-2">{mouvement.depot}</td>
                        <td className="p-2 text-center">{mouvement.quantite}</td>
                        <td className="p-2">{mouvement.operateur}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Équipements */}
        {activeTab === 'equipements' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Gestion des Équipements</h2>
                <button
                  onClick={() => setShowEquipmentModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel Équipement
                </button>
              </div>
              
              <div className="mb-4">
                <select
                  value={selectedEquipmentType}
                  onChange={(e) => setSelectedEquipmentType(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="tous">Tous les types</option>
                  {typesEquipements.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid gap-4">
                {equipmentsHook.data
                  .filter(eq => selectedEquipmentType === 'tous' || eq.type === selectedEquipmentType)
                  .map(equipment => {
                    const getIcon = (type) => {
                      switch(type) {
                        case 'Camion Porteur': return Truck;
                        case 'Nacelle': return Wrench;
                        case 'Groupe électrogène': return Cpu;
                        case 'Osmoseur': return Droplet;
                        case 'Robot nettoyage': return Bot;
                        default: return Package2;
                      }
                    };
                    const Icon = getIcon(equipment.type);
                    
                    return (
                      <div key={equipment.id} className="bg-white border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            <Icon className="w-8 h-8 text-blue-500 mt-1" />
                            <div>
                              <h3 className="font-semibold text-lg">{equipment.nom}</h3>
                              <p className="text-gray-600">{equipment.type}</p>
                              <p className="text-sm text-gray-500">Immat: {equipment.immatriculation}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 rounded text-sm ${
                              equipment.statut === 'Actif' ? 'bg-green-100 text-green-700' :
                              equipment.statut === 'Maintenance' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {equipment.statut}
                            </span>
                            <button
                              onClick={() => {
                                setEditingEquipment(equipment);
                                setEquipmentForm({
                                  nom: equipment.nom,
                                  type: equipment.type,
                                  immatriculation: equipment.immatriculation,
                                  statut: equipment.statut,
                                  kilometrage: equipment.kilometrage?.toString() || '',
                                  heuresService: equipment.heuresService?.toString() || '',
                                  derniereRevision: equipment.derniereRevision,
                                  prochaineRevision: equipment.prochaineRevision
                                });
                                setShowEquipmentModal(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => equipmentsHook.deleteItem(equipment.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                          {equipment.kilometrage && (
                            <div>
                              <p className="text-xs text-gray-500">Kilométrage</p>
                              <p className="font-medium">{equipment.kilometrage} km</p>
                            </div>
                          )}
                          {equipment.heuresService && (
                            <div>
                              <p className="text-xs text-gray-500">Heures service</p>
                              <p className="font-medium">{equipment.heuresService} h</p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-gray-500">Dernière révision</p>
                            <p className="font-medium">{new Date(equipment.derniereRevision).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Prochaine révision</p>
                            <p className={`font-medium ${
                              new Date(equipment.prochaineRevision) < new Date() ? 'text-red-600' : ''
                            }`}>
                              {new Date(equipment.prochaineRevision).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingIntervention({ equipementId: equipment.id });
                              setInterventionForm({ ...interventionForm, equipementId: equipment.id });
                              setShowInterventionModal(true);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Intervention
                          </button>
                          <button
                            onClick={() => {
                              setFuelForm({ ...fuelForm, equipementId: equipment.id });
                              setShowFuelModal(true);
                            }}
                            className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
                          >
                            Ravitaillement
                          </button>
                          <button
                            onClick={() => {
                              setDefautForm({ ...defautForm, equipementId: equipment.id });
                              setShowDefautModal(true);
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            Signaler défaut
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Onglet Interventions */}
        {activeTab === 'interventions' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Interventions</h2>
                <button
                  onClick={() => setShowInterventionModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Intervention
                </button>
              </div>
              
              <div className="grid gap-4">
                {interventionsHook.data.map(intervention => (
                  <div key={intervention.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{intervention.titre}</h3>
                        <p className="text-gray-600">{intervention.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          intervention.statut === 'Terminé' ? 'bg-green-100 text-green-700' :
                          intervention.statut === 'En cours' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {intervention.statut}
                        </span>
                        <button
                          onClick={() => interventionsHook.deleteItem(intervention.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <span className="ml-2">{new Date(intervention.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Équipement:</span>
                        <span className="ml-2">{intervention.equipementNom}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Opérateur:</span>
                        <span className="ml-2">{intervention.operateur}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Durée:</span>
                        <span className="ml-2">{intervention.duree}h</span>
                      </div>
                    </div>
                    
                    {intervention.articlesUtilises && intervention.articlesUtilises.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-medium mb-2">Articles utilisés:</p>
                        <div className="flex flex-wrap gap-2">
                          {intervention.articlesUtilises.map((articleId, index) => {
                            const article = articlesHook.data.find(a => a.id === articleId);
                            return article ? (
                              <span key={index} className="px-2 py-1 bg-blue-50 rounded text-xs">
                                {article.description}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Carburants intégré */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Fuel className="w-6 h-6 mr-2 text-orange-500" />
                  Carburants
                </h2>
                <button
                  onClick={() => setShowFuelModal(true)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Ravitaillement
                </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                {equipmentsHook.data.filter(e => e.type === 'Camion Porteur').map(camion => {
                  const ravitaillements = ravitaillementsHook.data.filter(r => r.equipementId === camion.id);
                  const totalLitres = ravitaillements.reduce((acc, r) => acc + (r.litres || 0), 0);
                  const totalKm = ravitaillements.reduce((acc, r) => acc + (r.kilometresParcourus || 0), 0);
                  const totalCout = ravitaillements.reduce((acc, r) => acc + (r.cout || 0), 0);
                  const consommation = totalKm > 0 ? ((totalLitres / totalKm) * 100).toFixed(1) : 0;
                  
                  return (
                    <div key={camion.id} className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium mb-2">{camion.nom}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Consommation:</span>
                          <span className="font-medium">{consommation} L/100km</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total carburant:</span>
                          <span className="font-medium">{totalLitres} L</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Coût total:</span>
                          <span className="font-medium">{totalCout.toFixed(2)}€</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Véhicule</th>
                      <th className="text-center p-2">Litres</th>
                      <th className="text-center p-2">Kilomètres</th>
                      <th className="text-center p-2">Coût</th>
                      <th className="text-left p-2">Opérateur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ravitaillementsHook.data.slice(0, 5).map(ravitaillement => (
                      <tr key={ravitaillement.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{new Date(ravitaillement.date).toLocaleDateString('fr-FR')}</td>
                        <td className="p-2">{ravitaillement.equipementNom}</td>
                        <td className="p-2 text-center">{ravitaillement.litres} L</td>
                        <td className="p-2 text-center">{ravitaillement.kilometrageActuel} km</td>
                        <td className="p-2 text-center">{ravitaillement.cout}€</td>
                        <td className="p-2">{ravitaillement.operateur}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Maintenance */}
        {activeTab === 'maintenance' && (
          <div className="space-y-4">
            {/* Plan de maintenance */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Plan de Maintenance</h2>
                <button
                  onClick={() => setShowMaintenanceModal(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Planifier Maintenance
                </button>
              </div>
              
              <div className="grid gap-4">
                {maintenancesHook.data.map(maintenance => (
                  <div key={maintenance.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{maintenance.titre}</h3>
                        <p className="text-gray-600">{maintenance.description}</p>
                        <div className="mt-2 flex space-x-4 text-sm">
                          <span>Équipement: {maintenance.equipementNom}</span>
                          <span>Fréquence: {maintenance.frequence}</span>
                          <span>Prochaine: {new Date(maintenance.prochaine).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => maintenancesHook.deleteItem(maintenance.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Défauts signalés */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
                  Défauts Signalés
                </h2>
                <button
                  onClick={() => setShowDefautModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Signaler Défaut
                </button>
              </div>
              
              <div className="grid gap-4">
                {defautsHook.data.filter(d => !d.resolu).map(defaut => (
                  <div key={defaut.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded text-sm ${
                            defaut.severite === 'Critique' ? 'bg-red-100 text-red-700' :
                            defaut.severite === 'Majeur' ? 'bg-orange-100 text-orange-700' :
                            defaut.severite === 'Mineur' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {defaut.severite}
                          </span>
                          <span className="text-sm text-gray-600">
                            {new Date(defaut.date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <h4 className="font-semibold">{defaut.titre}</h4>
                        <p className="text-gray-600">{defaut.description}</p>
                        <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                          <span>Équipement: {defaut.equipementNom}</span>
                          <span>Signalé par: {defaut.operateur}</span>
                        </div>
                        {defaut.photos && defaut.photos.length > 0 && (
                          <div className="mt-2 flex space-x-2">
                            {defaut.photos.map((photo, index) => (
                              <div key={index} className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                <Image className="w-6 h-6 text-gray-400" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => defautsHook.updateItem(defaut.id, { resolu: true })}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => defautsHook.deleteItem(defaut.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Défauts résolus */}
              {defautsHook.data.filter(d => d.resolu).length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3 text-green-600">Défauts Résolus</h3>
                  <div className="space-y-2">
                    {defautsHook.data.filter(d => d.resolu).map(defaut => (
                      <div key={defaut.id} className="bg-green-50 p-3 rounded flex justify-between items-center">
                        <div>
                          <span className="font-medium">{defaut.titre}</span>
                          <span className="text-sm text-gray-600 ml-2">- {defaut.equipementNom}</span>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}