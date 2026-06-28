const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration du mot de passe Admin
const MOT_DE_PASSE_ADMIN = "Renyan2026!"; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'produits.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// Création des dossiers indispensables s'ils n'existent pas
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// API : Récupérer les produits
app.get('/api/produits', (req, res) => {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
});

// API : Ajouter un produit avec image convertie en Base64 (Évite les configurations complexes sur Render)
app.post('/api/produits', (req, res) => {
    const { password, nom, categorie, prix, description, image_base64 } = req.body;
    
    if (password !== MOT_DE_PASSE_ADMIN) {
        return res.status(401).send("Mot de passe administrateur incorrect.");
    }

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    
    // Si aucune image n'est envoyée, on met un placeholder élégant
    const finalImage = image_base64 || 'https://via.placeholder.com/400x300?text=Renyan+Product';

    const nouveauProduit = {
        id: Date.now().toString(),
        nom,
        categorie,
        prix,
        description,
        image_url: finalImage
    };

    data.push(nouveauProduit);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.send(`<script>alert("Produit ajouté avec succès !"); window.location.href="/admin.html";</script>`);
});

// API : Supprimer un produit
app.post('/api/produits/supprimer', (req, res) => {
    const { password, id } = req.body;

    if (password !== MOT_DE_PASSE_ADMIN) {
        return res.status(401).send("Mot de passe incorrect.");
    }

    let data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    data = data.filter(p => p.id !== id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.send(`<script>alert("Produit supprimé."); window.location.href="/admin.html";</script>`);
});

app.listen(PORT, () => {
    console.log(`Renyan est prêt sur le port ${PORT}`);
});