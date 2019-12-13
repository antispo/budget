import React from'react'

class AccountForm extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.state = {
            saveAccount: props.saveAccount
        }
    }

    handleClick() {
        this.state.saveAccount(
            this.refs.accountName.value,
            this.refs.accountBalance.value
            )
    }

    render() {
        return <div>
            <span>Add Account</span>
            <input ref="accountName" type="text" />
            <input ref="accountBalance" type="text" />
            <button onClick={this.handleClick}>Save</button>
        </div>
    }
}

export default AccountForm