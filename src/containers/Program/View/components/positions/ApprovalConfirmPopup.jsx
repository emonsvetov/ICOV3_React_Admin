import React from "react";
import {
  Modal,
  ModalBody,
  Row,
  Col,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

const ApprovalConfirmPopup = ({ isOpen, toggle, setConfirmProgramHierarchy }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader>Confirm</ModalHeader>
      <ModalBody>
        Would you like to save this approval flow across the entire program
        hierarchy?
      </ModalBody>
    </Modal>
  );
};

export default ApprovalConfirmPopup;
