import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row, Card, CardBody, } from 'reactstrap';
import Alert from '@/shared/components/Alert';
import GeneralIcon from '@/shared/img/icon/general.svg';
import AccountingIcon from '@/shared/img/icon/accounting.svg';
import AwardingIcon from '@/shared/img/icon/awarding.svg';
import InvoiceIcon from '@/shared/img/icon/invoice.svg';
import EngagementIcon from '@/shared/img/icon/engagement.svg';
import MerchantsIcon from '@/shared/img/icon/merchants.svg';
import MainModalWrapper from './ResidentGifts/components/MainModalWrapper';

const ResidentGifts = () => {
    useEffect(() => {
        checkFlashMessage()
        getProgramId()
    })
    const [message, setMessage] = useState('')
    const [id, setId] = useState(null)
    const [modalName, setModalName] = useState(null)
    const [isOpen, setOpen] = useState(false)
    const getProgramId = () => {
        const params = new URLSearchParams(window.location.search)
        let id = params.get('id')
        if( id ) {
            setId(id)
        }
    }
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
  return (
    <Container className="resident-gifts">
      <Row>
        <Col md={12}>
          <h3 className="page-title">All Programs</h3>
          <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/program">Programs</Link> / Resident Gifts</h3>
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
            <MainModalWrapper name={modalName} isOpen={isOpen} setOpen={setOpen} toggle={toggle} programId={id} />
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
                    <Row>
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
                    <Row>
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
    </Container>
)}

export default ResidentGifts;
