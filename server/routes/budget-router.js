const express = require('express');

const BudgetCtrl = require('../controllers/budget-ctrl');
const AccountCtrl = require('../controllers/account-ctrl');
const CategoryCtrl = require('../controllers/category-ctrl');
const PayeeCtrl = require('../controllers/payee-ctrl');
const TransactionCtrl = require('../controllers/transaction-ctrl');
const EntryCtrl = require('../controllers/entry-ctrl');

const router = express.Router();

router.post('/budget', BudgetCtrl.createBudget);
router.put('/budget/:id', BudgetCtrl.updateBudget);
router.delete('/budget/:id', BudgetCtrl.deleteBudget);
router.get('/budget/:id', BudgetCtrl.getBudgetById);
router.get('/budgets', BudgetCtrl.getBudgets);

router.post('/account', AccountCtrl.createAccount);
router.put('/account/:id', AccountCtrl.updateAccount);
router.delete('/account/:id', AccountCtrl.deleteAccount);
router.get('/account/:id', AccountCtrl.getAccountById);
router.get('/accounts/:budgetId', AccountCtrl.getAccounts);

router.post('/category', CategoryCtrl.createCategory);
router.put('/category/:id', CategoryCtrl.updateCategory);
router.delete('/category/:id', CategoryCtrl.deleteCategory);
router.get('/category/:id', CategoryCtrl.getCategoryById);
router.get('/category/:name', CategoryCtrl.getCategoryByName);
router.get('/categories/:budgetId', CategoryCtrl.getCategories);

router.post('/payee', PayeeCtrl.createPayee);
router.put('/payee/:id', PayeeCtrl.updatePayee);
router.delete('/payee/:id', PayeeCtrl.deletePayee);
router.get('/payee/:id', PayeeCtrl.getPayeeById);
router.get('/payees/:budgetId', PayeeCtrl.getPayees);

router.post('/transaction', TransactionCtrl.createTransaction);
router.put('/transaction/:id', TransactionCtrl.updateTransaction);
router.delete('/transaction/:id', TransactionCtrl.deleteTransaction);
router.get('/transaction/:id', TransactionCtrl.getTransactionById);
router.get('/transactions/:budgetId', TransactionCtrl.getTransactions);

router.post('/entry', EntryCtrl.createEntry);
router.put('/entry/:id', EntryCtrl.updateEntry);
router.delete('/entry/:id', EntryCtrl.deleteEntry);
router.get('/entry/:id', EntryCtrl.getEntryById);
router.get('/entries/:budgetId', EntryCtrl.getEntries);

module.exports = router;
