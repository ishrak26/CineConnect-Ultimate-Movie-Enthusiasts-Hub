// configuring .env variables
require('dotenv').config();
const { supabase } = require('./config/supabaseConfig');
const app = require('./app');

const port = process.env.PORT;

// const movie = require('./models/Movie');
// movie.fetchMoviesByTitle('godfather');
let server;
server = app.listen(port, () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Server listening on http://localhost:${port}`);
    }
    // You can perform any additional startup logic here if needed
});

// Handling graceful shutdown
process
    .once('SIGTERM', () => {
        console.log('SIGTERM received. Shutting down gracefully.');
        server.close(() => {
            console.log('Server shut down.');
        });
    })
    .once('SIGINT', () => {
        console.log('SIGINT received. Shutting down gracefully.');
        server.close(() => {
            console.log('Server shut down.');
        });
    });

/*

1. require('dotenv').config();

This line imports the dotenv package and calls its config function. This enables your application to read environment variables from a .env file at the root of your project. This is useful for managing configuration settings separately from your code, such as API keys, database credentials, and other sensitive information.

2. const app = require('./app');

Imports the Express application created in the app.js file. This is likely where you set up your middleware, routes, and other Express-related configurations.

3. const database = require('./database/database');

Imports a module related to database operations, possibly containing functions to start up and shut down the database connection pool.

4. process.env.UV_THREADPOOL_SIZE = 10;

Sets the environment variable UV_THREADPOOL_SIZE to 10. This is specific to Node.js's underlying libuv threadpool, which is used for operations like file system I/O, DNS operations, and some specific types of work in database drivers. Increasing the threadpool size can improve performance when there are many concurrent I/O operations, which is common in database-heavy applications.

5. const port = process.env.PORT;

Retrieves the port number from the environment variables. This is the port on which your Express server will listen.

6. app.listen(port, async () => { ... });

Starts the server listening on the specified port. Inside the callback function, there's logic to handle database initialization and error handling.

7. Inside the callback of app.listen:

await database.startup();
Asynchronously initializes the database connection pool. This is likely where it connects to the database and becomes ready to handle queries.
console.log(listening on http://localhost:${port}`);`
Logs a message to the console indicating that the server has successfully started and is listening on the specified port.
catch (err) { ... }
Catches and logs any errors that occur during the startup of the database. If an error occurs, it logs the error message and exits the process.

8. process.once('SIGTERM', database.shutdown).once('SIGINT', database.shutdown);

Registers event listeners for SIGTERM and SIGINT signals. These are termination signals, typically sent when you want to gracefully shut down your application (like when you press Ctrl+C in the console). When these signals are received, it calls the database.shutdown function to properly close the database connection.

*/
