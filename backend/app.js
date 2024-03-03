// libraries
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// middlewares
const auth = require('./middleware/authMiddleware.js');

// router
const movieRouter = require('./routes/movieRoutes.js');
const authRouter = require('./routes/authRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const postRouter = require('./routes/postRoutes.js');
const chatRouter = require('./routes/chatRoutes.js');
const marketplaceRouter = require('./routes/marketplaceRoutes.js');

// const adminRouter = require('.routes/adminIndexRoute');

// app creation
const app = express();

// CORS configuration
app.use(
    cors({
        // Configure with your specific CORS settings
        // origin: 'http://cineconnect.com', // PLACEHOLDER: Replace with your frontend domain
        origin: process.env.CORS_ORIGIN, // PLACEHOLDER: Replace with your frontend domain
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);

// built-in body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// logging
app.use(morgan('tiny'));

// // static files
// app.use(express.static('public'));

// cookie parser
app.use(cookieParser());

// routers
// app.use('/', adminRouter);
app.use(auth);
app.use('/v1/auth/', authRouter);
app.use('/v1/', userRouter);
app.use('/v1/forum/', postRouter);

app.use('/v1/chat/', chatRouter);

app.use('/v1/marketplace/', marketplaceRouter);
app.use('/', movieRouter);

// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
