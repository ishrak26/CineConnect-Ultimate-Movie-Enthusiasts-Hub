const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const userModel = require('../models/User');
const SECRET_KEY = process.env.SECRET_KEY;

const authController = {
    register: async (req, res) => {
        // console.log('req.body', req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({ errors: errors.array() });
        }

        try {
            const { username, email, password, full_name } = req.body;

            // check if user exists
            // TODO: check if email exists
            // TODO: check if username exists

            const hashedPassword = await bcrypt.hash(password, 10);

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

            const user = await userModel.findOne({ username });

            if (!user) {
                return res.status(404).json({ errors: 'User not found' });
            }

            const isPasswordCorrect = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordCorrect) {
                return res
                    .status(401)
                    .json({ errors: 'Username or password is incorrect' });
            }

            const token = jwt.sign({ id: user.id }, SECRET_KEY, {
                expiresIn: '1d',
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
};

module.exports = authController;
