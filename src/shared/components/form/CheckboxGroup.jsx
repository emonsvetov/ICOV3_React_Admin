import {inArray} from '@/shared/helpers';

const CheckboxGroup = ({fields, options}) => {
    // console.log(fields)
    // console.log(options)
    // console.log(fields.value)
    const toggle = (event, option) => {
        if (event.target.checked) {
            fields.push(option);
        } else {
            console.log(option)
            console.log(fields.value)
            const index = fields.value.indexOf(option)
            console.log(index)
            fields.remove( index );
        }
    };
    return (
        <>
        {options.map(option => (
            <div key={`checkboxgroup-item-${fields.name}-${option.id}`} className={`checkboxgroup-item-${fields.name}`}>
              <div class="form__form-group-input-wrap"><label class="checkbox-btn "><input class="checkbox-btn__checkbox" type="checkbox" onChange={event => toggle(event, option.id)} checked={inArray(option.id, fields.value)} /><span class="checkbox-btn__checkbox-custom"><svg class="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path></svg></span><span class="checkbox-btn__label">{option.name}</span></label></div>
            </div>
        ))}
        </>
        
    )
}

export default CheckboxGroup