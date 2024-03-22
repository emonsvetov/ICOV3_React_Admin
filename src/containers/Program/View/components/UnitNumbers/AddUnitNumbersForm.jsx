import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { Row, Col, ButtonToolbar, Button } from "reactstrap";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import {
  useDispatch,
  flashSuccess,
  flashError,
} from "@/shared/components/flash";

const AddEventForm = ({ onStep, program }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onSubmit = (values) => {
    axios
      .post(
        `/organization/${program.organization_id}/program/${program.id}/unitnumber`,
        values
      )
      .then((res) => {
        if (res.status == 200) {
          onStep(0);
          flashSuccess(dispatch, "Unit number created successfully");
        }
      })
      .catch((err) => {
        flashError(dispatch, err.response.data);
        setLoading(false);
      });
  };

  const onClickCancel = () => {
    onStep(0);
  };

  return (
    <>
      <Form onSubmit={onSubmit} initialValues={{}}>
        {({ handleSubmit, form, submitting, pristine, values }) => (
          <>
            <form className="form" onSubmit={handleSubmit}>
              <Row className="w100">
                <Col md="6" lg="6" xl="6">
                  <h3 className="mb-4">Unit Number Information </h3>
                </Col>
                <Col md="6" lg="6" xl="6" className="text-right">
                  <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button
                      outline
                      color="primary"
                      className="mr-3"
                      onClick={onClickCancel}
                    >
                      Cancel
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
              <Row>
                <Col md="6" lg="4" xl="4">
                  <Field name="name">
                    {({ input, meta }) => (
                      <div className="form__form-group">
                        <span className="form__form-group-label">Unit</span>
                        <div className="form__form-group-field">
                          <div className="form__form-group-row">
                            <input type="text" {...input} placeholder="unit" />
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
                  <Field name="description">
                    {({ input, meta }) => (
                      <div className="form__form-group">
                        <span className="form__form-group-label">
                          Description
                        </span>
                        <div className="form__form-group-field">
                          <div className="form__form-group-row">
                            <input type="text" {...input} />
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
          </>
        )}
      </Form>
    </>
  );
};

export default withRouter(
  connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
  }))(AddEventForm)
);
