const express = require('express');
const router = express.Router();

const SauceController = require('./SauceController');
const auth = require('../../middleware/auth');
const multer = require('../../middleware/multer-config')

router.post('/', auth, multer, SauceController.createSauce);
router.get('/', auth, SauceController.getAllSauces);
router.get('/:id', auth, SauceController.getOneSauce);
router.put('/:id', auth, multer, SauceController.modifySauce);
router.delete('/:id', auth, SauceController.deleteSauce);
router.post('/:id/like', auth, SauceController.likeDislikeSauce);

module.exports = router;