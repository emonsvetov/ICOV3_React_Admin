import React, {useState, useEffect} from "react";
import Select from 'react-select'
import renderDatePickerField from '@/shared/components/form/DatePicker';
import { Field, Form } from 'react-final-form';
import { Button, Row, Col } from 'reactstrap';
import renderSelectField from '@/shared/components/form/Select'
import renderCheckBoxField from '@/shared/components/form/CheckBox';
import MerchantTreeView from "../../components/MerchantTreeView";
import axios from 'axios'

const prepareList = () =>{
    let y = new Date().getFullYear();
    let list = [];
    for (var i = y; i > y -7; i --){
        list.push({label: i, value: i})
    }    
    return list;
}
const fetchProgramData = async () => {
    try {
        const response = await axios.get(
            `/merchant?minimal=true&sortby=name`
        );
        // console.log(response)
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

const Filter = ({onClickFilterCallback}) => {
    
    const YEAR_LIST = prepareList();
    const [targetYear, setTargetYear] = React.useState({label: new Date().getFullYear(), value: new Date().getFullYear()})
    const [participant, setParticipant] = React.useState(null);
    const [programId, setProgramId] = React.useState([]);
    
    const [data, setData] = React.useState([])
    const [selected, setSelected] = useState([]);
    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds)
    };

    const onClickFilter = () => {
        onClickFilterCallback(programId, targetYear.value, participant)
    }
    const handleChange = (field, selected) => {
        if(field == "year")
            setTargetYear(selected);
        else
            setParticipant(selected);
    };
    
    useEffect( () => {
        
        fetchProgramData()
        .then( response => {
            setData(response)
        })
        
    }, [])

    
    return (
        <Form onSubmit={onClickFilter}
            initialValues={{
                year: targetYear
            }}
        >
            {({ handleSubmit, form, submitting, pristine, values }) => (
              <form className="form" onSubmit={handleSubmit}>
              <Row>
                    <div className="col-md-2">
                        <span className="form__form-group-label">
                            View for Merchant
                        </span>
                        {data && data.length > 0 && <div className="merchant-treeview px-2"><MerchantTreeView merchants={data} form={form} selected={selected} setSelected={(v) => {
                            form.change('merchant_id', v)
                            setSelected(v)
                        }} /></div>}
                    </div>
                    <div className="col-md-1">
                        <div className="form__form-group">
                            <span className="form__form-group-label">
                                View All
                            </span>
                            <div className="form__form-group-field">
                                <Field
                                    name="view_all"
                                    type="checkbox"
                                    component={renderCheckBoxField}
                                    initialValue={false}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='col-md-2'>
                        <div className="form__form-group">
                            <span className="form__form-group-label">
                                Target Year
                            </span>
                            <div className="form__form-group-field">
                                <div className="form__form-group-row">
                                    <Field 
                                        name="year"
                                        options={YEAR_LIST}
                                        component={renderSelectField}
                                        parse={value => {
                                            handleChange('year', value)
                                            return value;
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-2">
                        <Field 
                            name="participant"
                            parse={value => {
                                handleChange('participant', value)
                                return value;
                            }}
                        >
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Target Per Eligible Participant:</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="" />
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </div>   
            
                    <div className="col-md-3 d-flex align-items-end pl-5">
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

export default Filter;