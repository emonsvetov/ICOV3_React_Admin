import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Field } from "react-final-form";
import { Button, ButtonToolbar, Row, Col } from "reactstrap";
import {
  useDispatch,
  flashSuccess,
  flashError,
} from "@/shared/components/flash";
import { getPositionLevel } from "@/service/program/position";
import CheckboxField from "@/shared/components/form/CheckBox";

const EditPositionLevel = ({ program, onStep, positionId }) => {
  const [positionLevel, setPositionLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (program.id && program.organization_id && program) {
      setLoading(true);
      getPositionLevel(program, positionId).then((res) => {
        setPositionLevel(res);
        setLoading(false);
      });
    }
  }, [program, positionId]);

  const onSubmit = (values) => {
    // console.log("values", values);
    axios
      .put(
        `/organization/${program.organization_id}/program/${program.id}/positionlevel/${positionId}`,
        values
      )
      .then((res) => {
        if (res.status == 200) {
          flashSuccess(dispatch, "Position level saved!");
          onStep(0);
        }
      })
      .catch((err) => {
        flashError(dispatch, err.response.data);
        setLoading(false);
      });
  };

  const onClickBack = () => {
    onStep(0);
  };
  if (loading || !positionLevel) {
    return <p>Loading...</p>;
  }
  if (positionLevel) {
    return (
      <>
        <Form
          // mutators={{}}
          onSubmit={onSubmit}
          initialValues={{
            title: positionLevel?.title,
            name: positionLevel?.name,
            level: positionLevel?.level,
            status: positionLevel?.status,
          }}
        >
          {({ handleSubmit, form, submitting, pristine, values }) => (
            <form className="form" onSubmit={handleSubmit}>
              <Row className="w100">
                <Col md="6" lg="6" xl="6">
                  <h3 className="mb-4">Edit Position Level</h3>
                </Col>
                <Col md="6" lg="6" xl="6" className="text-right">
                  <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button
                      outline
                      color="primary"
                      className="mr-3"
                      onClick={onClickBack}
                    >
                      Back
                    </Button>{" "}
                    <Button
                      type="submit"
                      className="btn btn-primary"
                      color="#ffffff"
                      disabled={loading}
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
                            <input type="text" {...input} placeholder="Title" />
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
                <Col>
                  <Field name="name">
                    {({ input, meta }) => (
                      <div className="form__form-group">
                        <span className="form__form-group-label">Name </span>
                        <div className="form__form-group-field">
                          <div className="form__form-group-row">
                            <input type="text" {...input} placeholder="name" />
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
                <Col>
                  <Field name="level">
                    {({ input, meta }) => (
                      <div className="form__form-group">
                        <span className="form__form-group-label">Level </span>
                        <div className="form__form-group-field">
                          <div className="form__form-group-row">
                            <input type="text" {...input} placeholder="level" />
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
              <Row>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <Field
                      name="status"
                      label="Active"
                      type="checkbox"
                      component={CheckboxField}
                      parse={(value) => {
                        return value ? 1: 0;
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </form>
          )}
        </Form>
      </>
    );
  }
};

export default EditPositionLevel;
