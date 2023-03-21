import {useState} from 'react';
import { Card, CardBody, Col, Row, Button, Spinner} from 'reactstrap';
import { Form, Field } from "react-final-form";
import { Link } from 'react-router-dom'
import {isValidIPAddress} from '@/shared/helpers';
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import axios from 'axios';

const DomainIps = ({ organization, domain}) => {
    const dispatch = useDispatch()

    // console.log(domain)

    const [deleting, setDeleting] = useState(false)
    const [adding, setAdding] = useState(false)
    const [domainIps, setDomainIps] = useState(domain.domain_ips)

    // console.log(domainIps);

    const onSubmitAddIP = (values) => {
        // alert(JSON.stringify(values))
        setAdding(true)
        axios.post(`/organization/${organization.id}/domain/${domain.id}/addip`, values)
        .then( (res) => {
            if(res.status == 200)  {
                const newDomainIps = [...domainIps, ...[res.data.domain_ip]]
                // console.log(newDomainIps);
                setDomainIps(newDomainIps)
                setAdding(false)
                dispatch(sendFlashMessage('Domain IP added successfully!', 'alert-success'))
            }
        })
        .catch( error => {
            dispatch(sendFlashMessage(<ApiErrorMessage errors={error.response.data} />, 'alert-danger'))
            console.log(error.response.data);
            setAdding(false)
        })
    }

    const onClickDeleteIp = (e, id) => {
        e.preventDefault()
        setDeleting( true )
        axios.delete(`/organization/${organization.id}/domain/${domain.id}/domain_ip/${id}`)
        .then( (res) => {
            if(res.status == 200)  {
                const newDomainIps = domainIps.filter(function( obj ) {
                    return obj.id !== id;
                });
                setDeleting( false )
                setDomainIps(newDomainIps)
                dispatch(sendFlashMessage('Domain IP deleted successfully!', 'alert-success'))
            }
        })
        .catch( error => {
            dispatch(sendFlashMessage(<ApiErrorMessage errors={error.response.data} />, 'alert-danger'))
            // console.log(error.response.data);
            // setLoading(false)
        })
    }

    const RenderDomainIp = ({domain_ip}) => {
        return (
            <Row>
                <Col md="4" lg="4" xl="4">{domain_ip.ip_address}</Col>
                <Col md="4" lg="4" xl="4"><Link to={'#delete-ip-address'} disabled={deleting} onClick={(e) => {if(window.confirm('Are you sure to delete this domain?')){onClickDeleteIp(e, domain_ip.id)}}}>Delete</Link> </Col>
            </Row>
        )
    }

    return (
        <Row>
            <Col md={12}>
                <Card>
                    <CardBody className='infoview'>
                        <Form
                            onSubmit={onSubmitAddIP}
                            validate={validate}
                            initialValues={{}}
                        >
                            {({ handleSubmit, form, submitting, pristine, values }) => (
                            <form className="form" onSubmit={handleSubmit}>
                                <Row>
                                    <Col md="6" lg="6" xl="6">
                                        <h3 className="mb-4">Additional IP Addresses</h3>
                                    </Col>
                                </Row>
                                
                                {domainIps.length > 0 &&
                                    <Row>
                                        <Card  className='pb-0 mb-2' style={{borderBottom: '1px solid #f2f4f7'}}>
                                            <CardBody className='pb-0'>
                                                {domainIps.map( (domain_ip, i) => <RenderDomainIp domain_ip={domain_ip} key={`domain-ip-${i}`} />)}
                                            </CardBody>
                                        </Card>
                                    </Row>
                                }
                                
                                <Row className='mt-3'>
                                    <Col md="12" lg="12" xl="12" className='flex-column'>
                                        <Field name="ip_address">
                                        {({ input, meta }) => (
                                            <Row>
                                                <Col md="4" lg="4" xl="4">
                                                    <input
                                                        type="text"
                                                        {...input}
                                                        placeholder="New Address"
                                                    />
                                                    {adding && <Spinner animation="border" size="sm" className='input-spinner' variant="warning" />}
                                                    {meta.touched && meta.error && (
                                                        <span className="form__form-group-error">
                                                        {meta.error}
                                                        </span>
                                                    )}
                                                </Col>
                                                <Col md="4" lg="4" xl="4" className='pl-0'>
                                                    <Button type="submit" disabled={adding} className="btn btn-primary btn-sm" color="#ffffff">Add IP</Button>
                                                </Col>
                                            </Row>
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
    )
}

const validate = values => {
    let errors = {};
    if (!values.ip_address) {
      errors.ip_address = "Please enter an IP address";
    } else if (!isValidIPAddress(values.ip_address)) {
      errors.ip_address = "Please enter a valid IP address";
    }
    return errors;
  }

export default DomainIps