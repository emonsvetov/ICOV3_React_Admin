import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Card, CardBody, Col, Table, Row, ButtonToolbar, Button } from "reactstrap";
import { Form, Field } from "react-final-form";
import PencilIcon from "mdi-react/PencilIcon";

import getCsvImportTypes from "@/service/getCsvImportTypes";

const ImportTypes = ({ organization }) => {
  const [importTypes, setImportTypes] = useState(null);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (organization?.id) {
      getCsvImportTypes(organization.id).then((res) => {
        console.log(res);
        setImportTypes(res);
      });
    }
  }, [organization]);

  const onClickEditImportType = (item) => {
    setEditing(item);
    console.log(item);
  };

  const ImportTypesTable = () => {
    const DataIndex = () => {
      return importTypes.map((row) => {
        return (
          <tr>
            <td>{row.id}</td>
            <td>{row.context}</td>
            <td>{row.name}</td>
            <td>{row.type}</td>
            <td>
              <PencilIcon
                size={18}
                className="link"
                onClick={() => onClickEditImportType(row)}
              />
            </td>
          </tr>
        );
      });
    };
    return (
      <Table bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>Context</th>
            <th>Name</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <DataIndex />
        </tbody>
      </Table>
    );
  };

  const EditImportType = ({ item, setEditing }) => {
    const [loading, setLoading] = useState(false);
    const onClickCancel = () => {
      setEditing(null)
    }
    const onSubmit = () => {
      console.log("submit");
    };
    const validate = () => {
      console.log("validate");
    };
    return (
      <Card>
        <CardBody style={{ display: "flex" }}>
          <Form
            mutators={{}}
            onSubmit={onSubmit}
            validate={validate}
            initialValues={item}
          >
            {({ handleSubmit, form, submitting, pristine, values }) => (
              <>
                <form className="form" onSubmit={handleSubmit}>
                  <Row className="w100 mb-3">
                    <Col>
                      <h4 className="mb-0">Edit Import Type</h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Field name="context">
                        {({ input, meta }) => (
                          <div className="form__form-group">
                            <span className="form__form-group-label">Context</span>
                            <div className="form__form-group-field">
                              <div className="form__form-group-row">
                                <input
                                  type="text"
                                  {...input}
                                  placeholder="Context"
                                />
                                {meta.touched && meta.error && (
                                  <span className="form__form-group-error">
                                    {meta.error}
                                  </span>
                                )}
                                <em>"Programs", "Events" or "Users"</em>
                              </div>
                            </div>
                          </div>
                        )}
                      </Field>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Field name="name">
                        {({ input, meta }) => (
                          <div className="form__form-group">
                            <span className="form__form-group-label">Name</span>
                            <div className="form__form-group-field">
                              <div className="form__form-group-row">
                                <input
                                  type="text"
                                  {...input}
                                  placeholder="Name"
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
                    <Col>
                      <Field name="type">
                        {({ input, meta }) => (
                          <div className="form__form-group">
                            <span className="form__form-group-label">Type</span>
                            <div className="form__form-group-field">
                              <div className="form__form-group-row">
                                <input
                                  type="text"
                                  {...input}
                                  placeholder="Type"
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
                    <Col>
                      <ButtonToolbar className="flex justify-content-right w100">
                        <Button
                          outline
                          color="primary"
                          className="mr-3"
                          onClick={onClickCancel}
                          size="sm"
                        >
                          Cancel
                        </Button>{" "}
                        <Button
                          type="submit"
                          disabled={loading}
                          className="btn btn-primary"
                          color="#ffffff"
                          size="sm"
                        >
                          Save
                        </Button>
                      </ButtonToolbar>
                    </Col>
                  </Row>
                </form>
              </>
            )}
          </Form>
        </CardBody>
      </Card>
    );
  };

  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <Row>
            <Col md={editing ? 8 : 12} lg={editing ? 8 : 12} sm={12} xs={12}>
              {importTypes && <ImportTypesTable />}
            </Col>
            {editing && (
              <Col md={4} lg={4} sm={12}>
                <EditImportType item={editing} setEditing={setEditing} />
              </Col>
            )}
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};
export default withRouter(
  connect((state) => ({
    organization: state.organization,
  }))(ImportTypes)
);
