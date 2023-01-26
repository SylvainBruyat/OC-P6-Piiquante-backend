const fs = require('fs');
const ftp = require('jsftp');

const Sauce = require('./SauceModel').model;

exports.createSauce = async (req, res, next) => {
    try {
        const sauceObject = JSON.parse(req.body.sauce);
        delete sauceObject._id;
        const sauce = new Sauce({
            ...sauceObject,
            imageUrl: `https://hottakes.sylvain-bruyat.dev/images/${req.file.originalname}`,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: []
        });
        const client = await new ftp({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            pass: process.env.FTP_PASSWORD
        });
        await client.put(req.file.buffer, `images/${req.file.originalname}`, async (error) => {
            if (error) throw error;
            else {
                await sauce.save();
                res.status(201).json({message: "Sauce créée avec succès !"});
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

exports.getAllSauces = async (req, res, next) => {
    try {
        let sauces = await Sauce.find();
        res.status(200).json(sauces);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

exports.getOneSauce = async (req, res, next) => {
    try {
        let sauce = await Sauce.findOne({_id: req.params.id});
        if (!sauce)
            return res.status(404).json({message: "Sauce non trouvée !"});
        res.status(200).json(sauce);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

exports.modifySauce = async (req, res, next) => {
    try {
        let sauce = await Sauce.findOne({_id: req.params.id});

        if (req.file) {
            const client = await new ftp({
                host: process.env.FTP_HOST,
                user: process.env.FTP_USER,
                pass: process.env.FTP_PASSWORD
            });

            await client.put(req.file.buffer, `images/${req.file.originalname}`, (error) => {
                if (error) throw error;
            });

            const oldFilename = sauce.imageUrl.split('/images/')[1];
            await client.auth(process.env.FTP_USER, process.env.FTP_PASSWORD, (error) => {
                if (error) throw error;
            })
            await client.raw("DELE", `images/${oldFilename}`, (error, data) => {
                if (error) throw error;
            })
        }
        
        const sauceObject = req.file ?
            {
                ...JSON.parse(req.body.sauce),
                imageUrl: `https://hottakes.sylvain-bruyat.dev/images/${req.file.originalname}`
            }
            : {...req.body};
        await Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id});
        res.status(200).json({message: "Sauce modifiée avec succès !"});
        
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

exports.deleteSauce = async (req, res, next) => {
    try {
        let sauce = await Sauce.findOne({_id: req.params.id});
        
        if (!sauce)
            return res.status(404).json({message: "Sauce non trouvée !"});

        if (sauce.userId !== req.auth.userId)
            return res.status(403).json({message: "Requête non-autorisée !"});

        const filename = sauce.imageUrl.split('/images/')[1];
        const client = await new ftp({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            pass: process.env.FTP_PASSWORD
        });
        await client.raw("DELE", `images/${filename}`, async (error, data) => {
            if (error) throw error;
            else {
                await Sauce.deleteOne({_id: req.params.id});
                res.status(200).json({message: "Sauce supprimée avec succès !"});
            }
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

exports.likeDislikeSauce = async (req, res, next) => {
    try {
        let sauce = await Sauce.findOne({_id: req.params.id});

        if (!sauce)
            return res.status(404).json({message: "Sauce non trouvée !"});
    
        const userAlreadyLiked = sauce.usersLiked.find(userId => userId == req.auth.userId);
        const userAlreadyDisliked = sauce.usersDisliked.find(userId => userId == req.auth.userId);
        switch (req.body.like) {
            case -1:
                if (userAlreadyDisliked) {
                    return res.status(409).json({message: "Vous avez déjà disliké cette sauce !"});
                }
                else if (userAlreadyLiked) {
                    return res.status(409).json({message: "Vous ne pouvez pas disliké une sauce que vous avez déjà liké !"});
                }
                else {
                    await Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: req.auth.userId}});
                    return res.status(201).json({message: "Dislike pris en compte !"});
                }
            
            case 0:
                if (userAlreadyDisliked) {
                    await Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: req.auth.userId}});
                    return res.status(201).json({message: "Dislike supprimé !"});
                }
                else if (userAlreadyLiked) {
                    await Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: req.auth.userId}});
                    return res.status(201).json({message: "Like supprimé !"});
                }
                else {
                    return res.status(409).json({message: "Vous n'avez pas de like ou dislike à supprimer pour cette sauce !"});
                }
            
            case 1:
                if (userAlreadyDisliked) {
                    return res.status(409).json({message: "Vous ne pouvez pas liké une sauce que vous avez déjà disliké !"});
                }
                else if (userAlreadyLiked) {
                    return res.status(409).json({message: "Vous avez déjà liké cette sauce !"});
                }
                else {
                    await Sauce.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: req.auth.userId}});
                    return res.status(201).json({message: "Like pris en compte !"});
                }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}