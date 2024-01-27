const { body } = require('express-validator');

exports.registerValidator = [
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/)
        .withMessage('Password must contain both letters and numbers'),
];
