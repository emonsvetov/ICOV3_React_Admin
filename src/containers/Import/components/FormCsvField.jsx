import React, {useEffect, useRef, useState} from 'react';
import {Row, Col} from 'reactstrap';
import {Field} from 'react-final-form';
import Select from "react-select";

const FormCsvField = ({field, fieldsToMap, savedSettings, typeChanged}) => {

  const [selected, setSelected] = useState(null)
  const inputRef = useRef(null);

  useEffect(() => {
    if (typeChanged !== false) {
      setSelected(null);
      inputRef.current.clearValue()
    }
    if (Object.keys(savedSettings).length > 0) {
      if (typeChanged === false) {
        Object.keys(savedSettings['field_mapping']).map((item, index) => {
          Object.keys(savedSettings['field_mapping'][item]).map((subItem, subIndex) => {
            if (savedSettings['field_mapping'][item][subItem] === field) {
              let result = {"value": item+subItem, "label": subItem};
              setSelected(result)
              inputRef.current.selectOption(result)
            }
          });
        });
      }
    }
  }, [savedSettings, typeChanged])

  const onSelectChange = (selectedOption, input) => {
    setSelected(selectedOption)

    input.onChange(selectedOption);
  };

  return (
    <div>
      <Row>
        <Col md="3">
          <h5>{field}</h5>
        </Col>
        <Col md="9" lg="7" xl="5">
          <Field name={`fieldsToMap[${field}]`} >
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
                  ref={inputRef}
                  value={selected}
                  onChange={(selectedOption) => onSelectChange(selectedOption, input)}
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

