import React, {useEffect, useState} from 'react';
import { Link, useParams } from 'react-router-dom';
import { Col, Container, Row, Card, CardBody, } from 'reactstrap';
import Alert from '@/shared/components/Alert';
import MainModalWrapper from './ProgramView/components/MainModalWrapper';
import axios from 'axios'

const PUBLIC_URL = `${process.env.PUBLIC_URL}`;
const GeneralIcon = `${PUBLIC_URL}/img/icon/general.svg`;
const AccountingIcon = `${PUBLIC_URL}/img/icon/accounting.svg`;
const AwardingIcon = `${PUBLIC_URL}/img/icon/awarding.svg`;
const InvoiceIcon = `${PUBLIC_URL}/img/icon/invoice.svg`;
const EngagementIcon = `${PUBLIC_URL}/img/icon/engagement.svg`;
const MerchantsIcon = `${PUBLIC_URL}/img/icon/merchants.svg`;
const EventsIcon = `${PUBLIC_URL}/img/icon/events.svg`;

const ProgramView = () => {
    const { id } = useParams()
    const [message, setMessage] = useState('')
    const [data, setData] = useState(null)
    const [modalName, setModalName] = useState(null)
    const [isOpen, setOpen] = useState(false)
    useEffect(() => {
        checkFlashMessage()
        fetchProgramData()
    },[])

    const fetchProgramData = async() => {
        try {
            const response = await axios.get(`/organization/1/program/${id}`);
            // console.log(response)
            setData(response.data)
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    };
    const checkFlashMessage = () => {
        const params = new URLSearchParams(window.location.search)
        let message = params.get('message')
        if( message ) {
            setMessage(message)
        }
    }
    const toggle = (name=null) => {
        if( name ) setModalName(name)
        setOpen(prevState => !prevState)
    }

  if( !data ) return 'Loading...'
  return (
    <Container className="program-view">
      <Row>
        <Col md={12}>
          <h3 className="page-title">All Programs</h3>
          <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/program">Programs</Link> / {data.name}</h3>
          {message !== "" && <Alert color="success">{message}</Alert>}
        </Col>
      </Row>
      <Row>
        <Col md="6" lg="4" xl="4">
            <Card>
                <CardBody>
                    <Row onClick={()=>{toggle('general')}}>
                        <Col md={3} className='col-left'>
                            <img src={GeneralIcon} class="card-img-top" alt="General" />
                        </Col>
                        <Col md={9} className='col-right pl-0'>
                            <h5>General</h5>
                            <p>Description</p>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <MainModalWrapper data={data} name={modalName} isOpen={isOpen} setOpen={setOpen} toggle={toggle} programId={id} />
        </Col>
        <Col md="6" lg="4" xl="4">
            <Card>
                <CardBody>
                    <Row onClick={()=>{toggle('merchants')}}>
                        <Col md={3} className='col-left'>
                            <img src={MerchantsIcon} class="card-img-top" alt="Merchants" />
                        </Col>
                        <Col md={9} className='col-right pl-0'>
                            <h5>Merchants</h5>
                            <p>Description</p>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
        <Col md="6" lg="4" xl="4">
            <Card>
                <CardBody>
                    <Row onClick={()=>{toggle('invoices')}}>
                        <Col md={3} className='col-left'>
                            <img src={InvoiceIcon} class="card-img-top" alt="Invoice and Statement" />
                        </Col>
                        <Col md={9} className='col-right pl-0'>
                            <h5>Invoice and Statement</h5>
                            <p>Description</p>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
      </Row>
      <Row>
        <Col md="6" lg="4" xl="4">
            <Card>
                <CardBody>
                    <Row onClick={()=>{toggle('accounting')}}>
                        <Col md={3} className='col-left'>
                            <img src={AccountingIcon} class="card-img-top" alt="Accounting" />
                        </Col>
                        <Col md={9} className='col-right pl-0'>
                            <h5>Accounting</h5>
                            <p>Description</p>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
        <Col md="6" lg="4" xl="4">
            <Card>
                <CardBody>
                    <Row onClick={()=>{toggle('awarding')}}>
                        <Col md={3} className='col-left'>
                            <img src={AwardingIcon} class="card-img-top" alt="Awarding and Points" />
                        </Col>
                        <Col md={9} className='col-right pl-0'>
                            <h5>Awarding and Points</h5>
                            <p>Description</p>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
        <Col md="6" lg="4" xl="4">
            <Card>
                <CardBody>
                    <Row onClick={()=>{toggle('engagement')}}>
                        <Col md={3} className='col-left'>
                            <img src={EngagementIcon} class="card-img-top" alt="Engagement" />
                        </Col>
                        <Col md={9} className='col-right pl-0'>
                            <h5>Engagement</h5>
                            <p>Description</p>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
      </Row>
      <Row>
        <Col md="6" lg="4" xl="4">
            <Card>
                <CardBody>
                    <Row onClick={()=>{toggle('events')}}>
                        <Col md={3} className='col-left'>
                            <img src={EventsIcon} class="card-img-top" alt="Events" />
                        </Col>
                        <Col md={9} className='col-right pl-0'>
                            <h5>Events</h5>
                            <p>Description</p>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
      </Row>
    </Container>
)}

export default ProgramView;
