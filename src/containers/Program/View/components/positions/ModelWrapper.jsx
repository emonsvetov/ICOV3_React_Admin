import React from "react";
import ApprovalFlowHierarchyModal from "./ApprovalFlowHierarchyModal";
import ApprovalRelationModel from "./ApprovalRelationModel";
import ApprovalConfirmPopup from "./ApprovalConfirmPopup";

const ModelWrapper = (props) => {
  const { modalName, ...rest } = props;

  return (
    <>
      {/* {name === "ApprovalFlow" && <ApprovalFlow {...rest} />} */}
      {modalName === "ApprovalFlowRelation" && (
        <ApprovalRelationModel {...rest} />
      )}
      {modalName === "ApprovalFlowHierarchy" && (
        <ApprovalFlowHierarchyModal {...rest} />
      )}
      {modalName === "ApprovalFlowConfirmation" && (
        <ApprovalConfirmPopup {...rest} />
      )}
    </>
  );
};

export default ModelWrapper;
