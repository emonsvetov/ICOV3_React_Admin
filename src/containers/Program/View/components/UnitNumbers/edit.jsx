import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import {
  Row,
  Col,
  ButtonToolbar,
  Button,
} from "reactstrap";
import { connect } from "react-redux";
import { useParams, withRouter, Route } from "react-router-dom";
import {
  useDispatch,
  flashSuccess,
  flashError,
} from "@/shared/components/flash";
import axios from "axios";
import { Table } from "antd";


const fetchUnitnumber = async (oId, pId, unitId) => {
  try {
    const response = await axios.get(
      `/organization/${oId}/program/${pId}/unitnumber/${unitId}`
    );
    return response.data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

const Edit = ({ organization, onStep, unitId }) => {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(false);
  let [unitNumber, setUnitnumber] = useState(null);
  const [unitNumberParticipants, setUnitNumberParticipants] = useState([]);
  const dispatch = useDispatch();

  const fetchProgramData = async (id) => {
    try {
      const { id: organizationId } = organization;
      const response = await axios.get(
        `/organization/${organizationId}/program/${id}`
      );
      setProgram(response.data);
    } catch (e) {
      throw new Error(`API error:${e?.message}`);
    }
  };

  useEffect(() => {
    if (organization?.id && id) {
      fetchProgramData(id);
    }
  }, [id, organization]);

  useEffect(() => {
    if (unitId && program?.id && program.uses_units) {
      setLoading(true);
      fetchUnitnumber(program.organization_id, program.id, unitId).then(
        (res) => {
          // console.log("res",res)
          setUnitnumber(res);
          setUnitNumberParticipants(res.users);
          setLoading(false);
        }
      );
    }
  }, [program, unitId]);

  const onSubmit = (values) => {
    axios
      .put(
        `/organization/${program.organization_id}/program/${id}/unitnumber/${unitId}`,
        values
      )
      .then((res) => {
        if (res.status == 200) {
          flashSuccess(dispatch, "Unit number saved!");
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
  // console.log(unitNumber);
  if (loading || !unitNumber) {
    return <p>Loading...</p>;
  }

  // const handleParticipantsView = (data) => {
  //   navigate(`/home`);
  //   console.log("Participant edit not implemented yet");
  // };

  const columnsReportParticipants = [
    {
      title: "Participant Name",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <ButtonViewUser user={record} program={program} />
      ),
    },
  ];

  if (unitNumber) {
    return (
      <>
        <Form onSubmit={onSubmit} initialValues={unitNumber}>
          {({ handleSubmit, form, submitting, pristine, values }) => (
            <>
              <form className="form" onSubmit={handleSubmit}>
                <Row className="w100">
                  <Col md="6" lg="6" xl="6">
                    <h3 className="mb-4">Edit Unit Number</h3>
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
                              <input
                                type="text"
                                {...input}
                                placeholder="unit"
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
        <Row>
          <Col md="6" lg="6" xl="6">
            <h4 className="mb-3">Participants</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              rowKey="id"
              columns={columnsReportParticipants}
              dataSource={unitNumberParticipants}
            />
          </Col>
        </Row>
      </>
    );
  }
};

export default withRouter(
  connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
    organization: state.organization,
  }))(Edit)
);

const ButtonViewUser = ({user, program}) => (
  <Route render={({ history}) => (
    <a
      onClick={() => { history.push(`/program/${program.id}/user/view/${user.id}`) }}
      className="link"
    >
      View
    </a>
  )} />
)
