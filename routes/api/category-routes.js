const router = require('express').Router();
const { Category, Product } = require('../../models');


// For requests to /api/categories, GET route to get all categories (including associated products).
router.get('/', async (req, res) => {
    try {
        const categoryData = await Category.findAll({
            include: [{ model: Product }],
            order: [['id', 'ASC']]
        });
        res.status(200).json(categoryData);

    } catch (err) {
        res.status(500).json(err);
    }
});


// For request to /api/categories/id, GET route to get a single category (including associated products).
router.get('/:id', async (req, res) => {
    try {
        const categoryData = await Category.findByPk(req.params.id, {
            include: [{ model: Product }]
        });

        if (!categoryData) {
            res.status(404).json({ message: 'No category found with this id.' });
            return;
        }

        res.status(200).json(categoryData);

    } catch (err) {
        res.status(500).json(err);
    }
});


// For requests to /api/categories, POST route to create a new category. The request body should provide a category_name property and value.
router.post('/', (req, res) => {
    Category.create(req.body)
        .then((category) => {
            res.status(200).json(category);
        })

        .catch((err) => {
            res.status(400).json(err);
        });
});


// For requests to /api/categories/:id, PUT route to update a category by id. The category id should be provided as the request parameter. If the product ids associated with the category need to be updated, the entire set of product ids which should now be associated with the product need to be provided.
router.put('/:id', (req, res) => {
    Category.update(req.body, {
        where: {
            id: req.params.id,
        },
    })
        .then((category) => {
            if (req.body.productIds && req.body.productIds.length) {

                // Find the category to update
                Category.findAll({
                    where: { category_id: req.params.id }
                }).then((resultingCategory) => {

                    // This map extracts the product_id values from the category with the id the user requested and stores them in the productIds array.
                    const productIds = resultingCategory.map(({ product_id }) => product_id);
                    // The filter produces an array which contains only the product _ids from the req.body which weren't already associated with the category.
                    const newProductIds = req.body.productIds
                        .filter((product_id) => !productIds.includes(product_id))
                        // The below map takes the array of only new product _ids which was obtained from the filter, and it creates a new object for each of those product _ids, containing the category_id and the product_id. 
                        .map((product_id) => {
                            return {
                                category_id: req.params.id,
                                product_id,
                            };
                        });

                    // Remove all product ids which were present in the database but not present in the req.body.
                    const productIdsToRemove = productIds
                        .filter(({ product_id }) => !req.body.productIds.includes(product_id))
                        .map(({ id }) => id);

                    return Promise.all([
                        // Remove product ids no longer associated with the category.
                        Category.destroy({ where: { id: productIdsToRemove } }),
                        // Add the new product ids.
                        Category.bulkCreate(newProductIds),
                    ]);
                });
            }

            return res.json(`Number of rows updated: ${JSON.stringify(category)}`);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
});


// For requests to /api/categories/:id, DELETE route to delete a category by id.
router.delete('/:id', async (req, res) => {
    try {
        const categoryData = await Category.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!categoryData) {
            res.status(404).json({ message: 'No category found with this id.' });
            return;
        }

        return res.status(200).json(`Number of rows deleted: ${JSON.stringify(categoryData)}`);

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
