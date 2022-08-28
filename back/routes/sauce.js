const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const verifyUser = require('../middlewares/verify-user');
const isSameUser = require('../middlewares/is-same-user');
const multer = require('../middlewares/multer-config');

const sauceCtrl = require('../controllers/sauce')

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, verifyUser, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, verifyUser, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, isSameUser, sauceCtrl.likeSauce);

module.exports = router;