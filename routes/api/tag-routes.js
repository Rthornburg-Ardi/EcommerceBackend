const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// For requests to /api/tags, GET route to get all tags (including associated Product data).
router.get('/', async (req, res) => {
    try {
        const tagData = await Tag.findAll({
            include: [{ model: Product, through: ProductTag }],
            order: [['id', 'ASC']]
        });
        res.status(200).json(tagData);

    } catch (err) {
        res.status(500).json(err);
    }
});

// For requests to /api/tags/:id, GET route to get a tag by id (including associated Product data).
router.get('/:id', async (req, res) => {
    try {
        const tagData = await Tag.findByPk(req.params.id, {
            include: [{ model: Product, through: ProductTag }],
        });

        if (!tagData) {
            res.status(404).json({ message: 'No tag found with this id.' });
            return;
        }

        res.status(200).json(tagData);

    } catch (err) {
        res.status(500).json(err);
    }
});

// For requests to /api/tags, POST route to create a new tag.
router.post('/', (req, res) => {
    Tag.create(req.body)
        .then((tag) => {
            res.status(200).json(tag);
        })

        .catch((err) => {
            res.status(400).json(err);
        });
});

// For requests to /api/tags/:id, PUT route to update a tag by id.
router.put('/:id', (req, res) => {
    Tag.update(req.body, {
        where: {
            id: req.params.id,
        },
    })
        .then((tag) => {
            return res.json(`Number of rows updated: ${JSON.stringify(tag)}`);
        })

        .catch((err) => {
            res.status(400).json(err);
        });
});

// For requests to /api/tags/:id, DELETE route to delete a tag by id.
router.delete('/:id', async (req, res) => {
    try {
        const tagData = await Tag.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!tagData) {
            res.status(404).json({ message: 'No tag found with this id.' });
            return;
        }

        return res.status(200).json(`Number of rows deleted: ${JSON.stringify(tagData)}`);

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
