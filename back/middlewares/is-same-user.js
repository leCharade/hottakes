// Imports
const jwt = require('jsonwebtoken');
const Sauce = require('../models/sauce');
const dotenv = require('dotenv');

// Récupération des données dotenv
dotenv.config();

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    Sauce.findOne({ _id: req.params.id })
        .then (sauce => {
            if (sauce.userId == userId) {
                next();
            }
            else {
                res.status(401).json({ message: "Vous n'avez pas la permission d'effectuer cette action !" })
            }
        })
        .catch (error => res.status(500).json({ error }))         
}