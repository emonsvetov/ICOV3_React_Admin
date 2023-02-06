import React from 'react';
import { connect } from 'react-redux';
import {Card, CardBody, Col, Container, Row} from 'reactstrap';
import { RTLProps } from '@/shared/prop-types/ReducerProps';
import AddProgramForm from '../../containers/Program/components/AddProgramForm';
import SocialLinks from './components/SocialLinks';
import RedemptionsWeekView from './components/RedemptionsWeekView';
import TopMerchantsThisWeek from './components/TopMerchantsThisWeek';
import TotalActivePrograms from './components/TotalActivePrograms';
import TotalRewardsThisWeek from './components/TotalRewardsThisWeek';
import TotalRedemptionThisWeek from './components/TotalRedemptionThisWeek';
import NewParticipantInvitesThisWeek from './components/NewParticipantInvitesThisWeek';
import ParticipantInviteAndAcceptWeekView from './components/ParticipantInviteAndAcceptWeekView';
import {Link, withRouter} from "react-router-dom";
import FolderPlusOutlineIcon from "mdi-react/FolderPlusOutlineIcon";

const Dashboard = ({ organization }) => {
  if( !organization ) return 'loading...'
  console.log(organization)
  // organization.programCount = 1
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Dashboard</h3>
        </Col>
      </Row>
      { !organization.programCount &&
      <Row>Participant
          <Col md={12}>
              <Card>
                  <CardBody style={{display:'flex'}}>
                      <Col md={4}>
                      </Col>
                      <Col md={4}>
                          <div className="pb-4">
                              <div  className='text-center'><FolderPlusOutlineIcon size={34} color='#70bbfd' /></div>
                              <h3 className="text-center text-blue font-22">Create a new program</h3>
                          </div>
                          <AddProgramForm organization={organization} />
                      </Col>
                      <Col md={4}>
                      </Col>
                  </CardBody>
              </Card>
          </Col>
      </Row>
      }
      { organization.programCount &&
      <>
        <Row>
          {/*<TotalActivePrograms />*/}
          {/* <TotalRewardsThisWeek />
          <TotalRedemptionThisWeek />
          <NewParticipantInvitesThisWeek /> */}
        </Row>
        <Row>
          {/* <ParticipantInviteAndAcceptWeekView/>
          <RedemptionsWeekView />
          <TopMerchantsThisWeek /> */}
        </Row>
      </>
      }
    </Container>

  );
};

Dashboard.propTypes = {
  rtl: RTLProps.isRequired,
};

export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
    organization: state.organization
}))(Dashboard));
