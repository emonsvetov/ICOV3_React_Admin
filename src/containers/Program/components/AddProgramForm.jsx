import React, {useState} from 'react';
import { Row, Col } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import renderRadioButtonField from '@/shared/components/form/RadioButton';
import formValidation from "@/shared/validation/program-add";
import axios from 'axios';

const AddProgramForm = ( {program, organization} ) => {

    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSubmitAddProgram = values => {
        // alert(values);
        // console.log(values);
        // alert(JSON.stringify(values))
        // console.log(program)
        const organization_id = (program && program?.organization_id) ? program.organization_id : organization.id
        // console.log(organization_id)
        // return;
        values = {...values, 
            ...{
                setup_fee: 100,
                is_pay_in_advance: 1, 
                invoice_for_awards: 0,
                is_add_default_merchants: 1,
                parent_id: program ? program.id : null,
                factor_valuation: 1,
                is_demo: 0
            }
        }

        // alert(JSON.stringify(values))
        // return
        

        setLoading(true)
        axios.post(`/organization/${organization_id}/program`, values)
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

    if( !organization ) return 'Loading...'

    return (
    <Form
        onSubmit={onSubmitAddProgram}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={{
            name: program ? program.name + ' copy' : ''
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

        <button type="submit" className="btn btn-primary account__btn account__btn--small" disabled={loading}>Create Program</button>
      </form>
    )}
  </Form>
)}

export default AddProgramForm;
