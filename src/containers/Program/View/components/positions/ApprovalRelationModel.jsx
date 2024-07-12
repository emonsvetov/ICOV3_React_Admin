import React, { useState } from "react";
import { Modal, ModalBody, Row, Col, ModalFooter } from "reactstrap";
import CloseIcon from "mdi-react/CloseIcon";
import CreatableSelect from "react-select/creatable";

const ApprovalRelationModel = ({
  isOpen,
  toggle,
  theme,
  rtl,
  defineRelationNotification,
  setDefineRelationNotification,
  selectedApprovers,
}) => {
  const [approverRelation, setApproverRelation] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedApproverNotification, setSelectedApproverNotification] =
    useState([]);
  //console.log(selectedOptions);
  const createOptions = (currentItem) =>
    selectedApprovers
      ?.filter((item, i) => i !== currentItem)
      ?.map((item) => item);

  const createNotificationOptions = (approver) => {
    return selectedApproverNotification
      ?.filter((item, i) => item.value !== approver.value)
      ?.map((item) => item);
  };

  const handleApproverChange = (position, step) => {
    setApproverRelation(position);
    setSelectedOptions((prevState) => ({
      ...prevState,
      [step]: position,
    }));
    setSelectedApproverNotification((prevState) => [...prevState, ...position]);
  };

  const handleApproverNotification = (position, step) => {
    setDefineRelationNotification((prevState) => ({
      ...prevState,
      [step]: position,
    }));
  };

  return (
    <Modal
      className={`modal-program programTemplateModal modal-lg ${theme.className} ${rtl.direction}-support`}
      isOpen={isOpen}
      toggle={toggle}
    >
      <div className="close cursor-pointer">
        <CloseIcon onClick={toggle} size={30} />
      </div>
      <div className="p-1">
        <h3>Define Relations</h3>
        <h5 className="subhead">Create/Relations between position </h5>
      </div>
      <ModalBody>
        <div className="mt-2 mb-2">
          <Row>
            <Col>
              {" "}
              <h5>Awarder</h5>
            </Col>
            <Col>
              <h5>Approvers</h5>
            </Col>
            <Col>
              <h5>Notifications</h5>
            </Col>
          </Row>
        </div>
        <div className="m-2 p-1">
          {selectedApprovers?.map((approver, i) => (
            <Row className="mt-2" key={i}>
              <Col md="4" lg="4" xl="4">
                <h6> {approver.label}</h6>
              </Col>
              <Col md="4" lg="4" xl="4">
                <CreatableSelect
                  options={createOptions(i)}
                  value={selectedOptions[i]}
                  onChange={(position) => handleApproverChange(position, i)}
                  isMulti
                />
              </Col>
              <Col md="4" lg="4" xl="4">
                <CreatableSelect
                  options={createNotificationOptions(approver)}
                  value={defineRelationNotification[i]}
                  onChange={(position) =>
                    handleApproverNotification(position, i)
                  }
                  isMulti
                />
              </Col>
            </Row>
          ))}
        </div>
        <p className="mt-2 pt-2 text-primary">
          The Details will be saved when the Approval Flow is saved.
        </p>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={toggle}>
          Save (When Approval Flow is saved)
        </button>
        <button className="btn btn-secondary" onClick={toggle}>
          Cancel
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ApprovalRelationModel;
