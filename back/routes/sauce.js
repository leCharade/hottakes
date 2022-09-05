// Imports
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const isSameUser = require('../middlewares/is-same-user');
const isNotSameUser = require('../middlewares/is-not-same-user');
const multer = require('../middlewares/multer-config');

const sauceCtrl = require('../controllers/sauce')

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, isSameUser, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, isSameUser, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, isNotSameUser, sauceCtrl.likeSauce);

module.exports = router;