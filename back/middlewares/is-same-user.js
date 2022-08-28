const jwt = require('jsonwebtoken');
const Sauce = require('../models/sauce');

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    Sauce.findOne({ _id: req.params.id })
        .then (sauce => {
            if (sauce.userId == userId) {
                res.status(401).json({ message: "Vous n'avez pas la permission d'effectuer cette action !" })
            }
            else {
                next();
            }
        })
        .catch (error => res.status(500).json({ error }))         
}