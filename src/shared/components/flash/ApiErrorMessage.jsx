const ApiErrorMessage = ({errors, className}) => {
    className = 'apiError-wrap form-error mt-0' + (className ? ' ' + className : '')
    if(!errors?.errors){
        errors.errors = errors.message; //sometimes there is not errors but just a message!
    }
    return (
        <div className={className}>
            {typeof errors.errors === 'object' && <List errors={errors.errors} />}
            {typeof errors.errors === 'string' && <span>{errors.errors}</span>}
        </div>
    )
}

const List = ({errors}) => (
    <ul className="apiError-list">
        {
            Object.keys(errors).map(function(k){
                return <li key={k}  className="apiError-listItem">{errors[k]}</li>
            })
        }
    </ul>
)

export default ApiErrorMessage