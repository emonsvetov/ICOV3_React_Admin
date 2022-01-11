import React from 'react';
import {
  Card, CardBody, Col, Progress,
} from 'reactstrap';
import PropTypes from 'prop-types';

const social = [
    { id: 0, social: 'Target', progress: '92' },
    { id: 1, social: 'Best Buy', progress: '89' },
    { id: 2, social: 'Starbucks', progress: '83' },
    { id: 3, social: 'Walmart', progress: '81' },
    { id: 4, social: 'Gap', progress: '78' },
    { id: 5, social: 'Amazon', progress: '75' },
    { id: 6, social: 'Walmart', progress: '81' },
    { id: 7, social: 'Gap', progress: '78' },
    { id: 8, social: 'Amazon', progress: '75' },
    { id: 9, social: 'Walmart', progress: '81' },
    { id: 10, social: 'Gap', progress: '78' },
    { id: 11, social: 'Amazon', progress: '75' },
  ];
  
  const SocialScore = ({ children, progress }) => (
    <div className="dashboard__social-stat-item">
      <div className="dashboard__social-stat-title">
        {children}
      </div>
      <div className="dashboard__social-stat-progress">
        <div className="progress-wrap progress-wrap--small progress-wrap--yellow progress-wrap--rounded">
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
        <h5 className="dashboard__booking-total-description">Top Merchants This Week</h5>
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
