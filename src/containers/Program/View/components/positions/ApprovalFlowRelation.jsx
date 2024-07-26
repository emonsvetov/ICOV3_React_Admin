import React, { useState } from "react";
import { Row, Col, ButtonToolbar } from "reactstrap";
import CreatableSelect from "react-select/creatable";

const ApprovalFlowRelation = ({
  step,
  sameStepApproverNotifications,
  setSameStepApproverNotifications,
  selectedApprovarOptions,
  selectedPositions,
  setName,
  setApprovarRelationOptions,
  onClickApprovalRelationData,
}) => {
  const [approverNotificationOptions, setApproverNotificationOptions] =
    useState({});

  const createApproverOptions = (positionId) =>
    selectedPositions
      ?.filter((item, i) => item?.value !== positionId)
      ?.map((position) => position);

  const createApproverNotificationOptions = (positionId) => {
    return approverNotificationOptions[positionId];
  };

  const handleApproverChange = (position, awarderId) => {
    setApprovarRelationOptions((prevState) => ({
      ...prevState,
      [awarderId]: position,
      step,
    }));

    setApproverNotificationOptions((prevState) => ({
      ...prevState,
      [awarderId]: position,
      step,
    }));
  };

  const handleApproverNotification = (position, awarderId) => {
    setSameStepApproverNotifications((prevState) => ({
      ...prevState,
      [awarderId]: position,
      step,
    }));
  };

  return (
    <div>
      <div className="p-1">
        <h3>Define Relations</h3>
        <h5 className="subhead">Create/Relations between position </h5>
      </div>
      <div>
        <div className="mt-2 mb-2">
          <Row>
            <Col>
              {" "}
              <h5>Awarder</h5>
            </Col>
            <Col>
              <h5>Approvers</h5>
            </Col>
            <Col>
              <h5>Notifications</h5>
            </Col>
          </Row>
        </div>
        <div className="m-2 p-1">
          {selectedPositions?.map((approver, i) => (
            <Row className="mt-2" key={approver.value}>
              <Col md="4" lg="4" xl="4">
                <h6> {approver.label}</h6>
              </Col>
              <Col md="4" lg="4" xl="4">
                <CreatableSelect
                  options={createApproverOptions(approver?.value)}
                  value={selectedApprovarOptions[approver?.value]}
                  onChange={(position) =>
                    handleApproverChange(position, approver?.value)
                  }
                  isMulti
                />
              </Col>
              <Col md="4" lg="4" xl="4">
                <CreatableSelect
                  options={createApproverNotificationOptions(approver?.value)}
                  value={sameStepApproverNotifications[approver?.value]}
                  onChange={(position) =>
                    handleApproverNotification(position, approver?.value)
                  }
                  isMulti
                />
              </Col>
            </Row>
          ))}
        </div>
        <p className="mt-2 pt-2 text-danger">
          The Details will be saved when the Approval Flow is saved.
        </p>
      </div>
      <div>
        <ButtonToolbar>
          <button
            className="btn btn-primary"
            onClick={() => {
              setName("ApprovalFlow");
              onClickApprovalRelationData();
            }}
          >
            Save (When Approval Flow is saved)
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setName("ApprovalFlow")}
          >
            Back
          </button>
        </ButtonToolbar>
      </div>
    </div>
  );
};

export default ApprovalFlowRelation;
