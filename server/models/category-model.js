
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Category = new Schema(
    {
        budgetid: { type: String, required: true},
        name: { type: String, required: true },
        balance: { type: Number, required: true }
    }
)

module.exports = mongoose.model('Categories', Category)