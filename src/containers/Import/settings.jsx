import React, {useState} from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, NavItem, NavLink, Nav, TabPane, TabContent } from "reactstrap";
import classnames from "classnames";

import ImportTypes from './components/ImportTypes'

const ImportSettings = () => {

  // Tabs Panel
  const [currentActiveTab, setCurrentActiveTab] = useState('1');
  const togglePan = tab => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  }

  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Import Settings</h3>
          <h3 className="page-subhead subhead">
            <Link className="" to="/">
              Home
            </Link>
            &nbsp;/ {'Import Settings'}
          </h3>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            <CardBody className="infoview">
              <Row>
                <Col md="7">
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: currentActiveTab === "1",
                        })}
                        onClick={() => {
                          togglePan("1");
                        }}
                      >
                        Import Types
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: currentActiveTab === "2",
                        })}
                        onClick={() => {
                          togglePan("2");
                        }}
                      >
                        Fields
                      </NavLink>
                    </NavItem>
                  </Nav>
                </Col>
              </Row>
              <TabContent activeTab={currentActiveTab} className="tabContent">
                <TabPane tabId="1" className="tabPane">
                  <ImportTypes />
                </TabPane>
                <TabPane tabId="2" className="tabPane">
                  Tab 2
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ImportSettings;
