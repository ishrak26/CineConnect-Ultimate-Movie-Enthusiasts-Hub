const express = require('express');
const authController = require('../controllers/authController');

const { registerValidator } = require('../validators/userValidator');

const router = express.Router();

router.post('/register/', registerValidator, authController.register); // /v1/auth/register

router.post('/login/', authController.login); // /v1/auth/login

// Route to check if the user is logged in
router.get('/isLoggedIn/', authController.isLoggedIn); // /v1/auth/isLoggedIn

// Route to match password and confirm password
router.post('/:username/matchPassword/', authController.matchPassword); // /v1/auth/:username/matchPassword

// Router to logout 
router.post('/logout/', authController.logout); // /v1/auth/logout

module.exports = router;
