
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Transaction = new Schema(
    {
        budgetId: { type: String, required: true},
        date: { type: Date, default: Date.now },
        accountIdFrom: { type: String, required: false},
        accountIdTo: { type: String, required: false},
        payeeId: { type: String, required: false },
        categoryId: { type: String, required: false },
        memo: { type: String, required: false },
        ammount: { type: Number, required: true},
        cleared: { type: Boolean , required: true }
    }
)

module.exports = mongoose.model('Transactions', Transaction)