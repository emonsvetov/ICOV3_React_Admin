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
  const [permissions, setPermissions] = useState([]);
  const dispatch = useDispatch();

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "400px", // Set the desired width
    }),
  };

  const getPermissions = async (program) => {
    try {
      const response = await axios.get(
        `/organization/${program.organization_id}/program/${program.id}/positionpermissions`
      );
      return response.data;
    } catch (error) {
      throw new Error(`API error:${error?.message}`);
    }
  };

  useEffect(() => {
    if (program.id && program.organization_id && postionAssignPermissionId) {
      setLoading(true);
      getPositionLevel(program, postionAssignPermissionId).then((res) => {
        setPositionLevel(res.data[0]);
        setLoading(false);
      });
      getPermissions(program).then((res) => {
        setPermissions(labelizeNamedData(res.data));
      });
    }
  }, [program, postionAssignPermissionId]);

  const handlePermmissionChange = (permissionOptions, input) => {
    const permissionIds = permissionOptions.map(
      (permission) => permission.value
    );
    input.onChange(permissionIds);
  };

  const onSubmit = (values) => {
    console.log(values);
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
  };

  if (positionLevel) {
    return (
      <>
        <Form mutators={{}} onSubmit={onSubmit} initialValues={{}}>
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
                              options={permissions}
                              onChange={(o) =>
                                handlePermmissionChange(o, input)
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
