import React, {useState} from 'react'
import { Field, Form } from 'react-final-form';
import { Button, Row, Col } from 'reactstrap';
import RenderDatePicker from '@/shared/components/form/DatePickerWithInitial';

const getFirstDay = () =>{
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1)
}
const JournalDetailedFilter = ({onClickFilterCallback}) => {
    
    const [date, setDate] = useState({from: getFirstDay(), to: new Date()});

    const onClickFilter = (values) => {
        onClickFilterCallback(date.from.toISOString().slice(0, 10), date.to.toISOString().slice(0, 10))
    }

    const handleChange = (selected, type) => {
        let temp = date;
        temp[type] = selected;
        setDate(temp);
    };
    
    return (
        <Form onSubmit={onClickFilter}>
            {({ handleSubmit, form, submitting, pristine, values }) => (
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
                
                <div className="col-md-4 d-flex align-items-end pl-1">
                    <Button 
                        type="submit"
                        onClick={() => {
                            form.change("action", "submit");
                        }}
                        disabled={submitting} 
                        className="btn btn-sm btn-primary" 
                        color="#ffffff"
                    >Filter</Button>
                    <Button
                        type="submit"
                        onClick={() => {
                            form.change("action", "export");
                        }}
                        disabled={submitting} 
                        className="btn btn-sm btn-primary" 
                        color="#ffffff"
                    >Export CSV</Button>
                </div>
                </Row>
              </form>
            )}
          </Form>

    )
}

export default JournalDetailedFilter;