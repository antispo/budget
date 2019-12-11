
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Category = new Schema(
    {
        budgetId: { type: String, required: true},
        name: { type: String, required: true },
    }
)

module.exports = mongoose.model('Categories', Category)