import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import { Button, ButtonToolbar, Row, Col } from "reactstrap";
import renderSelectField from "@/shared/components/form/Select";
import axios from "axios";

const getPositionLevel = async (program, postionAssignpermissionId) => {
  try {
    const response = await axios.get(
      `/organization/${program.organization_id}/program/${program.id}/positionlevel/${postionAssignpermissionId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`API error:${error?.message}`);
  }
};

const AssignPermissionPositionLevels = ({
  program,
  onStep,
  postionAssignPermissionId,
}) => {
  const [loading, setLoading] = useState(false);
  const [positionLevel, setPositionLevel] = useState(null);

  useEffect(() => {
    if (program.id && program.organization_id && postionAssignPermissionId) {
      setLoading(true);
      getPositionLevel(program, postionAssignPermissionId).then((res) => {
        setPositionLevel(res.data[0]);
        setLoading(false);
      });
    }
  }, [program, postionAssignPermissionId]);

  const onSubmit = (values) => {
    console.log(values);
  };

  if (positionLevel) {
    return (
      <>
        <Form
          mutators={{}}
          onSubmit={onSubmit}
          initialValues={{
            title: positionLevel?.title,
          }}
        >
          {({ handleSubmit, form, submitting, pristine, values }) => (
            <form className="form" onSubmit={handleSubmit}>
              <Row className="w100">
                <Col md="6" lg="6" xl="6">
                  <h3 className="mb-4">Assign Position Permissions</h3>
                </Col>
                <Col md="6" lg="6" xl="6" className="text-right">
                  <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button
                      outline
                      color="primary"
                      className="mr-3"
                      onClick={() => onStep(0)}
                    >
                      Back
                    </Button>{" "}
                    <Button
                      type="submit"
                      className="btn btn-primary"
                      color="#ffffff"
                    >
                      Save
                    </Button>
                  </ButtonToolbar>
                </Col>
              </Row>
              <Row>
                <Col md="6" lg="4" xl="4">
                  <Field name="title">
                    {({ input, meta }) => (
                      <div className="form__form-group">
                        <span className="form__form-group-label">Title </span>
                        <div className="form__form-group-field">
                          <div className="form__form-group-row">
                            <input
                              type="text"
                              {...input}
                              placeholder="Title"
                              disabled={true}
                            />
                            {meta.touched && meta.error && (
                              <span className="form__form-group-error">
                                {meta.error}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Field>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <Field name="assign_permission">
                    {({ input, meta }) => (
                      <div className="form__form-group">
                        <span className="form__form-group-label">
                          Assign Permission{" "}
                        </span>
                        <div className="form__form-group-field">
                          <div className="form__form-group-row">
                            <Field
                              component={renderSelectField}
                              name="assign_permission"
                              // options={}
                              // onChange={}
                            />
                            {meta.touched && meta.error && (
                              <span className="form__form-group-error">
                                {meta.error}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Field>
                </Col>
              </Row>
            </form>
          )}
        </Form>
      </>
    );
  }
};

export default AssignPermissionPositionLevels;
