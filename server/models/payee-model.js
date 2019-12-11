
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Payee = new Schema(
    {
        budgetid: { type: String, required: true},
        name: { type: String, required: true },
    }
)

module.exports = mongoose.model('Payees', Payee)