#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const appFilePath = path.join(__dirname, 'src', 'App.js');
console.log('📝 Modification de App.js en cours...\n');
try {
  let content = fs.readFileSync(appFilePath, 'utf8');
  console.log('✅ Modification #1 - Ajout des imports hooks...');
  const importLine = "import React, { useState, useRef, useEffect, useCallback } from 'react';";
  const newImportLine = "import React, { useState, useRef, useEffect, useCallback } from 'react';\nimport { useArticles, useEquipements, useStock, useInterventions, useDefauts, useAccessoires } from './hooks';";
  content = content.replace(importLine, newImportLine);
  console.log('✅ Modification #2 - Articles avec hook...');
  content = content.replace(/const \[articles, setArticles\] = useState\(\[\s*\{[\s\S]*?\n\s*\]\);/, "const { articles, setArticles, ajouterArticle, mettreAJourArticle } = useArticles();");
  console.log('✅ Modification #3 - Équipements avec hook...');
  content = content.replace(/const \[equipements, setEquipements\] = useState\(\[\s*\{[\s\S]*?\n\s*\]\);/, "const { equipements, setEquipements, ajouterEquipement, mettreAJourEquipement, supprimerEquipement } = useEquipements();");
  console.log('✅ Modification #4 - Mouvements stock avec hook...');
  content = content.replace(/const \[mouvementsStock, setMouvementsStock\] = useState\(\[\s*\{[\s\S]*?\n\s*\]\);/, "const { mouvementsStock, setMouvementsStock, stockParDepot, setStockParDepot, ajouterMouvement, mettreAJourStockDepot } = useStock();");
  console.log('✅ Modification #5 - Interventions avec hook...');
  content = content.replace(/const \[interventions, setInterventions\] = useState\(\[\s*\{[\s\S]*?\n\s*\]\);/, "const { interventions, setInterventions, ajouterIntervention, mettreAJourIntervention, ajouterArticleIntervention } = useInterventions();");
  console.log('✅ Modification #6 - Défauts avec hook...');
  content = content.replace(/const \[defauts, setDefauts\] = useState\(\[\s*\{[\s\S]*?\n\s*\]\);/, "const { defauts, setDefauts, ajouterDefaut, mettreAJourDefaut, ajouterPhotoDefaut } = useDefauts();");
  console.log('✅ Modification #7 - Accessoires avec hook...');
  content = content.replace(/const \[accessoiresEquipement, setAccessoiresEquipement\] = useState\(\{[\s\S]*?}\);/, "const { accessoires, setAccessoires, ajouterAccessoire, mettreAJourAccessoire, supprimerAccessoire } = useAccessoires();");
  fs.writeFileSync(appFilePath, content, 'utf8');
  console.log('\n✅ ✅ ✅ MODIFICATIONS TERMINÉES! ✅ ✅ ✅\n');
  console.log('🚀 Lancez: npm start\n');
} catch (error) {
  console.error('❌ ERREUR:', error.message);
  process.exit(1);
}
