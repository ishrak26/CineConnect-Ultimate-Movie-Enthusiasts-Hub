const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();


// Route for getting a list of movies with filters
router.get('/v1/movies/', movieController.getMovies); // **//

// Route for getting details of a specific movie
router.get('/v1/movie/:movieId', movieController.getMovieById); // **//

// Route for editing a specific movie
router.put('/v1/movie/:movieId', movieController.updateMovie);

// Route for submitting a rating for a movie
router.post('/v1/movie/:movieId/rate', movieController.submitMovieRating);

// Route for editing a movie rating
router.put('/v1/movie/:movieId/rate', movieController.editMovieRating);

// Route for deleting a movie rating
router.delete('/v1/movie/:movieId/rate', movieController.deleteMovieRating);

// Route for adding a movie to a user's watchlist
router.post('/v1/movie/:movieId/watch', movieController.addToWatchlist);

// Route for removing a movie from a user's watchlist
router.delete('/v1/movie/:movieId/watch', movieController.removeFromWatchlist);

// Route for marking a movie as watched
router.post('/v1/movie/:movieId/watched', movieController.markAsWatched);

// Route for unmarking a movie as watched
router.delete('/v1/movie/:movieId/watched', movieController.unmarkAsWatched);

// Route for getting all awards of a specific movie
router.get('/v1/movie/:movieId/awards-nominations', movieController.getMovieAwards);

// Route for getting all casts and crews of a specific movie
router.get('/v1/movie/:movieId/casts', movieController.getMovieCasts);  // **//

// Route for getting a list of similar movies
router.get('/v1/movie/:movieId/similar', movieController.getSimilarMovies);

// Route for submitting a new movie
router.post('/v1/movie/submit', movieController.submitNewMovie);

// Route for getting all the reviews of a specific movie
router.get('/v1/movie/:movieId/reviews', movieController.getMovieReviews);

// Route for submitting a review for a movie
router.post('/v1/movie/:movieId/review/submit', movieController.submitMovieReview);

// Route for getting a specific movie person
router.get('/v1/moviePerson/:moviePersonId', movieController.getMoviePersonById); // **//

// Router to add a new movie to my watchlist
router.post('/v1/movie/:movieId/watch', movieController.addToWatchlist);

// Router to remove a movie from my watchlist
router.delete('/v1/movie/:movieId/watch', movieController.removeFromWatchlist);

// Router to mark a movie as watched
router.post('/v1/movie/:movieId/watched', movieController.markAsWatched);

// Router to unmark a movie as watched
router.delete('/v1/movie/:movieId/watched', movieController.unmarkAsWatched);

// Router to get all movie genres 
router.get('/v1/genres', movieController.getMovieGenres);

// Router to filter movies by genre
router.get('/v1/genre/:genreId/movies', movieController.getMoviesByGenre);

module.exports = router;

