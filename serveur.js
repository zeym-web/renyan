const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration du mot de passe Admin
const MOT_DE_PASSE_ADMIN = "Renyan2026!";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sert tous les fichiers statiques: CSS, JS, Images, index.html
app.use(express.static(__dirname)); 

const DATA_FILE = path.join(__dirname, 'produits.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads'); 

// Création des dossiers/fichiers indispensables s'ils n'existent pas
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// API : Récupérer les produits
app.get('/api/produits', (req, res) => {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  res.json(JSON.parse(data));
});

// API : Ajouter un produit 
app.post('/api/produits', (req, res) => {
  const { password, nom, categorie, prix, description, image_base64 } = req.body;

  if (password !== MOT_DE_PASSE_ADMIN) {
    return res.status(401).send("Mot de passe administrateur incorrect.");
  }
  
  // Ici tu mets le reste de ton code pour ajouter le produit
  // ...
  
  res.send("Produit ajouté");
});

// FIX POUR "Cannot GET /" 
// Force l'envoi de index.html quand on arrive sur /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => console.log(`Renyan est prêt sur le port ${PORT}`));
