import React from "react";
import CheckboxField from "@/shared/components/form/CheckboxField";
import { Row, Col, Button } from "reactstrap";
import { Field, Form } from "react-final-form";
import CreatableSelect from "react-select/creatable";
import CloseIcon from "mdi-react/CloseIcon";
import { useDispatch, flashError } from "@/shared/components/flash";

const ApprovalFlowForm = ({
  setFormData,
  setApprovalPopup,
  step,
  setStep,
  sameStepApproverRelation,
  setConfirmProgramHierarchy,
  allowSameStepApproval,
  setAllowSameStepApproval,
  setSelectedApproverNotifications,
  setApprovers,
  setSelectedPositions,
  getAvailableApproverOptions,
  approvers,
  selectedApproverNotifications,
  setName,
}) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "250px",
    }),
  };

  const dispatch = useDispatch();

  const handleStepDecrease = (step) => {
    const newapprovers = { ...approvers };
    const newselectedApproverNotifications = {
      ...selectedApproverNotifications,
    };
    delete newapprovers[step];
    delete newselectedApproverNotifications[step];
    setApprovers(newapprovers);
    setSelectedApproverNotifications(newselectedApproverNotifications);
    setStep(step - 1);
  };

  const handleStepIncrease = () => {
    setStep(step + 1);
  };

  const handleApproverChange = (selectedOptions, step) => {
    setApprovers({
      ...approvers,
      [step]: selectedOptions,
    });
  };

  const handleNotificationChange = (selectedOptions, step) => {
    setSelectedApproverNotifications({
      ...selectedApproverNotifications,
      [step]: selectedOptions,
    });
  };

  const handleApprovalRelation = (step) => {
    const selected = approvers[step];
    if (selected && selected.length >= 2) {
      setSelectedPositions(selected);
      setName("ApprovalFlowRelation");
    } else {
      flashError(
        dispatch,
        "Please select more than 1 position in the current step to define relations."
      );
      return;
    }
  };

  const approveralsData = (obj, notification) => {
    const result = [];

    Object.entries(obj).forEach(([key, values], index) => {
      console.log(key);
      result.push({
        step: key,
        position_level_id: values?.map((item, i) => item.value),
        notification:
          notification[key]?.length > 0
            ? notification[key]?.map((v) => v.value)
            : [],
        approval_relation:
          allowSameStepApproval && sameStepApproverRelation?.length > 0
            ? sameStepApproverRelation?.filter(
                (relation) => relation.step == key
              )
            : [],
      });
    });

    return result;
  };

  const onSubmit = (values) => {
    if (Object.keys(approvers).length > 0) {
      setFormData((prev) => ({
        ...prev,
        approval_request: approveralsData(
          approvers,
          selectedApproverNotifications
        ),
        allow_same_step_approval: allowSameStepApproval ? 1 : 0,
      }));
      setConfirmProgramHierarchy(false);
      setApprovalPopup(true);
    } else {
      flashError(dispatch, "Please select Approvers");
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      {({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="form" onSubmit={handleSubmit}>
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
                  Total Steps: {step}
                </h6>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="form__form-group">
                <Field name={`allow_same_step_approval`}>
                  {({ input, meta }) => (
                    <div style={{ width: "20%" }}>
                      <CheckboxField
                        name="allow_same_step_approval"
                        label="Enable same step approval"
                        checked={allowSameStepApproval}
                        onChange={(e) =>
                          setAllowSameStepApproval(e.target.checked)
                        }
                      />
                      {meta.touched && meta.error && (
                        <span className="form__form-group-error">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  )}
                </Field>
              </div>
            </Col>
          </Row>
          <Row className="w100 mb-2">
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
          {[...Array(step).keys()].map((_, index) => (
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
                        value={approvers[index + 1] || []}
                        onChange={(options) =>
                          handleApproverChange(options, index + 1)
                        }
                        placeholder="Select approver"
                      />
                      {meta.touched && meta.error && (
                        <span className="form__form-group-error">
                          {meta.error}
                        </span>
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
                          options={approvers[index + 1] || []}
                          value={selectedApproverNotifications[index + 1] || []}
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
              {allowSameStepApproval && (
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
        </form>
      )}
    </Form>
  );
};

export default ApprovalFlowForm;
