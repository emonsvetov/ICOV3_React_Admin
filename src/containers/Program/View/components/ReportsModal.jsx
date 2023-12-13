import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ThemeProps, RTLProps } from "@/shared/prop-types/ReducerProps";
import CheckboxField from "@/shared/components/form/CheckboxField";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  ButtonToolbar,
  Row,
  Col,
} from "reactstrap";
import { Form } from "react-final-form";
import formValidation from "@/shared/validation/program-engagement";
import axios from "axios";
import { sendFlashMessage } from "@/shared/components/flash";
import { getProgramAction } from "@/redux/actions/programActions";

const ReportsModal = ({
  dispatch,
  data,
  isOpen,
  toggle,
  theme,
  rtl,
}) => {
  const [loading, setLoading] = useState(false);
  const [checkboxOptions, setCheckboxOptions] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("/reports");
        setCheckboxOptions(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();

    if (isOpen) {
      setSelectedCheckboxes(data.selected_reports || []);
    }
  }, [isOpen]);  

  const handleCheckboxChange = (checkboxId) => {
    setSelectedCheckboxes((prevSelected) => {
      if (prevSelected.includes(checkboxId)) {
        return prevSelected.filter((id) => id !== checkboxId);
      } else {
        return [...prevSelected, checkboxId];
      }
    });
  };

  const onSubmitForm = async (values) => {
    setLoading(true);

    const dataToSend = {
      ...data,
      selected_reports: selectedCheckboxes,
    };

    try {
      const response = await axios.put(
        `/organization/${data.organization_id}/program/${data.id}/save-selected-reports`,
        dataToSend
      );

      setLoading(false);

      if (response.status === 200) {
        dispatch(
          sendFlashMessage("Program has been updated", "alert-success", "top")
        );
        dispatch(getProgramAction(data.organization_id, data.id));
      }
    } catch (e) {
      setLoading(false);
      dispatch(
        sendFlashMessage("Program could not be updated", "alert-danger", "top")
      );
      throw new Error(`API error: ${e?.message}`);
    }
  };


  return (
    <Modal
      className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`}
      isOpen={isOpen}
      toggle={toggle}
    >
      <Form
        onSubmit={onSubmitForm}
        validate={(values) => formValidation.validateForm(values)}
      >
        {({ handleSubmit, form, submitting, pristine, values }) => (
          <form className="form" onSubmit={handleSubmit}>
            <ModalHeader className="w100">
              <Row className="w100">
                <Col md="6" lg="6" xl="6">
                  <h3>Reports</h3>
                </Col>
                <Col md="6" lg="6" xl="6" className="text-right">
                  <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button
                      outline
                      color="primary"
                      className="mr-3"
                      onClick={toggle}
                    >
                      Close
                    </Button>{" "}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                      color="#ffffff"
                    >
                      Save
                    </Button>
                  </ButtonToolbar>
                </Col>
              </Row>
            </ModalHeader>
            <ModalBody className="modal-lg">
              <Row>
                <Col>
                  <h4 className="padding-10">
                    Selection of reports that will be available in the program.:
                  </h4>
                </Col>
              </Row>
              <Row>
                {checkboxOptions.map((option) => (
                  <Col md="6" lg="4" xl="4" key={option.id}>
                    <div className="form__form-group">
                      <CheckboxField
                        name={`w${option.id}`}
                        label={option.name}
                        checked={selectedCheckboxes.includes(option.id)}
                        onChange={() => handleCheckboxChange(option.id)}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </ModalBody>
            
          </form>
        )}
      </Form>
    </Modal>
  );
};

ReportsModal.propTypes = {
  theme: ThemeProps.isRequired,
  rtl: RTLProps.isRequired,
  data: Object.isRequired,
};

export default withRouter(
  connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
    data: state.program,
  }))(ReportsModal)
);

