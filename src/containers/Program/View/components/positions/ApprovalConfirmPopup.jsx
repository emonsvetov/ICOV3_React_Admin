import CloseIcon from "mdi-react/CloseIcon";
import React from "react";
import {
  Modal,
  ModalBody,
  ButtonToolbar,
  ModalFooter,
  Row,
  Col,
  Button,
} from "reactstrap";

const ApprovalConfirmPopup = ({
  modalOpen,
  modalToggle,
  setModalName,
  setConfirmProgramHierarchy,
}) => {
  return (
    <>
      <Modal isOpen={modalOpen} toggle={modalToggle}>
        <Row>
          <Col md="6" lg="6" xl="6">
            <h3 className="bold-text">Confirm</h3>
          </Col>
          <Col md="6" lg="6" xl="6" className="text-right">
            <Button
              outline
              color="ffff"
              type="button"
              className="btn btn-primary"
              onClick={() => modalToggle()}
            >
              Close
            </Button>
          </Col>
        </Row>

        <ModalBody className="w-100">
          Would you like to save this approval flow across the entire program
          hierarchy?
        </ModalBody>
        <ModalFooter className="w-100">
          <ButtonToolbar>
            <Button
              onClick={() => setConfirmProgramHierarchy(false)}
              color="ffff"
              type="button"
              className="btn btn-secondary"
            >
              No, only for this Program
            </Button>

            <Button
              color="ffff"
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setModalName("ApprovalFlowHierarchy");
                setConfirmProgramHierarchy(true);
                modalToggle();
              }}
              size="md"
            >
              Yes, Save to Hierarchy
            </Button>
          </ButtonToolbar>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ApprovalConfirmPopup;
