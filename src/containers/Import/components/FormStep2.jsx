import React, { useState } from 'react';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import { Field } from 'react-final-form';
import MuiButton from '@material-ui/core/Button';
import SwitchField from '@/shared/components/form/Switch';
import Select from "react-select";
import FormCsvField from "./FormCsvField";
import SetupFields from "./SetupFields";

const FormStep2 = ({ config, csvFile, setCsvFile, onclickBack, importHeaders, isValidResponse }) => {
    const [checked, setChecked] = useState(false);
    // console.log(importHeaders)
    const switchHandler = () => {
        setChecked(!checked);
    };

    const makeOptions = obj => {
        let newOptions = []
        for (const [key, fields] of Object.entries(obj)) {
            // console.log(key)
            let newOption = {
                label: key,
                options: []
            }
            for (const [name] of Object.entries(fields)) {
                // console.log(name)
                newOption.options.push({ label: name, value: name })
            }

            newOptions.push(newOption)
        }
        return newOptions;
    }

    if (!importHeaders) return 'Loading...'
    const fieldsToMap = makeOptions(importHeaders.fieldsToMap);

    return (
        <div className="form-step2">
            <div className="form__form-group">
                {importHeaders.hasOwnProperty("setups") &&
                    <SetupFields setups={importHeaders.setups} />
                }
                {importHeaders.hasOwnProperty("Userroles") && <Row>
                    <Col md="3">
                        <h5>User Role</h5>
                    </Col>
                    <Col md="9" lg="7" xl="5" >
                        <Field name={config.userRole.name}>
                            {({ input, meta }) => (
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
                </Row>}
                {importHeaders.hasOwnProperty("Emailusers") && <Row>
                    <Col md="3">
                        <h5>Email User?</h5>
                    </Col>
                    <Col md="9" lg="7" xl="5" >
                        <Field name="email_user">
                            {({ input, meta }) => (
                                <div>
                                    <SwitchField checked={checked} name={input.name} onClick={switchHandler} />
                                </div>
                            )}
                        </Field>
                    </Col>
                </Row>}
                {isValidResponse(importHeaders) &&
                    <>
                        <Row>
                            <Col md="12"><h4 className='mb-3'>Field Mapping</h4></Col>
                        </Row>
                        {importHeaders.CSVheaders.map((field, index) => <div key={index}><FormCsvField {... { field, fieldsToMap }} /></div>)}
                        <br />
                    </>
                }
                <div className="form__form-group-field flex-column">
                    <div className="form__form-group-row flex-row pt-3">
                        <Button className="btn btn-outline-primary btn-sm" color="#ffffff" disabled={1 == 2} onClick={onclickBack} style={{}}>Back</Button>
                        <Button className="btn btn-primary btn-sm" color="#ffffff" disabled={1 == 2} type="submit" style={{}}>Import</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FormStep2;

