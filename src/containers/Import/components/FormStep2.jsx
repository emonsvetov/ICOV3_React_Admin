import React, {useState} from 'react';
import {Row, Col, ButtonToolbar, Button} from 'reactstrap';
import {Field} from 'react-final-form';
import MuiButton from '@material-ui/core/Button';
import SwitchField from '@/shared/components/form/Switch';
import Select from "react-select";
import FormCsvField from "./FormCsvField";

const FormStep2 = ({config, csvFile, setCsvFile, onclickBack}) => {
  const [checked, setChecked] = useState(false);

  const switchHandler = () => {
    setChecked(!checked);
  };

  return (
    <div className="form-step2">

      <div className="form__form-group">
        <Row>
          <Col md="12"><h4>File Upload</h4></Col>
          <Col md="3">
            <h5>File<b>*</b></h5>
          </Col>
          <Col md="9" lg="7" xl="5" >
            <Field name={config.importFile.name}>
              {({input, meta}) => (
                <div>
                  <div className="flex-row form__form-group-field">
                    <div className="flex-column">
                      <MuiButton variant="contained" component="label" style={{textTransform: 'inherit'}}>
                        {config.importFile.label}
                        <input
                          hidden
                          type='file'
                          // accept='.csv'
                          id='csvFile'
                          {...input}
                          onChange={(e) => {
                            setCsvFile(e.target.files[0])
                          }}
                          value={csvFile?.name.file}
                        >
                        </input>
                      </MuiButton>
                    </div>
                    <div className="flex-column" style={{justifyContent: 'end', padding: '0px 10px', display: 'flex'}}>
                      {csvFile?.name}
                    </div>
                  </div>
                  {meta.touched && !csvFile && (<span className="form__form-group-error">{meta.error}</span>)}
                </div>
              )}
            </Field>
          </Col>
        </Row>
        <Row>
          <Col md="12"><h4>Setups</h4></Col>
          <Col md="3">
            <h5>Import type<b>*</b></h5>
          </Col>
          <Col md="9" lg="7" xl="5" >
            <Field name={config.importTypeStep2.name}>
              {({input, meta}) => (
                <div>
                  <Select
                    options={config.importTypeStep2.options}
                    clearable={false}
                    className="react-select"
                    placeholder={config.importTypeStep2.placeholder}
                    classNamePrefix="react-select"
                    {...input}
                  />
                  {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                </div>
              )}
            </Field>
          </Col>
        </Row>
        <Row>
          <Col md="3">
            <h5>User Role</h5>
          </Col>
          <Col md="9" lg="7" xl="5" >
            <Field name={config.userRole.name}>
              {({input, meta}) => (
                <div>
                  <Select
                    options={config.userRole.options}
                    clearable={false}
                    className="react-select"
                    placeholder={config.userRole.placeholder}
                    classNamePrefix="react-select"
                    {...input}
                  />
                  {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                </div>
              )}
            </Field>
          </Col>
        </Row>
        <Row>
          <Col md="3">
            <h5>Email User?</h5>
          </Col>
          <Col md="9" lg="7" xl="5" >
            <Field name="email_user">
              {({input, meta}) => (
                <div>
                  <SwitchField checked={checked} name={input.name} onClick={switchHandler} />
                </div>
              )}
            </Field>
          </Col>
        </Row>

        <Row>
          <Col md="12"><h4>Mapping</h4></Col>
        </Row>
        {config.csvFields.map((field, index) => <div key={index}><FormCsvField { ... {field, config}} /></div>)}

        <br/>
        <div className="form__form-group-field flex-column">
          <div className="form__form-group-row flex-row pt-3">
            <Button className="btn btn-outline-primary btn-sm" color="#ffffff" disabled={1 == 2}
                    onClick={onclickBack} style={{}}>Back</Button>
            <Button className="btn btn-primary btn-sm" color="#ffffff" disabled={1 == 2} type="submit"
                    style={{}}>Import</Button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default FormStep2;

