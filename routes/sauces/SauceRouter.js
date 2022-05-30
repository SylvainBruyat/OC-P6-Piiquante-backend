const express = require('express');
const router = express.Router();
const SauceController = require('./SauceController');

router.post('/', SauceController.createSauce);
router.get('/', SauceController.getAllSauces);
router.get('/:id', SauceController.getOneSauce);
router.put('/:id', SauceController.modifySauce);
router.delete('/:id', SauceController.deleteSauce);

module.exports = router;