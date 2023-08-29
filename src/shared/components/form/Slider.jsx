import React from 'react';
import {Slider, styled} from "@material-ui/core" ;
import PropTypes from "prop-types";
import {renderComponentField} from '@/shared/components/form/FormField';

const SliderField = ({
                       onChange,
                       SliderConfig,
                       max,
                       value,
                       name
                     }) => {

  const iOSBoxShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

  const IOSSlider = styled(Slider)(({theme}) => ({
    color: theme.palette.mode === 'dark' ? '#3880ff' : '#3880ff',
    height: 2,
    padding: '15px 0',
    '& .MuiSlider-thumb': {
      top: 6,
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      boxShadow: iOSBoxShadow,
      '&:focus, &:hover, &.Mui-active': {
        boxShadow:
          '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          boxShadow: iOSBoxShadow,
        },
      },
    },
    '& .MuiSlider-valueLabel': {
      fontSize: 12,
      fontWeight: 'normal',
      top: -6,
      left: -20,
      backgroundColor: 'unset',
      color: theme.palette.text.primary,
      '&:before': {
        display: 'none',
      },
      '& *': {
        background: 'transparent',
        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      },
    },
    '& .MuiSlider-track': {
      border: 'none',
    },
    '& .MuiSlider-rail': {
      opacity: 0.5,
      backgroundColor: '#bfbfbf',
    },
    '& .MuiSlider-mark': {
      backgroundColor: '#bfbfbf',
      height: 8,
      width: 1,
      '&.MuiSlider-markActive': {
        opacity: 1,
        backgroundColor: 'currentColor',
      },
    },
  }));

  return (
    <div>
      <div style={{paddingLeft: 22 }}>
        <IOSSlider
          name={name}
          value={value}
          max={max}
          marks={SliderConfig}
          valueLabelDisplay="on"
          onChange={onChange}
          aria-label="Small"
        />
      </div>
    </div>
  );
};

SliderField.propTypes = {
  onChange: PropTypes.func.isRequired,
  SliderConfig: PropTypes.array.isRequired,
  value: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  max: PropTypes.number.isRequired,
};

export default renderComponentField(SliderField);
