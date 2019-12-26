// @flow

import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

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
            showAccountForm: false,
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

    onChange = (id, name, what) => {
        // console.log(id, name)
        this.setState( prevState => {
            prevState.budget[what].forEach( w => {
                if (w._id === id ) {
                    w.name = name
                }
            })
            return prevState
        })
    }
    saveItemToDb = (id, name, action) => {
        //console.log(id, name)
        apis[action](id, { budgetId: this.state.budget._id, name: name })
            .then( apiResponse => {
                // console.log(apiResponse)
            })
            .catch( e => {
                // console.log(e)
            })

    }
    gAAs() {
        apis.getAllAccounts(this.state.budget._id).then( apiResponse => {
            this.setState( prevState => {
                prevState.budget.accounts = apiResponse.data.data
                prevState.budget.accounts.forEach( a => {
                    a.balance = 0
                    a.showPopup = false
                    a.onChange = this.onChange
                    a.saveAction = this.saveItemToDb
                    a.editAction = "updateAccountById"
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
                prevState.budget.categories.forEach( c => {
                    c.onChange = this.onChange
                    c.saveAction = this.saveItemToDb
                    c.editAction = "updateCategoryById"
                })
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
                prevState.budget.payees.forEach( p => {
                    p.onChange = this.onChange
                    p.saveAction = this.saveItemToDb
                    p.editAction = "updatePayeeById"
                })
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
            console.log(field) 
            data[field.name] = e.target[field.name].value
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
        // console.log("start delete item", this.state.budget.accounts)
        const newItems = this.state.budget[items].filter( item => {
            return item._id !== id
        })
        apis[action](id)
        this.setState( prevState => {
            prevState.budget[items] = newItems
            return { prevState }
        })
        // console.log("End delete item", this.state.budget.accounts)
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
            
        <div className="container-fluid">

            <div className="row text-primary text-center alin-center">    
                <div className="col-4">
                    <TotalList budget={this.state.budget} />
                </div>

                <div className="col-4">
                    <CurrentState budget={this.state.budget} />
                </div>

                <div className="col-4">
                    <BudgetList budget={this.state.budget} />
                </div>
            </div>

            <div className="row">
                <div className="col-2">


            {/* <div className="accounts">
                <ShowAddForm
                    addItem={this.addItem}
                    action="insertAccount"
                    what="accounts"
                    fields={[
                        { name: "name", ph: "Add Account" }, 
                    ]}
                />
                {this.state.budget.accounts.length !== 0 && 
                    <ListItems
                        fields={["name", "balance"]}
                        data={this.state.budget.accounts}
                        deleteItem={this.deleteItem}
                        items="accounts"
                        apiCall="deleteAccountById" />}                
            </div> */}

            <ItemsFormAndList
                className="accounts"
                addItem={this.addItem}
                action="insertAccount"
                items="accounts"
                fields={[
                    { name: "name", ph: "Add Account" }, 
                ]}
                showFields={["name", "balance"]}
                data={this.state.budget.accounts}
                deleteItem={this.deleteItem}
                apiCall="deleteAccountById"
            />
            
            <div className="categories">
                <ShowAddForm
                    addItem={this.addItem}
                    action="insertCategory"
                    what="categories"
                    fields={[
                        { name: "name", ph: "Add Category" }, 
                    ]}
                />
                <ListItems
                    fields={["name"]}
                    data={this.state.budget.categories}
                    deleteItem={this.deleteItem}
                    items="categories"
                    apiCall="deleteCategoryById"
                />
            </div>
            
            <div className="payees">
                <ShowAddForm
                    addItem={this.addItem}
                    action="insertPayee"
                    what="payees"
                    fields={[
                        { name: "name", ph: "Add Payee" }, 
                    ]}
                />
                <ListItems
                    fields={["name"]}
                    data={this.state.budget.payees}
                    deleteItem={this.deleteItem}
                    items="payees"
                    apiCall="deletePayeeById"
                />
            </div>
        </div>



            <div className="col-10">

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
        </div>
        </Router>
        )
    }
}

class ItemsFormAndList extends React.Component {
    render() {
        return (
            <div className={this.props.className}>
                <ShowAddForm
                    addItem={this.props.addItem}
                    action={this.props.action}
                    what={this.props.items}
                    fields={this.props.fields}
                />
                <ListItems
                    fields={this.props.showFields}
                    data={this.props.data}
                    deleteItem={this.props.deleteItem}
                    apiCall={this.props.apiCall}
                    items={this.props.items}
                />
            </div>
        )
    }
}


class ShowAddForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: props.visible
        }
    }
    showAddForm = () => {
        this.setState({visible: true})
    }
    handleClose = () => {
        this.setState({visible: false})
    }
    render() {
        // console.log(this.props)
        return (
            <div>
                <button className="btn btn-secondary btn-block" onClick={this.showAddForm}>
                    Add {this.props.what}
                </button>
                <Modal show={this.state.visible} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.fields[0].ph}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="account-form">
                            <AddItemForm
                                action={ (e) => {
                                    this.props.addItem(
                                        e,
                                        this.props.action, 
                                        this.props.fields, 
                                        this.props.what
                                    )
                                    this.handleClose()
                                }}
                                fields={this.props.fields} 
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
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

class EditItemPopup extends React.Component {
    state = {
        visible: false
    }
    handleChange(id, name) {
        console.log(this.props.items)
        this.props.item.onChange(id, name, this.props.items)
    }
    handleClose = () => {
        this.props.item.saveAction(this.props.item._id, this.props.item.name, this.props.item.editAction)
        this.setState({visible: false})
    }
    handleShow = () => {
        this.setState({visible: true})
    }
    deleteItem = (id) => {
        this.props.deleteItem(id, this.props.items, this.props.action)
        this.setState({visible: false})
    }
    
    render() {
        // console.log(this.props)
        return (
            <div>
                <button
                    className="btn btn-primary"
                    onClick={this.handleShow}
                >
                    Edit
                </button>
                <Modal show={this.state.visible} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit {this.props.items}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input value={this.props.item.name} type="text" onChange={ e => {
                            this.handleChange(this.props.item._id, e.target.value)
                        }} />
                        

                        <button 
                            className="btn btn-danger"
                            onClick={ () => {
                                this.deleteItem(this.props.item._id)
                            }}
                        >
                            Delete
                        </button>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleClose}>
                        Done
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

class ListItems extends React.Component {
    render() {
    return (
        <table className="table table-striped">
            <tbody>
                { this.props.data.map ( item => {
                    return (
                        <tr
                            className="account"
                            key={item._id}
                            id={item._id}
                        >
                            {this.props.fields.map( (field, index) => {
                                return (
                                    <td key={index}>{item[field]}</td> 
                                )
                            })}
                            <td>
                                <EditItemPopup
                                    item={item}
                                    deleteItem={this.props.deleteItem}
                                    items={this.props.items}
                                    action={this.props.apiCall}
                                />
                            </td>                            
                        </tr>
                    )
                }) }
            </tbody>
        </table>
    )
    }
}

const AddItemForm = props => {
    return (
        <form onSubmit={props.action} className="form">
            <div className="row">
                <div className="col-8">
                    {props.fields.map( (field, key) => {
                        return (
                            <div key={key}>
                                <input key={key} name={field.name} placeholder={field.ph} />
                            </div>
                        )
                    })}
                </div>
                <div className="col-4">
                    <button className="btn btn-primary">Submit</button>
                </div>
            </div>
        </form>
    )
}

const TransactionList = props => {
    
    const ts = props.ts.transactions.sort( (a, b) => {
        return new Date(b.date) - new Date(a.date)
    })
    
    return (
        <table style={{width: "100%"}} className="table table-striped">
            <thead  className="thead-light">
                <tr>
                    <th>Date</th>
                    <th>Payee</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Category</th>
                    <th>Ammount</th>
                    <th>Delete</th>
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
                         <button className="btn btn-danger" onClick={ () => {
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
        <table style={{width: "100%"}} className="table table-striped">
            <thead  className="thead-light">
                <tr>
                    {/* <th>Year</th>
                    <th>Month</th> */}
                    <th>Category</th>
                    <th>Budgeted</th>
                    <th>Activity</th>
                    <th>Available</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
        { props.es.map( e => {
            // console.log(props.es)
            const category = findItemById(props.budget, e.categoryId)
            return (
                <tr key={e._id} id={e._id}>
                     {/* <td>{e.year}</td> 
                     <td>{e.month}</td>  */}
                     <td>{ (category !== undefined) ? category.name : "NO_CATEGORY"}</td> 
                     <td>
                         <input
                            className="makeItGreen" 
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
                        <button className="btn btn-danger" onClick={ () => {
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
                <button className="btn btn-primary">Submit</button>
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
            <button className="btn btn-primary">Submit</button>
        </form>
    )
}

export default App
