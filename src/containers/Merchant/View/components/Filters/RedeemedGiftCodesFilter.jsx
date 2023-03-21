import React from 'react'
import DatePicker from 'react-datepicker';

const getFirstDay = () =>{
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1)
}

const RedeemedFilter = ({onClickFilterCallback}) => {
    const [from, setFrom] = React.useState( getFirstDay )
    const [to, setTo] = React.useState( new Date() )
    const onStartChange = ( value ) => {
        setFrom( value)
    }
    const onEndChange = ( value ) => {
        setTo(  value )
    }
    const onClickFilter = () => {
        onClickFilterCallback({
            from,to
        })
    }

    return (
        <div className="form__form-group">
            <div className="col-md-3">
                <div className="">
                    <DatePicker
                        dateFormat="MM/dd/yyyy"
                        selected={from}
                        onChange={onStartChange}
                        popperPlacement="center"
                        dropDownMode="select"
                        className="form__form-group-datepicker"
                    />
                </div>
            </div>
            <div className="col-md-3">
                <div className="">
                    <DatePicker
                        dateFormat="MM/dd/yyyy"
                        selected={to}
                        onChange={onEndChange}
                        popperPlacement="center"
                        dropDownMode="select"
                        className="form__form-group-datepicker"
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