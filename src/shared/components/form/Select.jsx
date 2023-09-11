import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { renderComponentField } from '@/shared/components/form/FormField';

export const SelectField = React.forwardRef(({
  onChange, value, name, placeholder, options, isClearable
}, ref) => {
  const handleChange = (selectedOption) => {
    onChange(selectedOption);
  };

  if(options){
    for (const [key, val] of Object.entries(options)) {
      if (val.value == value){
          value = val;
          break;
      }
    }
  }

  return (
    <Select
      name={name}
      value={value}
      onChange={handleChange}
      options={options}
      clearable={false}
      className="react-select"
      placeholder={placeholder}
      classNamePrefix="react-select"
      isClearable={isClearable}
      ref={ref}
    />
  );
});

SelectField.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ]).isRequired,
};

SelectField.defaultProps = {
  placeholder: '',
  options: [],
};

export default renderComponentField(SelectField);
