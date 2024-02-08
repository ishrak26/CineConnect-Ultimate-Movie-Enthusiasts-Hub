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
// const adminRouter = require('.routes/adminIndexRoute');

// app creation
const app = express();

// CORS configuration
app.use(
    cors({
        // Configure with your specific CORS settings
        // origin: 'http://cineconnect.com', // PLACEHOLDER: Replace with your frontend domain
        origin: 'http://localhost:3000', // PLACEHOLDER: Replace with your frontend domain
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
app.use('/v1/profile/', userRouter);
app.use('/', movieRouter);


// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;

/*

1. **`const express = require('express');`**
   - This line imports the Express.js framework into your application. Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

2. **`const morgan = require('morgan');`**
   - This imports Morgan, a HTTP request logger middleware for Node.js. It helps with logging request details.

3. **`const bodyParser = require('body-parser');`**
   - This line imports the `body-parser` middleware. This package is used to parse incoming request bodies in a middleware before your handlers, available under `req.body`.

4. **`const cookieParser = require('cookie-parser');`**
   - Imports `cookie-parser`, a middleware which parses cookies attached to the client request object.

5. **`const auth = require('./middlewares/auth').userAuth;`**
   - Imports a specific middleware function named `userAuth` from a local file located in `./middlewares/auth`. This is likely a custom authentication middleware.

6. **`const router = require('./router/indexRouter');`**
   **`const adminRouter = require('./router/adminIndexRouter');`**
   - These lines import routers from local files. Routers are used to define routes for different URL paths. Here, it seems there are separate routers for general and admin-related routes.

7. **`const app = express();`**
   - Initializes a new Express application. This is a standard way to create an Express app.

8. **`app.use(bodyParser.urlencoded({ extended: false }));`**
   - This tells the app to use the `body-parser` middleware to parse URL-encoded bodies (forms). The `{ extended: false }` option means using the classic encoding.

9. **`app.use(bodyParser.json());`**
   - Enables the `body-parser` middleware to parse JSON payloads.

10. **`app.use(cookieParser());`**
    - This tells the app to use the `cookie-parser` middleware. This middleware will parse cookies attached to the client request object.

11. **`app.use(morgan('tiny'));`**
    - Integrates Morgan into your app with the 'tiny' configuration, which is a minimal output for logging requests.

12. **`app.set('view engine', 'ejs');`**
    - Sets EJS as the template engine for the application. EJS is a simple templating language that lets you generate HTML markup with plain JavaScript.
    Note: This line is not necessary if you are using a different templating engine or not using a templating engine at all.

    **If your Express backend and Next.js frontend are running on different ports or domains, setting up CORS is necessary. CORS (Cross-Origin Resource Sharing) allows your frontend to make requests to your backend without being blocked by the browser's same-origin policy. Without this, browsers will refuse to load content from different origins for security reasons.
    The CORS settings are appropriate for your deployment environment. You might need to customize the cors() middleware configuration to allow only specific origins, methods, and headers.**

13. **`app.use(express.static('public'));`**
    - Serves static files (like images, CSS, JavaScript) from the `public` directory. In other words, this folder is made accessible to the public.

14. **`// app.use(express.urlencoded({ extended: true }));`**
    - This commented line would have enabled parsing of URL-encoded bodies with the `extended` option set to true, if it were not commented out.

15. **`app.use('/admin', adminRouter);`**
    - Uses the `adminRouter` for all requests that start with `/admin`. This means all admin-related routes are defined in `adminRouter`.

16. **`app.use(auth);`**
    - Applies the `auth` middleware globally. This means that the `userAuth` function will run on all routes, likely performing some form of authentication.

17. **`app.use('/', router);`**
    - Uses the `router` for handling requests to the root URL (`/`). This is where your general application routes are defined.

18. **`module.exports = app;`**
    - This line makes the `app` object (your Express application) available for import in other files. This is useful for modularizing your application and is especially important when you are setting up your server.
    
*/
