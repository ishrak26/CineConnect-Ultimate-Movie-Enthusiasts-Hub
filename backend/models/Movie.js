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
        movie_person (
            id, 
            name
        )`
        )
        .eq('movie_id', movieId);

    if (error) {
        console.error('Error fetching directors by movie id', error);
        return null;
    }

    if (data) {
        console.log('Returning from fetchDirectorsByMovieId:', data);
        return data;
    }
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
        movie_person (
            id, 
            name, 
            image_url
        )`
        )
        .eq('movie_id', movieId)
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Error fetching top casts by movie id', error);
        return null;
    }

    if (data) {
        console.log('Returning from fetchTopCastsByMovieId:', data);
        return data;
    }
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
        .select(
            'id, title, release_date, poster_url, duration_in_mins, language'
        )
        .in('id', movieIds);

    if (error) {
        console.error('Error fetching movies by moviePersonId', error);
        return null;
    }

    if (data) {
        // console.log(data);
        for (let movie of data) {
            const genres = await fetchGenresByMovieId(movie.id);
            if (genres) {
                movie.genres = genres;
                // console.log('movie.genres', movie.genres);
            }

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
        .ilike('title', title)  // ilike is case-insensitive. like is case-sensitive. 
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
        console.log('Returning from fetchMoviesByTitle:', data);
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
async function fetchMoviesById(id) {
    const { data, error } = await supabase
        .from('movie')
        .select(
            'id, title, release_date, plot_summary, poster_url, trailer_url, duration_in_mins, language, country_of_first_release, certification'
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
        }

        console.log('Returning from fetchMoviesById:', data);
        // console.log(data[0].casts);
        // console.log(data[0].directors);
        return data;
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
        .eq('id', moviePersonId);   // .eq -> equal

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

        console.log('Returning from fetchMoviePersonsById:', data);
        // console.log(data[0].movies);
        return data;
    }
}

const addMovieToWatchlist = async (userId, movieId) => {
    const { data, error } = await supabase
        .from('watch_list')
        .insert([
            { user_id: userId, movie_id: movieId }
        ]);

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
        .single();  // single() returns only one row

    if (watchlistError) {
        console.error('Error fetching from watchlist:', watchlistError);
        throw new Error('Error checking watchlist');
    }

    // If the movie is not in the watchlist, we can't remove it
    if (!watchlistData) {
        return { error: 'Movie not found in watchlist' };   // returns a json object with error field
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
      .insert([
        { user_id: userId, movie_id: movieId, joined_for_discussion: false }
      ]);
  
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
      .match({ user_id: userId, movie_id: movieId });
  
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
      .insert([
        { user_id: userId, movie_id: movieId, rating: rating }
      ]);
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  async function editRating (userId, movieId, rating) {
    const { data, error } = await supabase
      .from('movie_has_user_rating')
      .update({ rating: rating })
      .match({ user_id: userId, movie_id: movieId });
    
    if (error) {
      throw error;
    }
    
    return data;
  },


module.exports = {
    fetchMoviesById,
    fetchMoviesByTitle,
    fetchMoviePersonsById,
    fetchTopCastsByMovieId,
    fetchDirectorsByMovieId,
    addMovieToWatchlist,
    removeMovieFromWatchlist,
    addMovieToWatchedlist,
    removeMovieFromWatchedlist,

};
