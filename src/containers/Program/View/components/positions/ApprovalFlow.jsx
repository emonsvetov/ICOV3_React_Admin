import React, { useState } from "react";
import CheckboxField from "@/shared/components/form/CheckboxField";
import { Row, Col, Button } from "reactstrap";
import { Field, Form } from "react-final-form";
import CreatableSelect from "react-select/creatable";
import ApprovalRelationModel from "./ApprovalRelationModel";
import { getPositionLevels } from "@/service/program/position";
import { labelizeNamedData } from "@/shared/helpers";
import { useDispatch, flashError } from "@/shared/components/flash";
import CloseIcon from "mdi-react/CloseIcon";
import ApprovalConfirmPopup from "./ApprovalConfirmPopup";

const ApprovalFlow = ({ organization, program, theme, rtl }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [approverSelections, setApproverSelections] = useState({});
  const [notificationSelections, setNotificationSelections] = useState({});
  const [availablePositionLevel, setAvailablePositionLevel] = useState([]);
  const [enableApprovalSteps, setEnableApprovalsteps] = useState(false);
  const [loading, setLoading] = useState(true);
  const [defineRelationNotification, setDefineRelationNotification] = useState(
    {}
  );
  const [isOpen, setOpen] = useState(false);
  const [modelName, setModelName] = useState("");
  const [selectedApprovers, setSelectedApprovers] = useState([]);
  const [confirmProgramHierarchy, setConfirmProgramHierarchy] = useState(false);

  const dispatch = useDispatch();

  const toggle = () => {
    setOpen((prevState) => !prevState);
  };
  React.useEffect(() => {
    setLoading(true);
    if (organization?.id && program?.id) {
      getPositionLevels(organization?.id, program?.id)
        .then((positionLevel) => {
          if (positionLevel) {
            setAvailablePositionLevel(
              labelizeNamedData(positionLevel, ["id", "title"])
            );
            setLoading(false);
          }
        })
        .catch((error) => {
          flashError(dispatch, error.message);
          setLoading(false);
        });
    }
  }, [organization, program]);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "250px",
    }),
  };

  const handleStepIncrease = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleStepDecrease = (step) => {
    const newApproverSelections = { ...approverSelections };
    const newNotificationSelections = { ...notificationSelections };
    delete newApproverSelections[step];
    delete newNotificationSelections[step];
    setApproverSelections(newApproverSelections);
    setNotificationSelections(newNotificationSelections);
    setCurrentStep(currentStep - 1);
  };

  const handleApproverChange = (selectedOptions, step) => {
    setApproverSelections({
      ...approverSelections,
      [step]: selectedOptions,
    });
  };

  const handleNotificationChange = (selectedOptions, step) => {
    setNotificationSelections({
      ...notificationSelections,
      [step]: selectedOptions,
    });
  };

  const getAvailableApproverOptions = (step) => {
    const selectedValues = Object.values(approverSelections).flat();
    return availablePositionLevel?.map((option) => ({
      ...option,
      isDisabled:
        selectedValues.some((selected) => selected.value === option.value) &&
        !approverSelections[step]?.some(
          (selected) => selected.value === option.value
        ),
    }));
  };

  const handleApprovalRelation = (step) => {
    const selected = approverSelections[step];
    if (selected && selected.length >= 2) {
      setSelectedApprovers(selected);
      setModelName("Approval Relation");
      toggle();
    } else {
      flashError(
        dispatch,
        "Please select more than 1 position in the current step to define relations."
      );
      return;
    }
  };

  const onSubmit = (values) => {
    let forData = {};
    const selectedValues = Object.values(approverSelections).flat();
    if (selectedValues) {
    }
  };

  if (loading) return <p>Loading...</p>;

  if (availablePositionLevel) {
    return (
      <>
        <Form
          onSubmit={onSubmit}
          // validate={}
          initialValues={{}}
        >
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
                      onChange={() =>
                        setEnableApprovalsteps(!enableApprovalSteps)
                      }
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
            </form>
          )}
        </Form>
        {modelName === "Approval Relation" && selectedApprovers && (
          <ApprovalRelationModel
            isOpen={isOpen}
            setOpen={setOpen}
            toggle={toggle}
            theme={theme}
            rtl={rtl}
            defineRelationNotification={defineRelationNotification}
            setDefineRelationNotification={setDefineRelationNotification}
            selectedApprovers={selectedApprovers}
          />
        )}
        {modelName === "Approval program Confirm" && (
          <ApprovalConfirmPopup
            isOpen={isOpen}
            setOpen={setOpen}
            toggle={toggle}
            setConfirmProgramHierarchy={setConfirmProgramHierarchy}
          />
        )}
      </>
    );
  }
};

export default ApprovalFlow;
