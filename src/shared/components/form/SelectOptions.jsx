import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { renderComponentField } from '@/shared/components/form/FormField';

export const SelectOptionsField = React.forwardRef(({
  fieldOnChange, fieldValue, name, placeholder, options,
}, ref) => {
  const handleChange = (selectedOption) => {
    fieldOnChange(selectedOption);
  };

  return (
    <Select
      name={name}
      value={options.filter(({ value }) => value === fieldValue)}
      onChange={handleChange}
      options={options}
      className="react-select"
      placeholder={placeholder}
      classNamePrefix="react-select"
      ref={ref}
    />
  );
});

SelectOptionsField.propTypes = {
  fieldOnChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  fieldValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ]).isRequired,
};

SelectOptionsField.defaultProps = {
  placeholder: '',
  options: [],
};

export default renderComponentField(SelectOptionsField);
