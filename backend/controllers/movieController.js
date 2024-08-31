const { supabase } = require('../config/supabaseConfig');

const db_movie = require('../models/Movie.js');

const moviesController = {
    getMovies: async (req, res) => {
        const limit = req.query.limit || 10; // Default limit to 10 if not specified
        const offset = req.query.offset || 0; // Default offset to 0 if not specified
        // console.log('user: ', req.user);
        try {
            const title = req.query.title || ''; // if title is not provided, use empty string
            const movies = await db_movie.fetchMoviesByTitle(
                title,
                offset,
                limit
            );

            res.status(200).json(movies || []);
        } catch (error) {
            console.error('in catch: ', error.message);
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

    getMovieGenres: async (req, res) => {
        try {
            const genres = await db_movie.fetchAllGenres();
            res.status(200).json(genres);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getMoviesByGenre: async (req, res) => {
        try {
            const genreId = req.params.genreId;

            const limit = req.query.limit || 10; // Default limit to 10 if not specified
            const offset = req.query.offset || 0; // Default offset to 0 if not specified

            // Use the model function to fetch movies by genre
            const movies = await db_movie.fetchMoviesByGenre(
                genreId,
                limit,
                offset
            );

            if (!movies) {
                return res.status(404).json({
                    message: 'Movies for the specified genre not found.',
                });
            }

            // Send the movies as a response
            res.status(200).json(movies);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message:
                    'Internal server error occurred while fetching movies by genre.',
            });
        }
    },

    getMoviePersonById: async (req, res) => {
        const moviePersonId = req.params.moviePersonId;
        // console.log(req.params);
        try {
            const moviePersonData = await db_movie.fetchMoviePersonsById(
                moviePersonId
            );

            if (!moviePersonData) {
                // No data found or an error occurred
                return res
                    .status(404)
                    .json({ message: 'Movie person not found' });
            }

            res.status(200).json(moviePersonData);
        } catch (error) {
            console.error('Error in getMoviePersonById:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateMovie: async (req, res) => {
        // need authentication that user is a moderator
        try {
            if (!req.user || req.user.role !== 'moderator') {
                return res.status(403).json({ message: 'Unauthorized' });
            }

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
                res.status(200).json({ message: 'Movie successfully updated' });
            } else {
                res.status(404).json({ message: 'Movie not found' });
            }
        } catch (error) {
            if (error.message === 'Invalid input') {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({
                    message: 'Internal server error occurred',
                });
            }
        }
    },

    submitMovieRating: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const userId = req.user.id;
            const movieId = req.params.movieId;
            const rating = req.body.rating;

            const result = await db_movie.submitRating(userId, movieId, rating);
            if (!result) {
                res.status(500).json({ message: 'Internal server error' });
            }
            res.status(201).json({
                message: 'Rating submitted successfully',
            });
        } catch (error) {
            console.error('Error submitting rating: ', error);
            res.status(500).json({
                message: 'Internal server error',
            });
        }
    },

    editMovieRating: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const userId = req.user.id; // Assuming user ID is available from request object
            const movieId = req.params.movieId; // Extract movieId from request parameters
            const rating = req.body.rating; // Extract movieId and rating from request body

            const result = await db_movie.editRating(userId, movieId, rating);
            if (result.length === 0) {
                return res
                    .status(404)
                    .json({ message: 'Rating not found or no change made' });
            }
            res.status(200).json({
                message: 'Rating updated successfully',
            });
        } catch (error) {
            console.error('Error in editing movie rating:', error);
            res.status(500).json({
                message: 'Internal server error',
            });
        }
    },

    deleteMovieRating: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const userId = req.user.id; // Assuming user ID is available from request object
            const { movieId } = req.params; // Extract movieId from request parameters

            const result = await db_movie.deleteRating(userId, movieId);
            if (!result) {
                return res
                    .status(404)
                    .json({ message: 'Rating not found or already deleted' });
            }
            res.status(200).json({
                message: 'Rating deleted successfully',
            });
        } catch (error) {
            console.error('Error in deleteMovieRating:', error);
            res.status(500).json({
                message: 'Internal server error',
            });
        }
    },

    addToWatchlist: async (req, res) => {
        if (!req.user) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const movieId = req.params.movieId;
        const userId = req.user.id;

        try {
            const result = await db_movie.addMovieToWatchlist(userId, movieId);
            if (result) {
                res.status(201).json({
                    message: 'Movie successfully added to watchlist',
                });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        } catch (error) {
            console.error('Error in addToWatchlist:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    removeFromWatchlist: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const movieId = req.params.movieId;
            const userId = req.user.id;

            const result = await db_movie.removeMovieFromWatchlist(
                userId,
                movieId
            );

            if (!result) {
                return res.status(404).json({
                    message: 'Movie previously not added to watchlist',
                });
            }
            return res
                .status(200)
                .json({ message: 'Movie successfully removed from watchlist' });
        } catch (error) {
            console.error('Error in removeFromWatchlist controller:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    markAsWatched: async (req, res) => {
        if (!req.user) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const movieId = req.params.movieId;
        const userId = req.user.id;

        try {
            const result = await db_movie.addMovieToWatchedlist(
                userId,
                movieId
            );
            if (result) {
                res.status(201).json({
                    message: 'Movie successfully added to watched-list',
                });
            } else {
                res.status(404).json({
                    message: 'Movie not found or previously marked as watched',
                });
            }
        } catch (error) {
            console.error('Error in marking movie as watched:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    unmarkAsWatched: async (req, res) => {
        if (!req.user) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const movieId = req.params.movieId;
        const userId = req.user.id;

        try {
            const result = await db_movie.removeMovieFromWatchedlist(
                userId,
                movieId
            );
            if (result) {
                res.status(200).json({
                    message: 'Movie successfully removed from watched-list',
                });
            } else {
                res.status(404).json({
                    message:
                        'No movie/previous addition to watched-list found for the provided movieId',
                });
            }
        } catch (error) {
            console.error('Error unmarking movie as watched:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getMovieCasts: async (req, res) => {
        const movieId = req.params.movieId;
        const limit = req.query.limit || 6; // Default limit to 10 if not specified
        const offset = req.query.offset || 0; // Default offset to 0 if not specified

        try {
            const castsData = await db_movie.fetchTopCastsByMovieId(
                movieId,
                offset,
                limit
            );
            const directorsData = await db_movie.fetchDirectorsByMovieId(
                movieId
            );

            if (castsData && directorsData) {
                res.status(200).json({
                    casts: castsData,
                    directors: directorsData,
                });
            } else {
                res.status(404).json({
                    message: 'No movie found for the provided movieId',
                });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getSimilarMovies: async (req, res) => {
        const movieId = req.params.movieId;
        const limit = req.query.limit || 10; // Default limit to 10 if not specified

        try {
            const similarMovies = await db_movie.fetchSimilarMovies(
                movieId,
                limit
            );

            if (similarMovies) {
                res.status(200).json(similarMovies);
            } else {
                res.status(404).json({
                    message: 'No movie found for the provided movieId',
                });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    submitNewMovie: async (req, res) => {
        if (!req.user || req.user.role !== 'moderator') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const movieData = req.body; // Assuming the movie data is sent in the request body

        try {
            const submitResult = await db_movie.submitNewMovie(movieData);

            if (submitResult) {
                res.status(201).json({
                    message: 'Movie successfully submitted for approval',
                    requestId: submitResult.requestId, // Assuming this is generated in the model
                });
            } else {
                res.status(400).json({ message: 'Invalid input provided' });
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
                res.status(404).json({
                    message: 'No movie found for the provided movieId',
                });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    submitMovieReview: async (req, res) => {
        if (!req.user) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const movieId = req.params.movieId; // Extract movieId from request parameters
        const reviewData = req.body; // Extract review data from request body

        try {
            // Assume a user ID is extracted from the Authorization header (token)
            const userId = getUserIdFromToken(req.headers.authorization);

            const reviewId = await db_movie.submitMovieReview(
                movieId,
                userId,
                reviewData
            );

            if (reviewId) {
                res.status(201).json({
                    message: 'Review submitted successfully',
                    reviewId: reviewId,
                });
            } else {
                res.status(404).json({ message: 'Movie not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getTotalMovieCount: async (req, res) => {
        try {
            const count = await db_movie.fetchTotalMovieCount();
            res.status(200).json({ count });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getUserWatchInfoForMovie: async (req, res) => {
        try {
            const movieId = req.params.movieId;
            const watchInfo = await db_movie.fetchMovieWatchDetails(
                movieId,
                req.user?.id
            );

            if (watchInfo) {
                res.status(200).json(watchInfo);
            } else {
                res.status(404).json({
                    message: 'No movie found for the provided movieId',
                });
            }
        } catch (error) {
            console.error('Error in getUserInfoForMovie:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    searchAllTypes: async (req, res) => {
        try {
            const query = req.query.query; // Extract query from request query parameters
            const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not specified
            const offset = parseInt(req.query.offset) || 0; // Default offset to 0 if not specified
            const searchResults = await db_movie.searchAllTypes(
                query,
                offset,
                limit
            );

            const data = [];
            searchResults.forEach((result) => {
                const record = {
                    id: result.id,
                    type: result.record_type,
                    imageUrl: result.image_url,
                };
                if (result.record_type === 'movie') {
                    record.title = result.title_or_full_name;
                    record.release_date = result.username_or_release_date;
                } else if (result.record_type === 'movie_person') {
                    record.type = 'moviePerson';
                    record.name = result.title_or_full_name;
                } else if (result.record_type === 'user') {
                    record.username = result.username_or_release_date;
                    record.name = result.title_or_full_name;
                } else {
                    throw error;
                }
                data.push(record);
            });
            // console.log('searchResults:', data);
            res.status(200).json(data);
        } catch (error) {
            console.error('Error in searchAllTypes:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getMovieRating: async (req, res) => {
        const movieId = req.params.movieId; // Extract movieId from request parameters

        try {
            const rating = await db_movie.getMovieRatingInfo(
                movieId,
                req.user?.id
            );
            if (!rating) {
                return res.status(500).json({
                    message: 'Internal server error',
                });
            }

            res.status(200).json(rating);
        } catch (error) {
            console.error('Error in getMovieRating:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getMovieImages: async (req, res) => {
        const movieId = req.params.movieId; // Extract movieId from request parameters

        try {
            const limit = parseInt(req.query.limit) || 3;
            const offset = parseInt(req.query.offset) || 0;
            const images = await db_movie.fetchMovieImages(
                movieId,
                limit,
                offset
            );
            // console.log('In getMovieImages: images', images);
            const data = { posters: [], backdrops: [] };
            for (let image of images) {
                if (image._image_type === 'poster') {
                    data.posters.push(image._image_url);
                } else if (image._image_type === 'backdrop') {
                    data.backdrops.push(image._image_url);
                }
            }
            // console.log('In getMovieImages: data', data);

            res.status(200).json({ images: data });
        } catch (error) {
            console.error('Error in getMovieRating:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getTopRatedMovies: async (req, res) => {
        const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not specified
        const offset = parseInt(req.query.offset) || 0; // Default offset to 0 if not specified

        try {
            const movies = await db_movie.fetchTopRatedMovies(offset, limit);
            // console.log('movies:', movies);

            res.status(200).json(movies);
        } catch (error) {
            console.error('in catch of getTopRatedMovies: ', error.message);
            res.status(500).json({ message: error.message });
        }
    },

    getLatestMovies: async (req, res) => {
        const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not specified
        const offset = parseInt(req.query.offset) || 0; // Default offset to 0 if not specified

        try {
            const movies = await db_movie.fetchLatestMovies(offset, limit);
            // console.log('movies:', movies);

            res.status(200).json(movies);
        } catch (error) {
            console.error('in catch of getLatestMovies: ', error.message);
            res.status(500).json({ message: error.message });
        }
    },

    // Add more methods as per your API documentation...
};

module.exports = moviesController;
