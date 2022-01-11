import React from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import { RTLProps } from '@/shared/prop-types/ReducerProps';
import SocialLinks from './components/SocialLinks';
import RedemptionsWeekView from './components/RedemptionsWeekView';
import TopMerchantsThisWeek from './components/TopMerchantsThisWeek';
import TotalActivePrograms from './components/TotalActivePrograms';
import TotalRewardsThisWeek from './components/TotalRewardsThisWeek';
import TotalRedemptionThisWeek from './components/TotalRedemptionThisWeek';
import NewParticipantInvitesThisWeek from './components/NewParticipantInvitesThisWeek';
import ParticipantInviteAndAcceptWeekView from './components/ParticipantInviteAndAcceptWeekView';

const Dashboard = ({ rtl }) => {

  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Dashboard</h3>
        </Col>
      </Row>
      <Row>
        <TotalActivePrograms />
        <TotalRewardsThisWeek />
        <TotalRedemptionThisWeek />
        <NewParticipantInvitesThisWeek />
      </Row>
      <Row>
        <ParticipantInviteAndAcceptWeekView/>
        <RedemptionsWeekView />
        <TopMerchantsThisWeek />
      </Row>
    </Container>
  );
};

Dashboard.propTypes = {
  rtl: RTLProps.isRequired,
};

export default connect(state => ({
  rtl: state.rtl,
}))(Dashboard);
