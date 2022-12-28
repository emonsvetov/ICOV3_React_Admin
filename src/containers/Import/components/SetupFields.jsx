import React, {useState} from 'react';
import {Row, Col} from 'reactstrap';
import {Field} from 'react-final-form';
import Select from "react-select";

const SetupFields = ({setups}) => {
    if( !setups ) return null;

    if (!setups.constructor === Object) {
        console.log("setups is not a valid object");
        return null;
    }
    if (Object.keys(setups).length === 0) {
        console.log("setups object is empty");
        return null;
    }

    return (
        <div>
            <h4>Setups</h4>
            {
                Object.keys(setups).map((formRequest, i) => <div key={i}><FormSetupField {...{formRequest, setups}}/></div>)
            }
        </div>
    )
}

export default SetupFields;

const RenderSetupField = ({formRequest, name, rule }) => {
    // console.log(name)
    // console.log(rule)
    if (rule.indexOf('mustMatchWith') !== -1) {
        const matches = rule.match(/mustMatchWith\[(.*?)\]/);
        if (typeof matches === "object" && matches.length > 0) //is a non empty array
        {
            let options = matches[1].split('|')
            // console.log(options)
            if (options.length > 0) {
                options = options.map( (option) => {return {"value": option, "label": option} } )
                // console.log(options)
                return(
                    <Field name={`setups[${formRequest}][${name}]`} key={name}>
                        {
                            ({ input, meta }) => (
                                <div>
                                    <Select
                                        options={options}
                                        clearable={false}
                                        className="react-select"
                                        placeholder={' - - - '}
                                        classNamePrefix="react-select"
                                        {...input}
                                    />
                                    {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                </div>
                            )
                        }
                    </Field >
                )
            }
        }
    }
    return <span>:{name}-field</span>;
}

const FormSetupFieldGroup = ({formRequest, fields, field}) => {
    return (
        <Row key={`setupField-${field}`}>
            <Col md="4">
                <h5>{field.toUpperCase()}<b>*</b></h5>
            </Col>
            <Col md="4">
                <RenderSetupField formRequest={formRequest} name={field} rule={fields[field]} />
            </Col>
        </Row>
    )
}

const FormSetupField = ({formRequest, setups}) => {
    return (
        <div>
            <Row>
                <Col md="12"><h5>{formRequest} Setup</h5></Col>
            </Row>
            {
                Object.keys(setups[formRequest]).map((field, j) => <div key={j}><FormSetupFieldGroup formRequest={formRequest} fields={setups[formRequest]} field={field}/></div>)
            }
        </div>
    )
}