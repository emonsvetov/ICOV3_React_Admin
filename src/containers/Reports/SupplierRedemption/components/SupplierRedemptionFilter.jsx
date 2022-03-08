import React, {useState, useEffect} from "react";
import renderDatePickerField from '@/shared/components/form/DatePicker';
import { Field, Form } from 'react-final-form';
import { Button, Row, Col } from 'reactstrap';
import renderRadioButtonField from '@/shared/components/form/RadioButton';
import renderCheckBoxField from '@/shared/components/form/CheckBox';
import MerchantTreeView from "../../components/MerchantTreeView";
import axios from 'axios'
import RenderDatePicker from '@/shared/components/form/DatePickerWithInitial';

const getFirstDay = () =>{
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1)
}

const fetchProgramData = async () => {
    try {
        const response = await axios.get(
        `/organization/1/program?minimal=true&sortby=name`
        );
        // console.log(response)
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

const DepositFilter = ({onClickFilterCallback}) => {
    const [date, setDate] = useState({from: getFirstDay(), to: new Date()});
    const [data, setData] = React.useState([])
    const [selected, setSelected] = useState([]);
    
    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds)
    };

    
    const onClickFilter = values => {
        onClickFilterCallback(
            date.from.toISOString().slice(0, 10), 
            date.to.toISOString().slice(0, 10), 
     
        );
    }
    
    useEffect( () => {
        
        fetchProgramData()
        .then( response => {
            setData(response)
        })
        
    }, [])

    const handleDateChange = (selected, type) => {
        let temp = date;
        temp[type] = selected;
        setDate(temp);
    };

    return (
        <Form onSubmit={onClickFilter}>
            {({ handleSubmit, form, submitting, pristine, values }) => (
              <form className="form" onSubmit={handleSubmit}>
              
              <div className="col-md-3 px-0">     
                <span
                    className="form__form-group-label"
                >
                    View for Merchant
                </span>
                {data && data.length > 0 && 
                    <div className="merchant-treeview px-2">
                        <MerchantTreeView merchants={data} form={form} selected={selected} 
                            setSelected={(v) => {
                                form.change('merchant_id', v)
                                setSelected(v)}} />
                    </div>
                }
                </div>
                <div className="col-md-4 ">
                    <div className="form__form-group label-mb-0">
                        <Row className='w100'>
                            <Col md="6" lg="6" xl="6">
                                <Field
                                    name="type"
                                    component={renderRadioButtonField}
                                    label="SKU value"
                                    radioValue="sku"
                                />
                            </Col>
                            <Col md="6" lg="6" xl="6" className='hide-error'>
                                <Field
                                    name="type"
                                    component={renderRadioButtonField}
                                    label="Redemption Value"
                                    radioValue="redemtion"
                                />
                            </Col>
                        </Row>
                    </div>
                </div>   
                <div className="col-md-2">
                    <div className="form__form-group">
                    <div className="form__form-group-field">
                        
                        <Field
                            name="active_merchants"
                            type="checkbox"
                            component={renderCheckBoxField}
                            label={'Active Merchants'}
                            initialValue={false}
                        />
                    </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form__form-group">
                    <div className="form__form-group-field">
                        <Field
                            name="view_all"
                            type="checkbox"
                            component={renderCheckBoxField}
                            label={'view all'}
                            initialValue={false}
                        />
                    </div>
                    </div>
                </div>
                <Row>
                    <div className="col-md-2">
                    
                    </div>
                    <div className="col-md-3">
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
                    <div className="col-md-3">
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