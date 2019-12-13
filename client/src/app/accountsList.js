import React from 'react'

function AccountsList(props) {
    return (
        props.accounts.map( (account, key) => {
            return <div key={account._id}>{account.name} - {account.balance}</div>
        })
    )
}

export default AccountsList