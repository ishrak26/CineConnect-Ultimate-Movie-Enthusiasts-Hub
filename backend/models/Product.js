const supabase = require("../config/supabaseConfig");

async function fetchAllTags(limit, offset) {
  const { data, error } = await supabase.rpc("fetch_distinct_tags", {
    limit_val: limit,
    offset_val: offset,
  });

  if (error) {
    console.error("Error fetching tags:", error.message);
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
  const sortTypeUsed = sortType || "name_asc";

  // Call the stored procedure
  const { data, error } = await supabase.rpc(
    "fetch_products_by_tags_movies_and_sort_v2",
    {
      tag_names: tagNames,
      movie_titles: movieTitles,
      limit_val: limit,
      offset_val: offset,
      sort_type: sortTypeUsed,
    }
  );

  if (error) {
    console.error("Error fetching products:", error.message);
    throw error;
  }

  // console.log('Returning from fetchProductsByTagsAndMovies:', data);
  return data;
}

async function getProductRatingInfo(productId, userId = null) {
  const { data, error } = await supabase.rpc("get_product_rating_info", {
    pid: productId,
    uid: userId,
  });

  if (error) {
    console.error("Error fetching product rating info:", error);
    throw error;
  }

  // console.log('Returning from getProductRatingInfo:', data[0]);
  return data[0];
}

async function fetchProductDetails(productId) {
  const { data, error } = await supabase.rpc("fetch_product_details", {
    pid: productId,
  });

  if (error || data.length > 1) {
    console.error("Error fetching product details:", error);
    throw error;
  }

  if (data.length === 0) {
    console.error("No product found with the given ID:", productId);
    return null;
  }

  // console.log('Returning from fetchProductDetails', data[0]);
  return data[0];
}

async function fetchProductFeatures(productId) {
  const { data, error } = await supabase
    .from("product")
    .select("features")
    .eq("id", productId);

  if (error || data.length > 1) {
    console.error("Error fetching product features:", error);
    throw error;
  }

  if (data.length === 0) {
    console.error("No product found with the given ID:", productId);
    return null;
  }

  // console.log('Returning from fetchProductFeatures:', data[0].features);
  return data[0].features;
}

async function fetchProductTags(productId, limit, offset) {
  const { data, error } = await supabase
    .from("product_has_tags")
    .select("name")
    .eq("product_id", productId)
    .range(offset, offset + limit - 1)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching product tags:", error);
    throw error;
  }

  // const tags = data.map((tag) => tag.tag_name);
  // console.log('Returning from fetchProductTags:', data);
  return data;
}

async function isAddedToWishlist(productId, userId) {
  const { data, error } = await supabase
    .from("user_wishes_product")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", userId);

  if (error || data.length > 1) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }

  // console.log('Returning from isAddedToWishlist:', data.length === 1);

  return data.length === 1;
}

async function addProductToWishlist(productId, userId) {
  const { data, error } = await supabase
    .from("user_wishes_product")
    .insert({ product_id: productId, user_id: userId })
    .select("id");

  if (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }

  // console.log('Returning from addProductToWishlist:', data);
  return data.length === 1;
}

async function removeProductFromWishlist(productId, userId) {
  const { data, error } = await supabase
    .from("user_wishes_product")
    .delete()
    .eq("product_id", productId)
    .eq("user_id", userId)
    .select("id");

  if (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }

  // console.log('Returning from removeFromWishlist:', data);
  return data.length === 1;
}

async function fetchProductImages(productId, limit, offset) {
  const { data, error } = await supabase
    .from("product_has_images")
    .select("image_url, caption")
    .eq("product_id", productId)
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching product images:", error);
    throw error;
  }

  // const images = data.map((img) => img.url);
  // console.log('Returning from fetchProductImages:', data);
  return data;
}

async function createNewProduct(product) {
  const { data, error } = await supabase.rpc("create_new_product", {
    _name: product.name,
    _price: product.price,
    _owner_id: product.ownerId,
    _sizes: product.sizes,
    _colors: product.colors,
    _available_qty: product.availableQty,
    _thumbnail_url: product.thumbnailUrl,
    _movie_id: product.movieId,
    _features: product.features,
    _tags: product.tags,
    _images: product.images,
    _category: product.category,
  });

  if (error) {
    console.error("Error inserting new product:", error);
    throw error;
  }

  // console.log('Returning from createNewProduct:', data);
  return data; // This will be the UUID of the newly inserted product
}

async function updateProduct(product) {
  const { data, error } = await supabase.rpc("update_product", {
    _product_id: product.id,
    _name: product.name,
    _price: product.price,
    _owner_id: product.ownerId,
    _sizes: product.sizes,
    _colors: product.colors,
    _available_qty: product.availableQty,
    _thumbnail_url: product.thumbnailUrl,
    _movie_id: product.movieId,
    _features: product.features,
    _tags: product.tags,
    _images: product.images,
    _category: product.category,
  });

  if (error) {
    console.error("Error updating product:", error);
    throw error;
  }

  // console.log('Returning from updateProduct:', data);
  return data; // This will be the UUID of the newly inserted product
}

async function deleteProduct(productId) {
  const { data, error } = await supabase
    .from("product")
    .delete()
    .eq("id", productId)
    .select("id");

  if (error) {
    console.error("Error deleting product:", error);
    throw error;
  }

  // console.log('Returning from deleteProduct:', data);
  return data;
}

async function updateProductQuantity(productId, newQuantity) {
  const { data, error } = await supabase
    .from("product")
    .update({ available_qty: newQuantity })
    .eq("id", productId)
    .select("id");

  if (error) {
    console.error("Error updating product quantity:", error);
    throw error;
  }

  // console.log('Returning from updateProductQuantity:', data);
  return data;
}

async function fetchProductOwner(productId) {
  const { data, error } = await supabase
    .from("product")
    .select("owner_id")
    .eq("id", productId);

  if (error || data.length > 1) {
    console.error("Error fetching product owner:", error);
    throw error;
  }

  if (data.length === 0) {
    console.error("No product found with the given ID:", productId);
    return null;
  }

  // console.log('Returning from fetchProductOwner:', data[0].owner_id);
  return data[0].owner_id;
}

async function fetchTotalProductCountByMovieId(movieId) {
  const { count, error } = await supabase
    .from("movie_has_products")
    .select("*", { count: "exact", head: true })
    .eq("movie_id", movieId);

  if (error) {
    console.error("Error fetching total products count by movieId:", error);
    throw error;
  }

  // console.log('Returning from fetchTotalProductsCountByMovieId:', count);
  return count;
}

async function fetchTotalProductCountByUsername(username) {
  const { data, error } = await supabase.rpc("get_total_products_by_username", {
    username_input: username,
  });

  if (error) {
    console.error("Error fetching total products count by username:", error);
    throw error;
  }

  // console.log('Returning from fetchTotalProductsCountByUsername:', data);
  return data;
}

async function fetchProductsByMovieId(movieId, limit, offset) {
  const { data, error } = await supabase.rpc("fetch_products_by_movie_id", {
    mid: movieId,
    limit_val: limit,
    offset_val: offset,
  });

  if (error) {
    console.error("Error fetching products by movie id:", error);
    throw error;
  }

  // console.log('Returning from fetchProductsByMovieId:', data);
  return data;
}

async function fetchProductsByUsername(username, limit, offset) {
  const { data, error } = await supabase.rpc("fetch_products_by_username", {
    username_input: username,
    limit_val: limit,
    offset_val: offset,
  });

  if (error) {
    console.error("Error fetching products by username:", error);
    throw error;
  }

  // console.log('Returning from fetchProductsByUsername:', data);
  return data;
}

async function rateProduct(productId, userId, rating) {
  const { data, error } = await supabase
    .from("product_has_user_rating")
    .insert({ product_id: productId, user_id: userId, rating: rating })
    .select("id");

  if (error) {
    console.error("Error rating product:", error);
    throw error;
  }

  // console.log('Returning from rateProduct:', data);
  return data.length === 1;
}

async function updateRating(productId, userId, rating) {
  const { data, error } = await supabase
    .from("product_has_user_rating")
    .update({ rating: rating })
    .eq("product_id", productId)
    .eq("user_id", userId)
    .select("id");

  if (error) {
    console.error("Error updating product rating:", error);
    throw error;
  }

  // console.log('Returning from updateRating:', data);
  return data.length === 1;
}

module.exports = {
  fetchAllTags,
  fetchProductsByTagsAndMovies,
  getProductRatingInfo,
  fetchProductDetails,
  fetchProductFeatures,
  fetchProductTags,
  isAddedToWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
  fetchProductImages,
  createNewProduct,
  updateProductQuantity,
  fetchProductOwner,
  fetchTotalProductCountByMovieId,
  fetchTotalProductCountByUsername,
  fetchProductsByMovieId,
  fetchProductsByUsername,
  rateProduct,
  updateRating,
  updateProduct,
  deleteProduct,
};
