import React from 'react'

import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router} from 'react-router-dom'
// import Route from ('react-router-dom').Route

import apis from '../api'

const findItemById = (where, id) => {
    const res = where.filter( wi => {
        return wi._id === id
    })
    return res[0]
}

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
                entries: [],
                total: 0,
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
        this.gAEs()
    }
    // recalculate
    rc() {
        // console.log("in rc")
        let total = 0
        // console.log("Total", total)
        this.state.budget.accounts.map( a => {
            // console.log(a.name, a.balance)
            total += a.balance
        })
        // console.log("Total", total)
        this.setState( prevState => {
            prevState.budget.total = total
            return { prevState }
        })
        // console.log("Total", this.state.budget.total)
    }
    gAAs() {
        apis.getAllAccounts(this.state.budget._id).then( apiResponse => {
            this.setState( prevState => {
                prevState.budget.accounts = apiResponse.data.data
                return { prevState }
            })
        }).then( () => {
            // console.log(this.state.budget.accounts)
            this.rc()
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
    gAEs() {
        apis.getAllEntries(this.state.budget._id).then( apiResponse => {
            this.setState( prevState => {
                prevState.budget.entries = apiResponse.data.data
                return( prevState )
            })
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

    deleteEntry = id => {
        const es = this.state.budget.entries.filter( e => {
            return e._id !== id
        })
        apis.deleteEntryById(id)
        this.setState( prevState => {
            prevState.budget.entries = es
            return { prevState }
        })
    }
    
    addItem = (e, actions, fields, postaction) => {
        e.preventDefault()
        let data = {
            budgetId: this.state.budget._id
        }
        fields.map( (field, index) => {
            // console.log(e.target[field].value)
            data[field] = e.target[field].value
        })
        apis[actions](data).then( () => {
            this[postaction]()
        })
        // console.log(data)
        this.rc()
    }
    deleteItem = (id, items, action) => {
        // console.log(id, items, action)
        const newItems = this.state.budget[items].filter( item => {
            return item._id !== id
        })
        apis[action](id)
        this.setState( prevState => {
            prevState.budget[items] = newItems
            return { prevState }
        }, () => {
            this.rc()
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
        var accountFrom = findItemById(this.state.budget.accounts, data.accountIdFrom)
        if ( accountFrom !== undefined) { 
            accountFrom.balance -= parseFloat(data.ammount)
            apis.updateAccountById(accountFrom._id, accountFrom).then( () => {
                this.gAAs()
            })
        }
        var accountTo = findItemById(this.state.budget.accounts, data.accountIdTo)
        if (accountTo !== undefined) {
            accountTo.balance += parseFloat(data.ammount)
            apis.updateAccountById(accountTo._id, accountTo).then( () => {
                this.gAAs()
            })
        }
        apis.insertTransaction(data).then( () => {
            this.gATs()
        })
    }
    addEntry = e => {
        e.preventDefault()
        const data = {
            budgetId: this.state.budget._id,
            year: e.target.year.value,
            month: e.target.month.value,
            categoryId: e.target.category.value,
            budgeted: e.target.budgeted.value,
        }
        apis.insertEntry(data).then( () => {
            this.gAEs()
        })
    }
    render() {
        return (
            <Router>
                <div>
                    <Totallist total={this.state.budget.total} />
                    <ul>
                        {this.state.budget.accounts.length !== 0 && 
                            <ListItems
                                fields={["name", "balance"]}
                                data={this.state.budget.accounts}
                                deleteItem={this.deleteItem}
                                items="accounts"
                                apiCall="deleteAccountById"
                            />
                        }
                    </ul>
                    <AddItemForm
                        action={ (e) => {
                            this.addItem(e, "insertAccount", ["name", "balance"], "gAAs")
                        }}
                        fields={[
                                { name: "name", ph: "Add Account" }, 
                                { name: "balance", ph: "Balance" }
                            ]}
                    />


                    <ul>
                        <ListItems
                            fields={["name"]}
                            data={this.state.budget.categories}
                            deleteItem={this.deleteItem}
                            items="categories"
                            apiCall="deleteCategoryById"
                        />
                    </ul>
                    <AddItemForm 
                        action={ e => {
                            this.addItem(e, "insertCategory", ["name"], "gACs")
                        }}
                        fields={[{name: "name", ph: "Add Category"}]}
                     />

                    <ul>
                        <ListItems
                            fields={["name"]}
                            data={this.state.budget.payees}
                            deleteItem={this.deleteItem}
                            items="payees"
                            apiCall="deletePayeeById"
                        />
                    </ul>
                    <AddItemForm
                        action={ e => {
                            this.addItem(e, "insertPayee", ["name"], "gAPs")
                        }}
                        fields={[{name: "name", ph: "Add Payee"}]}
                    />
                    
                    <TransactionList 
                        ts={this.state.budget}
                        deleteTransaction={this.deleteTransaction}
                    />
                    <AddTransactionForm
                        payees={this.state.budget.payees}
                        accounts={this.state.budget.accounts}
                        categories={this.state.budget.categories}
                        addTransaction={this.addTransaction}
                    />

                    <EntryList
                        es={this.state.budget}
                        deleteEntry={this.deleteEntry}
                    />
                    <AddEntryForm
                        categories={this.state.budget.categories}
                        addEntry={this.addEntry}
                    />
                </div>
            </Router>
        )
    }
}

const Totallist = props => {
    return (
        <div>Total: {props.total}</div>
    )
}

const ListItems = props => {
    return (
        props.data.map ( item => {
            return (
                <li key={item._id} id={item._id}>
                    {/* { console.log(props.fields) } */}
                    {props.fields.map( (field, index) => {
                        return (
                            <span key={index}>| {item[field]} |</span> 
                        )
                    })}
                    <span onClick={ () => {
                        props.deleteItem(item._id, props.items, props.apiCall)
                    }}>del</span>
                </li>
            )
        })
    )
}
const AddItemForm = props => {
    return (
        <div className="form">
            <form onSubmit={props.action}>
                {props.fields.map( (field, key) => {
                    return (
                        <input key={key} name={field.name} placeholder={field.ph} />
                    )
                })}
                <button>Submit</button>
            </form>
        </div>
    )
}

const TransactionList = props => {
    // console.log(props.ts.transactions)
    return (
        props.ts.transactions.map( t => {
            const payee = findItemById(props.ts.payees, t.payeeId)
            // const payee = t.GET_BY_ID("payees", t.id)
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

const EntryList = props => {
    return (
        props.es.entries.map( e => {
            const category = findItemById(props.es.categories, e.categoryId)
            return (
                <li key={e._id} id={e._id}>
                    | <span>{e.year}</span> |
                    | <span>{e.month}</span> |
                    | <span>{ (category !== undefined) ? category.name : "NO_CATEGORY"}</span> |
                    | <span>{e.budgeted}</span> |
                    | <span onClick={ () => {
                        props.deleteEntry(e._id)
                    }}>delete</span> |
                </li>
            )
        })
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

const AddEntryForm = props => {
    return (
        <form onSubmit={props.addEntry}>
            <input name="year" type="text" placeholder="Year" />
            <input name="month" type="text" placeholder="Month" />
            <select name="category">
                <option key="no-category"></option>
                {props.categories.map( category => {
                    return (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    )
                })}
            </select>
            <input name="budgeted" type="text" placeholder="Budgeted" />
            <button>Submit</button>
        </form>
    )
}

export default App
