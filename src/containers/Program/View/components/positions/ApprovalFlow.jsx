import React, { useState, useEffect } from "react";
import ApprovalFlowRelation from "./ApprovalFlowRelation";
import { getPositionLevels } from "@/service/program/position";
import { labelizeNamedData } from "@/shared/helpers";
import {
  useDispatch,
  flashError,
  flashSuccess,
} from "@/shared/components/flash";
import ApprovalFlowProgramHierarchy from "./ApprovalFlowProgramHierarchy";
import ApprovalFlowForm from "./ApprovalFlowForm";
import axios from "axios";
import ApprovalConfirmPopup from "./ApprovalConfirmPopup";

const ApprovalFlow = ({ organization, program }) => {
  const [approvers, setApprovers] = useState({});
  const [selectedApproverNotifications, setSelectedApproverNotifications] =
    useState({});
  const [availablePositionLevel, setAvailablePositionLevel] = useState([]);
  const [allowSameStepApproval, setAllowSameStepApproval] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [sameStepApproverRelation, setSameStepApproverRelation] = useState([]);
  const [selectedApprovarOptions, setApprovarRelationOptions] = useState({});
  const [sameStepApproverNotifications, setSameStepApproverNotifications] =
    useState({});
  const [step, setStep] = useState(1);
  const [selectPrograms, setSelectPrograms] = useState([]);
  const [selectProgramHierarchy, setSelectProgramHierarchy] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [confirmProgramHierarchy, setConfirmProgramHierarchy] = useState(false);
  const [name, setName] = useState("ApprovalFlow");
  const [approvalPopup, setApprovalPopup] = useState(false);

  const dispatch = useDispatch();

  const approvalPopupToggle = () => {
    setApprovalPopup((prev) => !prev);
  };

  useEffect(() => {
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
      axios
        .get(
          `organization/${organization.id}/program/${program.id}/program-approval-step`
        )
        .then((res) => {
          if (res.success == 200) {
            console.log("res", res);
          }
        });
    }
  }, [organization, program]);

  const getAvailableApproverOptions = (step) => {
    const selectedValues = Object.values(approvers).flat();
    return availablePositionLevel?.map((option) => ({
      ...option,
      isDisabled:
        selectedValues.some((selected) => selected.value === option.value) &&
        !approvers[step]?.some((selected) => selected.value === option.value),
    }));
  };

  const onApprovalFlowSubmit = () => {
    if (Object.keys(approvers).length > 0) {
      formData.program_id = [program?.id];
      if (!confirmProgramHierarchy) {
        axios
          .post(
            `organization/${organization.id}/program/${program.id}/program-approval-step`,
            formData
          )
          .then((res) => {
            if (res.status === 200) {
              setName("ApprovalFlow");
              flashSuccess(dispatch, "Approval flow successfully saved!");
              approvalPopupToggle();
            }
          })
          .catch((err) => {
            flashError(dispatch, err.message);
          });
      }
    }
  };

  const onClickApprovalRelationData = () => {
    const extractData = (approvers, notification) => {
      let obj = Object.keys(approvers)
        .filter((key) => !isNaN(key))
        .reduce((approval, key) => {
          approval.push({
            approver_ids: approvers[key]?.map((v) => v?.value),
            awarder_id: key,
            notification: notification[key]?.map((v) => v?.value),
            step: approvers.step,
          });
          return approval;
        }, []);
      return { data: obj };
    };

    setSameStepApproverRelation((prev) => [
      ...prev,
      ...extractData(selectedApprovarOptions, sameStepApproverNotifications)
        .data,
    ]);
  };

  let props = {
    formData,
    sameStepApproverRelation,
    allowSameStepApproval,
    approvers,
    selectedApproverNotifications,
    step,
    setStep,
    setApprovalPopup,
    setName,
    approvalPopupToggle,
    setApprovers,
    setSelectedApproverNotifications,
    setSelectedPositions,
    setAllowSameStepApproval,
    getAvailableApproverOptions,
    setFormData,
    setConfirmProgramHierarchy,
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {availablePositionLevel.length > 0 ? (
        <div>
          {name === "ApprovalFlow" && (
            <>
              <div className="form__form-group">
                <h4 className="form__form-group-label thick">Approval Flow</h4>
              </div>
              <ApprovalFlowForm
                {...props}
                program={program}
                organization={organization}
              />
            </>
          )}
          {name === "ApprovalFlowRelation" && (
            <ApprovalFlowRelation
              {...props}
              sameStepApproverNotifications={sameStepApproverNotifications}
              setSameStepApproverNotifications={
                setSameStepApproverNotifications
              }
              program={program}
              organization={organization}
              selectedPositions={selectedPositions}
              selectedApprovarOptions={selectedApprovarOptions}
              onClickApprovalRelationData={onClickApprovalRelationData}
              setApprovarRelationOptions={setApprovarRelationOptions}
            />
          )}
          {name === "ApprovalFlowProgramHierarchy" && (
            <ApprovalFlowProgramHierarchy
              {...props}
              program={program}
              organization={organization}
              selectPrograms={selectPrograms}
              selectProgramHierarchy={selectProgramHierarchy}
              setSelectPrograms={setSelectPrograms}
              setSelectProgramHierarchy={setSelectProgramHierarchy}
            />
          )}

          <ApprovalConfirmPopup
            modalOpen={approvalPopup}
            setModalOpen={setApprovalPopup}
            setName={setName}
            modalToggle={approvalPopupToggle}
            onApprovalFlowSubmit={onApprovalFlowSubmit}
          />
        </div>
      ) : (
        <p>No Position Level available</p>
      )}
    </>
  );
};

export default ApprovalFlow;
