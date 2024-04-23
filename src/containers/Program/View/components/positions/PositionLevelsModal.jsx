import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { ThemeProps, RTLProps } from "@/shared/prop-types/ReducerProps";
import {
  Modal,
  ModalBody,
  Button,
  ButtonToolbar,
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import axios from "axios";
import {
  useDispatch,
  flashSuccess,
  flashError,
} from "@/shared/components/flash";
import classnames from "classnames";
import PositionLevelsDataTable from "./PositionLevelsDataTable";
import AddPositionLevels from "./AddPositionLevels";
import ApprovalFlow from "./ApprovalFlow";

const PositionsLevelsModal = ({ isOpen, toggle, program, theme, rtl }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentActiveTab, setCurrentActiveTab] = useState("1");
  const [step, setStep] = useState(0);
  const togglePan = (tab) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  };


  const handleStep = (step) => {
    setStep(step);
  };

  // useEffect(() => {}, [program]);

  const RenderPositionLevelData = (props) => {
    if (loading) return "Loading...";

    return (
      <>
        <Row className="w100 mb-4">
          <Col md="6" lg="6" xl="6">
            <h3 className="bold-text">Positions Options</h3>
            <h5 className="subhead">Create/View position levels </h5>
          </Col>
          <Col md="6" lg="6" xl="6" className="text-right">
            <ButtonToolbar className="modal__footer flex justify-content-right w100">
              <Button outline color="primary" className="mr-3" onClick={toggle}>
                Close
              </Button>
              <Button
                className={
                  program.use_budget_cascading > 0 ||
                  program.use_cascading_approvals > 0
                    ? "btn btn-primary"
                    : "d-none"
                }
                color="#ffffff"
                onClick={() => props.onStep(1)}
              >
                Add Positions
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>
        {program.use_budget_cascading > 0 ||
        program.use_cascading_approvals > 0 ? (
          <>
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
                  Positions
                </NavLink>
              </NavItem>
              {program.use_cascading_approvals > 0 && (
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: currentActiveTab === "2",
                    })}
                    onClick={() => {
                      togglePan("2");
                    }}
                  >
                    Approval Flow
                  </NavLink>
                </NavItem>
              )}
            </Nav>
            <TabContent activeTab={currentActiveTab}>
              <TabPane tabId="1">
                <>
                  <Row>
                    <Col>
                      <div className="form__form-group-field flex-column">
                        <h5 className="form__form-group-label thick">
                          Program's Positions
                        </h5>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <PositionLevelsDataTable program={program} />
                    </Col>
                  </Row>
                </>
              </TabPane>
              <TabPane tabId="2">
                <div className="form__form-group">
                  <h4 className="form__form-group-label thick">
                    Approval Flow
                  </h4>
                </div>
                <Row>
                  <Col>
                    <ApprovalFlow />
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </>
        ) : (
          <p>Program does not use Positions </p>
        )}
      </>
    );
  };

  return (
    <Modal
      className={`modal-program programTemplateModal modal-lg ${theme.className} ${rtl.direction}-support`}
      isOpen={isOpen}
      toggle={toggle}
    >
      <>
        <ModalBody className="">
          {step === 0 && <RenderPositionLevelData program={program} onStep={handleStep} />}
          {step === 1 && <AddPositionLevels onStep={handleStep} program={program} />}
        </ModalBody>
      </>
    </Modal>
  );
};

PositionsLevelsModal.propTypes = {
  theme: ThemeProps.isRequired,
  rtl: RTLProps.isRequired,
  organization: PropTypes.object,
  program: PropTypes.object,
};

export default withRouter(
  connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
    organization: state.organization,
    program: state.program,
  }))(PositionsLevelsModal)
);
