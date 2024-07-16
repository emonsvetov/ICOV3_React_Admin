import React, { useState } from "react";
import ApprovalRelationModel from "./ApprovalRelationModel";
import { getPositionLevels } from "@/service/program/position";
import { labelizeNamedData } from "@/shared/helpers";
import { useDispatch, flashError } from "@/shared/components/flash";
import CloseIcon from "mdi-react/CloseIcon";
import { Row, Col, Button } from "reactstrap";
import { Form } from "react-final-form";
import ApprovalConfirmPopup from "./ApprovalConfirmPopup";
import ApprovalFlowHierarchy from "./ApprovalFlowHierarchyModal";
import ModelWrapper from "./ModelWrapper";
import ApprovalFlowForm from "./ApprovalFlowForm";

let initialTitle = { label: "Approval Flow", value: "ApprovalFlow" };

const ApprovalFlow = ({ organization, program, theme, rtl, toggle }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [approverSelections, setApproverSelections] = useState({});
  const [notificationSelections, setNotificationSelections] = useState({});
  const [availablePositionLevel, setAvailablePositionLevel] = useState([]);
  const [enableApprovalSteps, setEnableApprovalsteps] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [defineRelationNotification, setDefineRelationNotification] = useState(
    {}
  );
  const [selectPrograms, setSelectPrograms] = useState([]);
  const [selectProgramHierarchy, setSelectProgramHierarchy] = useState([]);
  const [selectedApprovers, setSelectedApprovers] = useState([]);
  const [confirmProgramHierarchy, setConfirmProgramHierarchy] = useState(false);
  const [modalName, setModalName] = useState("ApprovalFlow");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState(false);

  const dispatch = useDispatch();

  const modalToggle = () => {
    setModalOpen((prev) => !prev);
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

  React.useEffect(() => {
    if (confirmProgramHierarchy) {
      setModalName("ApprovalFlowHierarchy");
    }
  }, [confirmProgramHierarchy]);

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
      setModalName("ApprovalFlowRelation");
      modalToggle();
    } else {
      flashError(
        dispatch,
        "Please select more than 1 position in the current step to define relations."
      );
      return;
    }
  };

  const onSubmit = (values) => {
    const selectedValues = Object.values(approverSelections).flat();

    if (selectedValues) {
      const transformObject = (obj) => {
        const result = [];

        Object.entries(obj).forEach(([key, values], index) => {
          result.push({
            step: key,
            position_level_id: values?.map((item, i) => item.value),
          });
        });

        return result;
      };
      setFormData({ approval_request: transformObject(approverSelections) });
      setConfirmPopup((prev) => !prev);
      modalToggle();
    }
  };

  if (loading) return <p>Loading...</p>;
  console.log(formData);
  if (availablePositionLevel) {
    return (
      <>
        <div className="form__form-group">
          <h4 className="form__form-group-label thick">{initialTitle.label}</h4>
        </div>
        {modalName === "ApprovalFlow" && (
          <Form onSubmit={onSubmit} initialValues={{}}>
            {({ handleSubmit, form, submitting, pristine, values }) => (
              <form className="form" onSubmit={handleSubmit}>
                <ApprovalFlowForm
                  setModalName={setModalName}
                  program={program}
                  onSubmit={onSubmit}
                  handleStepIncrease={handleStepIncrease}
                  handleStepDecrease={handleStepDecrease}
                  currentStep={currentStep}
                  enableApprovalSteps={enableApprovalSteps}
                  setEnableApprovalsteps={setEnableApprovalsteps}
                  getAvailableApproverOptions={getAvailableApproverOptions}
                  approverSelections={approverSelections}
                  notificationSelections={notificationSelections}
                  handleNotificationChange={handleNotificationChange}
                  handleApproverChange={handleApproverChange}
                  handleApprovalRelation={handleApprovalRelation}
                />
              </form>
            )}
          </Form>
        )}
        {modalName === "ApprovalFlowRelation" && (
          <ApprovalRelationModel
            isOpen={modalOpen}
            toggle={modalToggle}
            setModalName={setModalName}
            program={program}
            organization={organization}
            defineRelationNotification={defineRelationNotification}
            setDefineRelationNotification={setDefineRelationNotification}
            selectedApprovers={selectedApprovers}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {modalName === "ApprovalFlowHierarchy" && confirmProgramHierarchy && (
          <ApprovalFlowHierarchy
            setModalName={setModalName}
            program={program}
            organization={organization}
            selectPrograms={selectPrograms}
            selectProgramHierarchy={selectProgramHierarchy}
            setSelectPrograms={setSelectPrograms}
            setSelectProgramHierarchy={setSelectProgramHierarchy}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {confirmPopup && (
          <ApprovalConfirmPopup
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            modalName={modalName}
            setModalName={setModalName}
            modalToggle={modalToggle}
            confirmProgramHierarchy={confirmProgramHierarchy}
            setConfirmProgramHierarchy={setConfirmProgramHierarchy}
          />
        )}
      </>
    );
  }
};

export default ApprovalFlow;
