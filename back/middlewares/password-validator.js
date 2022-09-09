// Imports
const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8)                                    // Minimum length 8
// .is().max()                                     // Maximum length 100
.has().uppercase(1)                              // Must have uppercase letters
.has().lowercase(1)                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 2 digits
// .has().not().spaces()                           // Should not have spaces
// .is().not().oneOf([]);                          // Blacklist these values

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    }
    else {
        res.status(401).json({ message: "Votre mot de passe doit comporter au moins 8 caractères dont au moins une lettre majuscule, une lettre minuscule et un chiffre !" })
    }
}