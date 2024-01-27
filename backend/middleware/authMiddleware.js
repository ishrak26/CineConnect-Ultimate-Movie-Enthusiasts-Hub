const jwt = require('jsonwebtoken');
require('dotenv');

const SECRET_KEY = process.env.SECRET_KEY;

const authenticateTokens = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        // return res.status(401).json({ message: 'No token provided' });
        req.user = null;
        next();
    } else {
        try {
            const user = jwt.verify(token, SECRET_KEY);
            req.user = user;
            next();
        } catch (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
    }
};

module.exports = authenticateTokens;
