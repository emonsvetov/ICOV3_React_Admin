import React, {useState} from 'react'
import DatePicker from 'react-datepicker';

const RenderDatePicker = ({ dueDate, onChange }) => {
  const [startDate, setStartDate] = useState(dueDate);
  const handleChange = (date) => {
      setStartDate(date);
      onChange(date);
  };
  return(
    <DatePicker
      dateFormat="MM/dd/yyyy"
      selected={startDate}
      onChange={handleChange}
      popperPlacement="center"
      dropDownMode="select"
      className="form__form-group-datepicker"
    />
  )
}

export default RenderDatePicker;
