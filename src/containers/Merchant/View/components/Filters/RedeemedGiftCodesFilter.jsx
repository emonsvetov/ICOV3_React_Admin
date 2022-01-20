import React from 'react'

const RedeemedFilter = ({onClickFilterCallback}) => {
    const [from, setFrom] = React.useState('')
    const [to, setTo] = React.useState('')
    const onStartChange = (e) => {
        setFrom( e.target.value)
    }
    const onEndChange = (e) => {
        setTo( e.target.value)
    }
    const onClickFilter = () => {
        onClickFilterCallback(from, to)
    }
    return (
        <div className="form__form-group">
            <div className="col-md-3">
                <div className="">
                    <input 
                        value={from}
                        onChange={onStartChange}
                        type="text"
                        placeholder="From"
                    />
                </div>
            </div>
            <div className="col-md-3">
                <div className="">
                    <input 
                        value={to}
                        onChange={onEndChange}
                        type="text"
                        placeholder="To"
                    />
                </div>
            </div>
            <div className="col-md-3 d-flex align-items-center justify-content-around max-height-32px pl-1">
                <span className="text-blue pointer" onClick={onClickFilter}>Update</span>
                <span className="text-danger pointer" onClick={{}}>Export</span>    
            </div>
            
            
        </div>
    )
}

export default RedeemedFilter;