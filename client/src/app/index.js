import React from 'react'

import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Route} from 'react-router-dom'
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
                payess: [],
                transaction: [],
            },
            currentAccount: ""
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
        this.gAL()
    }
    gAL() {
        apis.getAllAccounts(this.state.budget._id).then( apiResponse => {
            this.setState( prevState => {
                prevState.budget.accounts = apiResponse.data.data
                return { prevState }
            })
        }).then( () => {
            // console.log(this.state.budget.accounts)
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
    addAccount = (e) => {
        e.preventDefault()
        const newName = e.target.name.value
        const newBalance = e.target.balance.value
        apis.insertAccount({ 
            budgetId: this.state.budget._id,
            name: newName,
            balance: newBalance
        }).then( () => {
            this.gAL()
        })
        
    }
    render() {
        return (
            <Router>
                <div className="container">
                    <div className="row">
                        <div className="col-5">
                            <div className="row">
                                <ul>
                                    {this.state.budget.accounts.length !== 0 && 
                                        this.state.budget.accounts.map( (account) => {
                                            return (
                                                <li key={account._id} id={account._id}>
                                                    <span>{account.name}</span> |
                                                    <span>{account.balance}</span> | 
                                                    <span
                                                        onClick={ () => {
                                                            this.deleteAccount(account._id)
                                                        }}>
                                                        del
                                                    </span>
                                                </li>
                                            )
                                    })}
                                </ul>
                            </div>
                            <div className="form">
                                <form onSubmit={this.addAccount}>
                                    <input name="name" type="text" placeholder="Add account" />
                                    <input name="balance" type="text" placeholder="0" />
                                    <button>Submit</button>
                                </form>
                            </div>
                        </div>
                        <div className="col-5">
                            Transactions
                            <Route path="/account/:id" exact render={ () => {
                                return <div>transaction</div>
                            }}>
                            </Route>
                        </div>
                    </div>
                </div>
            </Router>
        )
    }
}

export default App