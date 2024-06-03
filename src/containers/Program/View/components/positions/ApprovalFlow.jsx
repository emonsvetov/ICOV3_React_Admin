import React, { useState } from "react";
import CheckboxField from "@/shared/components/form/CheckboxField";
import { Row, Col, Button } from "reactstrap";
import { Field, Form } from "react-final-form";
import renderSelectField from "@/shared/components/form/Select";

const ApprovalFlow = () => {
  const [approvalSteps, setApprovalsteps] = useState([1]);
  const [enableApprovalSteps, setEnableApprovalsteps] = useState(false);
  const [selectedApprovalFlow, setSelectedApprovalFlow] = useState({});

  let approverOptions = [
    { label: "Demo", value: "2" },
    { label: "test", value: "1" },
    { label: "check", value: "3" },
    { label: "Active", value: "4" },
  ];

  const onClickAddSteps = () => {
    let newStep = approvalSteps.length + 1;
    setApprovalsteps([...approvalSteps, newStep]);
  };
  const onSubmit = (values) => {
    console.log(values);
  };

  const handleSelectApprovalFlowChange = (step, value) => {
    setSelectedApprovalFlow({
      ...selectedApprovalFlow,
      [step]: value,
    });
  };

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
                  onClick={onClickAddSteps}
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
                    Total Steps:{approvalSteps.length}
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
            {approvalSteps.map((step, index) => (
              <Row className="w100 mb-2" key={index}>
                <Col md="4" lg="4" xl="4">
                  <span className="mb-4">Step {step} :</span>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <Field name={`approvers_${step}`}>
                    {({ input, meta }) => (
                      <>
                        <Field
                          name={`approvers_${step}`}
                          component={renderSelectField}
                          options={approverOptions}
                          onChange={(value) =>
                            handleSelectApprovalFlowChange(step, value)
                          }
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
                  <Field name={`notifications_${step}`}>
                    {({ input, meta }) => (
                      <>
                        <input type="text" {...input} />
                        {meta.touched && meta.error && (
                          <span className="form__form-group-error">
                            {meta.error}
                          </span>
                        )}
                      </>
                    )}
                  </Field>
                </Col>
                {enableApprovalSteps && (
                  <Button className="btn btn-primary" color="ffff" size="sm">
                    Define Relations
                  </Button>
                )}
              </Row>
            ))}
          </form>
        )}
      </Form>
    </>
  );
};

export default ApprovalFlow;
