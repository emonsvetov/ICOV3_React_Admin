import React, {useState, useEffect} from 'react';
import { Form, Field } from 'react-final-form';
import CheckboxField from '@/shared/components/form/CheckBox';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import formValidation from "@/shared/validation/merchants/addMerchant";
import renderSelectField from '@/shared/components/form/Select';
import axios from 'axios';

import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import { useParams, useHistory } from "react-router-dom";


const fetchDomain = async ( id ) => {
    try {
        const response = await axios.get(`/domain/${id}`);
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

const EditDomainForm = () => {

    const dispatch = useDispatch()
    let { id } = useParams();

    const [loading, setLoading] = useState(false)
    const [useTango, setUseTango] = useState(false)
    const [errors, setErrors] = useState(null)
    const history = useHistory();
    let [domain, setDomain] = useState(null);

    useEffect( ()=>{
        setLoading(true)
        setDomain({name:"residentgifts.incentco.com"})
        setLoading(false)
        // fetchDomain( id )
        // .then( response => {
        //     setDomain(response)
        //     setLoading(false)
        // })
    }, [id])

    const onChangeUseTangoAPI = () => {
        setUseTango( !useTango )
    }

    const onSubmit = values => {
    
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
    
    const onClickCancel = () => {
        history.goBack();
    }

    if( loading || !domain ) return <p>Loading...</p>

    
    return (
    <Form
        onSubmit={onSubmit}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={{
            name:domain.name,
            secret_key: '45d1032b17576da7bc4c2ec692028eb908e41db6'
        }}
    >
    {({ handleSubmit, form, submitting, pristine, values }) => (
    <form className="form" onSubmit={handleSubmit}>
        {errors && 
            <div className="alert alert-danger fade show w100 mb-4" role="alert">
                <div className="alert__content">{errors}</div>
            </div>
        }
        <Row className='w100'>
            <Col md="6" lg="6" xl="6">
                <h3 className="mb-4">Edit Domain</h3>
            </Col>
            <Col md="6" lg="6" xl="6" className='text-right'>
                <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button outline color="primary" className="mr-3" onClick={onClickCancel}>Cancel</Button>{' '}
                    <Button type="submit" disabled={loading || pristine} className="btn btn-primary" color="#ffffff">Save</Button>
                </ButtonToolbar>
            </Col>
        </Row>
        <Row>
            <Col md="12" >
                <Field name="name">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Domain Name</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Domain Name" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>
            </Col>
        </Row>
        <Row>
            <Col md="12" >
                <Field name="secret_key">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Secret Key</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Domain Name" readOnly/>
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

export default EditDomainForm;
