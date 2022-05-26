const users = require("./routes/auth/UserIndex.js")

const express = require("express");
const mongoose = require("mongoose");
const app = express();

/********************************************************************************************************************
****************************** A sécuriser avant de commit et push vers le repo Github *****************************/
mongoose.connect('mongodb+srv://<username>:<password>@hottakes.ldelc.mongodb.net/?retryWrites=true&w=majority', {
/********************************************************************************************************************
********************************************************************************************************************/
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

app.post('/api/sauces', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({message: "Sauce créée"});
})

app.get('/api/sauces', (req, res, next) => {
    const listOfSauces = [
        {
            userId: "abcde",
            name: "Sauce 1",
            manufacturer: "abcde",
            description: "Caliente!",
            mainPepper: "Cayenne Pepper",
            imageUrl: "fakeImageUrl1",
            heat: 6,
            likes: 1,
            dislikes: 1,
            usersLiked: ["abcde"],
            usersDisliked: ["badguy42"]
        },
        {
            userId: "azerty",
            name: "Sauce 2",
            manufacturer: "azerty",
            description: "Not So(ce) Hot!",
            mainPepper: "Espelette Pepper",
            imageUrl: "fakeImageUrl2",
            heat: 3,
            likes: 2,
            dislikes: 1,
            usersLiked: ["azerty", "abcde"],
            usersDisliked: ["badguy42"]
        },
        {
            userId: "badguy42",
            name: "Sauce 3",
            manufacturer: "badguy42",
            description: "Badly Hot!",
            mainPepper: "Jalapeno Pepper",
            imageUrl: "fakeImageUrl3",
            heat: 8,
            likes: 1,
            dislikes: 0,
            usersLiked: ["badguy42"],
            usersDisliked: []
        },
    ];
    res.status(200).json(listOfSauces);
});

/* app.use("/api/auth", users); */

module.exports = app;