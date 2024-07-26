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

const unpatchData = (approvalData) => {
  let approvers = {};
  let approval_relations = {};
  let notifications = {};
  let totalStep = 0;
  approvalData?.map((approvals) => {
    totalStep++;
    let step = approvals.step;
    approvals?.approval_relations?.map((ar) => {
      approval_relations[ar.awarder_position_id] = [
        {
          label: ar?.approver_position_level?.title,
          value: ar?.approver_position_level?.id,
        },
      ];
    });
    approvers[step] = approvals?.program_approval_assignment?.map((pa) => ({
      label: pa?.position_level?.title,
      value: pa?.position_level?.id,
    }));
  });

  return {
    totalStep,
    approvers,
    notifications,
    approval_relations,
  };
};

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
          if (res.status == 200) {
            const { totalStep, approvers, notifications, approval_relations } =
              unpatchData(res?.data);
            if (totalStep && Object.keys(approvers).length > 0) {
              setStep(totalStep);
              setApprovers(approvers);
              //setSelectedApproverNotifications(notifications);
              if (Object.keys(approval_relations).length > 0) {
                setAllowSameStepApproval(true);
                setApprovarRelationOptions(approval_relations);
                setSameStepApproverNotifications(approval_relations);
              }
            }
            setLoading(false);
          }
        })
        .catch((error) => {
          flashError(dispatch, error.message);
          setLoading(false);
        });
    }
  }, [organization, program]);

  const onApprovalFlowSubmit = () => {
    if (Object.keys(approvers).length > 0) {
      formData.program_id = [program?.id];
      if (!confirmProgramHierarchy) {
        console.log(formData);
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
    availablePositionLevel,
    step,
    setStep,
    setApprovalPopup,
    setName,
    approvalPopupToggle,
    setApprovers,
    setSelectedApproverNotifications,
    setSelectedPositions,
    setAllowSameStepApproval,
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
