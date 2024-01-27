const express = require('express');
const authController = require('../controllers/authController');

const { registerValidator } = require('../validators/userValidator');

const router = express.Router();

router.post('/register/', registerValidator, authController.register);

router.post('/login/', authController.login);

module.exports = router;
