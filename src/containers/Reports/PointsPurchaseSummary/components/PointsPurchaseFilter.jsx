import React, {useState, useEffect} from "react";
import Select from 'react-select'
import renderDatePickerField from '@/shared/components/form/DatePicker';
import { Field, Form } from 'react-final-form';
import { Row, Col } from 'reactstrap';
import renderSelectField from '@/shared/components/form/Select'
import renderCheckBoxField from '@/shared/components/form/CheckBox';
import ProgramTreeView from "./ProgramTreeView";
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
        `/organization/1/program?minimal=true&sortby=name`
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
    
    const [data, setData] = React.useState([])
    const [selected, setSelected] = useState([]);
    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds)
    };


    const onClickFilter = () => {
        onClickFilterCallback(targetYear, participant)
    }
    const handleChange = (selected) => {
        setTargetYear(selected.value);
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
            {({ handleSubmit }) => (
              <form className="form" onSubmit={handleSubmit}>
              <Row>
                <div className="col-md-4">
                        
                        <span
                        className="form__form-group-label"
                        >
                        View for Merchant
                        </span>
                        <ProgramTreeView data={data} handleSelect={handleSelect} selected={selected} />
                    
                </div>
                <div className="col-md-4">
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
                <div className='col-md-4'>
                    <div className="form__form-group">
                        <span className="form__form-group-label">
                            To
                        </span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <Field 
                                    name="year"
                                    options={YEAR_LIST}
                                    component={renderSelectField}
                                    parse={value => {
                                        handleChange(value)
                                        return value;
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-4">
                    <Field name="name">
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
        
                
                <div className="col-md-4 d-flex align-items-center max-height-32px pl-1">
                     <span className="text-blue pointer" onClick={onClickFilter}>Filter</span>
                 </div>
                </Row>
                
              
              </form>
            )}
          </Form>

        
    )
}

export default Filter;