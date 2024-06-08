const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// For requests to /api/products, GET route to get all products (including associated Category and Tag data).
router.get('/', async (req, res) => {
    try {
        const productData = await Product.findAll({
            include: [{ model: Category }, { model: Tag }],
            order: [['id', 'ASC']]
        });
        res.status(200).json(productData);

    } catch (err) {
        res.status(500).json(err);
    }
});

// For requests to /api/products/:id, GET route to get one product (including associated Category and Tag data).
router.get('/:id', async (req, res) => {
    try {
        const productData = await Product.findByPk(req.params.id, {
            include: [{ model: Category },
            { model: Tag, through: ProductTag }]
        });

        if (!productData) {
            res.status(404).json({ message: 'No product found with this id.' });
            return;
        }

        res.status(200).json(productData);

    } catch (err) {
        res.status(500).json(err);
    }
});

// For requests to /api/products, POST route to create a new product. Request body should include (properties and values for) product_name, price, stock, and tagIds. tagIds should be an array of tag ids.
router.post('/', (req, res) => {
    Product.create(req.body)
        .then((product) => {
            // If there are tags for the product, create pairings to bulk create in the ProductTag model.
            if (req.body.tagIds.length) {
                const productTagIdArr = req.body.tagIds.map((tag_id) => {
                    return {
                        product_id: product.id,
                        tag_id,
                    };
                });
                return ProductTag.bulkCreate(productTagIdArr);
            }
            // If there are no product tags, respond 200 with the created product.
            res.status(200).json(product);
        })

        // If there were product tags, respond with the data from the created products and tags.
        .then((productTagIds) => res.status(200).json(productTagIds))
        .catch((err) => {
            res.status(400).json(err);
        });
});

// For requests to /api/products/:id, PUT route to update a product.
router.put('/:id', (req, res) => {
    Product.update(req.body, {
        where: {
            id: req.params.id,
        },
    })
        .then((product) => {
            if (req.body.tagIds && req.body.tagIds.length) {

                // Fetch all productTags associated with this product.
                ProductTag.findAll({
                    where: { product_id: req.params.id }
                }).then((productTags) => {

                    // This map extracts the tag_id values from the product and stores them in the productTagIds array.
                    const productTagIds = productTags.map(({ tag_id }) => tag_id);
                    // The filter produces an array which contains only the tag_ids from the req.body which weren't already associated with the product.
                    const newProductTags = req.body.tagIds
                        .filter((tag_id) => !productTagIds.includes(tag_id))
                        // The below map takes the array of only new tag_ids which was obtained from the filter, and it creates a new object for each of those tag_ids, containing the product_id and the tag_id.
                        .map((tag_id) => {
                            return {
                                product_id: req.params.id,
                                tag_id,
                            };
                        });

                    // Remove all tag_ids which were present in the database but not present in the req.body.
                    const productTagsToRemove = productTags
                        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
                        .map(({ id }) => id);

                    return Promise.all([
                        // Remove the product tags no longer associated with the product.
                        ProductTag.destroy({ where: { id: productTagsToRemove } }),
                        // Add the new product tags.
                        ProductTag.bulkCreate(newProductTags),
                    ]);
                });
            }

            return res.json(`Number of rows updated: ${JSON.stringify(product)}`);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
});

// For requests to /api/products/:id, DELETE route to delete a product by id.
router.delete('/:id', async (req, res) => {
    try {
        const productData = await Product.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!productData) {
            res.status(404).json({ message: 'No product found with this id.' });
            return;
        }
        return res.status(200).json(`Number of rows deleted: ${JSON.stringify(productData)}`);

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
