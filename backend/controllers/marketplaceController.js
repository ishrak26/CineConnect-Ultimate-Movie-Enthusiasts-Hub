const dbProduct = require('../models/Product');

const marketplaceController = {
    getAllTags: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const offset = parseInt(req.query.offset) || 0;
            const tags = await dbProduct.fetchAllTags(offset, limit);
            if (!tags) {
                return res
                    .status(500)
                    .json({ message: 'Internal server error' });
            }
            const data = [];
            for (let tag_name of tags) {
                data.push(tag_name.tag_name);
            }

            res.status(200).json(data);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getAllProducts: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const offset = parseInt(req.query.offset) || 0;
            const tags = req.query.tags ? req.query.tags.split(',') : [];
            const movies = req.query.movies ? req.query.movies.split(',') : [];
            const sortType = req.query.sortType || 'name_asc';
            const products = await dbProduct.fetchProductsByTagsAndMovies(
                tags,
                movies,
                limit,
                offset,
                sortType
            );
            if (!products) {
                return res
                    .status(500)
                    .json({ message: 'Internal server error' });
            }
            const data = [];
            for (let product of products) {
                data.push({
                    id: product.product_id, // uuid
                    name: product.product_name, // string
                    price: product.price, // numeric
                    thumbnailUrl: product.thumbnail_url, // string
                    avgRating: product.average_rating, // numeric
                });
            }
            res.status(200).json(data);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getProductRating: async (req, res) => {
        try {
            const productId = req.params.id;
            const userId = req.user ? req.user.id : null;
            const ratingInfo = await dbProduct.getProductRatingInfo(
                productId,
                userId
            );
            if (!ratingInfo) {
                return res
                    .status(500)
                    .json({ message: 'Internal server error' });
            }
            const data = {
                avgRating: ratingInfo.average_rating, // numeric
                totalRatings: ratingInfo.total_ratings, // integer
                userRating: ratingInfo.user_rating, // numeric
            };
            res.status(200).json(data);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getProductDetails: async (req, res) => {
        try {
            const productId = req.params.id;
            const productDetails = await dbProduct.fetchProductDetails(
                productId
            );
            if (!productDetails) {
                return res.status(404).json({ message: 'Product not found' });
            }
            const data = {
                productName: productDetails.name, // string
                price: productDetails.price, // numeric
                owner: {
                    id: productDetails.owner_id, // uuid
                    username: productDetails.username, // string
                },
                sizes: productDetails.sizes, // array
                colors: productDetails.colors, // array
                availableQuantity: productDetails.available_qty, // numeric
                thumbnailUrl: productDetails.thumbnail_url, // string
                movieName: productDetails.movie_name, // string
                reviewCount: productDetails.total_reviews_count, // integer
            };
            res.status(200).json(data);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getProductFeatures: async (req, res) => {
        try {
            const productId = req.params.id;
            const productFeatures = await dbProduct.fetchProductFeatures(
                productId
            );
            if (!productFeatures) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json(productFeatures);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Add more methods as per your API documentation...
};

module.exports = marketplaceController;
