import React from "react";
import axios from "axios";
import { Form, Field } from "react-final-form";
import { Button, ButtonToolbar, Row, Col } from "reactstrap";
import {
  useDispatch,
  flashSuccess,
  flashError,
} from "@/shared/components/flash";

const AddPositionLevels = ({ onStep, program }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const onClickBack = () => {
    onStep(0);
  };

  const onSubmit = async (values) => {
    axios
      .post(
        `/organization/${program.organization_id}/program/${program.id}/positionlevel`,
        values
      )
      .then((res) => {
        if (res.status == 200) {
          onStep(0);
          flashSuccess(dispatch, "Position level created successfully");
        }
      })
      .catch((err) => {
        flashError(dispatch, err.response.data);
        setLoading(false);
      });
  };
  return (
    <>
      <Form mutators={{}} onSubmit={onSubmit} initialValues={{}}>
        {({ handleSubmit, form, submitting, pristine, values }) => (
          <form className="form" onSubmit={handleSubmit}>
            <Row className="w100">
              <Col md="6" lg="6" xl="6">
                <h3 className="mb-4">Add a Position</h3>
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
            </Row>
          </form>
        )}
      </Form>
    </>
  );
};

export default AddPositionLevels;
