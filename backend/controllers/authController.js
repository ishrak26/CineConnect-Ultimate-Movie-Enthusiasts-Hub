const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const userModel = require('../models/User');
const SECRET_KEY = process.env.SECRET_KEY;

const authController = {
    register: async (req, res) => {
        console.log('req.body', req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('errors', errors);
            return res.status(422).send({ errors: errors.array() });
        }

        try {
            const { username, email, password, full_name } = req.body;

            console.log('req.body', req.body);
            // console.log('username', username);
            // console.log('email', email);
            // console.log('password', password);
            // console.log('full_name', full_name);

            // check conflicts
            // check if email exists
            const emailExists = await userModel.checkIfEmailExists({ email });
            if (emailExists) {
                return res.status(409).json({ errors: 'Email already exists' });
            }

            // check if username exists
            const userExists = await userModel.checkIfUserExists({ username });
            if (userExists) {
                return res
                    .status(409)
                    .json({ errors: 'Username already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('hashedPassword', hashedPassword);

            const user = await userModel.createUser({
                username,
                email,
                password: hashedPassword,
                full_name,
            });

            // const token = jwt.sign({ id: user.id }, SECRET_KEY);
            return res.status(201).json({ success: true });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ errors: err });
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            console.log('login: ', req.body);
            // console.log('username', username);
            // console.log('password', password);

            const user = await userModel.findOne({ username });

            if (!user) {
                console.log('user not found');
                return res
                    .status(401)
                    .json({ errors: 'Username or password is incorrect' });
            }

            console.log('user', user);

            // const hashedPassword = await bcrypt.hash(password, 10);

            // console.log('hashedPassword', hashedPassword);
            console.log('user.password', user.password);
            const isPasswordCorrect = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordCorrect) {
                console.log('password incorrect');
                return res
                    .status(401)
                    .json({ errors: 'Username or password is incorrect' });
            }

            const token = jwt.sign({ id: user.id }, SECRET_KEY, {
                expiresIn: '1d',
            });
            // Set the JWT in an HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true, // Makes the cookie inaccessible to client-side JS
                secure: false, // Ensures the cookie is only sent over HTTPS
                sameSite: 'strict', // Helps mitigate CSRF attacks
            });
            return res.status(200).json({
                user: { username: user.username, id: user.id, role: user.role },
                token: token,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ errors: err });
        }
    },

    isLoggedIn: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(200).json({ loggedIn: false });
            }
            const user = await userModel.fetchUserById({ id: req.user.id });
            if (!user) {
                return res.status(200).json({ loggedIn: false });
            }
            return res.status(200).json({
                user: {
                    username: user.username,
                    id: user.id,
                    role: user.role,
                    loggedIn: true,
                },
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ errors: err });
        }
    },
};

module.exports = authController;
