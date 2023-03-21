
import {inArray} from '@/shared/helpers';

export const ArrayCheckbox = ({fields, options}) => {
    const toggle = (event, option) => {
        if (event.target.checked) {
            fields.push(option);
        } else {
            const index = fields.value.indexOf(option)
            fields.remove( index );
        }
    };
    return (
        <>
        {options.map(option => (
            <div key={`permission-${option.id}`}>
              <div className="form__form-group-input-wrap"><label className="checkbox-btn "><input className="checkbox-btn__checkbox" type="checkbox" onChange={event => toggle(event, option.id)} checked={inArray(option.id, fields.value)} /><span className="checkbox-btn__checkbox-custom"><svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path></svg></span><span className="checkbox-btn__label">{option.name}</span></label></div>
            </div>
        ))}
        </>
        
    )
}

export default ArrayCheckbox