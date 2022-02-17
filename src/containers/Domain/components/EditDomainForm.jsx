import React, {useState, useEffect} from 'react';
import { Form, Field } from 'react-final-form';
import CheckboxField from '@/shared/components/form/CheckBox';
import { Row, Col, ButtonToolbar, Button, Spinner } from 'reactstrap';
import formValidation from "@/shared/validation/domain";
import { Link } from 'react-router-dom'
import axios from 'axios';

import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"
import { useParams, useHistory } from "react-router-dom";
import {isEmpty} from '@/shared/helpers'

const EditDomainForm = ({organization}) => {

    const fetchDomain = async ( id ) => {
        try {
            const response = await axios.get(`/organization/${organization.id}/domain/${id}`);
            return response.data;
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    }

    // alert(JSON.stringify(organization))

    const dispatch = useDispatch()
    let { id } = useParams();

    const [loading, setLoading] = useState(false)
    const [loadingGenerateKey, setLoadingGenerateKey] = useState(false)
    const [keygenerated, setKeygenerated] = useState(false)
    const [errors, setErrors] = useState(null)
    const history = useHistory();
    let [domain, setDomain] = useState(null);

    useEffect( ()=>{
        if( !isEmpty(organization) ) {
            setLoading(true)
            fetchDomain( id )
            .then( response => {
                setDomain(response)
                setLoading(false)
            })
        }
    }, [id, organization])

    const onSubmit = values => {
        setLoading(true)
        axios.put(`/organization/${organization.id}/domain/${id}`, values)
        .then( (res) => {
            if(res.status == 200)  {
                dispatch(sendFlashMessage('Domin udpated successfully', 'alert-success'))
                history.goBack()
            }
        })
        .catch( error => {
            console.log(error.response.data);
            dispatch(sendFlashMessage(<ApiErrorMessage errors={error.response.data} />, 'alert-danger'))
            setLoading(false)
        })
    }
    
    const onClickCancel = () => {
        history.goBack();
    }
    
    const onChangeField = (field, value) => {
        //patch domain object with updated field
        const newDomain = {...domain, ...{[field]:value}}
        setDomain(newDomain)
    }
    
    const generateSecretKey = (e) => {
        e.preventDefault()
        setLoadingGenerateKey(true)
        axios.get(`/organization/${organization.id}/domain/${id}/generateSecretKey`)
        .then( (res) => {
            console.log(res);
            if( res.status == 200 )  {
                dispatch(sendFlashMessage('Secret Key generate successfully', 'alert-success'))
                const newDomain = {...domain, ...{secret_key: res.data.secret_key}}
                setDomain( newDomain )
                setLoadingGenerateKey(false)
                setKeygenerated(true)
            }
        })
        .catch( error => {
            console.log(error.response.data);
            dispatch(sendFlashMessage('Secret Key generate could not be generated', 'alert-danger'))
            setLoadingGenerateKey(false)
        })
    }

    if( loading || !domain ) return <p>Loading...</p>

    
    return (
    <Form
        onSubmit={onSubmit}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={domain}
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
                    <Button type="submit" disabled={loading || (pristine && !keygenerated)} className="btn btn-primary" color="#ffffff">Save</Button>
                </ButtonToolbar>
            </Col>
        </Row>
        <Row>
            <Col md="6" >
                <Field name="name"
                parse={
                    (value) => {
                        onChangeField('name', value);
                        return value
                    }
                }>
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
            <Col md="6" >
                <Field name="secret_key">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Secret Key</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row position-relative">
                                <input type="text" {...input} placeholder="Secret Key" readOnly/>
                                {loadingGenerateKey && <Spinner animation="border" size="sm" className='input-spinner' variant="warning" />}
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>
            </Col>
            <Col md="6" >
                <div className="form__form-group">
                    <span className="form__form-group-label"></span>
                    <div className="form__form-group-field h-ji87uhh">
                        <div className="form__form-group-row">
                            <Link to={'#generateSecretKey'} disabled={loading} onClick={generateSecretKey}>Generate Secret Key</Link>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
      
    </form>
    )}
  </Form>
)}

export default EditDomainForm;
