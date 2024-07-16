import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { ThemeProps, RTLProps } from "@/shared/prop-types/ReducerProps";
import ReactTableBase from "@/shared/components/table/ReactTableBase";
import { getPositionLevels } from "@/service/program/position";
import { COLUMNS } from "./columns";
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
import AddPositionLevels from "./AddPositionLevels";
import ApprovalFlow from "./ApprovalFlow";
import AssignPositionLevelPermissions from "./AssignPositionLevelPermissions";
import EditPositionLevel from "./EditPositionLevel";

const PositionsLevelsModal = ({
  isOpen,
  setOpen,
  toggle,
  organization,
  program,
  theme,
  rtl,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentActiveTab, setCurrentActiveTab] = useState("1");
  const [positionLevels, setPositionLevels] = useState([]);
  const [postionLevelId, setPostionLevelId] = React.useState(null);
  const [step, setStep] = useState(0);

  const togglePan = (tab) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  };

  const handleStep = (step) => {
    setStep(step);
  };

  const tableConfig = {
    isResizable: true,
    isSortable: false,
  };

  useEffect(() => {
    if (program?.organization_id && program?.id) {
      setLoading(true);
      getPositionLevels(program.organization_id, program.id).then((levels) => {
        setPositionLevels(levels);
        setLoading(false);
      });
    }
  }, [program, step]);

  const onClickAssignPermission = (positionLevelId) => {
    if (positionLevelId) {
      handleStep(4);
      setPostionLevelId(positionLevelId);
    }
  };

  const onClickEdit = (positionLevelId) => {
    if (positionLevelId) {
      handleStep(3);
      setPostionLevelId(positionLevelId);
    }
  };

  const onClickRemove = (positionLevel) => {
    if (positionLevel) {
      setLoading(true);
      axios
        .delete(
          `/organization/${program.organization_id}/program/${program.id}/positionlevel/${positionLevel.id}`,
          { data: positionLevel }
        )
        .then((res) => {
          if (res.status === 200) {
            getPositionLevels(program.organization_id, program.id).then(
              (levels) => {
                setPositionLevels(levels);
              }
            );
            flashSuccess(dispatch, "Position level deleted successfully");
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          flashError(dispatch, error.message);
        });
    }
  };

  const RenderActions = ({ row }) => {
    return (
      <>
        <span
          className="table-hover text-primary"
          style={{ cursor: "pointer" }}
          color="#ffffff"
          onClick={() => onClickEdit(row.original.id)}
        >
          Edit
        </span>{" "}
        |
        <span
          className="table-hover text-primary"
          style={{ cursor: "pointer" }}
          color="#ffffff"
          onClick={() => onClickAssignPermission(row.original.id)}
        >
          {" "}
          Manage Permission
        </span>{" "}
        |
        <span
          className="table-hover text-primary"
          style={{ cursor: "pointer" }}
          color="#ffffff"
          onClick={() => {
            if (window.confirm("Are you sure to delete this Position Level?")) {
              onClickRemove(row.original);
            }
          }}
        >
          {" "}
          Delete
        </span>
      </>
    );
  };

  let positions_columns = [
    ...COLUMNS,
    ...[
      {
        Header: "",
        accessor: "action",
        Cell: ({ row }) =>
          row.original.status > 0 ? <RenderActions row={row} /> : null,
      },
    ],
  ];

  let columns = useMemo(() => positions_columns, []);

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
              {program?.use_cascading_approvals > 0 && (
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
                      <ReactTableBase
                        columns={columns}
                        data={positionLevels}
                        tableConfig={tableConfig}
                        program={program}
                      />
                    </Col>
                  </Row>
                </>
              </TabPane>
              <TabPane tabId="2">
                <div>
                  <ApprovalFlow
                    theme={theme}
                    rtl={rtl}
                    organization={organization}
                    isOpen={isOpen}
                    setOpen={setOpen}
                    toggle={toggle}
                    program={program}
                  />
                </div>
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
          {step === 0 && (
            <RenderPositionLevelData program={program} onStep={handleStep} />
          )}
          {step === 1 && (
            <AddPositionLevels onStep={handleStep} program={program} />
          )}
          {step === 3 && (
            <EditPositionLevel
              program={program}
              onStep={handleStep}
              positionId={postionLevelId}
            />
          )}
          {step === 4 && (
            <AssignPositionLevelPermissions
              program={program}
              onStep={handleStep}
              postionLevelId={postionLevelId}
            />
          )}
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
