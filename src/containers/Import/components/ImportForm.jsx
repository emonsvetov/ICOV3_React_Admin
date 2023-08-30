import React, {useEffect, useState} from 'react';
import { Form } from 'react-final-form';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import { useDispatch, flashError, flashSuccess } from "@/shared/components/flash"
import Select from 'react-select';
import { Field } from 'react-final-form';
import FormStep1 from './FormStep1';
import FormStep2 from './FormStep2';

const isValidResponse = data => {
  if (!data.hasOwnProperty('CSVheaders')) return false;
  if (!data.hasOwnProperty('fieldsToMap')) return false;
  // Add more validation here
  return true;
}

const tableConfig = {
  isResizable: true,
  isSortable: false
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
  }
}

const ImportForm = ({ organization }) => {
  const dispatch = useDispatch()
  const [importType, setImportType] = useState('');
  const [importHeaders, setImportHeaders] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState(null)
  const [saveSettings, setSaveSettings] = useState(false);

  const reset = () => {
    setStep(0)
    setCsvFile(null)
    setImportHeaders(null)
    setImportType('')
    setError(null)
    setLoading(false)
    setSaveSettings(false)
  }

  const onSelectCsvFile = (file) => {
    setCsvFile(file)
    setImportHeaders(null)
  }
  const onclickBack = () => {
    setStep(step - 1)
  }
  const onclickNext = () => {
    setStep(step + 1)
  }
  const onSelectImportType = (selectedOption) => {
    if (selectedOption) {
      setImportType(selectedOption.value)
      setStep(1)
    }
    // alert(JSON.stringify(selectedOption))
  };
  const validate = (values) => {
    let errors = {};
    if(step === 1) 
    {
      if (!importType) {
        errors.import_type = "Please select import type";
      }
      if (!csvFile) {
        errors.import_file = "Csv file is required";
      }
    }
    else if(step === 2) 
    {
      // if(values.hasOwnProperty('fieldsToMap'))
      // {
      //   errors['fieldsToMap']['ProgramID'] = 'Some error';
      // }
      // console.log(errors)
    }
    // alert(JSON.stringify(values))
    return errors;
  }

  const onSubmitStep1 = values => {
    let data = new FormData();
    const prefix = importType.toLowerCase().substring(0, importType.length - 1)
    data.append('upload-file', csvFile)
    const url = `/organization/${organization.id}/${prefix}importheaders`
    // console.log(url)
    axios
    .post(url, data, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    }
    )
    .then((res) => {
      if (!isValidResponse(res.data)) {
        flashError(dispatch, "Cannot read or invalid CSV file");
        return;
      }
      // console.log(res.data)
      setImportHeaders(res.data)
      setStep(2)
    })
    .catch((error) => {
        console.log(error)
    //   const errors = error.response.data.errors;
    //   flashError(dispatch, errors);
    });
  }

  const onSubmitStep2 = values => {

    const isSaveSettings = !!values.isSaveSettings;
    let isAutoImport = false;

    // console.log(values)
    // console.log(importHeaders)
    // console.log(values.hasOwnProperty("fieldsToMap"))
    // console.log(csvFile instanceof File)
    if( !values || !importHeaders || !values.hasOwnProperty("fieldsToMap") || !(csvFile instanceof File))
    {
      flashError(dispatch, "Invalid data found")
      setSaveSettings(false);
      return
    }
    // console.log(values)

    const formFields = values.fieldsToMap;

    // console.log(formFields)
    let newFormFields = {}
    for (const [formRequest, headerFieldsToMap] of Object.entries(importHeaders.fieldsToMap)) 
    {
      newFormFields[formRequest] = {}
      for (const [fieldName] of Object.entries(headerFieldsToMap)) 
      {
        for(const [formFieldName, formFieldValue] of Object.entries(formFields) )
        {
          if( formFieldValue && formFieldValue.value === fieldName)
          {
            newFormFields[formRequest][fieldName] = formFieldName;
          }
        }
      }
    }
    let type = '';
    let setupsFields = {};
    if(values.hasOwnProperty("setups"))
    {
        const setups = values['setups'];
        Object.keys(setups).map( (formRequest) => {
            setupsFields[formRequest] = {}
            const fields = setups[formRequest];
            if( Object.keys(fields).length > 0 )
            {
                Object.keys(fields).map( (field) => {
                  if (field === 'type'){
                    type = fields[field].value;
                  }
                    if (fields[field]){
                      setupsFields[formRequest][field]= fields[field].value
                    }
                })
            }
        })
    }

    // console.log(newFormFields)
    let data = new FormData();
    const prefix = importType.toLowerCase().substring(0, importType.length - 1)
    data.append('upload-file', csvFile)
    data.append('fieldsToMap', JSON.stringify(newFormFields))
    if( Object.keys(setupsFields).length > 0)
    {
        data.append('setups', JSON.stringify(setupsFields))
    }
    let url = `/organization/${organization.id}/${prefix}import`
    if (isSaveSettings){
      url = `/organization/${organization.id}/csv-import-setting`
    } else if (type && type === 'Add and Award Participants') {
      isAutoImport = true;
      url = `/organization/${organization.id}/user-auto-import`
    }

    // console.log(url)
    // console.log(JSON.stringify(data))
    // return;
    axios
    .post(url, data, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    })
    .then((res) => {
    //   console.log(res)
      if ( res.data?.csvImport )
      {
        flashSuccess(dispatch, "Import request added to queue. You will be notified when it is processed.");
        reset();
      }
      if (isSaveSettings){
        if ( res.data?.success )
        {
          flashSuccess(dispatch, "Settings successfully saved");
          setSaveSettings(false);
        }
      } else if(isAutoImport){
        console.log(res.data);
        if ( res.data?.csvImport ) {
          flashSuccess(dispatch, "Import request added to queue. You will be notified when it is processed.");
          // reset();
        }
      }
    })
    .catch((error) => {
      const errors = error.response.data.errors;
      setError(errors)
      setSaveSettings(false)
    //   alert(JSON.stringify(errors))
      flashError(dispatch, "There were errors. Scroll down the page to view.");
    });
    // return newFormFields;
  }

  // function onSubmit( values ) {
  const onSubmit = async values => {
    if( step === 1 ) {
      onSubmitStep1( values )
    }
    else if( step === 2 )
    {
      onSubmitStep2(values)
    }
  }

  const onClickCancel = () => {
    window.location = '/users'
  }
  config = { ...config, ...{ roles } }

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      initialValues={{
        import_type: importType,
        import_file: csvFile
      }}
    >
      {({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="form" onSubmit={handleSubmit}>
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
                        <h4 className='mb-4'>{config.importType.label}</h4>
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
                </div>}
              {step === 1 && <FormStep1 {...{ config, setStep, csvFile, onSelectCsvFile, onclickBack, onclickNext, importHeaders }} />}
              {step === 2 && <FormStep2 {...{ config, setStep, csvFile, onclickBack, importHeaders, isValidResponse, setSaveSettings, saveSettings, handleSubmit}} />}
              {error && <ErrorComponentRaw error={error} />}

              {/*<pre>{JSON.stringify(values, 0, 2)}</pre>*/}

            </Col>
          </Row>
        </form>
      )}
    </Form>
  )
}

const ErrorComponent = ({error}) => {
  return (
    <div className=''>
      <h4 className='mb-2'>Import Errors</h4>
      <div className='p-3'>
        <ul className=''>
            {
              Object.entries(error).map( (a) => (
                <li className='text-danger'>{a[0]}
                  <ul>
                  {
                    Object.entries(a[1]).map( (b) => (
                      <>
                        {
                          Object.entries(b[1]).map( (c) => (
                            <li>{c[0]}
                              <ul>
                                {
                                  Object.keys(c[1]).map( (d, i) => (
                                    <li>{d}
                                      <ul>
                                        {
                                          c[1][d].map( (e, i) =>(
                                            <li>{e}</li>
                                          ))
                                        }
                                      </ul>
                                    </li>
                                  ))
                                }
                              </ul>
                            </li>
                          ))
                        }
                      </>
                    ))
                  }
                  </ul>
                </li>
              ))
            }
        </ul>
      </div>
    </div>
  )
}

const ErrorComponentRaw = ({error}) => {
    return (
        <div className=''>
            <h4 className='mb-2'>Import Errors</h4>
            <div className='p-3 text-danger'>
                {JSON.stringify(error)}
            </div>
        </div>
    )
}

export default withRouter(connect((state) => ({
  organization: state.organization
}))(ImportForm));

// {
//   
//   )
// )
