const Payee = require('../models/payee-model')

createPayee = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a payee',
        })
    }

    const payee = new Payee(body)

    if (!payee) {
        return res.status(400).json({ success: false, error: err })
    }

    payee
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: payee._id,
                message: 'Payee created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Payee not created!',
            })
        })
}

updatePayee = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Payee.findOne({ _id: req.params.id }, (err, payee) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Payee not found!',
            })
        }
        payee.dudgetId = body.budgetId
        payee.name = body.name
        payee
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: payee._id,
                    message: 'Payee updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Payee not updated!',
                })
            })
    })
}

deletePayee = async (req, res) => {
    await Payee.findOneAndDelete({ _id: req.params.id }, (err, payee) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!payee) {
            return res
                .status(404)
                .json({ success: false, error: `Payee not found` })
        }

        return res.status(200).json({ success: true, data: payee })
    }).catch(err => console.log(err))
}

getPayeeById = async (req, res) => {
    await Payee.findOne({ _id: req.params.id }, (err, payee) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!payee) {
            return res
                .status(404)
                .json({ success: false, error: `Payee not found` })
        }
        return res.status(200).json({ success: true, data: payee })
    }).catch(err => console.log(err))
}

getPayees = async (req, res) => {
    await Payee.find({ budgetId: req.params.budgetId}, (err, payees) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!payees.length) {
            return res
                .status(404)
                .json({ success: false, error: `Payee not found` })
        }
        return res.status(200).json({ success: true, data: payees })
    }).catch(err => console.log(err))
}

module.exports = {
    createPayee,
    updatePayee,
    deletePayee,
    getPayees,
    getPayeeById,
}