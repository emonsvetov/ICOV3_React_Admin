import React, {useEffect, useRef, useState} from 'react';
import {Row, Col} from 'reactstrap';
import {Field} from 'react-final-form';
import Select from "react-select";

const SetupFields = ({setups, setupsFull, setTypeChanged, typeChanged, savedSettings}) => {

  if (!setups) return null;

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
        Object.keys(setups).map((formRequest, i) => <div key={i}><FormSetupField {...{
          formRequest,
          setups,
          setupsFull,
          typeChanged,
          savedSettings,
          setTypeChanged
        }}/></div>)
      }
    </div>
  )
}

export default SetupFields;

const RenderSetupField = ({
                            formRequest,
                            name,
                            rule,
                            typeChanged,
                            setTypeChanged,
                            savedSettings
                          }) => {

  const [selected, setSelected] = useState(null)
  const inputRef = useRef(null);
  const [count, setCount] = useState(0)

  const onSelectChange = (selectedOption, input) => {
    if (input.name === 'setups[UserRequest][type]') {
      if (selectedOption && typeChanged === false && input.value.value !== selectedOption.value){
        setTypeChanged(selectedOption.value)
      }
    }

    setSelected(selectedOption);
    input.onChange(selectedOption);
  };

  useEffect(() => {
    if (typeChanged !== false && name !== 'type') {
      // console.log(name);
      setSelected(null);
      if(inputRef.current){
        inputRef.current.clearValue()
      }
    }
    if (Object.keys(savedSettings).length > 0) {
      if (typeChanged === false) {
        Object.keys(savedSettings['setups']).map((item, index) => {
          Object.keys(savedSettings['setups'][item]).map((subItem, subIndex) => {
            if (subItem === name) {
              let result = {
                "value": savedSettings['setups'][item][subItem],
                "label": savedSettings['setups'][item][subItem]
              };
              setSelected(result)
              inputRef.current.selectOption(result)
            }
          });
        });
      }
    }
  }, [savedSettings, typeChanged])

  const handleCheck = (arr, val) => {
    return arr.some(item => val.value === item.value);
  }

  if (rule.indexOf('mustMatchWith') !== -1) {
    const matches = rule.match(/mustMatchWith\[(.*?)\]/);
    if (typeof matches === "object" && matches.length > 0) //is a non empty array
    {
      let options = matches[1].split('|');
      if (options.length > 0) {
        options = options.map((option) => {
          return {"value": option, "label": option}
        })
        return (
          <Field name={`setups[${formRequest}][${name}]`} key={name}>
            {
              ({input, meta}) => (
                <div>
                  <Select
                    options={options}
                    clearable={false}
                    className="react-select"
                    placeholder={' - - - '}
                    classNamePrefix="react-select"
                    {...input}
                    ref={inputRef}
                    value={selected}
                    onChange={(selectedOption) => onSelectChange(selectedOption, input)}
                  />
                  {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                </div>
              )
            }
          </Field>
        )
      }
    }
  }
  return <span>:{name}-field</span>;
}

const FormSetupFieldGroup = ({
                               formRequest, fields, field, typeChanged, setTypeChanged, setupsFull,
                               savedSettings
                             }) => {

  const setupsSearch = setupsFull[formRequest][field].split('|');
  const isRequired = setupsSearch.filter(item => {
    if (item === 'nullable') {
      return true;
    }
  }).length === 0;

  return (
    <Row key={`setupField-${field}`}>
      <Col md="4">
        <h5>{field.toUpperCase()}{isRequired ? <b>*</b> : ''}</h5>
      </Col>
      <Col md="6">
        <RenderSetupField formRequest={formRequest} name={field} rule={fields[field]} typeChanged={typeChanged}
                          setTypeChanged={setTypeChanged} savedSettings={savedSettings}
        />
      </Col>
    </Row>
  )
}

const FormSetupField = ({
                          formRequest,
                          setups,
                          setupsFull,
                          typeChanged,
                          setTypeChanged,
                          savedSettings
                        }) => {

  return (
    <div>
      <Row>
        <Col md="12"><h5>{formRequest} Setup</h5></Col>
      </Row>
      {
        Object.keys(setups[formRequest]).map((field, j) =>
          <div key={j}>
            <FormSetupFieldGroup formRequest={formRequest} fields={setups[formRequest]} field={field}
                                 typeChanged={typeChanged} setTypeChanged={setTypeChanged}
                                 setupsFull={setupsFull} savedSettings={savedSettings}
            />
          </div>)
      }
    </div>
  )
}