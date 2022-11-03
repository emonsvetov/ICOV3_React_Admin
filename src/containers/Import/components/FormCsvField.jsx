import React, {useState} from 'react';
import {Row, Col} from 'reactstrap';
import {Field} from 'react-final-form';
import Select from "react-select";

const FormCsvField = ({field, config}) => {
  return (
    <div>
      <Row>
        <Col md="3">
          <h5>{field}</h5>
        </Col>
        <Col md="9" lg="7" xl="5" >
          <Field name={field}>
            {({input, meta}) => (
              <div>
                <Select
                  options={config.fieldsToMap}
                  clearable={false}
                  className="react-select"
                  classNamePrefix="react-select"
                  placeholder=" ----- "
                  {...input}
                />
                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
              </div>
            )}
          </Field>
        </Col>
      </Row>
    </div>
  )
}

export default FormCsvField;

