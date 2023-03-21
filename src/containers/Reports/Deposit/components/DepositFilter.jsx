import React, {useState, useEffect} from "react";
import { Field, Form } from 'react-final-form';
import { Button, Row, Col } from 'reactstrap';
import renderSelectField from '@/shared/components/form/Select'
import axios from 'axios'
import RenderDatePicker from '@/shared/components/form/DatePickerWithInitial';

const fetchProgramData = async () => {
    try {
        const response = await axios.get(
        `/organization/1/program?minimal=true&sortby=name`
        );
        console.log(response.data)
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};


const getFirstDay = () =>{
    let date = new Date();
    return new Date(date.getFullYear(), 0, 1)
}

const DepositFilter = ({onClickFilterCallback}) => {
    const [date, setDate] = useState({from: getFirstDay(), to: new Date()});
    
    const [invoiceNumber, setInvoiceNumber] = React.useState('');
    const [programName, setProgramName] = React.useState('');
    const [programId, setProgramId] = React.useState('');
    
    const [data, setData] = React.useState([])

    const onClickFilter = values => {
        onClickFilterCallback(
            date.from.toISOString().slice(0, 10), 
            date.to.toISOString().slice(0, 10), 
            invoiceNumber, 
            programName.value, 
            programId
        );
    }

    const handleDateChange = (selected, type) => {
        let temp = date;
        temp[type] = selected;
        setDate(temp);
    };
    const handleChange = (field, selected) => {
        switch (field) {
            case 'invoice_number':
                setInvoiceNumber(selected);
                break;
            case 'program_name':
                setProgramName(selected);
                break;
            case 'program_id':
                setProgramId(selected);
                break;
            default:
                console.log('default case...');
        }
        
    };

    useEffect( () => {
    
        fetchProgramData()
        .then( response => {
            let temp = [];
            response.forEach((item, index) => {
                temp.push({value: item.id, label: item.name})
            })
            setData(temp)
        })
        
    }, [])

    return (
        <Form onSubmit={onClickFilter}
            initialValues={{                
                
            }}
            
        >
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
                                onChange={(e) => handleDateChange(e, 'from')}
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
                                name="to"
                                dueDate={new Date()}
                                onChange={(e) => handleDateChange(e, 'to')}
                                component={RenderDatePicker}    
                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <Field 
                        name="invoice_number"
                        parse={value => {
                            handleChange('invoice_number', value)
                            return value;
                        }}
                    >
                    {({ input, meta }) => (
                        <div className="form__form-group">
                            <span className="form__form-group-label">Invoice Number</span>
                            <div className="form__form-group-field">
                                <div className="form__form-group-row">
                                    <input type="text" {...input} placeholder="" />
                                    
                                </div>
                            </div>
                        </div>
                    )}
                    </Field>
                </div>   
                
            </Row>
            <Row>
                <div className='col-md-4'>
                    <div className="form__form-group">
                        <span className="form__form-group-label">
                            Program Name
                        </span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <Field 
                                    name="program_name"
                                    options={data}
                                    component={renderSelectField}
                                    parse={value => {
                                        handleChange('program_name', value)
                                        return value;
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <Field 
                        name="program_id"
                        parse={value => {
                            handleChange('program_id', value)
                            return value;
                        }}
                    >
                    {({ input, meta }) => (
                        <div className="form__form-group">
                            <span className="form__form-group-label">Program ID</span>
                            <div className="form__form-group-field">
                                <div className="form__form-group-row">
                                    <input type="text" {...input} placeholder="" />
                                    
                                </div>
                            </div>
                        </div>
                    )}
                    </Field>
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

export default DepositFilter;