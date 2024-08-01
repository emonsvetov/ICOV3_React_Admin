import React from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import Panel, { PanelTitle } from '@/shared/components/Panel';

const data01 = [{ value: 78, fill: '#b8e986' },
  { value: 23, fill: '#eeeeee' }];

const data02 = [{ value: 25, fill: '#ff4861' },
  { value: 75, fill: '#eeeeee' }];

const NewParticipantAcceptedInvitesThisWeek = () => {

  return (
    <Panel
      md={12}
      lg={6}
      xl={3}
      xs={12}
      title={'Participants'}
      subhead="Total % of participants registered this week"
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
              <p className="dashboard__weekly-stat-label" style={{ color: '#b8e986' }}>78%</p>
            </div>
            <div className="dashboard__weekly-stat-info">
              <p>Participant Registered</p>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default NewParticipantAcceptedInvitesThisWeek;
