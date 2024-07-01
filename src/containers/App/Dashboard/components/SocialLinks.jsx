import React from 'react';
import {
  Card, CardBody, Col, Progress,
} from 'reactstrap';
import PropTypes from 'prop-types';

const social = [
    { id: 0, social: 'Booking.com', progress: '87' },
    { id: 1, social: 'Airbnb', progress: '65' },
    { id: 2, social: 'Tripadvisor', progress: '92' },
    { id: 3, social: 'Tripadvisor', progress: '81' },
  ];
  
  const SocialScore = ({ children, progress }) => (
    <div className="dashboard__social-stat-item">
      <div className="dashboard__social-stat-title">
        {children}
      </div>
      <div className="dashboard__social-stat-progress">
        <div className="progress-wrap progress-wrap--small progress-wrap--blue-gradient progress-wrap--rounded">
          <p className="progress__label">{progress}%</p>
          <Progress value={progress} />
        </div>
      </div>
    </div>
  );
  
  SocialScore.propTypes = {
    progress: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  };

const SocialLinks = () => (
  <Col md={12} xl={3} lg={6} xs={12}>
    <Card>
      <CardBody className="dashboard__booking-card">
        <h5 className="dashboard__booking-total-description">Total Redemption This Week</h5>
        <div className="dashboard__social-stat">
        {social.map(item => (
            <SocialScore key={item.id} progress={item.progress}>
            {item.social}
            </SocialScore>
        ))}
        </div>
      </CardBody>
    </Card>
  </Col>
);

export default SocialLinks;
