const supabase = require('../config/supabaseConfig');

/*
    returns array of json objects
    each json object resembles a row from the movie table
    key is the column name, value is the required value in db
*/
async function getMovies() {
    const { data, error } = await supabase.from('movie').select();

    if (error) {
        console.log(error);
    }
    if (data) {
        console.log(data);
        return data;
    }
}

/*
    returns array of json objects
    each json object resembles a row from the movie table
    key is the column name, value is the required value in db
    returns only those rows where movie.id=id
*/
async function getMoviesById(id) {
    const { data, error } = await supabase.from('movie').select().eq('id', id);

    if (error) {
        console.log(error);
    }
    if (data) {
        console.log(data);
        return data;
    }
}

/*
    returns array of json objects
    each json object resembles a row from the movie table
    key is the column name, value is the required value in db
    returns only those rows where movie.title matches the case-insensitive title
*/
async function getMoviesByTitle(title) {
    title = '%' + title + '%';
    const { data, error } = await supabase
        .from('movie')
        .select()
        .ilike('title', title);

    if (error) {
        console.log(error);
    }
    if (data) {
        console.log(data);
        return data;
    }
}

module.exports = {
    getMovies,
    getMoviesById,
    getMoviesByTitle,
};
