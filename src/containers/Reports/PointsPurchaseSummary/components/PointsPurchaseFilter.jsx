import React, {useState, useEffect} from "react";
import { Field, Form } from 'react-final-form';
import { Button, Row } from 'reactstrap';
import renderSelectField from '@/shared/components/form/Select'
import {connect} from 'react-redux'
import {CSVLink} from "react-csv";
const prepareList = () =>{
    let y = new Date().getFullYear();
    let list = [];
    for (var i = y; i > y -7; i --){
        list.push({label: i, value: i})
    }    
    return list;
}

const Filter = ({ 
    filter,
    setFilter,
    setUseFilter,
    download,
    exportData,
    exportLink,
    exportHeaders
}) => {
    
    const YEAR_LIST = prepareList();
    const [targetYear, setTargetYear] = React.useState({label: new Date().getFullYear(), value: new Date().getFullYear()})
    const [participant, setParticipant] = React.useState(null);
    const [programId, setProgramId] = React.useState([]);
    const [selected, setSelected] = useState([]);
    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds)
    };
  
  const finalFilter = {...filter}
const onClickFilterCallback = (values) => {
    let change = false;

    if (finalFilter.year !== values) {
        change = true
    }

    if (!change) {
        alert('No change in filters')
        setUseFilter(false)
        return
    }

    let filters = {}
    filters.year = values;

    setFilter({...filter, year:values})
    setUseFilter(true)
    }

const onClickFilter = (e) => {
    if (e.action == "export") {
        download(filter)
    }
    else  {
        onClickFilterCallback( targetYear.value)
    }
}
const handleChange = (field, selected) => {
    if(field == "year")
        setTargetYear(selected);
    else
        setParticipant(selected);
};
    
return (
    <Form onSubmit={onClickFilter}
        initialValues={{
            year: targetYear
        }}
    >
        {({ handleSubmit, form, submitting, pristine, values }) => (
            <form className="form" onSubmit={handleSubmit}>
            <Row>
                <div className='col-md-6 col-sm-12'>
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
                
                
                <div className="col-md-6 col-sm-12 d-flex align-items-end">
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
                    >Export CSV
                     <CSVLink
                            data={exportData}
                            headers={exportHeaders}
                            filename="report.csv"
                            className="hidden"
                            ref={exportLink}
                            target="_blank"
                        />
                    </Button>
                    
                </div>
            </Row>
            </form>
        )}
    </Form>

    
)
}

const mapStateToProps = (state) => {
    return {
      auth: state.auth,
      organization: state.organization,
    };
  };
  export default connect(mapStateToProps)(Filter);