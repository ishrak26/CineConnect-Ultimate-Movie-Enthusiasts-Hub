const jwt = require('jsonwebtoken');
require('dotenv');

const SECRET_KEY = process.env.SECRET_KEY;

const authenticateTokens = async (req, res, next) => {
    req.user = null;

    // const token = req.header('Authorization')?.split(' ')[1];
    // console.log('req', req);
    // console.log('req.cookies', req.cookies);
    // console.log('req.headers', req.headers);

    if (!req.cookies) {
        next();
    } else {
        // console.log('req.cookies', req.cookies);

        const token = req.cookies.token;

        if (!token) {
            // return res.status(401).json({ message: 'No token provided' });
            // req.user = null;
            next();
        } else {
            try {
                const user = jwt.verify(token, SECRET_KEY);
                req.user = user;
                console.log('req.user', req.user);
                next();
            } catch (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }
        }
    }
};

module.exports = authenticateTokens;
