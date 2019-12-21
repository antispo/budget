import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
})

export const insertBudget = payload => api.post(`/budget`, payload)
export const getAllBudgets = () => api.get(`/budgets`)
export const updateBudgetById = (id, payload) => api.put(`/budget/${id}`, payload)
export const deleteBudgetById = id => api.delete(`/budget/${id}`)
export const getBudgetById = id => api.get(`/budget/${id}`)

export const insertAccount = payload => api.post(`/account`, payload)
export const getAllAccounts = budgetId => api.get(`/accounts/${budgetId}`)
export const updateAccountById = (id, payload) => api.put(`/account/${id}`, payload)
export const deleteAccountById = id => api.delete(`/account/${id}`)
export const getAccountById = id => api.get(`/account/${id}`)

export const insertCategory = payload => api.post(`/category`, payload)
export const getAllCategories = budgetId => api.get(`/categories/${budgetId}`)
export const updateCategoryById = (id, payload) => api.put(`/category/${id}`, payload)
export const deleteCategoryById = id => api.delete(`/category/${id}`)
export const getCategoryById = id => api.get(`/category/${id}`)
export const getCategoryByName = name => api.get(`/category/${name}`)

export const insertPayee = payload => api.post(`/payee`, payload)
export const getAllPayees = budgetId => api.get(`/payees/${budgetId}`)
export const updatePayeeById = (id, payload) => api.put(`/payee/${id}`, payload)
export const deletePayeeById = id => api.delete(`/payee/${id}`)
export const getPayeeById = id => api.get(`/payee/${id}`)

export const insertTransaction = payload => api.post(`/transaction`, payload)
export const getAllTransactions = budgetId => api.get(`/transactions/${budgetId}`)
export const updateTransactionById = (id, payload) => api.put(`/transaction/${id}`, payload)
export const deleteTransactionById = id => api.delete(`/transaction/${id}`)
export const getTransactionById = id => api.get(`/transaction/${id}`)

export const insertEntry = payload => api.post(`/entry`, payload)
export const getAllEntries = budgetId => api.get(`/entries/${budgetId}`)
export const updateEntryById = (id, payload) => api.put(`/entry/${id}`, payload)
export const deleteEntryById = id => api.delete(`/entry/${id}`)
export const getEntryById = id => api.get(`/entry/${id}`)

const apis = {
    insertBudget,
    getAllBudgets,
    updateBudgetById,
    deleteBudgetById,
    getBudgetById,

    insertAccount,
    getAllAccounts,
    updateAccountById,
    deleteAccountById,
    getAccountById,

    insertCategory,
    getAllCategories,
    updateCategoryById,
    deleteCategoryById,
    getCategoryById,

    insertPayee,
    getAllPayees,
    updatePayeeById,
    deletePayeeById,
    getPayeeById,

    insertTransaction,
    getAllTransactions,
    updateTransactionById,
    deleteTransactionById,
    getTransactionById,

    insertEntry,
    getAllEntries,
    updateEntryById,
    deleteEntryById,
    getEntryById,
}

export default apis