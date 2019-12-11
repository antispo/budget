const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db')

const budgetRouter = require('./routes/budget-router')
const accountRouter = require('./routes/account-router')
const categoryRouter = require('./routes/category-router')
const payeeRouter = require('./routes/payee-router')
const transactionRouter = require('./routes/transaction-router')

const app = express()
const apiPort = 3001

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api/budget', budgetRouter)
app.use('/api/account', accountRouter)
app.use('/api/category', categoryRouter)
app.use('/api/payee', payeeRouter)
app.use('/api/transaction', transactionRouter)


app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))