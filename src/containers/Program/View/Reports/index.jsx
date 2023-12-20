import React, { useMemo, useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import { Col, Container, Row, Card, CardBody, NavItem, NavLink, Nav, TabPane, Button, TabContent } from 'reactstrap';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from "axios";
import classnames from "classnames";
import ParticipantAccountSubProgram from "../Reports/ParticipantAccountSubProgram";
import ProgramParticipantStatusSummary from "../Reports/ProgramParticipantStatusSummary";
import SupplierRedemptionIndex from "../Reports/SupplierRedemptionIndex";
import JournalDetailed from "../Reports/JournalDetail";
import DepositTransfer from "../Reports/DepositTransfer";
import DepositBalance from "../Reports/DepositBalance";
import PointsPurchase from "../Reports/PointsPurchase";
import ParticipantAccountSummary from '../Reports/ParticipantAccountSummary'
import UserDetailsChangeLogs from "../Reports/UserDetailsChangeLog";
import DeletedSocialWallPosts from '../Reports/DeletedSocialWallPosts'
const ProgramReport = ({organization}) => {
  // Tabs Panel
  const [currentActiveTab, setCurrentActiveTab] = useState('1');
  const togglePan = tab => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  }
  const { programId } = useParams();
  const [program, setProgram] = useState(null);

  const fetchProgramData = async(organization) => {
    try {
      const response = await axios.get(`/organization/${organization.id}/program/${programId}`);
      setProgram(response.data)
    } catch (e) {
      throw new Error(`API error:${e?.message}`);
    }
  };
  useEffect(() => {
    if( organization )  {
      fetchProgramData(organization)
    }
  },[organization, programId])

  if( !program?.id || !organization?.id )  {
    return 'Loading...'
  }

  return (
    <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Reports</h3>
        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/program">Programs</Link> / <Link className="" to = {`/program/view/${program.id}`}>{program?.name}</Link>/ Reports </h3>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <Card>
          <CardBody className='infoview'>
            <Row>
              <Col md="12" >
                <Nav tabs>
                  <NavItem>
                    <NavLink
                        className={classnames({
                          active:
                              currentActiveTab === '1'
                        })}
                        onClick={() => {
                          togglePan('1');
                        }}
                    >
                      Participant Accounts By Subprogram
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                        className={classnames({
                          active:
                              currentActiveTab === '2'
                        })}
                        onClick={() => {
                          togglePan('2');
                        }}
                    >
                      Participant Status Summary
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                        className={classnames({
                          active:
                              currentActiveTab === '3'
                        })}
                        onClick={() => {
                          togglePan('3');
                        }}
                    >
                      Journal Detail
                    </NavLink>
                  </NavItem>
                  <NavLink
                      className={classnames({
                          active:
                              currentActiveTab === '4'
                      })}
                      onClick={() => {
                          togglePan('4');
                      }}
                  >
                      Supplier Redemption
                  </NavLink>
                  <NavLink
                      className={classnames({
                        active:
                            currentActiveTab === '5'
                      })}
                      onClick={() => {
                        togglePan('5');
                      }}
                  >
                    Deposit Transfers
                  </NavLink>
                  <NavLink
                      className={classnames({
                        active:
                            currentActiveTab === '6'
                      })}
                      onClick={() => {
                        togglePan('6');
                      }}
                  >
                    Deposit Balance
                  </NavLink>
                  <NavLink
                      className={classnames({
                        active:
                            currentActiveTab === '7'
                      })}
                      onClick={() => {
                        togglePan('7');
                      }}
                  >
                    Point Purchase
                  </NavLink>
                  <NavLink
                      className={classnames({
                        active:
                            currentActiveTab === '8'
                      })}
                      onClick={() => {
                        togglePan('8');
                      }}
                  >
                    Participant Account Summary
                  </NavLink>
                  <NavLink
                      className={classnames({
                        active:
                            currentActiveTab === '9'
                      })}
                      onClick={() => {
                        togglePan('9');
                      }}
                  >
                    User Detail Change Log
                  </NavLink>
                  <NavLink
                      className={classnames({
                        active:
                            currentActiveTab === '10'
                      })}
                      onClick={() => {
                        togglePan('10');
                      }}
                  >
                      Deleted Social Wall Posts
                  </NavLink>
                </Nav>
              </Col>
            </Row>
            <TabContent activeTab={currentActiveTab} className="tabContent">
              <TabPane tabId="1" className="tabPane">
                <ParticipantAccountSubProgram program={program}/>
              </TabPane>
              <TabPane tabId="2">
                {
                  currentActiveTab != 2 ? 'Loading...' :
                  <ProgramParticipantStatusSummary program={program}/>
                }
              </TabPane>
              <TabPane tabId="3">
                {
                  currentActiveTab != 3 ? 'Loading...' :
                  <JournalDetailed program={program}/>
                }
              </TabPane>
              <TabPane tabId="4">
                  {
                      currentActiveTab != 4 ? 'Loading...' :
                          <SupplierRedemptionIndex program={program}/>
                  }
              </TabPane>
              <TabPane tabId="5">
                {
                  currentActiveTab != 5 ? 'Loading...' :
                      <DepositTransfer program={program}/>
                }
              </TabPane>
              <TabPane tabId="6">
                {
                  currentActiveTab != 6 ? 'Loading...' :
                      <DepositBalance program={program}/>
                }
              </TabPane>
              <TabPane tabId="7">
                {
                  currentActiveTab != 7 ? 'Loading...' :
                      <PointsPurchase program={program}/>
                }
              </TabPane>
              <TabPane tabId="8">
                {
                  currentActiveTab != 8 ? 'Loading...' :
                      <ParticipantAccountSummary program={program}/>
                }
              </TabPane>
              <TabPane tabId="9">
                {
                  currentActiveTab != 9 ? 'Loading...' :
                      <UserDetailsChangeLogs program={program}/>
                }
              </TabPane>
              <TabPane tabId="10">
                {
                  currentActiveTab != 10 ? 'Loading...' :
                      <DeletedSocialWallPosts program={program}/>
                }
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
  )
}

export default withRouter(connect((state) => ({
  organization: state.organization
}))(ProgramReport));
