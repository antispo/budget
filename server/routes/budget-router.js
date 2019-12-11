const express = require('express')

const BudgetCtrl = require('../controllers/budget-ctrl')

const router = express.Router()

router.post('/budget', BudgetCtrl.createBudget)
router.put('/budget/:id', BudgetCtrl.updateBudget)
router.delete('/budget/:id', BudgetCtrl.deleteBudget)
router.get('/budget/:id', BudgetCtrl.getBudgetById)
router.get('/budgets', BudgetCtrl.getBudgets)

module.exports = router