const express = require('express');
const authController = require('../controllers/authController');

const { registerValidator } = require('../validators/userValidator');

const router = express.Router();

router.post('/register/', registerValidator, authController.register); // /v1/auth/register

router.post('/login/', authController.login); // /v1/auth/login

router.post('/logout/', authController.logout); // /v1/auth/logout

module.exports = router;
