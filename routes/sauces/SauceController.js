const Sauce = require('./SauceModel');

exports.createSauce = (req, res, next) => {
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save() //Renvoie le produit créé (y compris l'ID) quand la promise est résolue
        .then(() => res.status(201).json({message: "Sauce créée avec succès !"}))
        .catch(error => res.status(400).json({error}));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
};

exports.modifySauce = (req, res, next) => {
    Sauce.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id})
        .then(() => res.status(200).json({message: "Sauce modifiée avec succès !"}))
        .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({_id: req.params.id})
        .then(() => res.status(200).json({message: "Sauce supprimée avec succès !"}))
        .catch(error => res.status(400).json({error}));
};