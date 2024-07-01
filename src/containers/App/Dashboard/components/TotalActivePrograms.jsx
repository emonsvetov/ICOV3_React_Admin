import React from 'react';
import { connect } from 'react-redux';
import {withRouter, Link} from "react-router-dom";
import {
  Card, CardBody, Col, Progress,
} from 'reactstrap';
import TrendingUpIcon from 'mdi-react/TrendingUpIcon';

const TotalActivePrograms = ({organization}) => (
  <Col md={12} xl={3} lg={6} xs={12}>
    <Card>
      <CardBody className="dashboard__booking-card">
        <Link to="/program">
          <div className="dashboard__booking-total-container">
            <h5 className="dashboard__booking-total-title dashboard__booking-total-title--green">
              {organization.programCount ? organization.programCount : 0}
            </h5>
            <TrendingUpIcon className="dashboard__trend-icon" />
          </div>
          <h5 className="dashboard__booking-total-description">Total Active Programs</h5>
          <div className="progress-wrap progress-wrap--small progress-wrap--lime-gradient progress-wrap--rounded">
            <p className="dashboard__booking-card-progress-label progress__label">32%</p>
            <Progress value={32} />
          </div>
        </Link>
      </CardBody>
    </Card>
  </Col>
);
export default withRouter(connect((state) => ({
  organization: state.organization
}))(TotalActivePrograms));

