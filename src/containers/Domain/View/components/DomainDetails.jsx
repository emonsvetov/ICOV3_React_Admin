import React, {useState} from 'react';
import { Card, CardBody, Col, Row, ButtonToolbar} from 'reactstrap';
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import axios from 'axios'
import { Link } from 'react-router-dom'
import DomainIPs from './DomainIps'
// 
const DomainDetails = ( {data, organization} ) => {
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)
    const [resultCheckStatus, setResultCheckStatus] = useState(false)
    const [failResultCheckStatus, setFailResultCheckStatus] = useState(false)
    let [domain, setDomain] = useState(data)

    const checkAWSRouteStatus = (e) => {
        e.preventDefault()
        setLoading( true )
        axios.get(`/organization/${organization.id}/domain/${domain.id}/check-status`)
          .then( (res) => {
              setLoading( false )
              if(res.status === 200)  {
                  let result = res.data.result;
                  if (result.length > 0){
                      let item = result.shift();
                      let ips = [];
                      item.ResourceRecords.forEach((resourceRecord) => {
                          console.log(resourceRecord)
                          ips.push(resourceRecord.Value);
                      });
                      let tmpResultCheckStatus = 'Domain is Registered';
                      tmpResultCheckStatus += '; Pointed to → ' + ips.join(', ');
                      setResultCheckStatus(tmpResultCheckStatus);
                  } else {
                      let tmpResultCheckStatus = 'Domain is not Registered';
                      setFailResultCheckStatus(tmpResultCheckStatus);
                  }
              }
          })
          .catch( error => {
              console.log(error)
              setLoading( false )
              dispatch(sendFlashMessage(JSON.stringify(error.response.data), 'alert-danger'))
              // throw new Error(`API error:${e?.message}`);
          })
    }

    const onClickDelete = (e) => {
        e.preventDefault()
        setLoading( true )
        axios.delete(`/organization/${organization.id}/domain/${domain.id}`)
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
                                    <Link className='text-blue' to={`/domains/edit/${domain.id}`}>Edit</Link>
                                    <Link to={`#`} disabled={loading} className="text-danger" onClick={(e) => {if(window.confirm('Are you sure to delete this domain?')){onClickDelete(e)}}}>Delete</Link>
                                    
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
                                {resultCheckStatus &&
                                  <div style={{color: 'green'}}>{resultCheckStatus}</div>
                                }
                                {failResultCheckStatus &&
                                  <div style={{color: 'red'}}>{failResultCheckStatus}</div>
                                }
                                {!resultCheckStatus && !failResultCheckStatus &&
                                  <Link to={'#/'} onClick={checkAWSRouteStatus}>Check Status</Link>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                Secret Key:
                            </Col>
                            <Col md="8" lg="8" xl="8" sm="8">
                                {domain.secret_key}
                            </Col>
                        </Row>
                        <Row>
                            <Col md="4" lg="4" xl="4" sm="4" className='label'>
                            Access Key:
                            </Col>
                            <Col md="8" lg="8" xl="8" sm="8">
                                {domain.id}
                            </Col>
                        </Row>
                        
                    </CardBody>
                </Card>
            </Col>
        </Row>
        <DomainIPs domain={domain} organization={organization} />
        </>
    )
}

export default DomainDetails