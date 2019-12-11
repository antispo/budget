
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Budget = new Schema(
    {
        name: { type: String, required: true }
    }
)

module.exports = mongoose.model('Budgets', Budget)