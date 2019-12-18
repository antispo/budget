const CategoryList = props => {
    return (
        props.categories.map( category => {
        return (
            <li key={category._id} id={category._id}>
                <span>{category.name}</span> |
                <span
                    onClick={ () => {
                        props.deleteCategory(category._id)
                    }}>
                    del
                </span>
            </li>
            )
        })
    )
}