// @flow

import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'

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
        const pa = window.location.pathname.split("/")
        this.state = {
            budget: {
                _id: pa[1],
                name: "",
                accounts: [],
                categories: [],
                payees: [],
                transactions: [],
                entries: [],
                total: 0,
                budgeted: 0,
                activity: 0,
                year: parseInt(pa[2], 10),
                month: pa[3]
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
                this.gACs()
                this.gAPs()
                this.gATs()
                this.gAEs()
            })
        })
    }

    gAAs() {
        apis.getAllAccounts(this.state.budget._id).then( apiResponse => {
            this.setState( prevState => {
                prevState.budget.accounts = apiResponse.data.data
                prevState.budget.accounts.forEach( a => {
                    a.balance = 0
                })
                return { prevState }
            })
        }).then( () => {
        }).catch( e => {
        })
    }

    gACs() {
        // console.log("gACs()")
        apis.getAllCategories(this.state.budget._id).then ( apiResponse => {
            this.setState ( prevState => {
                prevState.budget.categories = apiResponse.data.data
                return { prevState }
            })
        }).then( () => {
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
        }).catch( e => {
            
        })
    }

    gATs() { 
        apis.getAllTransactions(this.state.budget._id).then( apiResponse => {
            this.setState( prevState => {
                prevState.budget.transactions = apiResponse.data.data
                
                return { prevState }
            }, () => {
                this.processTransactions()
                
            })
        }).then( () => {
            this.calculateEntries()
        }).catch( e => {
            
        })
    }

    processTransactions() {
        const accounts = this.state.budget.accounts
        var total = this.state.budget.total
        this.state.budget.transactions.forEach( t => {
            if (t.accountIdFrom !== "") {
                accounts.forEach( a => {
                    if ( t.accountIdFrom === a._id ) {
                        
                        a.balance = EM.sub(a.balance, t.ammount)
                        
                    }
                })                
            }
            if (t.accountIdTo !== "") {
                accounts.forEach( a => {
                    if ( t.accountIdTo === a._id ) {
                        a.balance = EM.add(a.balance, t.ammount)
                        
                    }
                })
            }
        })
        accounts.forEach( a => {
            // console.log(a)
            total = EM.add(total, a.balance)
        })
        this.setState( prevState => {
            prevState.budget.accounts = accounts
            prevState.budget.total = total
            return prevState
        }, () => {
        })
    }

    calculateEntries() {
        const entries = this.state.budget.entries
        const transactions = this.state.budget.transactions

        var budgeted = 0
        var activity = 0
        var available = 0
        
        entries.forEach( entry => {
            // console.log(entry)
            budgeted = EM.add(budgeted, entry.budgeted)
            let activitySum = 0
            transactions.forEach( t => {
                // console.log(t, entry)
                if ( t.categoryId === entry.categoryId ) {
                    // console.log("calc es for t for if ")
                    if (t.accountIdFrom !== "" ) {
                        activitySum = EM.sub(activitySum, t.ammount)
                    }
                    if ( t.accountIdTo !== "" ) {
                        activitySum = EM.add(activitySum, t.ammount)
                    }
                }
            })

            // console.log(entry)
            
            entry['activitySum'] = activitySum
            entry['available'] = EM.add(entry.budgeted, activitySum)

            activity = EM.add(activity, entry.activitySum)
            available = EM.add(available, entry.available)
        })
        this.setState( p => {
            p.budget.entries = entries
            p.budget.budgeted = budgeted
            p.budget.activity = activity
            p.budget.available = available
            p.budget.currentState = p.budget.total - budgeted
            return( p )
        }, () => {
            
        })
    }

    gAEs() {
        apis.getAllEntries(this.state.budget._id).then( apiResponse => {
            this.setState( prevState => {
                prevState.budget.entries = apiResponse.data.data
                // moved this filtering to the display part
                // apiResponse.data.data.forEach( e => {
                //     // console.log(e, this.state.budget)
                //     if ( e.year === this.state.budget.year &&
                //             e.month === this.state.budget.month ) {
                //             // return e
                //             prevState.budget.entries.push(e)
                //         }
                //         // return e
                // })
                return( prevState )
            }, this.calculateEntries )
        }).then( () => {
            
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

    deleteTransaction = id => {
        const ts = this.state.budget.transactions.filter( t => {
            return t._id !== id
        })
        const transaction = this.state.budget.transactions.filter( t => {
            return t._id === id
        })[0]
        const AAA = parseFloat(transaction.ammount)
        // console.log("AAA:", AAA)
        var toAdd = 0
        var toSub = 0
        var accountTo = findItemById(this.state.budget.accounts, transaction.accountIdTo)
        if ( accountTo !== undefined ) {
            // console.log("AT:", accountTo)
            accountTo.balance = EM.sub(accountTo.balance, AAA)
            toSub = AAA
            apis.updateAccountById(accountTo._id, accountTo).then( r => {
                // toSub = AAA
            })
        }
        var accountFrom = findItemById(this.state.budget.accounts, transaction.accountIdFrom)
        if ( accountFrom !== undefined) {
            // console.log("AF:", accountFrom)
            toAdd = AAA
            accountFrom.balance = EM.add(accountFrom.balance, AAA)
            apis.updateAccountById(accountFrom._id, accountFrom).then( r => {
                // toAdd = AAA
            })
        }
        // console.log(toAdd, toSub)
        apis.deleteTransactionById(id)
        this.setState( prevState => {
            prevState.budget.transactions = ts
            prevState.budget.total = EM.add(prevState.budget.total, toAdd)
            prevState.budget.total = EM.sub(prevState.budget.total, toSub)
            // console.log(prevState.budget.total)
            return { prevState }
        }, this.calculateEntries)
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
    
    addItem = (e, actions, fields, items) => {
        e.preventDefault()
        let data = {
            budgetId: this.state.budget._id
        }
        fields.forEach( (field) => {           
            data[field] = e.target[field].value
        })
        if ( items === "accounts" ) {
            data.balance = 0
        }
        apis[actions](data).then( ( apiResponse ) => {
            data._id = apiResponse.data.id
            this.setState( prevState => {
                prevState.budget[items].push(data)
                return ( prevState )
            })
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
        }

        var accountFrom = findItemById(this.state.budget.accounts, data.accountIdFrom)
        var toAdd = 0
        var toSub = 0
        if ( accountFrom !== undefined) { 
            accountFrom.balance = EM.sub(accountFrom.balance, parseFloat(data.ammount))
            apis.updateAccountById(accountFrom._id, accountFrom).then( () => {
                
            })
            toSub = data.ammount
        }
        var accountTo = findItemById(this.state.budget.accounts, data.accountIdTo)
        if (accountTo !== undefined) {
            accountTo.balance = EM.add(accountTo.balance, parseFloat(data.ammount))
            apis.updateAccountById(accountTo._id, accountTo).then( () => {
                
            })
            toAdd = data.ammount
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
                // console.log(p.budget.total, toAdd, toSub)
                return( p )
            }, () => {
                this.calculateEntries()
            })
        })
    }

    addEntry = e => {
        e.preventDefault()
        const data = {
            budgetId: this.state.budget._id,
            year: this.state.budget.year,
            month: this.state.budget.month,
            categoryId: e.target.category.value,
            budgeted: e.target.budgeted.value,
        }
        apis.insertEntry(data).then( ( apiResponse ) => {
            data._id = apiResponse.data.id
            this.setState( prevState => {
                prevState.budget.entries.push(data)
                return( prevState )
            }, this.calculateEntries)
        })
    }

    saveEntry = e => {
        // TODO: verify it;s different first
        apis.updateEntryById(e._id, e)
    }

    handleEntryChange = (e, v) => {
        this.setState( prevState => {
            prevState.budget.entries.forEach( be => {
                if ( be._id === e._id) {
                    be.budgeted = v
                }
            })
            return prevState
        }, this.calculateEntries)
    }

    render() {
        const entries = []
        this.state.budget.entries.forEach( e => {
            if ( e.year === this.state.budget.year &&
                e.month === this.state.budget.month ) {
                entries.push(e)
            }
        })
        return (
        
        <Router>
            
        <div className="App">

            <div className="currentState">    
                <div className="total">
                    <TotalList budget={this.state.budget} />
                </div>

                <div className="currentState">
                    <CurrentState budget={this.state.budget} />
                </div>

                <div className="budget">
                    <BudgetList budget={this.state.budget} />
                </div>
            </div>

            <div className="main">
            <div className="accounts">
                <div className="account-form">
                    <AddItemForm
                        action={ (e) => {
                            this.addItem(e, "insertAccount", ["name"], "accounts")
                        }}
                        fields={[
                                { name: "name", ph: "Add Account" }, 
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
                        this.addItem(e, "insertCategory", ["name"], "categories")
                    }}
                    fields={[{name: "name", ph: "Add Category"}]}
                />
                <div className="categoriesList">
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
                        this.addItem(e, "insertPayee", ["name"], "payees")
                    }}
                    fields={[{name: "name", ph: "Add Payee"}]}
                />
                <div className="payeesList">
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

            <Route>
            <div className="entries">
                <AddEntryForm
                    categories={this.state.budget.categories}
                    addEntry={this.addEntry}
                />
                <div className="entry-list">
                    <EntryList
                        es={entries}
                        budget={this.state.budget.categories}
                        handleChange={this.handleEntryChange}
                        deleteEntry={this.deleteEntry}
                        onBlur={this.saveEntry}
                    />
                </div>
            </div>
            </Route>
        </div>
        </div>
        </Router>
        )
    }
}

const TotalList = props => {
    return (
        <div>{props.budget._id} | {props.budget.name} | {props.budget.total}</div>
    )
}

const BudgetList = props => {
    return (
        <div>{props.budget.budgeted} | {props.budget.activity} | <span style={{color: "green", fontWeight: "bold"}}>{props.budget.available}</span></div>
    )
}

const CurrentState = props => {
    return (
        <div>To Be Budgeted: {props.budget.currentState}</div>
    )
}

const ListItems = props => {
    return (
        <table>
            <tbody>
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
            </tbody>
        </table>
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
        <table style={{width: "100%"}}>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Payee</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Category</th>
                    <th>Ammount</th>
                </tr>
            </thead>
            <tbody>
        { ts.map( t => {
            const payee = findItemById(props.ts.payees, t.payeeId)
            const accountFrom = findItemById(props.ts.accounts, t.accountIdFrom)
            const accountTo = findItemById(props.ts.accounts, t.accountIdTo)
            const category = findItemById(props.ts.categories, t.categoryId)
            // console.log((new Date(t.date)).toLocaleDateString())
            return (
                <tr key={t._id} id={t._id}>
                     <td>{(new Date(t.date)).toLocaleDateString()}</td> 
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
    // console.log(props.es.entries)
    return (
        <table style={{width: "100%"}}>
            <thead>
                <tr>
                    {/* <th>Year</th>
                    <th>Month</th> */}
                    <th>Category</th>
                    <th>Budgeted</th>
                    <th>Activity</th>
                    <th>Available</th>
                </tr>
            </thead>
            <tbody>
        { props.es.map( e => {
            console.log(props.es)
            const category = findItemById(props.budget, e.categoryId)
            return (
                <tr key={e._id} id={e._id}>
                     {/* <td>{e.year}</td> 
                     <td>{e.month}</td>  */}
                     <td>{ (category !== undefined) ? category.name : "NO_CATEGORY"}</td> 
                     <td>
                         <input 
                            type="number" 
                            value={e.budgeted} 
                            onChange={ (ev) => {
                                // console.log(ev.target.value)
                                props.handleChange(e, ev.target.value)
                            }}
                            onBlur={ () => {
                                props.onBlur(e)
                            }}
                        />
                     </td>
                     <td>{e.activitySum}</td> 
                     <td>{e.available}</td>  
                     <td>
                        <button onClick={ () => {
                            props.deleteEntry(e._id)
                        }}>delete
                        </button>
                    </td> 
                </tr>
            )
        })}
        </tbody></table>
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
            {/* <input name="year" type="text" placeholder="Year" />
            <input name="month" type="text" placeholder="Month" /> */}
            <select name="category">
                <option key="no-category"></option>
                {props.categories.map( category => {
                    return (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    )
                })}
            </select>
            <input name="budgeted" type="number" placeholder="Budgeted" />
            <button>Submit</button>
        </form>
    )
}

export default App
