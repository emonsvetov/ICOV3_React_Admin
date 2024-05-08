import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Table,
  Row,
  ButtonToolbar,
  Button,
} from "reactstrap";
import { Form, Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import PencilIcon from "mdi-react/PencilIcon";
import SelectGroupIcon from "mdi-react/SelectGroupIcon";
import axios from "axios";

import getCsvImportTypes from "@/service/getCsvImportTypes";
import {
  useDispatch,
  flashError,
  flashSuccess,
} from "@/shared/components/flash";

const getImportTypeFields = async (organizationId, importtype) => {
  try {
    const url = `/organization/${organizationId}/importtype/${importtype.id}/fields`;
      const response = await axios.get(url);
      return response.data;
  } catch (e) {
      throw new Error(`API error:${e?.message}`);
  }
}

const ImportTypes = ({ organization }) => {
  const [importTypes, setImportTypes] = useState(null);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    if (organization?.id) {
      getCsvImportTypes(organization.id).then((res) => {
        setImportTypes(res);
      });
    }
  }, [organization]);

  const onClickEditImportType = (item) => {
    setAdding(null);
    setEditing(item);
  };

  const onClickAddImportType = () => {
    setEditing(null);
    setAdding(true);
  };

  const ImportTypesTable = () => {
    const DataIndex = () => {
      const [currentItem, setCurrentItem] = useState(null);
      useEffect(() => {
        if (currentItem) {
        }
      }, [currentItem]);
      const onClickImportTypeField = (item) => {
        setCurrentItem(item);
      };

      const FieldEditor = ({ item }) => {
        const FieldsForm = ({ item }) => {
          const dispatch = useDispatch();
          const [loading, setLoading] = useState(false);
          const [savedFields, setSavedFields] = useState(null);
          useEffect(() => {
            // console.log("item to edit");
            // console.log(item);
            getImportTypeFields(organization.id, item)
            .then( res => {
              console.log(res)
              setSavedFields(res.fields)
            })
          }, [item]);
          const onClickCancel = () => {
            setCurrentItem(null);
          };
          const onSubmit = async (values) => {
            // console.log(values);
            // return;
            try {
              const url = `/organization/${organization.id}/importtype/${item.id}/fields`;
              const response = await axios.put(url, values);
              if (response.status === 200) {
                getImportTypeFields(organization.id, item)
                .then( res => {
                  setSavedFields(res.fields)
                })
                flashSuccess(dispatch, "Csv Import Type fields saved!");
              } else {
                flashError(dispatch, "Csv Import Type fields could not be saved!");
              }
            } catch (e) {
              flashError(dispatch, "Csv Import Type fields could not be saved!");
              throw new Error(`API error:${e?.message}`);
            }
          };
          const validate = (values) => {
            let errors = {};
            // if( !values.name ) errors.name = "Name is a required field"
            // if( !values.context ) errors.context = "Context is a required field"
            // if( !values.type ) errors.type = "Type is a required field"
            return errors;
          };
          return (
            <Card>
              <CardBody style={{ display: "flex" }}>
                <Form
                  onSubmit={onSubmit}
                  validate={validate}
                  mutators={{
                    ...arrayMutators,
                  }}
                  initialValues={{
                    fields: savedFields
                }}
                >
                  {({
                    handleSubmit,
                    form: {mutators: { push, pop }},
                    submitting,
                    pristine,
                    values,
                  }) => (
                    <>
                      <form className="form" onSubmit={handleSubmit}>
                        <Row className="w100 mb-3">
                          <Col className="pl-0">
                            <h4 className="mb-0"><strong>{item.name}</strong> fields</h4>
                            <p>"Name" is the name of field in the database table. example, <em>program_id</em><br/>"Rule" is the rule one would put in "FormRequest" class instance. example, <em>required|string</em>. Any additional validation rule must be added via middleware.</p>
                          </Col>
                        </Row>
                        <Row>
                          <ButtonToolbar className="flex justify-content-left">
                            <Button
                              color="primary"
                              className="mr-3"
                              onClick={() => push("fields", undefined)}
                              size="xs"
                            >
                              Add Field
                            </Button>{" "}
                            <Button
                              className="btn btn-primary"
                              color="#ffffff"
                              size="xs"
                              onClick={() => pop("fields", undefined)}
                            >
                              Remove Field
                            </Button>
                          </ButtonToolbar>
                        </Row>
                        <Row>
                          <Col md={1}><label>#</label></Col>
                          <Col md={3}>Field Name</Col>
                          <Col md={4}>Ruleset</Col>
                          <Col md={3}>CSVColumnName</Col>
                          <Col md={1}>Action</Col>
                        </Row>
                        <FieldArray name="fields">
                          {({ fields }) =>
                            fields.map((name, index) => (
                              <Row className="w100" key={name}>
                                <Col md={1}><label>{index + 1}</label></Col>
                                <Col md={3}>
                                  <Field
                                    name={`${name}.id`}
                                    component="input"
                                    type="hidden"
                                  />
                                  <Field
                                    name={`${name}.name`}
                                    component="input"
                                    placeholder="field_name"
                                  />
                                </Col>
                                <Col md={4}>
                                  <Field
                                    name={`${name}.rule`}
                                    component="input"
                                    placeholder="Ruleset"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Field
                                    name={`${name}.csv_column_name`}
                                    component="input"
                                    placeholder="CSVColumnName"
                                  />
                                </Col>
                                <Col md={1}>
                                  <span
                                    onClick={() => fields.remove(index)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    ❌
                                  </span>
                                </Col>
                              </Row>
                            ))
                          }
                        </FieldArray>
                        <Row className="mt-4">
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

        if (!currentItem) return null;
        if (item.id !== currentItem.id) return null;
        return (
          <>
            <tr>
              <td colSpan={5}>
                <Card>
                  <CardBody>
                    <FieldsForm item={item} />
                  </CardBody>
                </Card>
              </td>
            </tr>
          </>
        );
      };
      return importTypes.map((row) => {
        return (
          <>
            <tr>
              <td>{row.id}</td>
              <td>{row.context}</td>
              <td>{row.name}</td>
              <td>{row.type}</td>
              <td>
                <span onClick={() => onClickEditImportType(row)} className="link">
                  <PencilIcon
                    size={18}
                    xlinkTitle="Edit Type"
                  />Edit
                </span>{' | '}
                <span onClick={() => onClickImportTypeField(row)} className="link">
                <SelectGroupIcon
                  size={18}
                  title="Show Type fields"
                />Fields
                </span>
              </td>
            </tr>
            <FieldEditor item={row} />
          </>
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
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const onClickCancel = () => {
      setEditing(null);
    };
    const onSubmit = async (values) => {
      try {
        const url = `/organization/${organization.id}/importtype/${item.id}`;
        const response = await axios.put(url, values);
        if (response.status === 200) {
          flashSuccess(dispatch, "Csv Import Type saved!");
        } else {
          flashError(dispatch, "Csv Import Type could not be saved!");
        }
      } catch (e) {
        flashError(dispatch, "Csv Import Type could not be saved!");
        throw new Error(`API error:${e?.message}`);
      }
    };
    const validate = (values) => {
      let errors = {};
      if (!values.name) errors.name = "Name is a required field";
      if (!values.context) errors.context = "Context is a required field";
      if (!values.type) errors.type = "Type is a required field";
      return errors;
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
                            <span className="form__form-group-label">
                              Context
                            </span>
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
  const AddImportType = ({ item, setAdding }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const onClickCancel = () => {
      setAdding(null);
    };
    const onSubmit = async (values) => {
      try {
        const url = `/organization/${organization.id}/importtype`;
        const response = await axios.post(url, values);
        if (response.status === 200) {
          flashSuccess(dispatch, "Csv Import Type saved!");
        } else {
          flashError(dispatch, "Csv Import Type could not be saved!");
        }
      } catch (e) {
        flashError(dispatch, "Csv Import Type could not be saved!");
        throw new Error(`API error:${e?.message}`);
      }
    };
    const validate = (values) => {
      let errors = {};
      if (!values.name) errors.name = "Name is a required field";
      if (!values.context) errors.context = "Context is a required field";
      if (!values.type) errors.type = "Type is a required field";
      return errors;
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
                      <h4 className="mb-0">Add Import Type</h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Field name="context">
                        {({ input, meta }) => (
                          <div className="form__form-group">
                            <span className="form__form-group-label">
                              Context
                            </span>
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
            <Col md={12}>
              <Button
                color="primary"
                className="mr-3 float-right"
                onClick={onClickAddImportType}
                size="sm"
              >
                Add Import Type
              </Button>
            </Col>
          </Row>
          <Row>
            <Col
              md={adding || editing ? 8 : 12}
              lg={adding || editing ? 8 : 12}
              sm={12}
              xs={12}
            >
              {importTypes && <ImportTypesTable />}
            </Col>
            {editing && (
              <Col md={4} lg={4} sm={12}>
                <EditImportType item={editing} setEditing={setEditing} />
              </Col>
            )}
            {adding && (
              <Col md={4} lg={4} sm={12}>
                <AddImportType setAdding={setAdding} />
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
