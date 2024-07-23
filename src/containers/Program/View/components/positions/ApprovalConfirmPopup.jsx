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
  setName,
  onApprovalFlowSubmit,
}) => {
  return (
    <>
      <Modal
        isOpen={modalOpen}
        className={`modal-small modal-md p-0`}
        toggle={modalToggle}
      >
        <div className="close cursor-pointer">
          <CloseIcon
            onClick={() => {
              setName("ApprovalFlow");
              modalToggle();
            }}
            size={30}
          />
        </div>
        <Row>
          <Col md="6" lg="6" xl="6">
            <h3 className="bold-text">Confirm</h3>
          </Col>
        </Row>
        <Row>
          <Col md="12" lg="12" xl="12">
            <ModalBody>
              <p style={{ fontSize: "16px", textAlign: "justify" }}>
                {" "}
                Would you like to save this approval flow across the entire
                program hierarchy?
              </p>
            </ModalBody>
          </Col>
        </Row>
        <ModalFooter className="w-100">
          <ButtonToolbar>
            <Button
              color="ffff"
              type="submit"
              onClick={onApprovalFlowSubmit}
              className="btn btn-secondary"
            >
              No, only for this Program
            </Button>

            <Button
              color="ffff"
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setName("ApprovalFlowProgramHierarchy");
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
