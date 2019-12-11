
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Account = new Schema(
    {
        budgetId: { type: String, required: true},
        name: { type: String, required: true },
        balance: { type: Number, required: true }
    }
)

module.exports = mongoose.model('Accounts', Account)