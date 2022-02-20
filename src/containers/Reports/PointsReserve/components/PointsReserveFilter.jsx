import React, {useState} from 'react'
import Select from 'react-select'
import renderDatePickerField from '@/shared/components/form/DatePicker';
import { Field, Form } from 'react-final-form';
import { Row, Col } from 'reactstrap';
import DatePicker from 'react-datepicker';

const RenderDatePicker = ({ dueDate, onChange }) => {
    const [startDate, setStartDate] = useState(dueDate);
    const handleChange = (date) => {
        setStartDate(date);
        onChange(date);
    };
  return(
    <div className="date-picker">
    <DatePicker
      dateFormat="MM/dd/yyyy"
      selected={startDate}
      onChange={handleChange}
      className="form__form-group-datepicker"
    />
    </div>
  )
}



const TrialBalanceFilter = ({onClickFilterCallback}) => {
    
    const [date, setDate] = useState({from:'', to:''});
    

    const onClickFilter = (values) => {

        onClickFilterCallback(date.from, date.to)
    }
    const handleChange = (selected, type) => {
        let temp = date;
        temp[type] = selected;
        setDate(temp);
        debugger
      };
    const getFirstDay = () =>{
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1)
    }
    return (
        <Form onSubmit={onClickFilter}
        >
            {({ handleSubmit }) => (
              <form className="form" onSubmit={handleSubmit}>
              <Row>
                <div className="col-md-4 px-0">
                    <div className="form__form-group">
                    <span className="form__form-group-label">From</span>
                    <div className="form__form-group-field">
                    <Field
                        name="from"
                        dueDate={getFirstDay}
                        onChange={(e) => handleChange(e, 'from')}
                        component={RenderDatePicker}    
                        />
                    </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form__form-group">
                    <span className="form__form-group-label">To</span>
                    <div className="form__form-group-field">
                        <Field
                            name="from"
                            dueDate={new Date()}
                            onChange={(e) => handleChange(e, 'to')}
                            component={RenderDatePicker}    
                        />
                    </div>
                    </div>
                </div>
                
                <div className="col-md-4 d-flex align-items-center max-height-32px pl-1">
                     <span className="text-blue pointer" onClick={onClickFilter}>Filter</span>
                 </div>
                </Row>
                
              
              </form>
            )}
          </Form>

    )
}

export default TrialBalanceFilter;