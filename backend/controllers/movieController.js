const { supabase } = require('../config/supabaseConfig');

const db_movie = require('../models/Movie.js');

const moviesController = {

    getMovies: async (req, res) => {
        const limit = req.query.limit || 10; // Default limit to 10 if not specified
        try {
            console.log('title: ', req.query.title);
            const title = req.query.title || ''; // if title is not provided, use empty string
            const movies = await db_movie.fetchMoviesByTitle(title, limit);
            res.json(movies || []);
        } catch (error) {
            console.log('in catch: ', error.message);
            res.status(500).json({ message: error.message });
        }
    },

    getMovieById: async (req, res) => {
        try {
            // console.log(req.params);
            const movieId = req.params.movieId;
            const movie = await db_movie.fetchMoviesById(movieId);
            if (movie && movie.length > 0) {
                res.json(movie[0]);
            } else {
                res.status(404).json({ message: 'Movie not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateMovie: async (req, res) => {  // need authentication that user is a moderator
        try {
            const movieId = req.params.movieId;
            const movieData = req.body;

            // Validate and sanitize input data
            const updateData = {
                title: movieData.title,
                release_date: movieData.release_date,
                duration_in_mins: movieData.duration_in_mins,
                language: movieData.language,
                country_of_first_release: movieData.country_of_first_release,
                certification: movieData.certification,
                trailer_url: movieData.trailer_url,
                poster_url: movieData.poster_url,
                plot_summary: movieData.plot_summary,
                // Additional properties if they need to be updated
            };

            const result = await db_movie.updateMovieById(movieId, updateData);

            if (result) {
                res.status(200).json({ message: "Movie successfully updated" });
            } else {
                res.status(404).json({ message: "Movie not found" });
            }
        } catch (error) {
            if (error.message === "Invalid input") {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Internal server error occurred" });
            }
        }
    },

    submitMovieRating: async (req, res) => {    // need authentication that the user is logged in
        const movieId = req.params.movieId;
        const { rating } = req.body;

        // Validate the rating
        if (!rating || typeof rating !== 'number') {
            return res.status(400).json({ message: "Invalid input provided" });
        }

        try {
            const userId = req.user.id;
            const result = await db_movie.addMovieRating(movieId, userId, rating);

            if (result) {
                res.status(201).json({ message: "Movie successfully rated" });
            } else {
                res.status(500).json({ message: "Internal server error occurred" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    editMovieRating: async (req, res) => {  // need authentication that the user is logged in
        const movieId = req.params.movieId;
        const { rating } = req.body;

        // Validate the rating
        if (!rating || typeof rating !== 'number') {
            return res.status(400).json({ message: "Invalid input provided" });
        }

        try {
            const userId = req.user.id;
            const result = await db_movie.updateMovieRating(movieId, userId, rating);

            if (result) {
                res.status(200).json({ message: "Rating successfully updated" });
            } else {
                res.status(404).json({ message: "Movie not found" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteMovieRating: async (req, res) => {    // need authentication that the user is logged in
        const movieId = req.params.movieId;

        try {
            // Assuming you have a userId from the auth token or session
            const userId = req.user.id;
            const result = await db_movie.deleteMovieRatingById(movieId, userId);

            if (result) {
                res.status(200).json({ message: "Rating deleted successfully" });
            } else {
                res.status(404).json({ message: "No movie/previous rating found for the provided movieId" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    addToWatchlist: async (req, res) => {
        const movieId = req.params.movieId;
        const userId = req.user.id; // Assuming you have a way to get userId from the request (e.g., from a JWT token)

        try {
            const result = await db_movie.addMovieToWatchlist(movieId, userId);
            if (result) {
                res.status(201).json({ message: "Movie successfully added to watchlist" });
            } else {
                res.status(404).json({ message: "Movie not found" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    removeFromWatchlist: async (req, res) => {
        const movieId = req.params.movieId;
        const userId = req.user.id; // Assuming you have a way to get userId from the request

        try {
            const result = await db_movie.removeMovieFromWatchlist(movieId, userId);
            if (result) {
                res.status(200).json({ message: "Movie successfully removed from watchlist" });
            } else {
                res.status(404).json({ message: "No movie/previous addition to watchlist found for the provided movieId" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    markAsWatched: async (req, res) => {
        const movieId = req.params.movieId;
        const userId = req.user.id; // Assuming you have a way to get userId from the request (e.g., from a JWT token)

        try {
            const result = await db_movie.markMovieAsWatched(movieId, userId);
            if (result) {
                res.status(201).json({ message: "Movie successfully added to watched-list" });
            } else {
                res.status(404).json({ message: "Movie not found" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    unmarkAsWatched: async (req, res) => {
        const movieId = req.params.movieId;
        const userId = req.user.id; // Assuming you have a way to get userId from the request

        try {
            const result = await db_movie.unmarkMovieAsWatched(movieId, userId);
            if (result) {
                res.status(200).json({ message: "Movie successfully removed from watched-list" });
            } else {
                res.status(404).json({ message: "No movie/previous addition to watched-list found for the provided movieId" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getMovieAwards: async (req, res) => {
        const movieId = req.params.movieId;

        try {
            const awardsData = await db_movie.fetchMovieAwards(movieId);
            if (awardsData) {
                res.status(200).json(awardsData);
            } else {
                res.status(404).json({ message: "No movie found for the provided movieId" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getMovieCasts: async (req, res) => {
        const movieId = req.params.movieId;
        const limit = req.query.limit || 10; // Default limit to 10 if not specified   
        const offset = req.query.offset || 0; // Default offset to 0 if not specified

        try {
            const castsData = await db_movie.fetchTopCastsByMovieId(movieId, offset, limit);
            // const directorsData = await db_movie.fetchDirectorsByMovieId(movieId);
            
            if (castsData) {
                res.status(200).json({ casts: castsData });
            } else {
                res.status(404).json({ message: "No movie found for the provided movieId" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getMoviePersonById: async (req, res) => {
        const moviePersonId = req.params.moviePersonId;

        try {
            const moviePersonData = await moviePersonModel.fetchMoviePersonsById(moviePersonId);

            if (!moviePersonData) {
                // No data found or an error occurred
                return res.status(404).json({ message: 'Movie person not found' });
            }

            res.status(200).json(moviePersonData);
        } catch (error) {
            console.error('Error in getMoviePersonById:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getSimilarMovies: async (req, res) => {
        const movieId = req.params.movieId;
        const limit = req.query.limit || 10; // Default limit to 10 if not specified

        try {
            const similarMovies = await db_movie.fetchSimilarMovies(movieId, limit);
            
            if (similarMovies) {
                res.status(200).json(similarMovies);
            } else {
                res.status(404).json({ message: "No movie found for the provided movieId" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    submitNewMovie: async (req, res) => {
        const movieData = req.body; // Assuming the movie data is sent in the request body

        try {
            const submitResult = await db_movie.submitNewMovie(movieData);

            if (submitResult) {
                res.status(201).json({ 
                    message: "Movie successfully submitted for approval",
                    requestId: submitResult.requestId // Assuming this is generated in the model
                });
            } else {
                res.status(400).json({ message: "Invalid input provided" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getMovieReviews: async (req, res) => {
        const movieId = req.params.movieId; // Extract movieId from request parameters

        try {
            const reviews = await db_movie.getMovieReviews(movieId);

            if (reviews) {
                res.status(200).json(reviews);
            } else {
                res.status(404).json({ message: "No movie found for the provided movieId" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    submitMovieReview: async (req, res) => {
        const movieId = req.params.movieId; // Extract movieId from request parameters
        const reviewData = req.body; // Extract review data from request body

        try {
            // Assume a user ID is extracted from the Authorization header (token)
            const userId = getUserIdFromToken(req.headers.authorization);

            const reviewId = await db_movie.submitMovieReview(movieId, userId, reviewData);

            if (reviewId) {
                res.status(201).json({
                    message: "Review submitted successfully",
                    reviewId: reviewId
                });
            } else {
                res.status(404).json({ message: "Movie not found" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Add more methods as per your API documentation...

};

module.exports = moviesController;

