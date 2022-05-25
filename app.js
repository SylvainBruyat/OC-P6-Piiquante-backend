const USERS = require("./routes/users/index.js")

const EXPRESS = require("express");
const APP = EXPRESS();

APP.use((req, res, next) => {
    console.log("Requête reçue");
    next();
})

APP.use((req, res, next) => {
    res.status(201);
    next();
})

APP.use((req, res, next) => {
    res.json({message: "Votre requête a bien été reçue"});
    next();
})

APP.use((req, res) => {
    console.log("Réponse envoyée avec succès");
})

/* APP.use("/api/users", USERS); */

module.exports = APP;