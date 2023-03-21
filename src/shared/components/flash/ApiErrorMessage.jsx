const ApiErrorMessage = ({errors, className}) => {
    className = 'apiError-wrap form-error mt-0' + (className ? ' ' + className : '')
    let errorObj = null;
    if( typeof errors === "string" )
    {
      errorObj = errors; //just a message!
    }
    else if(typeof errors === "object")
    {
        if(errors.hasOwnProperty("errors"))
        {
          errorObj = errors.errors;
        }
        else if(errors.hasOwnProperty("message"))
        {
          errorObj = errors.message;
        }
        else 
        {
          errorObj = errors;
        }
    }
    if( !errorObj )
    {
      errorObj = "ApiErrorMessage: Undefined error";
    }
    return (
        <div className={className}>
            {typeof errorObj === 'object' && <List errors={errorObj} />}
            {typeof errorObj === 'string' && <span>{errorObj}</span>}
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