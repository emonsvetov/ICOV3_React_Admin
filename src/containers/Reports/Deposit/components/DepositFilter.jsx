import React, {useState, useEffect} from "react";
import Select from 'react-select'
import renderDatePickerField from '@/shared/components/form/DatePicker';
import { Field, Form } from 'react-final-form';
import { Row, Col } from 'reactstrap';
import renderSelectField from '@/shared/components/form/Select'
import axios from 'axios'

const TEMPLATES = [
    { label: "Birthday", value: 1 },
    { label: "Work Anniversary", value: 2 },
    { label: "Custom Template", value: 3 },
  ];
  
const statusOptions = [
    {'value':'', 'label':'All'},
    {'value':'Active', 'label':'Active'},
    {'value':'Inactive', 'label':'Inactive'},
    {'value':'Pending', 'label':'Pending'},
]

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

const DepositFilter = ({onClickFilterCallback}) => {
    const [status, setStatus] = React.useState('')
    const [keyword, setKeyword] = React.useState('')
    const [programName, setProgramName] = React.useState('')
    
    const [data, setData] = React.useState([])

    const onStatusChange = (selectedOption) => {
        setStatus(selectedOption.value)
    };
    const onProgramPhaseChange = (e) => {
        setKeyword( e.target.value)
    }
    const onClickFilter = values => {
        debugger;
        onClickFilterCallback(status, keyword)
    }
    const handleChange = (selected) => {
        setProgramName(selected.value);
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
            {({ handleSubmit }) => (
              <form className="form" onSubmit={handleSubmit}>
              <Row>
                <div className="col-md-4 px-0">
                    <div className="form__form-group">
                    <span className="form__form-group-label">From</span>
                    <div className="form__form-group-field">
                        <Field
                        name="from"
                        component={renderDatePickerField}
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
                        component={renderDatePickerField}
                        />
                    </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <Field name="invoice_number">
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
                                    name="email_template_id"
                                    options={data}
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
                    <Field name="program_id">
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

                <div className="col-md-4 d-flex align-items-center max-height-32px pl-1">
                     <span className="text-blue pointer" onClick={onClickFilter}>Filter</span>
                 </div>
                </Row>
                
              
              </form>
            )}
          </Form>

        // <div className="form__form-group">
        //     <div className="col-md-4 px-0">
        //         <Select
        //             value={status}
        //             onChange={onStatusChange}
        //             options={statusOptions}
        //             clearable={false}
        //             className="react-select"
        //             placeholder={statusPlaceholder}
        //             classNamePrefix="react-select"
        //         />
        //     </div>
        //     <div className="col-md-4">
        //         <div className="">
        //             <input 
        //                 value={keyword}
        //                 onChange={onProgramPhaseChange}
        //                 type="text"
        //                 placeholder="Program phrase"
        //             />
        //         </div>
        //     </div>
        //     <div className="col-md-4 d-flex align-items-center max-height-32px pl-1">
        //         <span className="text-blue pointer" onClick={onClickFilter}>Filter</span>
        //     </div>
        // </div>
    )
}

export default DepositFilter;