import React from 'react'

import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router} from 'react-router-dom'
// import Route from ('react-router-dom').Route
 
import apis from '../api'

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            budget: {
                _id: "5df2468b0fbf700f3df20683",
                name: "",
                accounts: [],
                categories: [],
                payees: [],
                transactions: [],
            },
        }
    }
    componentDidMount() {
        apis.getBudgetById(this.state.budget._id).then( apiResponse => {
            this.setState( prevState => {  
                prevState.budget.name = apiResponse.data.data.name
                return { prevState }
            })
        }).then( () => {
            // console.log(this.state.budget.name)
        })
        this.gAAs()
        this.gACs()
        this.gAPs()
        this.gATs()
    }
    gAAs() {
        apis.getAllAccounts(this.state.budget._id).then( apiResponse => {
            this.setState( prevState => {
                prevState.budget.accounts = apiResponse.data.data
                return { prevState }
            })
        }).then( () => {
            // console.log(this.state.budget.accounts)
        })
    }
    gACs() {
        apis.getAllCategories(this.state.budget._id).then ( apiResponse => {
            this.setState ( prevState => {
                prevState.budget.categories = apiResponse.data.data
                return { prevState }
            })
        })
    }
    gAPs() {
        apis.getAllPayees(this.state.budget._id).then( apiResponse => {
            this.setState( prevState => {
                prevState.budget.payees = apiResponse.data.data
                return { prevState }
            })
        }).then( () => {
            // console.log(this.state.budget.payees)
        })
    }
    gATs() {
        apis.getAllTransactions(this.state.budget._id).then( apiResponse => {
            this.setState( prevState => {
                prevState.budget.transactions = apiResponse.data.data
                return { prevState }
            })
        })
    }
    deleteAccount = (id) => {
        const newAccounts = this.state.budget.accounts.filter( (value) => {
            return value._id !== id
        })
        apis.deleteAccountById(id)
        this.setState( prevState => {
            // console.log(prevState)
            prevState.budget.accounts = newAccounts
            return { prevState }
        })
    }
    deleteCategory = id => {
        const categories = this.state.budget.categories.filter( (value) => {
            return value._id !== id
        })
        apis.deleteCategoryById(id)
        this.setState( prevState => {
            // console.log(prevState)
            prevState.budget.categories = categories
            return { prevState }
        })
    }
    deletePayee = (id) => {
        const newPayees = this.state.budget.payees.filter( (value) => {
            return value._id !== id
        })
        apis.deletePayeeById(id)
        this.setState( prevState => {
            // console.log(prevState)
            prevState.budget.payees = newPayees
            return { prevState }
        })
    }
    deleteTransaction = id => {
        const ts = this.state.budget.transactions.filter( t => {
            return t._id !== id
        })
        apis.deleteTransactionById(id)
        this.setState( prevState => {
            prevState.budget.transactions = ts
            return { prevState }
        })
    }
    addAccount = (e) => {
        e.preventDefault()
        const newName = e.target.name.value
        const newBalance = e.target.balance.value
        apis.insertAccount({ 
            budgetId: this.state.budget._id,
            name: newName,
            balance: newBalance
        }).then( () => {
            this.gAAs()
        })  
    }
    addCategory = e => {
        e.preventDefault()
        const name = e.target.name.value
        apis.insertCategory({
            budgetId: this.state.budget._id,
            name: name
        }).then( () => {
            this.gACs()
        })
    }
    addPayee = e => {
        e.preventDefault()
        const name = e.target.name.value
        apis.insertPayee({
            budgetId: this.state.budget._id,
            name: name
        }).then( () => {
            this.gAPs()
        })
    }
    addTransaction = e => {
        e.preventDefault()
        const data = {
            budgetId: this.state.budget._id,
            date: e.target.date.value,
            payeeId: e.target.payeeId.value,
            accountIdFrom: e.target.accFrom.value,
            accountIdTo: e.target.accTo.value,
            categoryId: e.target.category.value,
            ammount: e.target.ammount.value,
            cleared: true
        }
        apis.insertTransaction(data).then( () => {
            this.gATs()
        })
    }
    render() {
        return (
            <Router>
                <div>
                    <ul>
                        {this.state.budget.accounts.length !== 0 && 
                            <AccountList
                                accounts={this.state.budget.accounts}
                                deleteAccount={this.deleteAccount}
                            />
                        }
                    </ul>
                    <AddAccountForm addAccount={this.addAccount} />
                    <ul>
                        {this.state.budget.categories.length !== 0 &&
                            <CategoryList 
                                categories={this.state.budget.categories}
                                deleteCategory={this.deleteCategory}
                            />
                        }
                    </ul>
                    <AddCategoryForm addCategory={this.addCategory} />
                    <ul>
                        {this.state.budget.payees.length !== 0 && 
                            <PayeeList
                                payees={this.state.budget.payees}
                                deletePayee={this.deletePayee}
                            />
                        }
                    </ul>
                    <AddPayeeForm addPayee={this.addPayee} />
                    
                    <AddTransactionForm
                        payees={this.state.budget.payees}
                        accounts={this.state.budget.accounts}
                        categories={this.state.budget.categories}
                        addTransaction={this.addTransaction}
                    />
                    <TransactionList 
                        ts={this.state.budget}
                        deleteTransaction={this.deleteTransaction}
                    />
                </div>
            </Router>
        )
    }
}

const AccountList = props => {
    return (
        props.accounts.map( account => {
        return (
            <li key={account._id} id={account._id}>
                <span>{account.name}</span> |
                <span>{account.balance}</span> | 
                <span
                    onClick={ () => {
                        props.deleteAccount(account._id)
                    }}>
                    del
                </span>
            </li>
            )
        })
    )
}

const CategoryList = props => {
    return (
        props.categories.map( category => {
        return (
            <li key={category._id} id={category._id}>
                <span>{category.name}</span> |
                <span
                    onClick={ () => {
                        props.deleteCategory(category._id)
                    }}>
                    del
                </span>
            </li>
            )
        })
    )
}

const PayeeList = props => {
    return (
        props.payees.map( payee => {
        return (
            <li key={payee._id} id={payee._id}>
                <span>{payee.name}</span> |
                <span
                    onClick={ () => {
                        props.deletePayee(payee._id)
                    }}>
                    del
                </span>
            </li>
            )
        })
    )
}

const findItemById = (where, id) => {
    const res = where.filter( wi => {
        return wi._id === id
    })
    return res[0]
}

const TransactionList = props => {
    return (
        props.ts.transactions.map( t => {
            const payee = findItemById(props.ts.payees, t.payeeId)
            const accountFrom = findItemById(props.ts.accounts, t.accountIdFrom)
            const accountTo = findItemById(props.ts.accounts, t.accountIdTo)
            const category = findItemById(props.ts.categories, t.categoryId)
            return (
                <li key={t._id} id={t._id}>
                    | <span>{t.date}</span> |
                    | <span>{ (payee !== undefined) ? payee.name : "NO_PAYEE"}</span> |
                    | <span>{ (accountFrom !== undefined) ? accountFrom.name : "NO_ACCOUNT_FROM"}</span> |
                    | <span>{ (accountTo !== undefined) ? accountTo.name : "NO_ACCOUNT_TO"}</span> |
                    | <span>{ (category !== undefined) ? category.name : "NO_CATEGORY"}</span> |
                    | <span>{t.ammount}</span> |
                    | <span onClick={ () => {
                        props.deleteTransaction(t._id)
                    }}>delete</span> |
                </li>
            )
        })
    )
}

const AddAccountForm = (props) => {
    return (
        <div className="form">
            <form onSubmit={props.addAccount}>
                <input name="name" type="text" placeholder="Add account" />
                <input name="balance" type="text" placeholder="0" />
                <button>Submit</button>
            </form>
        </div>
    )
}

const AddCategoryForm = (props) => {
    return (
        <div className="form">
            <form onSubmit={props.addCategory}>
                <input name="name" type="text" placeholder="Add category" />
                <button>Submit</button>
            </form>
        </div>
    )
}

const AddPayeeForm = (props) => {
    return (
        <div className="form">
            <form onSubmit={props.addPayee}>
                <input name="name" type="text" placeholder="Add payee" />
                <button>Submit</button>
            </form>
        </div>
    )
}

const AddTransactionForm = props => {
    return (
        <div className="form">
            <form onSubmit={props.addTransaction}>
                <input name="date" type="text" placeholder="Date" />
                <select name="payeeId">
                    <option key="no-payee"></option>
                    {props.payees.map( payee => {
                        return (
                            <option key={payee._id} value={payee._id}>{payee.name}</option>
                        )
                    })}
                </select>
                <select name="accFrom">
                    <option key="no-account-from"></option>
                    {props.accounts.map( account => {
                        return (
                            <option key={account._id} value={account._id}>{account.name} - {account.balance}</option>
                        )
                    })}
                </select>
                <select name="accTo">
                    <option key="no-account-to"></option>
                    {props.accounts.map( account => {
                        return (
                            <option key={account._id} value={account._id}>{account.name} - {account.balance}</option>
                        )
                    })}
                </select>
                <select name="category">
                    <option key="no-category"></option>
                    {props.categories.map( category => {
                        return (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        )
                    })}
                </select>
                
                <input name="ammount" type="text" placeholder="ammount" />
                <button>Submit</button>
            </form>
        </div> 
    )
}

export default App