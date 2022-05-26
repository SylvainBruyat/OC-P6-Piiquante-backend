const express = require('express');
const mongoose = require('mongoose');
const app = express();

const User = require('./routes/auth/UserIndex.js');
const Sauce = require('./routes/sauces/SauceModel.js');

/********************************************************************************************************************
****************************** A sécuriser avant de commit et push vers le repo Github *****************************/
mongoose.connect('mongodb+srv://<username>:<password>@hottakes.ldelc.mongodb.net/?retryWrites=true&w=majority', {
/********************************************************************************************************************
********************************************************************************************************************/
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connexion à MongoDB réussie !"))
.catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

app.post('/api/sauces', (req, res, next) => {
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save()
        .then(() => res.status(201).json({message: "Sauce créée avec succès !"}))
        .catch(error => res.status(400).json({error}));
});

app.get('/api/sauces', (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
});

app.get('/api/sauces/:id', (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
});

/* app.use("/api/auth", User); */

module.exports = app;