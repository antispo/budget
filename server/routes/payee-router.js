const express = require('express')

const PayeeCtrl = require('../controllers/payee-ctrl')

const router = express.Router()

router.post('/payee', PayeeCtrl.createPayee)
router.put('/payee/:id', PayeeCtrl.updatePayee)
router.delete('/payee/:id', PayeeCtrl.deletePayee)
router.get('/payee/:id', PayeeCtrl.getPayeeById)
router.get('/payees/:budgetId', PayeeCtrl.getPayees)

module.exports = router