const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./UserModel').model;

exports.signup = async (req, res, next) => {
    try {
        let hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(() => res.status(201).json({message: "Compte créé avec succès"}))
            .catch(error => res.status(400).json({error}));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal error"});
    }
}

exports.login = async (req, res, next) => {
    try {
        let user = await User.findOne({email: req.body.email})
        if (!user)
            return res.status(401).json({error: "Il n'y a pas de compte lié à cette adresse e-mail"});

        bcrypt.compare(req.body.password, user.password)
            .then(validPassword => {
                if (!validPassword)
                    return res.status(401).json({error: "Mot de passe incorrect !"});

                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        {userId: user._id},
                        process.env.TOKEN_KEY,
                        {expiresIn: '24h'}
                    )
                });
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({message: "Internal error"});
            });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal error"});
    }
}