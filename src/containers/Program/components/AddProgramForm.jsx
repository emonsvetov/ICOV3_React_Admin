import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import EmailOutlineIcon from 'mdi-react/EmailOutlineIcon';
import renderRadioButtonField from '@/shared/components/form/RadioButton';

const AddProgramForm = ( {onSubmit, loading, errors} ) => {

    // useEffect(() => {
    // });

    const validate = values => {
        let errors = {};
        if (!values.name) {
            errors.name = "Program name is required";
        }
        if (!values.program_type) {
            errors.program_type = "Program type is required";
        }
        return errors;
    }
  
    // const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    // const onSubmit = async values => {
    //   await sleep(400);
    //   window.location = '/forgot/checkemail'
    // }

    return (
    <Form
        onSubmit={onSubmit}
        validate={validate}
        initialValues={{
            program_type: "Employee"
        }}
    >
    {({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="form" onSubmit={handleSubmit}>
        {errors && 
            <div className="alert alert-danger fade show w100" role="alert">
                <div className="alert__content">
                <p>{errors.message}</p>
                <ul>
                {
                    Object.keys(errors.errors).map(function(k){
                        return <li key={k}>{errors.errors[k]}</li>
                    })
                }
                </ul>
                </div>
            </div>
        }
        <Field name="name">
        {({ input, meta }) => (
            <div className="form__form-group">
                <span className="form__form-group-label">Program name</span>
                <div className="form__form-group-field">
                    <div className="form__form-group-row">
                        <input type="text" {...input} placeholder="Program name" />
                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                    </div>
                </div>
            </div>
        )}
        </Field>

        <div className="mb-3">
            <div className="form__form-group form__form-group-field">
                <Field
                    name="program_type"
                    component={renderRadioButtonField}
                    label="Employee"
                    radioValue="Employee"
                />
            </div>
            <div className="form__form-group form__form-group-field">
                <Field
                    name="program_type"
                    component={renderRadioButtonField}
                    label="Resident"
                    radioValue="Resident"
                />
            </div>
        </div>

        <button type="submit" className="btn btn-primary account__btn account__btn--small" disabled={loading}>Create Program</button>
      </form>
    )}
  </Form>
)}

export default AddProgramForm;
