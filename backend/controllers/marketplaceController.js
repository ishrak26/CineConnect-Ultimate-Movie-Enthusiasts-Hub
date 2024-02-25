const dbProduct = require('../models/Product');

const marketplaceController = {
    getAllTags: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const offset = parseInt(req.query.offset) || 0;
            const tags = await dbProduct.fetchAllTags(limit, offset);
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
            const sortType = req.query.sortType || 'price_asc';
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
                category: productDetails.category, // string
                owner: {
                    id: productDetails.owner_id, // uuid
                    username: productDetails.username, // string
                },
                sizes: productDetails.sizes, // array
                colors: productDetails.colors, // array
                availableQuantity: productDetails.available_qty, // numeric
                thumbnailUrl: productDetails.thumbnail_url, // string
                movie: {
                    id: productDetails.movie_id, // uuid
                    title: productDetails.movie_name, // string
                },
                reviewCount: productDetails.total_reviews_count, // integer
                wishlistCount: productDetails.wishlist_count, // integer
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

    getProductTags: async (req, res) => {
        try {
            const productId = req.params.id;
            const limit = parseInt(req.query.limit) || 10;
            const offset = parseInt(req.query.offset) || 0;
            const tags = await dbProduct.fetchProductTags(
                productId,
                limit,
                offset
            );
            const data = [];
            for (let tag_name of tags) {
                data.push(tag_name.name); // string
            }
            res.status(200).json(data);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    checkProductInWishlist: async (req, res) => {
        try {
            if (!req.user) return res.status(200).json({ inWishlist: false });

            const productId = req.params.id;
            const userId = req.user.id;
            const inWishlist = await dbProduct.isAddedToWishlist(
                productId,
                userId
            );
            res.status(200).json({ inWishlist });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    addToWishlist: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const productId = req.params.id;
            const userId = req.user.id;
            const added = await dbProduct.addProductToWishlist(
                productId,
                userId
            );
            if (!added) {
                return res
                    .status(500)
                    .json({ message: 'Internal server error' });
            }
            res.status(201).json({ message: 'Added to wishlist' });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    removeFromWishlist: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const productId = req.params.id;
            const userId = req.user.id;
            const removed = await dbProduct.removeProductFromWishlist(
                productId,
                userId
            );
            if (!removed) {
                return res
                    .status(500)
                    .json({ message: 'Internal server error' });
            }
            res.status(200).json({ message: 'Removed from wishlist' });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getProductImages: async (req, res) => {
        try {
            const productId = req.params.id;
            console.log(productId);
            const limit = parseInt(req.query.limit) || 5;
            const offset = parseInt(req.query.offset) || 0;
            const images = await dbProduct.fetchProductImages(
                productId,
                limit,
                offset
            );
            const data = [];
            for (let image of images) {
                data.push({
                    imageUrl: image.image_url, // string
                    caption: image.caption || '', // string
                });
            }
            res.status(200).json(data);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    createProduct: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const userId = req.user.id;
            const {
                name, // string
                price, // numeric
                category, // string
                sizes, // array of strings
                colors, // array of strings
                availableQty, // numeric
                thumbnailUrl, // string
                movieId, // uuid (string)
                tags, // array of strings
                features, // array of strings
                images, // array of objects, each having imageUrl and caption
            } = req.body;

            if (
                !name ||
                !price ||
                !category ||
                !availableQty ||
                !thumbnailUrl ||
                !movieId ||
                !tags ||
                !features
            ) {
                return res.status(400).json({ message: 'Bad request' });
            }

            const product = {
                name,
                price,
                ownerId: userId,
                sizes: sizes ? sizes : [],
                colors: colors ? colors : [],
                category,
                availableQty,
                thumbnailUrl,
                movieId,
                tags,
                features,
                images: images ? images : [],
            };

            const productId = await dbProduct.createNewProduct(product);
            if (!productId) {
                return res
                    .status(500)
                    .json({ message: 'Internal server error' });
            }
            res.status(201).json({ success: true });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateProductQuantity: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const productId = req.params.id;
            const userId = req.user.id;

            const owner_id = await dbProduct.fetchProductOwner(productId);
            if (!owner_id) {
                return res.status(404).json({ message: 'Product not found' });
            }
            if (owner_id !== userId) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            const { quantity } = req.body;

            if (!quantity) {
                return res.status(400).json({ message: 'Bad request' });
            }

            const updated = await dbProduct.updateProductQuantity(
                productId,
                quantity
            );
            if (!updated) {
                return res
                    .status(500)
                    .json({ message: 'Internal server error' });
            }
            res.status(200).json({ success: true });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getTotalProductCountByMovieId: async (req, res) => {
        try {
            const movieId = req.params.movieId;
            const count = await dbProduct.fetchTotalProductCountByMovieId(
                movieId
            );
            if (count === null) {
                return res.status(404).json({ message: 'Movie not found' });
            }
            res.status(200).json({ count });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getTotalProductCountByUsername: async (req, res) => {
        try {
            const username = req.params.username;
            const count = await dbProduct.fetchTotalProductCountByUsername(
                username
            );
            if (count === null) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ count });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getProductsByMovie: async (req, res) => {
        try {
            const movieId = req.params.movieId;
            const limit = parseInt(req.query.limit) || 10;
            const offset = parseInt(req.query.offset) || 0;
            const products = await dbProduct.fetchProductsByMovieId(
                movieId,
                limit,
                offset
            );
            const data = [];
            for (let product of products) {
                data.push({
                    id: product.id, // uuid
                    name: product.name, // string
                    price: product.price, // numeric
                    thumbnailUrl: product.thumbnail_url, // string
                });
            }
            res.status(200).json(data);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getProductsByUsername: async (req, res) => {
        try {
            const username = req.params.username;
            const limit = parseInt(req.query.limit) || 10;
            const offset = parseInt(req.query.offset) || 0;
            const products = await dbProduct.fetchProductsByUsername(
                username,
                limit,
                offset
            );
            const data = [];
            for (let product of products) {
                data.push({
                    id: product.id, // uuid
                    name: product.name, // string
                    price: product.price, // numeric
                    thumbnailUrl: product.thumbnail_url, // string
                });
            }
            res.status(200).json(data);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    rateProduct: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const productId = req.params.id;
            const userId = req.user.id;

            const owner_id = await dbProduct.fetchProductOwner(productId);
            if (!owner_id) {
                return res.status(404).json({ message: 'Product not found' });
            }
            if (owner_id === userId) {
                return res
                    .status(403)
                    .json({ message: 'Cannot rate own product' });
            }

            const { rating } = req.body;

            if (!rating) {
                return res.status(400).json({ message: 'Bad request' });
            }

            const rated = await dbProduct.rateProduct(
                productId,
                userId,
                rating
            );
            if (!rated) {
                return res
                    .status(500)
                    .json({ message: 'Internal server error' });
            }
            res.status(201).json({ success: true });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateProductRating: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const productId = req.params.id;
            const userId = req.user.id;
            const { rating } = req.body;

            if (!rating) {
                return res.status(400).json({ message: 'Bad request' });
            }

            const updated = await dbProduct.updateRating(
                productId,
                userId,
                rating
            );
            if (!updated) {
                return res
                    .status(500)
                    .json({ message: 'Internal server error' });
            }
            res.status(200).json({ success: true });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Add more methods as per your API documentation...
};

module.exports = marketplaceController;
