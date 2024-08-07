import React, {useEffect, useState} from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Col, Container, Row, Card, CardBody, } from 'reactstrap';
import MainModalWrapper from './View/components/MainModalWrapper';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getProgramAction } from '@/redux/actions/programActions';
import axios from 'axios'

const PUBLIC_URL = `${process.env.PUBLIC_URL}`;
const GeneralIcon = `${PUBLIC_URL}/img/icon/general.svg`;
const AccountingIcon = `${PUBLIC_URL}/img/icon/accounting.svg`;
const AwardingIcon = `${PUBLIC_URL}/img/icon/awarding.svg`;
const InvoiceIcon = `${PUBLIC_URL}/img/icon/invoice.svg`;
const EngagementIcon = `${PUBLIC_URL}/img/icon/engagement.svg`;
const MerchantsIcon = `${PUBLIC_URL}/img/icon/merchants.svg`;
const EventsIcon = `${PUBLIC_URL}/img/icon/events.svg`;
const participants = `${PUBLIC_URL}/img/icon/participants.svg`;

const ProgramView = ( {dispatch, organization, program, auth} ) => {
    const { id } = useParams()
    const [modalName, setModalName] = useState(null)
    const [isOpen, setOpen] = useState(false);
    const [depositBalance, setDepositBalance] = useState(0);
    const [financialBalance, setFinancialBalance] = useState(0);
    const locale = new Intl.Locale('en-US');
    let history = useHistory();
     useEffect(()=> {
        if (organization && program)
        axios.get(`/organization/${organization?.id}/program/${program?.id}/getBalance`)
        .then( (res) => {
                setDepositBalance(res.data.financial_detail);
                setFinancialBalance(res.data.total_financial_balance);
        })
    },[organization, program])
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

    let showLiveMode = !!((auth?.isAdmin || auth?.isSuperAdmin) && program?.is_demo);

    if( !program || !organization ) return 'Loading...'

    const {id: organizationId, name: organizationName} = program.organization
//   console.log(data)
  
    return (
        <Container className="program-view">
            <Row>
                <Col md={6}>
                    <h3 className="page-title">All Programs</h3>
                    <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/program">Programs</Link> / {program.name} {!!program.is_demo && <span style={{color: 'red'}}>Demo Mode</span>}</h3>
                    <p> (Organization: {organizationId} - {organizationName})</p>
                </Col>
                <Col md={6} className='text-right'>
                    <span style={{maxWidth:'200px'}} className="btn btn-primary account__btn account__btn--small" onClick={()=>toggle('addprogram')}>Add sub program</span>
                    { showLiveMode &&
                      <>
                        &nbsp;&nbsp;
                        <span style={{maxWidth:'200px'}} className="btn btn-success account__btn account__btn--small" onClick={()=>toggle('activateLiveMode')}>Live Mode</span>
                      </>
                    }
                     <div className="program-balance" style={{marginTop:'10px'}}>
                        <p>Deposit Balance:
                            <span style={{marginLeft:'10px', }}>${depositBalance.toLocaleString(locale)}</span>
                        </p>
                        <p style={{marginTop: '0px', marginBottom:'10px'}}>Financial Balance:
                            <span style={{marginLeft:'10px', }}>${financialBalance.toLocaleString(locale)}</span>
                        </p>
                    </div>
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
                                    <p>General program settings and information.</p>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <MainModalWrapper organization={organization} name={modalName} isOpen={isOpen} setOpen={setOpen} toggle={toggle} programId={id} />
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
                                    <p>Select a template and customize the theme.</p>
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
                                    <p>Enable engagement features.</p>
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
                                    <p>Create events to award users.</p>
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
                                    <p>Build the perfect hierarchy.</p>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
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
                                    <p>Select the merchants you want make available to your users.</p>
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
                            <Row onClick={()=>{toggle('awarding')}}>
                                <Col md={3} className='col-left'>
                                    <img src={AwardingIcon} className="card-img-top" alt="Awarding and Points" />
                                </Col>
                                <Col md={9} className='col-right pl-0'>
                                    <h5>Awarding and Points</h5>
                                    <p>Awarding and points settings.</p>
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
                                    <p>User management.</p>
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
                                    <h5>Account</h5>
                                    <p>Create Invoices, View statements, Track funds and payments.</p>
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
                        <Row onClick={()=>{toggle('domains')}}>
                            <Col md={3} className='col-left'>
                                <img src={EventsIcon} className="card-img-top" alt="Domains" />
                            </Col>
                            <Col md={9} className='col-right pl-0'>
                                <h5>Domains</h5>
                                <p>Domain settings.</p>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>

                {auth?.isSuperAdmin && <Col md="6" lg="4" xl="4">
                    <Card>
                        <CardBody>
                            <Row onClick={() => {
                                toggle('accounting')
                            }}>
                                <Col md={3} className='col-left'>
                                    <img src={InvoiceIcon} className="card-img-top" alt="Accounting"/>
                                </Col>
                                <Col md={9} className='col-right pl-0'>
                                    <h5>Accounting</h5>
                                    <p>Accounting settings</p>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col> }
                <Col md="6" lg="4" xl="4">
                    <Card>
                        <CardBody>
                            <Row onClick={()=>{toggle('digitalmedia')}}>
                                <Col md={3} className='col-left'>
                                    <img src={AccountingIcon} className="card-img-top" alt="Digital Media"/>
                                </Col>
                                <Col md={9} className='col-right pl-0'>
                                    <h5>Upload Content</h5>
                                    <p>Upload brochures, newsletters, videos and more for users to view.</p>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                {/*<Col md="4" lg="4" xl="4">*/}
                {/*    <Card>*/}
                {/*        <CardBody>*/}
                {/*            <Row onClick={()=>{toggle('emailtemplate')}}>*/}
                {/*                <Col md={3} className='col-left'>*/}
                {/*                    <img src={EventsIcon} className="card-img-top" alt="Email Templates" />*/}
                {/*                </Col>*/}
                {/*                <Col md={9} className='col-right pl-0'>*/}
                {/*                    <h5>Email Templates</h5>*/}
                {/*                    <p>Manage Program's Email Templates</p>*/}
                {/*                </Col>*/}
                {/*            </Row>*/}
                {/*        </CardBody>*/}
                {/*    </Card>*/}
                {/*</Col>*/}
            </Row>
            <Row>
                <Col md="4" lg="4" xl="4">
                    <Card>
                        <CardBody>
                            <Row onClick={()=>{history.push(`/program/${id}/reports`)}}>
                                <Col md={3} className='col-left'>
                                    <img src={EventsIcon} className="card-img-top" alt="Reports" />
                                </Col>
                                <Col md={9} className='col-right pl-0'>
                                    <h5>Reports</h5>
                                    <p>Program reports.</p>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="6" lg="4" xl="4">
                    <Card>
                        <CardBody>
                            <Row onClick={()=>{toggle('reports')}}>
                                <Col md={3} className='col-left'>
                                    <img src={AccountingIcon} className="card-img-top" alt="Manager Reports Settings"/>
                                </Col>
                                <Col md={9} className='col-right pl-0'>
                                    <h5>Manager Reports Settings</h5>
                                    <p>Selection of reports that will be available in the program.</p>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="6" lg="4" xl="4">
                    <Card>
                        <CardBody>
                            <Row onClick={()=>{toggle('csv_importtypes')}}>
                                <Col md={3} className='col-left'>
                                    <img src={AccountingIcon} className="card-img-top" alt="Manager Import Settings"/>
                                </Col>
                                <Col md={9} className='col-right pl-0'>
                                    <h5>Manager Import Settings</h5>
                                    <p>Selection of CSV imports that will be available in the program.</p>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="6" lg="4" xl="4">
                    <Card>
                        <CardBody>
                            <Row onClick={()=>{toggle('AwardLevels')}}>
                                <Col md={3} className='col-left'>
                                    <img src={participants} className="card-img-top" alt="Award Levels"/>
                                </Col>
                                <Col md={9} className='col-right pl-0'>
                                    <h5>Award Levels</h5>
                                    <p>Program's Award Levels</p>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="6" lg="4" xl="4">
                    <Card>
                        <CardBody>
                            <Row onClick={()=>{toggle('UnitNumbers')}}>
                                <Col md={3} className='col-left'>
                                    <img src={participants} className="card-img-top" alt="Award Levels"/>
                                </Col>
                                <Col md={9} className='col-right pl-0'>
                                    <h5>Unit Numbers</h5>
                                    <p>Program's Unit Numbers</p>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="6" lg="4" xl="4">
                    <Card>
                        <CardBody>
                            <Row onClick={()=>{toggle('entratasettings')}}>
                                <Col md={3} className='col-left'>
                                    <img src={AccountingIcon} className="card-img-top" alt="Entrata Configuration"/>
                                </Col>
                                <Col md={9} className='col-right pl-0'>
                                    <h5>Entrata Configurations</h5>
                                    <p>View, edit or delete Entrata configurations/integrations</p>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="6" lg="4" xl="4">
                    <Card>
                        <CardBody>
                            <Row onClick={()=>{toggle('PositionLevels')}}>
                                <Col md={3} className='col-left'>
                                    <img src={participants} className="card-img-top" alt="Award Levels"/>
                                </Col>
                                <Col md={9} className='col-right pl-0'>
                                    <h5>Positions</h5>
                                    <p>Program's Positions</p>
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
    program: state.program,
    auth: state.auth
}))(ProgramView));
