import React from 'react'

import './App.css';

const EM = require('exact-math');

import "bootstrap/dist/css/bootstrap.min.css"



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
                _id: "5dfdfd026a572627cc560a0f",
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
            }, () => {
                
                this.gAAs()
            })
        })
    }

    gAAs() {
        apis.getAllAccounts(this.state.budget._id).then( apiResponse => {
            this.setState( prevState => {
                prevState.budget.accounts = apiResponse.data.data
                return { prevState }
            })
        }).then( () => {
            
            
            this.gACs()
        }).catch( e => {
            
        })
    }

    gACs() {
        apis.getAllCategories(this.state.budget._id).then ( apiResponse => {
            this.setState ( prevState => {
                prevState.budget.categories = apiResponse.data.data
                return { prevState }
            })
        }).then( () => {
            this.gAPs()
        }).catch( e => {
            
        })
    }
    gAPs() {
        apis.getAllPayees(this.state.budget._id).then( apiResponse => {
            this.setState( prevState => {
                prevState.budget.payees = apiResponse.data.data
                return { prevState }
            })
        }).then( () => {
            
            this.gATs()
            
        }).catch( e => {
            
        })
    }
    gATs() {
        
        apis.getAllTransactions(this.state.budget._id).then( apiResponse => {
            this.setState( prevState => {
                prevState.budget.transactions = apiResponse.data.data
                
                return { prevState }
            }, () => {
                this.calculateEntries()
                this.processTransactions()
                this.calculateTotal()
            })
        }).then( () => {
            
        }).catch( e => {
            
        })
    }
    calculateTotal() {
        var total = 0
        this.state.budget.accounts.forEach( a => {
            total = EM.add(total, a.balance)
        })
        this.setState( p => {
            p.budget.total = total
            return( p ) 
        }, () => {
        })
    }

    processTransactions() {
        this.state.budget.transactions.forEach( t => {
            if (t.accountIdFrom !== "") {
                this.setState( p => {
                    p.budget.accounts.forEach( a => {
                        if ( t.accountIdFrom === a._id ) {
                            
                            a.balance = EM.sub(a.balance, t.ammount)
                            
                        }
                    })
                    return( p )
                })
            }
            if (t.accountIdTo !== "") {
                this.setState( p => {
                    p.budget.accounts.forEach( a => {
                        if ( t.accountIdTo === a._id ) {
                            a.balance = EM.add(a.balance, t.ammount)
                            
                        }
                    })
                    return( p )
                }, () => {
                    this.calculateTotal()
                })
            }
        })
    }
    calculateEntries() {
        const entries = this.state.budget.entries
        const transactions = this.state.budget.transactions
        
        entries.forEach( entry => {
            let activitySum = 0
            transactions.forEach( t => {
                
                
                if ( t.categoryId === entry.categoryId ) {
                    activitySum += t.ammount
                }
                
            })
            
            entry['activitySum'] = activitySum
            entry['available'] = entry.budgeted - activitySum
        })
        this.setState( p => {
            p.budget.entries = entries
            return( p )
        }, () => {
            
        })
    }
    gAEs() {
        apis.getAllEntries(this.state.budget._id).then( apiResponse => {
            this.setState( prevState => {
                prevState.budget.entries = apiResponse.data.data
                
                
                
                return( prevState )
            })
        }).then( () => {
            this.calculateEntries()
        }).catch( e => {
            
        })
    }

    deleteCategory = id => {
        const categories = this.state.budget.categories.filter( (value) => {
            return value._id !== id
        })
        apis.deleteCategoryById(id)
        this.setState( prevState => {
            
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
            
            prevState.budget.payees = newPayees
            return { prevState }
        })
    }


    deleteTransaction = id => {
        const ts = this.state.budget.transactions.filter( t => {
            return t._id !== id
        })
        const transaction = this.state.budget.transactions.filter( t => {
            return t._id === id
        })[0]
        const AAA = parseFloat(transaction.ammount)
        console.log("AAA:", AAA)
        var toAdd = 0
        var toSub = 0
        var accountTo = findItemById(this.state.budget.accounts, transaction.accountIdTo)
        if ( accountTo !== undefined ) {
            console.log("AT:", accountTo)
            accountTo.balance = EM.sub(accountTo.balance, AAA)
            toSub = AAA
            apis.updateAccountById(accountTo._id, accountTo).then( r => {
                // toSub = AAA
            })
        }
        var accountFrom = findItemById(this.state.budget.accounts, transaction.accountIdFrom)
        if ( accountFrom !== undefined) {
            console.log("AF:", accountFrom)
            toAdd = AAA
            accountFrom.balance = EM.add(accountFrom.balance, AAA)
            apis.updateAccountById(accountFrom._id, accountFrom).then( r => {
                // toAdd = AAA
            })
        }
        console.log(toAdd, toSub)
        apis.deleteTransactionById(id)
        this.setState( prevState => {
            prevState.budget.transactions = ts
            prevState.budget.total = EM.add(prevState.budget.total, toAdd)
            prevState.budget.total = EM.sub(prevState.budget.total, toSub)
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
        fields.forEach( (field) => {
            
            data[field] = e.target[field].value
        })
        apis[actions](data).then( () => {
            this[postaction]()
        })
        
        
        
        
    }
    deleteItem = (id, items, action) => {
        
        const newItems = this.state.budget[items].filter( item => {
            return item._id !== id
        })
        apis[action](id)
        this.setState( prevState => {
            prevState.budget[items] = newItems
            return { prevState }
        }, () => {
            
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
        
        if (data.accountIdFrom === "" && data.accountIdTo === "") {
            throw new Error("Here be needed at least on account")
        } else {
            if (data.payeeId === "" && data.categoryId === "") {
                throw new Error("Here be needed a payee or category, bre")
            }
        }
        var accountFrom = findItemById(this.state.budget.accounts, data.accountIdFrom)
        var toAdd = 0
        var toSub = 0
        if ( accountFrom !== undefined) { 
            accountFrom.balance = EM.sub(accountFrom.balance, parseFloat(data.ammount))
            apis.updateAccountById(accountFrom._id, accountFrom).then( () => {
                
            })
            toSub = accountFrom.balance
        }
        var accountTo = findItemById(this.state.budget.accounts, data.accountIdTo)
        if (accountTo !== undefined) {
            accountTo.balance = EM.add(accountTo.balance, parseFloat(data.ammount))
            apis.updateAccountById(accountTo._id, accountTo).then( () => {
                
            })
            toAdd = accountTo.balance
        }
        apis.insertTransaction(data).then( ( apiResponse ) => {
            
            
            
            
            data._id = apiResponse.data.id
            this.setState( p => {
                p.budget.transactions.push(data)
                if (toAdd.id !== null ) {
                    p.budget.total = EM.add(p.budget.total, toAdd)
                }
                if (toSub.id !== null ) {
                    p.budget.total = EM.sub(p.budget.total, toSub)
                }
                return( p )
            })
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
            
        <div className="App">
            
            <div className="total">
                <TotalList total={this.state.budget.total} />
            </div>

            <div className="main">
            <div className="accounts">
                <div className="account-form">
                    <AddItemForm
                        action={ (e) => {
                            this.addItem(e, "insertAccount", ["name", "balance"], "gAAs")
                        }}
                        fields={[
                                { name: "name", ph: "Add Account" }, 
                                { name: "balance", ph: "Balance" }
                            ]} 
                    />
                </div>
                <div className="accountslist">
                    {this.state.budget.accounts.length !== 0 && 
                        <ListItems
                            fields={["name", "balance"]}
                            data={this.state.budget.accounts}
                            deleteItem={this.deleteItem}
                            items="accounts"
                            apiCall="deleteAccountById" />}
                </div>
            </div>
            
            <div className="categories">
                <AddItemForm 
                    action={ e => {
                        this.addItem(e, "insertCategory", ["name"], "gACs")
                    }}
                    fields={[{name: "name", ph: "Add Category"}]}
                />
                <div className="">
                    <ul>
                        <ListItems
                            fields={["name"]}
                            data={this.state.budget.categories}
                            deleteItem={this.deleteItem}
                            items="categories"
                            apiCall="deleteCategoryById"
                        />
                    </ul>
                </div>
            </div>
            
            <div className="payees">
                <AddItemForm
                    action={ e => {
                        this.addItem(e, "insertPayee", ["name"], "gAPs")
                    }}
                    fields={[{name: "name", ph: "Add Payee"}]}
                />
                <div className="">
                    <ul>
                        <ListItems
                            fields={["name"]}
                            data={this.state.budget.payees}
                            deleteItem={this.deleteItem}
                            items="payees"
                            apiCall="deletePayeeById"
                        />
                    </ul>
                </div>
            </div>

            <div className="">
                <AddTransactionForm
                    payees={this.state.budget.payees}
                    accounts={this.state.budget.accounts}
                    categories={this.state.budget.categories}
                    addTransaction={this.addTransaction}
                />
                <div className="transactions">
                    <TransactionList 
                        ts={this.state.budget}
                        deleteTransaction={this.deleteTransaction}
                    />
                </div>
            </div>

            <div className="entries">
                <AddEntryForm
                    categories={this.state.budget.categories}
                    addEntry={this.addEntry}
                />
                <div className="entry-list">
                    <EntryList
                        es={this.state.budget}
                        deleteEntry={this.deleteEntry}
                    />
                </div>
            </div>
            </div>
            
        </div>
        )
    }
}

const TotalList = props => {
    return (
        <div>Total: {props.total}</div>
    )
}

const ListItems = props => {
    return (
        <table><tbody>
            { props.data.map ( item => {
                return (
                    <tr className="account" key={item._id} id={item._id}>
                        {props.fields.map( (field, index) => {
                            return (
                                <td key={index}>{item[field]}</td> 
                            )
                        })}
                        <td>
                            <button className="delete-button" onClick={ () => {
                                props.deleteItem(item._id, props.items, props.apiCall)
                            }}>del</button>
                        </td>
                    </tr>
                )
            }) }
        </tbody></table>
    )
}
const AddItemForm = props => {
    return (
        <form onSubmit={props.action}>
            {props.fields.map( (field, key) => {
                return (
                    <div key={key}>
                        <input key={key} name={field.name} placeholder={field.ph} />
                    </div>
                )
            })}
            <button>Submit</button>
        </form>
    )
}

const TransactionList = props => {
    
    const ts = props.ts.transactions.sort( (a, b) => {
        return new Date(b.date) - new Date(a.date)
    })
    
    return (
        <table style={{width: "100%"}}><tbody>
        { ts.map( t => {
            const payee = findItemById(props.ts.payees, t.payeeId)
            
            const accountFrom = findItemById(props.ts.accounts, t.accountIdFrom)
            const accountTo = findItemById(props.ts.accounts, t.accountIdTo)
            const category = findItemById(props.ts.categories, t.categoryId)
            return (
                <tr key={t._id} id={t._id}>
                     <td>{t.date}</td> 
                     <td>{ (payee !== undefined) ? payee.name : ""}</td> 
                     <td>{ (accountFrom !== undefined) ? accountFrom.name : ""}</td> 
                     <td>{ (accountTo !== undefined) ? accountTo.name : ""}</td> 
                     <td>{ (category !== undefined) ? category.name : ""}</td> 
                     <td>{t.ammount}</td> 
                     <td>
                         <button onClick={ () => {
                            props.deleteTransaction(t._id)
                            }}>delete
                        </button> 
                    </td>
                </tr>
            )
        }) }
        </tbody></table>
    )
}

const EntryList = props => {
    
    
    return (
        <table style={{width: "100%"}}>
            {/* <th>
                <td></td>
            </th> */}
        { props.es.entries.map( e => {
            
            const category = findItemById(props.es.categories, e.categoryId)
            return (
                <tr key={e._id} id={e._id}>
                     <td>{e.year}</td> 
                     <td>{e.month}</td> 
                     <td>{ (category !== undefined) ? category.name : "NO_CATEGORY"}</td> 
                     <td>{e.activitySum}</td> 
                     <td>{e.available}</td> 
                     <td>{e.budgeted}</td> 
                     <td onClick={ () => {
                        props.deleteEntry(e._id)
                    }}>delete</td> 
                </tr>
            )
        })}
        </table>
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
                            <option key={account._id} value={account._id}>{account.name} ( {account.balance} )</option>
                        )
                    })}
                </select>
                <select name="accTo">
                    <option key="no-account-to"></option>
                    {props.accounts.map( account => {
                        return (
                            <option key={account._id} value={account._id}>{account.name} ( {account.balance} )</option>
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
