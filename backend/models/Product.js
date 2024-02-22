const supabase = require('../config/supabaseConfig');

async function fetchAllTags(offset, limit) {
    try {
        const { data, error } = await supabase.rpc('fetch_distinct_tags', {
            limit_val: limit,
            offset_val: offset,
        });

        if (error) {
            console.error('Error fetching tags:', error.message);
            return null;
        }

        // console.log('Returning from fetchAllTags:', data);
        return data;
    } catch (err) {
        console.error('Exception fetching tags:', err.message);
    }
}

async function fetchProductsByTagsAndMovies(
    tags,
    movies,
    limit,
    offset,
    sortType
) {
    try {
        // Prepare the parameters, ensuring empty arrays are correctly formatted
        const tagNames = tags.length > 0 ? tags : null;
        const movieTitles = movies.length > 0 ? movies : null;
        const sortTypeUsed = sortType || 'name_asc';

        // Call the stored procedure
        const { data, error } = await supabase.rpc(
            'fetch_products_by_tags_movies_and_sort',
            {
                tag_names: tagNames,
                movie_titles: movieTitles,
                limit_val: limit,
                offset_val: offset,
                sort_type: sortTypeUsed,
            }
        );

        if (error) {
            console.error('Error fetching products:', error.message);
            return null;
        }

        console.log('Returning from fetchProductsByTagsAndMovies:', data);
        return data;
    } catch (error) {
        console.error('Exception fetching products:', error);
        throw error; // or handle it as needed
    }
}

module.exports = {
    fetchAllTags,
    fetchProductsByTagsAndMovies,
};
