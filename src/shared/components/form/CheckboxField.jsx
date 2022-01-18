import { Field } from 'react-final-form';
const CheckboxField = ( {name, label, onChange} ) => {
    return (
        <Field
            name={name}
            type="checkbox"
            onChange={onChange}
        >
        {({ input, meta }) => (
            <label className="checkbox-btn flex-column" htmlFor={name}>
                <span>
                    <input className="checkbox-btn__checkbox" id={name} {...input} />
                    <span className="checkbox-btn__checkbox-custom">
                        <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path></svg>
                    </span>
                    <span className="checkbox-btn__label">{label}</span>
                </span>
                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
            </label>
        )}
        </Field>
    )
}
export default CheckboxField;