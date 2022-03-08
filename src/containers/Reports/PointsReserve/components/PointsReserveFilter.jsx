import React, {useState} from 'react'
import { Field, Form } from 'react-final-form';
import { Row, Col } from 'reactstrap';
import DatePicker from 'react-datepicker';
import RenderDatePicker from '@/shared/components/form/DatePickerWithInitial';

const getFirstDay = () =>{
  let date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

const PointsReserveFilter = ({onClickFilterCallback}) => {
    
    const [date, setDate] = useState({from: getFirstDay(), to: new Date()});
  
    const onClickFilter = () => {

      onClickFilterCallback(date.from.toISOString().slice(0, 10), date.to.toISOString().slice(0, 10))
    }
    const handleChange = (selected, type) => {
        let temp = date;
        temp[type] = selected;
        setDate(temp);
    };
    
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

export default PointsReserveFilter;