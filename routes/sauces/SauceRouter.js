const express = require('express');
const router = express.Router();
const SauceController = require('./SauceController');
const auth = require('../../middleware/auth');

router.post('/', auth, SauceController.createSauce);
router.get('/', auth, SauceController.getAllSauces);
router.get('/:id', auth, SauceController.getOneSauce);
router.put('/:id', auth, SauceController.modifySauce);
router.delete('/:id', auth, SauceController.deleteSauce);

module.exports = router;