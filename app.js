const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require ('path');
const mongoSanitize = require('express-mongo-sanitize');

const User = require('./routes/auth/UserRouter');
const Sauce = require('./routes/sauces/SauceRouter')

require('dotenv').config()

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@hottakes.ldelc.mongodb.net/?retryWrites=true&w=majority`, {
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
app.use(mongoSanitize({allowDots: true}));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', User);
app.use('/api/sauces', Sauce);

module.exports = app;