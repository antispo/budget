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