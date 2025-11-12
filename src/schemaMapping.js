// Mapping camelCase -> snake_case
export const mapArticleToSupabase = (article) => ({
  code: article.code,
  description: article.description,
  fournisseur: article.fournisseur,
  prix_unitaire: article.prixUnitaire,
  stock_min: article.stockMin
});

export const mapEquipementToSupabase = (eq) => ({
  immat: eq.immat,
  type: eq.type,
  marque: eq.marque,
  modele: eq.modele,
  // ... à compléter avec tous les champs
});
