const supabase = require('../config/supabaseConfig');

/*
    returns only the numeric avg rating of a movie
*/
async function fetchMovieRatingById(movieId) {
    const { data, error } = await supabase
        .from('movie_has_user_rating')
        .select('rating', { avg: 'rating' })
        .eq('movie_id', movieId);

    if (error) {
        console.error('Error fetching movie rating by id', error);
        return null;
    }
    if (data) {
        // console.log(data);
        return data[0].rating;
    }
}

/*
    returns array of json objects
    each json object has two fields: genre_id, genre_name
*/
async function fetchGenresByMovieId(movieId) {
    // First, get the genre IDs associated with the movie
    const genreIdResponse = await supabase
        .from('movie_has_genre')
        .select('genre_id')
        .eq('movie_id', movieId);

    if (genreIdResponse.error) {
        console.error(genreIdResponse.error);
        return null;
    }

    // Extract genre IDs from the response
    const genreIds = genreIdResponse.data.map((item) => item.genre_id);

    // Now, get the genres using the retrieved IDs
    const { data, error } = await supabase
        .from('genre')
        .select('id, name')
        .in('id', genreIds);

    if (error) {
        console.error('Error fetching genres by movie id', error);
        return null;
    }

    if (data) {
        // console.log(data);
        return data;
    }
}

/*
    returns array of json objects
    each json object has 4 fields: cast_id, cast_name, image_url, role_name
*/
async function fetchCastsByMovieId(movieId) {
    const { data, error } = await supabase
        .from('movie_has_cast')
        .select(
            `
        role_name,
        movie_person (
            id, 
            name, 
            image_url
        )`
        )
        .eq('movie_id', movieId);

    if (error) {
        console.error('Error fetching casts by movie id', error);
        return null;
    }

    if (data) {
        // console.log(data);
        return data;
    }
}

/*
    returns array of json objects
    each json object has two fields: director_id, director_name
*/
async function fetchDirectorsByMovieId(movieId) {
    const { data, error } = await supabase
        .from('movie_has_director')
        .select(
            `
            movie_person:movie_person_id (id, name)
        `
        )
        .eq('movie_id', movieId);

    if (error) {
        console.error('Error fetching directors by movie id', error);
        return null;
    }

    // Map over the data to restructure the objects to a non-nested format
    const reformattedData = data.map((director) => {
        return {
            id: director.movie_person.id,
            name: director.movie_person.name,
        };
    });

    if (reformattedData.length > 0) {
        // console.log('Returning from fetchDirectorsByMovieId:', reformattedData);
        return reformattedData;
    }

    // If no data was found or there was an error, return null
    return null;
}

/*
    returns array of json objects
    each json object has two fields: cast_id, cast_name, image_url, role_name
*/
async function fetchTopCastsByMovieId(movieId, offset, limit) {
    const { data, error } = await supabase
        .from('movie_has_cast')
        .select(
            `
            role_name,
            movie_person:movie_person_id (id, name, image_url)
        `
        )
        .eq('movie_id', movieId)
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Error fetching top casts by movie id', error);
        return null;
    }

    // Map over the data to restructure the objects to a non-nested format
    const reformattedData = data.map((cast) => {
        return {
            role_name: cast.role_name,
            id: cast.movie_person.id,
            name: cast.movie_person.name,
            image_url: cast.movie_person.image_url,
        };
    });

    if (reformattedData.length > 0) {
        // console.log('Returning from fetchTopCastsByMovieId:', reformattedData);
        return reformattedData;
    }

    // If no data was found or there was an error, return null
    return null;
}

/*
    returns array of json objects
    each json object has two fields: cast_id, cast_name, image_url, role_name
*/
async function fetchMoviesByMoviePersonId(moviePersonId) {
    const movieIdCastResponse = await supabase
        .from('movie_has_cast')
        .select('movie_id')
        .eq('movie_person_id', moviePersonId);

    if (movieIdCastResponse.error) {
        console.error(movieIdCastResponse.error);
        return null;
    }

    let movieIds = movieIdCastResponse.data.map((item) => item.movie_id);

    const movieIdDirectorResponse = await supabase
        .from('movie_has_director')
        .select('movie_id')
        .eq('movie_person_id', moviePersonId);

    if (movieIdDirectorResponse.error) {
        console.error(movieIdDirectorResponse.error);
        return null;
    }

    movieIds = [
        ...movieIds,
        ...movieIdDirectorResponse.data.map((item) => item.movie_id),
    ];

    // Now, get the genres using the retrieved IDs
    const { data, error } = await supabase
        .from('movie')
        .select('id, title, release_date, poster_url')
        .in('id', movieIds);

    if (error) {
        console.error('Error fetching movies by moviePersonId', error);
        return null;
    }

    if (data) {
        // console.log(data);
        for (let movie of data) {
            // const genres = await fetchGenresByMovieId(movie.id);
            // if (genres) {
            //     movie.genres = genres;
            //     // console.log('movie.genres', movie.genres);
            // }

            const rating = await fetchMovieRatingById(movie.id);
            if (rating) {
                movie.rating = rating;
            }
            // console.log('movie', movie);
        }
        return data;
    }
}

/*
    returns array of json objects
    each json object resembles a movie
    key is the column name, value is the required value in db

    returns only those rows where movie.title matches the case-insensitive title
*/
async function fetchMoviesByTitle(title, offset, limit) {
    title = '%' + title + '%';
    const { data, error } = await supabase
        .from('movie')
        .select('id, title, release_date, poster_url')
        .ilike('title', title) // ilike is case-insensitive. like is case-sensitive.
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Error fetching movies by title', error);
        return null;
    }
    if (data) {
        for (let movie of data) {
            // const genres = await fetchGenresByMovieId(movie.id);
            // if (genres) {
            //     movie.genres = genres;
            //     // console.log('movie.genres', movie.genres);
            // }

            const rating = await fetchMovieRatingById(movie.id);
            if (rating) {
                movie.rating = rating;
            }
            // console.log('movie', movie);
        }
        // console.log('Returning from fetchMoviesByTitle:', data);
        // console.log(data[0].genres);
        return data;
    }
}

/*
    returns array of json objects
    each json object resembles a row from the movie table
    key is the column name, value is the required value in db
    returns only those rows where movie.id=id

    should return an array of size 1
*/
async function fetchMoviesById(id, user) {
    const { data, error } = await supabase
        .from('movie')
        .select(
            'id, title, release_date, plot_summary, poster_url, trailer_url, duration_in_mins, language, country_of_first_release, certification, backdrop_url'
        )
        .eq('id', id);

    if (error) {
        console.error('Error fetching movies by id', error);
        return null;
    }

    if (data.length > 1) {
        console.error('Multiple movies for one id', data);
        return null;
    }

    if (data) {
        for (let movie of data) {
            const genres = await fetchGenresByMovieId(movie.id);
            if (genres) {
                movie.genres = genres;
            }

            // casts = await fetchCastsByMovieId(movie.id);
            // if (casts) {
            //     movie.casts = casts;
            // }

            const directors = await fetchDirectorsByMovieId(movie.id);
            if (directors) {
                movie.directors = directors;
            }

            const rating = await fetchMovieRatingById(movie.id);
            if (rating) {
                movie.rating = rating;
            }

            if (user) {
                // find user's rating for this movie
                const { data: userRatingData, error: userRatingError } =
                    await supabase
                        .from('movie_has_user_rating')
                        .select('rating')
                        .eq('user_id', user.id)
                        .eq('movie_id', movie.id);
                if (userRatingError) {
                    console.error(
                        'Error fetching user rating',
                        userRatingError
                    );
                    throw userRatingError;
                }
                if (userRatingData && userRatingData.length > 0) {
                    movie.user_rating = userRatingData[0].rating;
                }

                // find if movie is in user's watchlist
                const { data: watchlistData, error: watchlistError } =
                    await supabase
                        .from('watch_list')
                        .select('id')
                        .eq('user_id', user.id)
                        .eq('movie_id', movie.id);
                if (watchlistError) {
                    console.error('Error fetching watchlist', watchlistError);
                    throw watchlistError;
                }
                if (watchlistData && watchlistData.length > 0) {
                    movie.in_watchlist = true;
                }
            }
        }

        // console.log('Returning from fetchMoviesById:', data);
        // console.log(data[0].casts);
        // console.log(data[0].directors);
        return data;
    }
}

/*
returns the genre id of the genre with the given name
*/

async function getGenreIdByName(genreName) {
    try {
        const { data, error } = await supabase
            .from('genre')
            .select('id')
            .ilike('name', genreName); // Using 'ilike' for case-insensitive matching

        if (error) {
            console.error('Error fetching genre id by name:', error);
            throw error;
        }

        // Assuming 'name' is a unique field and should only return one record
        if (data && data.length > 0) {
            return data[0].id; // Return the first id (should be the only one)
        } else {
            return null; // No genre found with that name
        }
    } catch (error) {
        console.error('Error in getGenreIdByName:', error);
        throw error; // Rethrow the error and handle it in the controller
    }
}

/*
    returns array of json objects
    each json object resembles a row from the movie table
    key is the column name, value is the required value in db
    returns only those rows where movie.id=movie_has_genre.movie_id

    should return an array 
*/

async function fetchMoviesByGenre(genreName) {
    try {
        // Fetch the movie IDs associated with the given genre ID
        const genreId = await getGenreIdByName(genreName);
        const { data: movieGenreData, error: movieGenreError } = await supabase
            .from('movie_has_genre')
            .select('movie_id')
            .eq('genre_id', genreId);

        if (movieGenreError) throw movieGenreError;

        // Extract just the movie IDs from the data
        const movieIds = movieGenreData.map((entry) => entry.movie_id);
        // map() returns an array of movie_ids, entry is a json object

        // Fetch the movies that have the extracted movie IDs
        const { data: moviesData, error: moviesError } = await supabase
            .from('movie')
            .select('id, title, release_date, poster_url')
            .in('id', movieIds);

        if (moviesError) throw moviesError;

        // Return the array of movie records
        return moviesData;
    } catch (error) {
        console.error('Error fetching movies by genre', error);
        return null;
    }
}

/*
    arg: moviePersonId

    returns array of json objects
    each json object resembles a row from the movie table
    key is the column name, value is the required value in db
    returns only those rows where movie.id=id

    should return an array of size 1
*/
async function fetchMoviePersonsById(moviePersonId) {
    const { data, error } = await supabase
        .from('movie_person')
        .select(
            'id, image_url, biography, date_of_birth, date_of_death, name, place_of_birth'
        )
        .eq('id', moviePersonId); // .eq -> equal

    if (error) {
        console.error('Error fetching movie persons by id', error);
        return null;
    }

    if (data.length > 1) {
        console.error('Multiple movie persons for one id', data);
        return null;
    }

    if (data) {
        for (let moviePerson of data) {
            const movies = await fetchMoviesByMoviePersonId(moviePerson.id);
            if (movies) {
                moviePerson.movies = movies;
            }
        }

        // console.log('Returning from fetchMoviePersonsById:', data);
        // console.log(data[0].movies);
        return data;
    }
}

const addMovieToWatchlist = async (userId, movieId) => {
    const { data, error } = await supabase
        .from('watch_list')
        .insert([{ user_id: userId, movie_id: movieId }])
        .select('id');

    if (error) {
        console.error('Error adding movie to watchlist:', error);
        return null;
    }

    return data;
};

async function removeMovieFromWatchlist(userId, movieId) {
    // checking if the movie is in the user's watchlist
    let { data: watchlistData, error: watchlistError } = await supabase // watchlistData is an array of json objects, and
        // watchlistError is an error object or null
        .from('watch_list')
        .select('id')
        .eq('user_id', userId)
        .eq('movie_id', movieId)
        .single(); // single() returns only one row

    if (watchlistError) {
        console.error('Error fetching from watchlist:', watchlistError);
        throw new Error('Error checking watchlist');
    }

    // If the movie is not in the watchlist, we can't remove it
    if (!watchlistData) {
        return { error: 'Movie not found in watchlist' }; // returns a json object with error field
    }

    // If the movie is in the watchlist, proceed to delete it
    const { error } = await supabase
        .from('watch_list')
        .delete()
        .match({ id: watchlistData.id });

    if (error) {
        console.error('Error removing from watchlist:', error);
        throw new Error('Error removing from watchlist');
    }

    // Return a success response
    return { message: 'Movie successfully removed from watchlist' };
}

async function addMovieToWatchedlist(userId, movieId) {
    const { data, error } = await supabase
        .from('watched_list')
        .insert([{ user_id: userId, movie_id: movieId, joined_forum: false }])
        .select('id');

    if (error) {
        console.error('Error adding movie to watched list', error);
        throw error;
    }

    return data;
}

// Function to remove a movie from the watched list
async function removeMovieFromWatchedlist(userId, movieId) {
    const { data, error } = await supabase
        .from('watched_list')
        .delete()
        .match({ user_id: userId, movie_id: movieId })
        .select('id');
    if (error) {
        console.error('Error removing movie from watched list', error);
        throw error;
    }

    return data;
}

// Function to submit a rating for a movie
async function submitRating(userId, movieId, rating) {
    const { data, error } = await supabase
        .from('movie_has_user_rating')
        .insert([{ user_id: userId, movie_id: movieId, rating: rating }])
        .select('id');

    if (error) {
        console.error('Error rating movie as current user', error);
        throw error;
    }

    return data;
}

async function editRating(userId, movieId, rating) {
    const { data, error } = await supabase
        .from('movie_has_user_rating')
        .update({ rating: rating })
        .match({ user_id: userId, movie_id: movieId })
        .select('id');

    if (error) {
        throw error;
    }

    return data;
}

async function deleteRating(userId, movieId) {
    const { data, error } = await supabase
        .from('movie_has_user_rating')
        .delete()
        .match({ user_id: userId, movie_id: movieId })
        .select('id');

    if (error) {
        throw error;
    }

    return data;
}

const fetchTopCastsIdsByMovieId = async (movieId, offset = 0, limit = 5) => {
    try {
        const { data, error } = await supabase
            .from('movie_has_cast')
            .select('movie_person_id')
            .eq('movie_id', movieId)
            .range(offset, offset + limit - 1); // Adjust the range for pagination

        if (error) {
            throw error;
        }

        // Extract just the movie_person_id values from the data
        const castIds = data.map((entry) => entry.movie_person_id);

        return castIds;
    } catch (error) {
        console.error(
            'Error fetching top cast IDs by movie ID with pagination',
            error
        );
        return null;
    }
};

module.exports = {
    fetchMoviesById,
    fetchMoviesByTitle,
    fetchMoviesByGenre,
    fetchMoviePersonsById,
    fetchTopCastsByMovieId,
    fetchDirectorsByMovieId,
    addMovieToWatchlist,
    removeMovieFromWatchlist,
    addMovieToWatchedlist,
    removeMovieFromWatchedlist,
    submitRating,
    editRating,
    deleteRating,
};
