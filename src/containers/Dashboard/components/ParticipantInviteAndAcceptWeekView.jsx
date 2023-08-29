import React from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import Panel from '@/shared/components/Panel';

const data01 = [{ value: 78, fill: '#4ce1b6' },
  { value: 22, fill: '#eeeeee' }];

const data02 = [{ value: 86, fill: '#b8e986' },
  { value: 14, fill: '#eeeeee' }];

const ParticipantInviteAndAcceptWeekView = () => {

  return (
    <Panel
      md={12}
      lg={6}
      xl={3}
      xs={12}
      title={'New Participants'}
      subhead="% of participants invited, applied and activated this week"
      className="pb-0"
    >
      <div className="dashboard__weekly-stat">
        <div className="dashboard__weekly-stat-chart">
          <div className="dashboard__weekly-stat-chart-item">
            <div className="dashboard__weekly-stat-chart-pie">
              <ResponsiveContainer>
                <PieChart className="dashboard__weekly-stat-chart-pie-wrapper">
                  <Pie
                    data={data01}
                    dataKey="value"
                    cx={50}
                    cy={50}
                    innerRadius={50}
                    outerRadius={55}
                  />
                </PieChart>
              </ResponsiveContainer>
              <p className="dashboard__weekly-stat-label" style={{ color: '#4ce1b6' }}>78%</p>
            </div>
            <div className="dashboard__weekly-stat-info">
              <p>Participant Applied</p>
            </div>
          </div>
          <div className="dashboard__weekly-stat-chart-item">
            <div className="dashboard__weekly-stat-chart-pie">
              <ResponsiveContainer>
                <PieChart className="dashboard__weekly-stat-chart-pie-wrapper">
                  <Pie
                    data={data02}
                    dataKey="value"
                    cx={50}
                    cy={50}
                    innerRadius={50}
                    outerRadius={55}
                  />
                </PieChart>
              </ResponsiveContainer>
              <p className="dashboard__weekly-stat-label" style={{ color: '#b8e986' }}>86%</p>
            </div>
            <div className="dashboard__weekly-stat-info">
              <p>Participants Activated</p>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default ParticipantInviteAndAcceptWeekView;
