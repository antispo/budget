const Category = require('../models/category-model')

createCategory = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a category',
        })
    }

    const category = new Category(body)

    if (!category) {
        return res.status(400).json({ success: false, error: err })
    }

    category
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: category._id,
                message: 'Category created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Category not created!',
            })
        })
}

updateCategory = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Category.findOne({ _id: req.params.id }, (err, category) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Category not found!',
            })
        }
        category.dudgetId = body.budgetId
        category.name = body.name
        category
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: category._id,
                    message: 'Category updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Category not updated!',
                })
            })
    })
}

deleteCategory = async (req, res) => {
    await Category.findOneAndDelete({ _id: req.params.id }, (err, category) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!category) {
            return res
                .status(404)
                .json({ success: false, error: `Category not found` })
        }

        return res.status(200).json({ success: true, data: category })
    }).catch(err => console.log(err))
}

getCategoryById = async (req, res) => {
    await Category.findOne({ _id: req.params.id }, (err, category) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!category) {
            return res
                .status(404)
                .json({ success: false, error: `Category not found` })
        }
        return res.status(200).json({ success: true, data: category })
    }).catch(err => console.log(err))
}

getCategoryByName = async (req, res) => {
    await Category.findOne({ name: req.params.name }, (err, category) => {
        console.log(category)
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!category) {
            return res
                .status(404)
                .json({ success: false, error: `Category not found` })
        }
        return res.status(200).json({ success: true, data: category })
    }).catch(err => console.log(err))
}

getCategories = async (req, res) => {
    await Category.find({ budgetId: req.params.budgetId}, (err, categories) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!categories.length) {
            return res
                .status(404)
                .json({ success: false, error: `Category not found` })
        }
        return res.status(200).json({ success: true, data: categories })
    }).catch(err => console.log(err))
}

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories,
    getCategoryById,
    getCategoryByName,
}