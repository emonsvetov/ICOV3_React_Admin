import React, {useState} from 'react';
import { Form, Field } from "react-final-form";
import { Card, CardBody, Col, Row, ButtonToolbar} from 'reactstrap';
import {answerYesNo} from '@/shared/helpers'
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import axios from 'axios'
import { Link } from 'react-router-dom'
import formValidation from "@/shared/validation/domain";

const DomainDetails = ( {data} ) => {
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    let [domain, setDomain] = useState(data)

    const onClickDelete = (e) => {
        e.preventDefault()
        setLoading( true )
        axios.delete(`/domain/${domain.id}`)
        .then( (res) => { 
            // console.log(res)
            if(res.status == 200)  {
                window.location = `/domains?message=domain deleted successfully!`
            }
        })
        .catch( error => {
            console.log(error)
            setLoading( false )
            dispatch(sendFlashMessage(JSON.stringify(error.response.data), 'alert-danger'))
            // throw new Error(`API error:${e?.message}`);
        })
    }    
    
    return(
        <>
        <Row>
            <Col md={12}>
                <Card>
                    <CardBody className='infoview'>
                        <Row>
                            <Col md="6" lg="6" xl="6">
                                <h3 className="mb-4">Domain Details</h3>
                            </Col>
                            <Col md="6" lg="6" xl="6" className="text-right">
                                <ButtonToolbar className="flex justify-content-right w100">
                                    <Link className='text-blue' to={`/domains/edit/${domain.access_key}`}>Edit</Link>
                                    <Link disabled={loading} className="text-danger" onClick={(e) => {if(window.confirm('Are you sure to delete this domain?')){onClickDelete(e)}}}>Delete</Link>
                                    
                                </ButtonToolbar>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                Domain Name:
                            </Col>
                            <Col md="8" lg="8" xl="8" sm="8">
                                {domain.name}
                            </Col>
                        </Row>
                        <Row>
                            <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                AWS Route53:
                            </Col>
                            <Col md="8" lg="8" xl="8" sm="8">
                                {'Check Status'}
                            </Col>
                        </Row>
                        <Row>
                            <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                Secret Key:
                            </Col>
                            <Col md="8" lg="8" xl="8" sm="8">
                                6898ba6dc032575a043ec651332ff653612ea2d9
                            </Col>
                        </Row>
                        <Row>
                            <Col md="4" lg="4" xl="4" sm="4" className='label'>
                            Access Key:
                            </Col>
                            <Col md="8" lg="8" xl="8" sm="8">
                                {domain.access_key}
                            </Col>
                        </Row>
                        
                    </CardBody>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col md={12}>
                <Card>
                    <CardBody className='infoview'>
                        <Form
                            onSubmit={() =>{}}
                            validate={(values) => formValidation.validateForm(values)}
                            initialValues={{}}
                        >
                            {({ handleSubmit, form, submitting, pristine, values }) => (
                            <form className="form" onSubmit={handleSubmit}>
                                <Row>
                                    <Col md="6" lg="6" xl="6">
                                        <h3 className="mb-4">Additional IP Addresses</h3>
                                    </Col>
                                    <Col md="6" lg="6" xl="6" className="text-right">
                                        <ButtonToolbar className="flex justify-content-right w100">
                                            <Link className='text-blue' onClick={()=>{}}>Add</Link>
                                            
                                        </ButtonToolbar>
                                    </Col>
                                </Row>
                                {error && (
                                <div
                                    className="alert alert-danger fade show w100 mb-4"
                                    role="alert"
                                >
                                    <div className="alert__content">{error}</div>
                                </div>
                                )}
                                
                                <Row>
                                <Col md="6" lg="4" xl="4">
                                    <Field name="address">
                                    {({ input, meta }) => (
                                        <div className="form__form-group">
                                        
                                        <div className="form__form-group-field">
                                            <div className="form__form-group-row">
                                            <input
                                                type="text"
                                                {...input}
                                                placeholder="New Address"
                                            />
                                            {meta.touched && meta.error && (
                                                <span className="form__form-group-error">
                                                {meta.error}
                                                </span>
                                            )}
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
                    
                    </CardBody>
                </Card>
            </Col>
        </Row>
        </>
    )
}

export default DomainDetails