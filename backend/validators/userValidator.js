const { body } = require('express-validator');

// password is already hashed from the frontend
exports.registerValidator = [
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('full_name').isLength({ min: 1 }).withMessage('Empty full name'),
];
