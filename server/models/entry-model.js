const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Entry = new Schema(
    {
        budgetId: { type: String, required: true},
        year: { type: Number, required: true },
        month: { type: String, required: true },
        categoryId: { type: String, required: false },
        budgeted: { type: Number, required: true},
    }
)

module.exports = mongoose.model('Entries', Entry)