import React from 'react'

import AccountFrom from './accountForm'
import AccountsList from './accountsList'   
 
import apis from '../api'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            budgetId: "5df2468b0fbf700f3df20683",
            name: "",
            accounts: [],

        }
    }

    loadBudget() {
        apis.getBudgetById(this.state.budgetId).then(apiResponse => {
            console.log(apiResponse)
            this.setState({ name: apiResponse.data.data.name})
        })
    }

    loadAccounts() {
        apis.getAllAccounts(this.state.budgetId).then(apiResponse => {
            console.log(apiResponse)
            this.setState({ accounts: apiResponse.data.data })
        });
    }

    componentDidMount() {
        this.loadBudget()
        this.loadAccounts()
        console.log(this.state)
    }

    saveAccount(name, balance) {
        console.log(name)
        const payload = { 
            budgetId: "5df2468b0fbf700f3df20683", 
            name: name, 
            balance: balance }
        apis.insertAccount(payload)
    }

    render() {
        return (
            <div id="main">
                <div>{this.state.name}</div>
                <h1>Ola, Ioana! :*</h1>
                <AccountFrom saveAccount={this.saveAccount}/>
                <AccountsList accounts={this.state.accounts} />
            </div>
        )
    }
}

export default App