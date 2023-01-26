import React, {useEffect, useState} from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Col, Container, Row, Card, CardBody, } from 'reactstrap';
import MainModalWrapper from './View/components/MainModalWrapper';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getProgramAction } from '@/redux/actions/programActions';

const PUBLIC_URL = `${process.env.PUBLIC_URL}`;
const GeneralIcon = `${PUBLIC_URL}/img/icon/general.svg`;
const AccountingIcon = `${PUBLIC_URL}/img/icon/accounting.svg`;
const AwardingIcon = `${PUBLIC_URL}/img/icon/awarding.svg`;
const InvoiceIcon = `${PUBLIC_URL}/img/icon/invoice.svg`;
const EngagementIcon = `${PUBLIC_URL}/img/icon/engagement.svg`;
const MerchantsIcon = `${PUBLIC_URL}/img/icon/merchants.svg`;
const EventsIcon = `${PUBLIC_URL}/img/icon/events.svg`;

const ProgramView = ( {dispatch, organization, program} ) => {
    const { id } = useParams()
    const [modalName, setModalName] = useState(null)
    const [isOpen, setOpen] = useState(false);
    let history = useHistory();
    useEffect(() => {
        if(id && organization?.id)    {
            const {id: organizationId} = organization //store as
            dispatch(getProgramAction(organizationId, id))
        }
    },[id, organization])

    const toggle = (name=null) => {
        if( name ) setModalName(name)
        setOpen(prevState => !prevState)
    }

  if( !program || !organization ) return 'Loading...'
  
  const {id: organizationId, name: organizationName} = program.organization
//   console.log(data)
  return (
    <Container className="program-view">
      <Row>
        <Col md={6}>
          <h3 className="page-title">All Programs</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/program">Programs</Link> / {program.name}</h3>
          <p> (Organization: {organizationId} - {organizationName})</p>
        </Col>
        <Col md={6} className='text-right'>
        <span style={{maxWidth:'200px'}} className="btn btn-primary account__btn account__btn--small" onClick={()=>toggle('addprogram')}>Add sub program</span>
        </Col>
      </Row>
      <Row>
        <Col md="6" lg="4" xl="4">
            <Card>
                <CardBody>
                    <Row onClick={()=>{toggle('general')}}>
                        <Col md={3} className='col-left'>
                            <img src={GeneralIcon} className="card-img-top" alt="General" />
                        </Col>
                        <Col md={9} className='col-right pl-0'>
                            <h5>General</h5>
                            <p>Description</p>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <MainModalWrapper organization={organization} name={modalName} isOpen={isOpen} setOpen={setOpen} toggle={toggle} programId={id} />
        </Col>
        <Col md="6" lg="4" xl="4">
            <Card>
                <CardBody>
                    <Row onClick={()=>{toggle('merchants')}}>
                        <Col md={3} className='col-left'>
                            <img src={MerchantsIcon} className="card-img-top" alt="Merchants" />
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
                            <img src={InvoiceIcon} className="card-img-top" alt="Invoice and Statement" />
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
                            <img src={AccountingIcon} className="card-img-top" alt="Accounting" />
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
                            <img src={AwardingIcon} className="card-img-top" alt="Awarding and Points" />
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
                            <img src={EngagementIcon} className="card-img-top" alt="Engagement" />
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
                            <img src={EventsIcon} className="card-img-top" alt="Events" />
                        </Col>
                        <Col md={9} className='col-right pl-0'>
                            <h5>Events</h5>
                            <p>Description</p>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
        <Col md="6" lg="4" xl="4">
            <Card>
                <CardBody>
                    <Row onClick={()=>{history.push(`/program/${id}/users`)}}>
                        <Col md={3} className='col-left'>
                            <img src={EventsIcon} className="card-img-top" alt="Users" />
                        </Col>
                        <Col md={9} className='col-right pl-0'>
                            <h5>Users</h5>
                            <p>Description</p>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
        <Col md="4" lg="4" xl="4">
            <Card>
                <CardBody>
                    <Row onClick={()=>{history.push(`/program/${id}/subprograms`)}}>
                        <Col md={3} className='col-left'>
                            <img src={EventsIcon} className="card-img-top" alt="Sub Programs" />
                        </Col>
                        <Col md={9} className='col-right pl-0'>
                            <h5>Sub Programs</h5>
                            <p>Description</p>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
      </Row>
      <Row>
        <Col md="4" lg="4" xl="4">
            <Card>
                <CardBody>
                    <Row>
                        <Col md={3} className='col-left'>
                            <img src={EventsIcon} className="card-img-top" alt="Domains" />
                        </Col>
                        <Col md={9} className='col-right pl-0'>
                            <h5>Domains</h5>
                            {
                                program.domains.length > 0 && 
                                program.domains.map( (domain, i) => {
                                    return <li key={`domain-list-${i}`}><Link className="" to={`/domains/view/${domain.id}`}>{domain.name}</Link></li>
                                })
                            }
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
        <Col md="4" lg="4" xl="4">
            <Card>
                <CardBody>
                    <Row onClick={()=>{toggle('themesettings')}}>
                        <Col md={3} className='col-left'>
                            <img src={EventsIcon} className="card-img-top" alt="Sub Programs" />
                        </Col>
                        <Col md={9} className='col-right pl-0'>
                            <h5>Theme Settings</h5>
                            <p>Theme/template related settings</p>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
      </Row>
    </Container>
)}

export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
    organization: state.organization,
    program: state.program
  }))(ProgramView));
