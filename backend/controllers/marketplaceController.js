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

    // Add more methods as per your API documentation...
};

module.exports = marketplaceController;
