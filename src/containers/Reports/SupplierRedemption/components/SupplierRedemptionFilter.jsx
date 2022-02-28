import React, {useState, useEffect} from "react";

import renderDatePickerField from '@/shared/components/form/DatePicker';
import { Field, Form } from 'react-final-form';
import { Row, Col } from 'reactstrap';

import renderRadioButtonField from '@/shared/components/form/RadioButton';
import renderCheckBoxField from '@/shared/components/form/CheckBox';
import ProgramTreeView from "./ProgramTreeView";
import axios from 'axios'

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
            {({ handleSubmit }) => (
              <form className="form" onSubmit={handleSubmit}>
              <Row>
              <div className="col-md-4 px-0">
                        
                        <span
                        className="form__form-group-label"
                        >
                        View for Merchant
                        </span>
                        <ProgramTreeView data={data} handleSelect={handleSelect} selected={selected} />
                    
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
                <div className="col-md-4">
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
                <div className="col-md-4">
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