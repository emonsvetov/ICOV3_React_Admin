import React from 'react';
import {Row, Col} from 'reactstrap';
import {Field} from 'react-final-form';
import Select from "react-select";

const FormCsvField = ({field, fieldsToMap}) => {
  return (
    <div>
      <Row>
        <Col md="3">
          <h5>{field}</h5>
        </Col>
        <Col md="9" lg="7" xl="5" >
          <Field name={`fieldsToMap[${field}]`}>
            {({input, meta}) => (
              <div>
                <Select
                  options={fieldsToMap}
                  clearable={false}
                  className="react-select"
                  classNamePrefix="react-select"
                  placeholder=" - - - "
                  touchUi={false}
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

