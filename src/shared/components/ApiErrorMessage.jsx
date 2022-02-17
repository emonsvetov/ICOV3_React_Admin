const ApiErrorMessage = props => {
    return (
        <>
            {props.errors.message && <span>{props.errors.message}</span>}
            {typeof props.errors.errors === 'object' && <List errors={props.errors.errors} />}
            {typeof props.errors.errors === 'string' && <span>{props.errors.errors}</span>}
        </>
    )
}

const List = ({errors}) => (
    <ul>
        {
            Object.keys(errors).map(function(k){
                return <li key={k}>{errors[k]}</li>
            })
        }
    </ul>
)

export default ApiErrorMessage