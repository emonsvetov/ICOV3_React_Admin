import React, { useMemo, useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import { Col, Container, Row, Card, CardBody, NavItem, NavLink, Nav, TabPane, Button, TabContent } from 'reactstrap';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from "axios";
import classnames from "classnames";
import ParticipantAccountSubProgram from "../Reports/ParticipantAccountSubProgram";
import ProgramParticipantStatusSummary from "../Reports/ProgramParticipantStatusSummary";
import JournalDetailed from "../Reports/JournalDetail";

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
      // console.log(response)
      setProgram(response.data)
    } catch (e) {
      throw new Error(`API error:${e?.message}`);
    }
  };
  useEffect(() => {
    if( organization )  {
      fetchProgramData(organization)
    }
  },[organization])

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
              <Col md="7" >
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
