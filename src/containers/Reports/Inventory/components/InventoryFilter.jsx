import React, {useState, useEffect} from "react";
import Select from 'react-select'
import renderDatePickerField from '@/shared/components/form/DatePicker';
import { Field, Form } from 'react-final-form';
import { Row, Col } from 'reactstrap';
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
const InventoryFilter = ({onClickFilterCallback}) => {
    const [merchantId, setMerchantId] = React.useState([])
    const [endDate, setEndDate] = React.useState(new Date())

    const [data, setData] = React.useState([])
    const [selected, setSelected] = useState([]);
    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds)
    };

    const handleChange = (selected) => {
        setEndDate(selected)    
    };

    const onClickFilter = () => {
        onClickFilterCallback(merchantId, endDate.toISOString().slice(0, 10))
    }

    useEffect( () => {        
        fetchProgramData()
        .then( response => {
            setData(response)
        })
        
    }, [])

    
    return (
        <Form onSubmit={onClickFilter}>
            {({ handleSubmit }) => (
              <form className="form" onSubmit={handleSubmit}>
              <Row>
                
                <div className="col-md-4">
                    
                    <span className="form__form-group-label">
                        View for Merchant
                    </span>
                    <ProgramTreeView data={data} handleSelect={handleSelect} selected={selected} />
                    
                </div>
                <div className="col-md-4">
                    <div className="form__form-group">
                        <span className="form__form-group-label">Through Date</span>
                        <div className="form__form-group-field">
                            <Field
                                name="end_date"
                                dueDate={new Date()}
                                onChange={handleChange}
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

export default InventoryFilter;