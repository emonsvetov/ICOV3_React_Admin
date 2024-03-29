import React from 'react';
import {
  Card, CardBody, Col, Progress,
} from 'reactstrap';
import TrendingDownIcon from 'mdi-react/TrendingDownIcon';

const TotalRewardsThisWeek = () => (
  <Col md={12} xl={3} lg={6} xs={12}>
    <Card>
      <CardBody className="dashboard__booking-card">
        <div className="dashboard__booking-total-container">
          <h5 className="dashboard__booking-total-title dashboard__booking-total-title--red">
            432
          </h5>
          <TrendingDownIcon className="dashboard__trend-icon" />
        </div>
        <h5 className="dashboard__booking-total-description">Total Rewards This Week</h5>
        <div className="progress-wrap progress-wrap--small progress-wrap--pink-gradient progress-wrap--rounded">
          <p className="dashboard__booking-card-progress-label progress__label">87%</p>
          <Progress value={87} />
        </div>
      </CardBody>
    </Card>
  </Col>
);

export default TotalRewardsThisWeek;
