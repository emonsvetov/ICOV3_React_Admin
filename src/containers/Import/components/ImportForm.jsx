import React, {useState} from 'react';
import { Form } from 'react-final-form';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import formValidation from "@/shared/validation/adduser";
import axios from 'axios';
import ReactTableBase from "@/shared/components/table/ReactTableBase";
import { fetchRoles } from "@/shared/apiHelper"
import {unpatchSelect, labelizeNamedData} from '@/shared/helpers'
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"
import Select from 'react-select';
import { Field } from 'react-final-form';
import {makeCsvErrors} from "@/shared/apiTableHelper"
import FormStep1 from './FormStep1';
import FormStep2 from './FormStep2';

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
                label: 'Users',
                value: 'Users'
            }
        ],
        placeholder: ' ----- '
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
    const [csvFile, setCsvFile] = useState(null);
    const [step, setStep] = useState(2);
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
        if( setImportType ) {
            setImportType( selectedOption.value )
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

    // React.useEffect( () => {
    //     getRoles(organization)
    // }, [organization])

    // const getRoles = ( organization ) => {
    //     setLoading(true)
    //     fetchRoles( 1 )
    //     .then( data => {
    //         let newData = labelizeNamedData(data);
    //         // console.log(newData)
    //         setRoles(newData);
    //         setLoading(false)
    //     })
    // }
  
    function onSubmit() {
        let data = new FormData();
        // if( !csvFile ){
        //   return;
        // }
        data.append('import_type', importType)
        data.append('import_file', csvFile)
        axios
        .post(`/organization/${organization.id}/import/map`, data, {
                headers: {
                    "Content-type": "multipart/form-data",
                },       
            }
        )
        .then((res) => {
            console.log(res);
            // if (res.status == 200) {
            //     dispatch(sendFlashMessage('Giftcodes saved successfully', 'alert-success'))
            //     // alert('success')
            // }
        })
        .catch((error) => {
            const errors = error.response.data.errors;
            const csv_errors = errors.file_medium_info;
            // console.log(csv_errors)
            if(typeof csv_errors === 'object')  {
                try{
                    const {columns:csvColumns, rows:csvRows} = makeCsvErrors(csv_errors);
                    setErrorComponent(
                    <ReactTableBase
                        columns={csvColumns}
                        data={csvRows}
                        tableConfig={tableConfig}
                    />)
                    dispatch(sendFlashMessage('Error occurred while validating giftcodes. Please see the errors below', 'alert-danger', 'top'))
                }
                catch(err)
                {
                    console.log(err)
                    // console.log(error.response.data)
                    dispatch(sendFlashMessage(<ApiErrorMessage errors={err.response.data} />, 'alert-danger', 'top'))
                }

                // console.log(csv_errors_json)
            }
            // if( typeof errors)
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
        <Row className='w100'>
            <Col md="12" lg="12" xl="12" className='text-right'>
                <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button outline color="primary" className="mr-3" onClick={onClickCancel}>Cancel</Button>{' '}
                    <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Save</Button>
                </ButtonToolbar>
            </Col>
        </Row>
        <Row>
            <Col md="8" lg="8" xl="8">
                {step === 0 && 
                <div>
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
                                    clearable={false}
                                    className="react-select"
                                    placeholder={config.importType.placeholder}
                                    classNamePrefix="react-select"
                                    {...input}
                                />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                            <div className="form__form-group-row">
                                <Button className="btn btn-primary btn-sm" color="#ffffff" disabled={!importType} onClick={onclickNext} style={{margin: 'auto auto auto 10px'}}>GO</Button>
                            </div>
                        </div>
                    </div>
                )}
                </Field></div>}
                {step === 1 && <FormStep1 { ...{config, csvFile, setCsvFile, onclickBack} } />}
                {step === 2 && <FormStep2 { ...{config, csvFile, setCsvFile, onclickBack} } />}
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

