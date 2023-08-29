import React, {useState, useEffect} from 'react';
import { Form, Field } from 'react-final-form';
import {Link} from 'react-router-dom';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import formValidation from "@/shared/validation/merchants/addMerchant";

import axios from 'axios';
import { useParams, useHistory } from "react-router-dom";

const STATUS = [
    {label: 'Pending', value: 'pending'},
    {label: 'Cancelled', value: 'cancelled'},
    {label: 'Shipped', value: 'shipped'},
]

const fetchTango = async ( id ) => {
    try {
        const response = await axios.get(`/tango/${id}`);
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

const TangoOrderDetail = () => {
    let { id } = useParams();

    const [loading, setLoading] = useState(false)
    
    const [errors, setErrors] = useState(null)
    const history = useHistory();
    let [tango, setTango] = useState({order_state: "Successfully Submitted!"});

    useEffect( ()=>{
        setLoading(true)
        
        // fetchTango( id )
        // .then( response => {
        //     setTango(response)
        //     setLoading(false)
        // })
        setLoading(false)
    }, [id])


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

    if( loading || !tango ) return <p>Loading...</p>

    return (
    <Form
        onSubmit={onSubmit}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={{
            
        }}
    >
    {({ handleSubmit, form, submitting, pristine, values }) => (
    <form className="form form--horizontal" onSubmit={handleSubmit}>
        {errors && 
            <div className="alert alert-danger fade show w100 mb-4" role="alert">
                <div className="alert__content">{errors}</div>
            </div>
        }
        <Row className='w100'>
            <Col md="6" lg="6" xl="6">
                <h3 className="mb-4">Edit Tango Order</h3>
            </Col>
            <Col md="6" lg="6" xl="6" className='text-right'>
                <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button outline color="primary" className="mr-3" onClick={onClickCancel}>Cancel</Button>{' '}
                    <Button type="submit" disabled={loading || pristine} className="btn btn-primary" color="#ffffff">Save</Button>
                </ButtonToolbar>
            </Col>
        </Row>
        <h5 className='thick size16 mb-4'>Order Information</h5>
        
        <Row className='w100'>
            <Col md={6}>
                <Field name="id">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">External Tango Order ID</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                {" RA220126-1278861-89"}
                            </div>
                        </div>
                    </div>
                )}
                </Field>  
            </Col>
            <Col md={6}>
                <Field name="tango_order">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Physical Order ID</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <Link to={`/physical-orders/edit/${id}`}>{id}</Link>
                            </div>
                        </div>
                    </div>
                )}
                </Field>  
            </Col>
          
        </Row>
        <Row className='w100'>
            <Col md={6}>
                <Field name="submitted_at">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Submitted At</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                            {"2022-01-26 13:39:50"}
                            </div>
                        </div>
                    </div>
                )}
                </Field>  
            </Col>
            <Col md={6}>
                <Field name="order_state">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Order State</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                {tango.order_state}
                            </div>
                        </div>
                    </div>
                )}
                </Field>  
            </Col>
            
        </Row>
       
        <Row>
            <Col md="6" >
                <div className="form__form-group">
                    <span className="form__form-group-label">Process Log</span>
                    <div className="form__form-group-field">
                        <Field
                        name="process_log"
                        component="textarea"
                        type="text"
                        readOnly
                        />
                    </div>
                </div>
            </Col>
            
        </Row>
        <h5 className='thick size16 mb-4'>Merchant</h5>
    </form>
    
    )}
  </Form>
)}

export default TangoOrderDetail;
