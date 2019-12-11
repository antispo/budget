const Budget = require('../models/budget-model')

createBudget = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a budget',
        })
    }

    const budget = new Budget(body)

    if (!budget) {
        return res.status(400).json({ success: false, error: err })
    }

    budget
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: budget._id,
                message: 'Budget created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Budget not created!',
            })
        })
}

updateBudget = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Budget.findOne({ _id: req.params.id }, (err, budget) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Budget not found!',
            })
        }
        budget.name = body.name
        budget
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: budget._id,
                    message: 'Budget updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Budget not updated!',
                })
            })
    })
}

deleteBudget = async (req, res) => {
    await Budget.findOneAndDelete({ _id: req.params.id }, (err, budget) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!budget) {
            return res
                .status(404)
                .json({ success: false, error: `Budget not found` })
        }

        return res.status(200).json({ success: true, data: budget })
    }).catch(err => console.log(err))
}

getBudgetById = async (req, res) => {
    await Budget.findOne({ _id: req.params.id }, (err, budget) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!budget) {
            return res
                .status(404)
                .json({ success: false, error: `Budget not found` })
        }
        return res.status(200).json({ success: true, data: budget })
    }).catch(err => console.log(err))
}

getBudgets = async (req, res) => {
    await Budget.find({}, (err, budgets) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!budgets.length) {
            return res
                .status(404)
                .json({ success: false, error: `Budget not found` })
        }
        return res.status(200).json({ success: true, data: budgets })
    }).catch(err => console.log(err))
}

module.exports = {
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgets,
    getBudgetById,
}