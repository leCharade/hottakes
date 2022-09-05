// Imports
const Sauce = require('../models/sauce');
const fs = require('fs');

// Obtention de la liste des sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}))
}

// Obtention des données d'une seule sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}))
}

// Création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    // On supprime certaines valeurs par défaut pour qu'elles ne puissent pas être modifiées via certaines requêtes
    delete sauceObject._id;
    delete sauceObject._userId;
    delete sauceObject.likes;
    delete sauceObject.dislikes;
    delete sauceObject.usersLiked;
    delete sauceObject.usersDisliked;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        // On définit les likes et dislikes d'origine à 0
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });

    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({error}))
}

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                // Suppression de l'image d'origine et ajout de la nouvelle image
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    const sauceObject = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                    delete sauceObject._id;
                    delete sauceObject._userId;
                    delete sauceObject.likes;
                    delete sauceObject.dislikes;
                    delete sauceObject.usersLiked;
                    delete sauceObject.usersDisliked;
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                        .catch(error => res.status(400).json({ error }));
                })
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        const sauceObject = { ...req.body };
        delete sauceObject._id;
        delete sauceObject._userId;
        delete sauceObject.likes;
        delete sauceObject.dislikes;
        delete sauceObject.usersLiked;
        delete sauceObject.usersDisliked;
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
            .catch(error => res.status(400).json({ error }));
    }
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            // Suppression de l'image et des données de la sauce
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message : 'Objet supprimé !'}))
                    .catch(error => res.status(401).json({error}));
            });
        })
        .catch(error => req.status(500).json({error}));
}

// Ajout de like ou dislike
exports.likeSauce = (req, res, next) => {
    const sauceId = req.params.id;
    const userId = req.body.userId;
    const like = req.body.like;
    // Si l'utilisateur a cliqué sur Like, on like la sauce
    if (like === 1) {
      Sauce.updateOne(
        { _id: sauceId },
        {
          $inc: { likes: like },
          $push: { usersLiked: userId },
        }
      )
        .then(() => res.status(200).json({ message: "Sauce appréciée !" }))
        .catch((error) => res.status(500).json({ error }));
    }
    // Si l'utilisateur a cliqué sur Dislike, on dislike la sauce
    else if (like === -1) {
      Sauce.updateOne(
        { _id: sauceId },
        {
          $inc: { dislikes: -1 * like },
          $push: { usersDisliked: userId },
        }
      )
        .then(() => res.status(200).json({ message: "Sauce dépréciée !" }))
        .catch((error) => res.status(500).json({ error }));
    }
    else {
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
            // Si l'utilisateur a retiré son like, on décrémente le compte de likes
            if (sauce.usersLiked.includes(userId)) {
                Sauce.updateOne(
                { _id: sauceId },
                { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
                )
                .then(() => {
                    res.status(200).json({ message: "Sauce dépréciée !" });
                })
                .catch((error) => res.status(500).json({ error }));
            // Si l'utilisateur a retiré son dislike, on décrémente le compte de dislikes
            } else if (sauce.usersDisliked.includes(userId)) {
                Sauce.updateOne(
                { _id: sauceId },
                {
                    $pull: { usersDisliked: userId },
                    $inc: { dislikes: -1 },
                }
                )
                .then(() => {
                    res.status(200).json({ message: "Sauce appréciée !" });
                })
                .catch((error) => res.status(500).json({ error }));
            }
        })
        .catch((error) => res.status(401).json({ error }));
    }
};