import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import { Button, ButtonToolbar, Row, Col } from "reactstrap";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import { labelizeNamedData } from "@/shared/helpers";
import {
  useDispatch,
  flashSuccess,
  flashError,
} from "@/shared/components/flash";
import {
  getPositionLevel,
  getPositionAssignPermissions,
  getPermissions,
} from "@/service/program/position";

const AssignPermissionPositionLevels = ({
  program,
  onStep,
  postionAssignPermissionId,
}) => {
  const [loading, setLoading] = useState(false);
  const [positionLevel, setPositionLevel] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [assignPermissions, setAssignPermissions] = useState([]);
  const dispatch = useDispatch();
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "400px",
    }),
  };

  useEffect(() => {
    if (program.id && program.organization_id && postionAssignPermissionId) {
      setLoading(true);
      getPositionLevel(program, postionAssignPermissionId).then((position) => {
        setPositionLevel(position.data[0]);
        setLoading(false);
      });
      getPermissions(program).then((permissions) => {
        setPermissions(labelizeNamedData(permissions.data));
      });
    }
  }, [program, postionAssignPermissionId]);

  useEffect(() => {
    if (program.id && program.organization_id && postionAssignPermissionId) {
      getPositionAssignPermissions(program, postionAssignPermissionId).then(
        (response) => {
          setAssignPermissions(labelizeNamedData(response, ["id", "title"]));
        }
      );
    }
  }, [program, postionAssignPermissionId]);

  const handlePermmissionChange = (permissionOptions) => {
    setAssignPermissions(permissionOptions);
  };

  if (loading || !positionLevel) {
    return <p>Loading...</p>;
  }

  function getAssignPermissionIds(permissions) {
    if (permissions?.length > 0) {
      const permissionIds = permissions?.map((permission) => permission.value);
      return permissionIds;
    }
  }

  const onSubmit = (values) => {
    if (values?.position_permission?.length > 0) {
      values.position_permission = getAssignPermissionIds(
        values?.position_permission
      );
      setLoading(true);
      axios
        .post(
          `/organization/${program.organization_id}/program/${program.id}/positionlevel/${postionAssignPermissionId}/assign-permissions`,
          values
        )
        .then((res) => {
          if (res.status === 200) {
            onStep(0);
            flashSuccess(
              dispatch,
              "Position level assign permission successfully"
            );
          }
        })
        .catch((err) => {
          flashError(dispatch, err.response.data);
          setLoading(false);
        });
    } else {
      flashError(dispatch, "The Assign Permission field is required.");
    }
  };
  if (positionLevel) {
    return (
      <>
        <Form
          mutators={{}}
          onSubmit={onSubmit}
          initialValues={{ position_permission: assignPermissions }}
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
                      disabled={loading}
                    >
                      Save
                    </Button>
                  </ButtonToolbar>
                </Col>
              </Row>
              <Row>
                <Col md="6" lg="4" xl="4">
                  <span className="form__form-group-label">Position Name </span>
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                      <h5>{positionLevel?.title}</h5>
                    </div>
                  </div>
                </Col>
                <Col md="6" lg="6" xl="6">
                  <Field name="position_permission">
                    {({ input, meta }) => (
                      <div className="form__form-group">
                        <span className="form__form-group-label">
                          Assign Permission{" "}
                        </span>
                        <div className="form__form-group-field">
                          <div className="form__form-group-row">
                            <CreatableSelect
                              styles={customStyles}
                              isMulti
                              value={assignPermissions}
                              options={permissions}
                              onChange={(value) =>
                                handlePermmissionChange(value)
                              }
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
