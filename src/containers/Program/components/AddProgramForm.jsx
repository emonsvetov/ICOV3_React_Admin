import React, {useState} from 'react';
import { Row, Col } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import renderRadioButtonField from '@/shared/components/form/RadioButton';
import formValidation from "@/shared/validation/program-add";
import axios from 'axios';

const AddProgramForm = ( ) => {

    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSubmitAddProgram = values => {
        // alert(values);
        // console.log(values);
        // alert(JSON.stringify(values))
        // return;
        setLoading(true)
        axios.post('/organization/1/program', values)
        .then( (res) => {
            // console.log(res)
            // console.log(res.status == 200)
            if(res.status == 200)  {
            // var t = setTimeout(window.location = '/', 500)
            window.location = '/program?message=New program added successfully!'
            }
        })
        .catch( error => {
            console.log(error.response.data);
            setErrors(error.response.data);
            setLoading(false)
        })
    }

    return (
    <Form
        onSubmit={onSubmitAddProgram}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={{
            // program_type: "Employee"
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

        <div className="form__form-group label-mb-0">
            <span className="form__form-group-label">Program Type</span>
            <Row className='w100'>
                <Col md="6" lg="6" xl="6">
                    <Field
                        name="type"
                        component={renderRadioButtonField}
                        label="Employee"
                        radioValue="Employee"
                    />
                </Col>
                <Col md="6" lg="6" xl="6" className='hide-error'>
                    <Field
                        name="type"
                        component={renderRadioButtonField}
                        label="Resident"
                        radioValue="Resident"
                    />
                </Col>
            </Row>
        </div>

        <Field name="setup_fee">
        {({ input, meta }) => (
            <div className="form__form-group">
                <span className="form__form-group-label">Setup fee</span>
                <div className="form__form-group-field">
                    <div className="form__form-group-row">
                        <input type="text" {...input} placeholder="Setup fee" />
                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                    </div>
                </div>
            </div>
        )}
        </Field>

        <div className="form__form-group label-mb-0">
            <span className="form__form-group-label">Pay in advance?</span>
            <Row className='w100'>
                <Col md="6" lg="6" xl="6">
                    <Field
                        name="is_pay_in_advance"
                        component={renderRadioButtonField}
                        label="Yes"
                        radioValue="1"
                    />
                </Col>
                <Col md="6" lg="6" xl="6" className='hide-error'>
                    <Field
                        name="is_pay_in_advance"
                        component={renderRadioButtonField}
                        label="No"
                        radioValue="0"
                    />
                </Col>
            </Row>
        </div>

        <div className="form__form-group label-mb-0">
            <span className="form__form-group-label">Invoice for rewards?</span>
            <Row className='w100'>
                <Col md="6" lg="6" xl="6">
                    <Field
                        name="is_invoice_for_rewards"
                        component={renderRadioButtonField}
                        label="Yes"
                        radioValue="1"
                    />
                </Col>
                <Col md="6" lg="6" xl="6" className='hide-error'>
                    <Field
                        name="is_invoice_for_rewards"
                        component={renderRadioButtonField}
                        label="No"
                        radioValue="0"
                    />
                </Col>
            </Row>
        </div>

        <div className="form__form-group label-mb-0">
            <span className="form__form-group-label">Add default merchants?</span>
            <Row className='w100'>
                <Col md="6" lg="6" xl="6">
                    <Field
                        name="is_add_default_merchants"
                        component={renderRadioButtonField}
                        label="Yes"
                        radioValue="1"
                    />
                </Col>
                <Col md="6" lg="6" xl="6" className='hide-error'>
                    <Field
                        name="is_add_default_merchants"
                        component={renderRadioButtonField}
                        label="No"
                        radioValue="0"
                    />
                </Col>
            </Row>
        </div>

        <button type="submit" className="btn btn-primary account__btn account__btn--small" disabled={loading}>Create Program</button>
      </form>
    )}
  </Form>
)}

export default AddProgramForm;
