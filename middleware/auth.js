const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
        const userId = decodedToken.userId;
        req.auth = {userId};
        if (req.body.userId && req.body.userId !== userId) // Eventuellement à supprimer en déplaçant la gestion du userId dans les controllers
            throw 'User ID non valable';
        else
            next();
    }
    catch (error) {
        res.status(403).json({error: error || "Requête non-autorisée"});
    }
};