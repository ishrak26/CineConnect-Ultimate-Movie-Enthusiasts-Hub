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
            const tag_names = [];
            for (let tag_name of tags) {
                tag_names.push(tag_name.tag_name);
            }

            res.status(200).json(tag_names);
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
            res.status(200).json(products);
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
            res.status(200).json(ratingInfo);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Add more methods as per your API documentation...
};

module.exports = marketplaceController;
