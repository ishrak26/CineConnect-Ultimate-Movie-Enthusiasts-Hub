const supabase = require('../config/supabaseConfig');

async function fetchAllTags(offset, limit) {
    const { data, error } = await supabase.rpc('fetch_distinct_tags', {
        limit_val: limit,
        offset_val: offset,
    });

    if (error) {
        console.error('Error fetching tags:', error.message);
        throw error;
    }

    // console.log('Returning from fetchAllTags:', data);
    return data;
}

async function fetchProductsByTagsAndMovies(
    tags,
    movies,
    limit,
    offset,
    sortType
) {
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
        throw error;
    }

    // console.log('Returning from fetchProductsByTagsAndMovies:', data);
    return data;
}

async function getProductRatingInfo(productId, userId = null) {
    const { data, error } = await supabase.rpc('get_product_rating_info', {
        pid: productId,
        uid: userId,
    });

    if (error) {
        console.error('Error fetching product rating info:', error);
        throw error;
    }

    // console.log('Returning from getProductRatingInfo:', data);
    return data;
}

async function fetchProductDetails(productId) {
    const { data, error } = await supabase.rpc('fetch_product_details', {
        pid: productId,
    });

    if (error || data.length !== 1) {
        console.error('Error fetching product details:', error);
        throw error;
    }

    // console.log('Returning from fetchProductDetails', data[0]);
    return data[0];
}

module.exports = {
    fetchAllTags,
    fetchProductsByTagsAndMovies,
    getProductRatingInfo,
    fetchProductDetails,
};
