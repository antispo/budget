
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Payee = new Schema(
    {
        budgetId: { type: String, required: true},
        name: { type: String, required: true },
    }
)

module.exports = mongoose.model('Payees', Payee)