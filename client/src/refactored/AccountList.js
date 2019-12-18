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