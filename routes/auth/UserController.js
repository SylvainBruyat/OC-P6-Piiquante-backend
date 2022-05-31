const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./UserModel');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({message: "Utilisateur créé avec succès"}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({message: "Internal error"});
        });
}

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({error: "Il n'y a pas de compte lié à cette adresse e-mail"});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(validPassword => {
                    if (!validPassword) {
                        return res.status(401).json({error: "Mot de passe incorrect !"});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            'THi5_IS-My&S3CRET+T0ken*ENcrypTION/key', // Clé temporaire pour le développement. A remplacer en production
                            {expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json({message: "Internal error"});
                })
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({message: "Internal error"});
        });
};




/* module.exports = {
    signup: async (req, res) => {
        try {
            res.send("OK");
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal error");
        }
    }
} */