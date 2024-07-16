import React, { useState } from "react";
import CheckboxField from "@/shared/components/form/CheckboxField";
import { Row, Col, Button } from "reactstrap";
import { Field, Form } from "react-final-form";
import CreatableSelect from "react-select/creatable";
import CloseIcon from "mdi-react/CloseIcon";

const ApprovalFlowForm = ({
  onSubmit,
  handleStepIncrease,
  handleStepDecrease,
  currentStep,
  enableApprovalSteps,
  setEnableApprovalsteps,
  getAvailableApproverOptions,
  approverSelections,
  notificationSelections,
  handleNotificationChange,
  handleApproverChange,
  handleApprovalRelation,
}) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "250px",
    }),
  };
  return (
    <>
      <Row>
        <Col md="6" lg="6" xl="6">
          <Button
            color="ffff"
            type="submit"
            className="btn btn-primary"
            size="sm"
          >
            Save Changes
          </Button>
        </Col>
        <Col md="6" lg="6" xl="6">
          <Button
            color="ffff"
            type="button"
            className="btn btn-primary"
            onClick={handleStepIncrease}
            size="sm"
          >
            Add More Steps
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs="12" md="8" lg="8">
          <div className="form__form-group">
            <h6 className="form__form-group-label thick">
              Total Steps: {currentStep}
            </h6>
            <div className="form__form-group-field flex-column"></div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs="12" md="8" lg="8">
          <div className="form__form-group">
            <CheckboxField
              name="use_step_approval"
              label="Enable same step approval"
              checked={enableApprovalSteps}
              onChange={() => setEnableApprovalsteps(!enableApprovalSteps)}
            />
          </div>
        </Col>
      </Row>
      <Row className="w100">
        <Col md="4" lg="4" xl="4">
          <span className="mb-4">Steps</span>
        </Col>
        <Col md="4" lg="4" xl="4">
          <span className="mb-4">Approvers</span>
        </Col>
        <Col md="4" lg="4" xl="4">
          <span className="mb-4">Notifications</span>
        </Col>
      </Row>
      {[...Array(currentStep).keys()].map((_, index) => (
        <Row className="w100 mb-2" key={index}>
          <Col md="4" lg="4" xl="4">
            <span className="mb-4">Step {index + 1} :</span>
          </Col>
          <Col md="6" lg="4" xl="4">
            <Field name={`approvers_${index}`}>
              {({ input, meta }) => (
                <>
                  <CreatableSelect
                    isMulti
                    options={getAvailableApproverOptions(index + 1)}
                    value={approverSelections[index + 1] || []}
                    onChange={(options) =>
                      handleApproverChange(options, index + 1)
                    }
                    placeholder="Select approver"
                  />
                  {meta.touched && meta.error && (
                    <span className="form__form-group-error">{meta.error}</span>
                  )}
                </>
              )}
            </Field>
          </Col>
          <Col md="6" lg="4" xl="4">
            <div className="d-flex">
              <Field name={`notifications_${index}`}>
                {({ input, meta }) => (
                  <>
                    <CreatableSelect
                      styles={customStyles}
                      isMulti
                      options={approverSelections[index + 1] || []}
                      value={notificationSelections[index + 1] || []}
                      onChange={(options) =>
                        handleNotificationChange(options, index + 1)
                      }
                      placeholder="Select notification"
                    />
                    {meta.touched && meta.error && (
                      <span className="form__form-group-error">
                        {meta.error}
                      </span>
                    )}
                  </>
                )}
              </Field>
              {index > 0 && (
                <CloseIcon
                  size={30}
                  onClick={() => handleStepDecrease(index + 1)}
                />
              )}
            </div>
          </Col>
          {enableApprovalSteps && (
            <Button
              className="btn btn-primary"
              color="ffff"
              size="sm"
              onClick={() => handleApprovalRelation(index + 1)}
            >
              Define Relations
            </Button>
          )}
        </Row>
      ))}
    </>
  );
};

export default ApprovalFlowForm;
