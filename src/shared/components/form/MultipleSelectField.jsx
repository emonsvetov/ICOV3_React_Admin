import React from 'react';
import PropTypes from 'prop-types';
import {renderComponentField} from '@/shared/components/form/FormField';
import Select from '@material-ui/core/Select';

export const MultipleSelectField = ({fieldValue, name, placeholder, options, setValue, type}) => {

  const handleChangeNative = (event) => {
    const tmpOptions = event.target.options;
    const tmpValue = [];
    for (let i = 0, l = tmpOptions.length; i < l; i += 1) {
      if (tmpOptions[i].selected) {
        tmpValue.push(tmpOptions[i].value);
      }
    }
    setValue(tmpValue);
  };
  let isNative;
  if (type === 'native') {
    isNative = true;
  }

  return (
      <>
      {isNative &&
        <Select
          multiple
          native
          name={name}
          value={fieldValue}
          onChange={handleChangeNative}
          label="Native"
          inputProps={{
            id: name + '-id',
          }}
        >
          {options.map((optionObject) => (
            <option key={optionObject.value} value={optionObject.value}>
              {optionObject.label}
            </option>
          ))}
        </Select>
      }
      </>
  );
};

MultipleSelectField.propTypes = {
  setValue: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  fieldValue: PropTypes.array
};

MultipleSelectField.defaultProps = {
  placeholder: '',
  options: [],
};

export default renderComponentField(MultipleSelectField);
