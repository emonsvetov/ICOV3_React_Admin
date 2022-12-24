import React, {useState} from 'react';
import { Form } from 'react-final-form';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import ReactTableBase from "@/shared/components/table/ReactTableBase";
import {useDispatch, flashError, flashSuccess} from "@/shared/components/flash"
import Select from 'react-select';
import { Field } from 'react-final-form';
import {makeCsvErrors} from "@/shared/apiTableHelper"
import FormStep1 from './FormStep1';
import FormStep2 from './FormStep2';

const isValidResponse = res => {
  if( !res.hasOwnProperty('data') ) return false;
  if( !res.data.hasOwnProperty('CSVheaders') )  return false;
  if( !res.data.hasOwnProperty('fieldsToMap') )  return false;
  // Add more validation here
  return true;
}

const tableConfig = {
    isResizable: true,
    isSortable:false
}

let config = {
    importType: {
        name: 'import_type',
        label: 'Select Import Type',
        options: [
            {
                label: 'Events',
                value: 'Events'
            }, 
            {
                label: 'Programs',
                value: 'Programs'
            }, 
            {
                label: 'Users',
                value: 'Users'
            },
            
        ],
        // placeholder: null
    },
    importFile: {
        name: 'import_file',
        label: 'Choose File'
    },
    importTypeStep2: {
        name: 'import_type',
        label: 'Select Import Type',
        options: [
            {
                label: 'Users',
                value: 'Users'
            }
        ],
        placeholder: ' ----- '
    },
    userRole: {
        name: 'user_role',
        label: 'Select User Role',
        options: [
            {
                label: 'Participant',
                value: 'Participant'
            },
            {
                label: 'Manager',
                value: 'Manager'
            }
        ],
        placeholder: ' ----- '
    },
    csvFields: [
      "org", "name", "surname", "email", "birthday", "status", "program name", "external id", "employee_number"
    ],
    fieldsToMap: [
        {
            label: 'user_status_id',
            value: 'user_status_id'
        },
        {
            label: 'first_name',
            value: 'first_name'
        },
        {
            label: 'last_name',
            value: 'last_name'
        },
        {
            label: 'email',
            value: 'email'
        },
        {
            label: 'email_verified_at',
            value: 'email_verified_at'
        },
        {
            label: 'password',
            value: 'password'
        },
        {
            label: 'phone',
            value: 'phone'
        },
        {
            label: 'etc.',
            value: 'etc.'
        }
    ]
}
const ImportForm = ({organization}) => {
    const dispatch = useDispatch()
    const [importType, setImportType] = useState('');
    const [importHeaders, setImportHeaders] = useState(null);
    const [csvFile, setCsvFile] = useState(null);
    const [step, setStep] = useState(0);
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [roles, setRoles] = useState(null)
    const [errorComponent, setErrorComponent] = useState(null);

    const onclickNext = () => {
        setStep(step+1)
    }
    const onclickBack = () => {
        setStep(step-1)
        setErrorComponent(null)
    }
    const onSelectImportType = (selectedOption) => {
      if(selectedOption)
      {
        setImportType( selectedOption.value )
        setStep(1)
      }
        // alert(JSON.stringify(selectedOption))
    };
    const validateMe = (values) => {
        let errors = {};
        // alert(JSON.stringify(csvFile))
        if( !importType )   {
            errors.import_type = "Please select import type";
        }
        if ( !csvFile ) {
            errors.import_file = "Csv file is required";
        }
        // // console.log(csvFile);
        return errors;
    }
  
    function onSubmit() {
        let data = new FormData();
        // if( !csvFile ){
        //   return;
        // }
        // data.append('import_type', importType)
        const prefix = importType.toLowerCase().substring(0, importType.length -1)
        data.append('upload-file', csvFile)
        const url = `/organization/${organization.id}/${prefix}importheaders`
        console.log(url)
        axios
        .post(url, data, {
                headers: {
                    "Content-type": "multipart/form-data",
                },       
            }
        )
        .then((res) => {
            if(!isValidResponse(res))
            {
              flashError(dispatch, "Cannot read or invalid CSV file");
              return;
            }
            setImportHeaders(res.data)
            setStep(2)
        })
        .catch((error) => {
            const errors = error.response.data.errors;
            flashError(dispatch, errors);
        });
    }
    
    const onClickCancel = () => {
        window.location = '/users'
    }
    config = {...config, ...{roles}}

    return (
    <Form
        onSubmit={onSubmit}
        validate={validateMe}
        initialValues={{
            import_type:importType,
            import_file:csvFile
        }}
    >
    {({ handleSubmit, form, submitting, pristine, values }) => (
    <form className="form" onSubmit={handleSubmit}>
        <Row>
            <Col md="8" lg="8" xl="8">
                <Field name={config.importType.name}
                    parse={
                        (value) => {
                            onSelectImportType(value)
                            return value
                        }
                    }
                >
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">{config.importType.label}</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <Select
                                    options={config.importType.options}
                                    // clearable={false}
                                    className="react-select"
                                    placeholder={importType ? importType : config.importType.placeholder}
                                    classNamePrefix="react-select"
                                    {...input}
                                />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                            <div className="form__form-group-row">
                                {/* <Button className="btn btn-primary btn-sm" color="#ffffff" disabled={!importType} onClick={onclickNext} style={{margin: 'auto auto auto 10px'}}>GO</Button> */}
                            </div>
                        </div>
                    </div>
                )}
                </Field>

                {step === 1 && <FormStep1 { ...{config, csvFile, setCsvFile, onclickBack} } />}
                {step === 2 && <FormStep2 { ...{config, csvFile, setCsvFile, onclickBack, importHeaders} } />}
            </Col>
        </Row>
        {errorComponent}
    </form>
    )}
  </Form>
)}

export default withRouter(connect((state) => ({
organization: state.organization
}))(ImportForm));

