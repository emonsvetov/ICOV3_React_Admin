import React, {useState} from 'react';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import { useParams, useHistory } from "react-router-dom";
import formValidation from "@/shared/validation/program-add";
import axios from 'axios';

const AddDomainForm = ( ) => {

    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const onClickCancel = () => {
        history.goBack();
    } 
    const onSubmitAddDomain = values => {
        
        // values = {...values, 
        //     ...{
        //         setup_fee: 100,
        //         is_pay_in_advance: 1, 
        //         is_invoice_for_rewards: 1 ,
        //         is_add_default_merchants: 1,
        //         program_id: program ? program.id : null
        //     }
        // }


        // setLoading(true)
        // axios.post('/organization/1/program', values)
        // .then( (res) => {
        
        //     if(res.status == 200)  {
        
        //         window.location = '/program?message=New program added successfully!'
        //     }
        // })
        // .catch( error => {
        //     console.log(error.response.data);
        //     setErrors(error.response.data);
        //     setLoading(false)
        // })
    }

    return (
    <Form
        onSubmit={onSubmitAddDomain}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={{        }}
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
        <Row className='w100'>
            <Col md="6" lg="6" xl="6">
                <h3 className="mb-4">Add Domain</h3>
            </Col>
            <Col md="6" lg="6" xl="6" className='text-right'>
                <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button outline color="primary" className="mr-3" onClick={onClickCancel}>Cancel</Button>{' '}
                    <Button type="submit" disabled={loading || pristine} className="btn btn-primary" color="#ffffff">Save</Button>
                </ButtonToolbar>
            </Col>
        </Row>
        <Row>
            <Col md="6" lg="4" xl="4">
                <Field name="name">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Domain </span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Domain name" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>
            </Col>
        </Row>
        
      </form>
    )}
  </Form>
)}

export default AddDomainForm;
