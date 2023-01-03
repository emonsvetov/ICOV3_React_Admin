import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { Row, Col, ButtonToolbar, Button } from "reactstrap";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
// import WYSIWYGEditor from '@/shared/components/form/WYSIWYGEditor'
import renderToggleButtonField from "@/shared/components/form/ToggleButton";
import { useDispatch, flashSuccess, flashError } from "@/shared/components/flash"
import axios from "axios";

const EditEmailTemplateForm = ({onStep, organization, program, setStep, template, setTrigger}) => {
  const dispatch = useDispatch()
  // console.log(program)

  const [loading, setLoading] = useState(false);

  const onSubmit = (values) => {

    // console.log(values)
    delete values["id"]
    // return;
    
    axios
      .post(`/organization/${program.organization_id}/program/${program.id}/emailtemplate/${template.id}`, values)
      .then((res) => {
        //   console.log(res)
        if (res.status == 200) {
          setTrigger( Math.floor(Date.now() / 1000) )
          onStep(0);
          flashSuccess(dispatch, "Email Template updated")
        }
      })
      .catch((err) => {
        flashError(dispatch, err.response.data)
        setLoading(false);
      });
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      initialValues={template}
    >
    {({ handleSubmit, form, submitting, pristine, values }) => (
      <form className="form" onSubmit={handleSubmit}>
        <Row className="w100">
          <Col md="6" lg="6" xl="6">
            <h3 className="mb-4">Edit Email Template </h3>
          </Col>
          <Col md="6" lg="6" xl="6" className="text-right">
            <ButtonToolbar className="modal__footer flex justify-content-right w100">
              <Button
                outline
                color="primary"
                className="mr-3"
                onClick={() => setStep(0)}
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
                  <span className="form__form-group-label">Template Name</span>
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                      <input
                        type="text"
                        {...input}
                        placeholder="Template Name"
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
        <Row>
          <Col md="9" lg="9" xl="9">
            <div className="form__form-group">
              <span className="form__form-group-label">Content</span>
              <div className="form__form-group-field">
                <div className="form__form-group-row">
                  <Field
                    name="content"
                    // component={WYSIWYGEditor}
                    component="textarea"
                    type="text"
                  />
                  {!values.hasOwnProperty('content') &&
                    <span className="form__form-group-error">
                      Please enter content
                    </span>
                  }
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="6" lg="4" xl="4">
            <div className="form__form-group">
              <div className="form__form-group-field">
                <span
                  className="form__form-group-label"
                  style={{ width: "200%" }}
                >
                  Is Default
                </span>
                <Field
                  name="is_default"
                  component={renderToggleButtonField}
                />
              </div>
            </div>
          </Col>
        </Row>
      </form>
    )}
    </Form>
  );
};

const validate = values => {
  // console.log(values)
  let errors = {}
  if( String(values.name) === "" )
  {
    errors.name = 'Please enter name'
  }
  if( String(values.content).trim() === "" )
  {
    errors.content = 'Please enter content'
  }
  // console.log(errors)
  return errors;
}

export default withRouter(connect((state) => ({
  theme: state.theme,
  rtl: state.rtl,
  organization: state.organization
}))(EditEmailTemplateForm));
