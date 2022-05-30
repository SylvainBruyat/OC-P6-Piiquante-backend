const express = require('express');
const mongoose = require('mongoose');
const app = express();

const User = require('./routes/auth/UserRouter');
const Sauce = require('./routes/sauces/SauceRouter')

/********************************************************************************************************************
****************************** A sécuriser avant de commit et push vers le repo Github *****************************/
mongoose.connect('mongodb+srv://<username>:<password>@hottakes.ldelc.mongodb.net/?retryWrites=true&w=majority', {
/********************************************************************************************************************
********************************************************************************************************************/
    useNewUrlParser: true,
    useUnifiedTopology: true})
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

app.use(express.json());

app.use('/api/sauces', Sauce);

/* app.use("/api/auth", User); */

module.exports = app;