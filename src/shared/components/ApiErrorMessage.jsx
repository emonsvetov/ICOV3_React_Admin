const ApiErrorMessage = props => {
    return (
        <>
            <p>{props.errors.message}</p>
            <ul>
                {
                    Object.keys(props.errors.errors).map(function(k){
                        return <li key={k}>{props.errors.errors[k]}</li>
                    })
                }
            </ul>
         </>
    )
}

export default ApiErrorMessage