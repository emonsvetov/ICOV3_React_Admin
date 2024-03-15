import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import {
  Row,
  Col,
  ButtonToolbar,
  Button,
  Card,
  CardBody,
  Container,
} from "reactstrap";
import { connect } from "react-redux";
import { useParams, useHistory, withRouter } from "react-router-dom";
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

const Edit = ({ organization }) => {
  const { programId, unitId } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(false);
  let [unitNumber, setUnitnumber] = useState(null);
  const [unitNumberParticipants, setUnitNumberParticipants] = useState([]);
  const [visible, setVisible] = useState(false);
  const [dataparticipants, setDatapartiscipants] = useState(null);
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
    if (organization?.id && programId) {
      fetchProgramData(programId);
    }
  }, [programId, organization]);

  useEffect(() => {
    if (unitId && program?.id) {
      setLoading(true);
      fetchUnitnumber(program.organization_id, program.id, unitId).then(
        (res) => {
          // console.log("res",res)
          setUnitnumber(res);
          setUnitNumberParticipants(res.eventAwardsLevel);
          setLoading(false);
        }
      );
    }
  }, [program, unitId]);

  let history = useHistory();

  const onSubmit = (values) => {
    axios
      .put(
        `/organization/${program.organization_id}/program/${programId}/unitnumber/${unitId}`,
        values
      )
      .then((res) => {
        if (res.status == 200) {
          flashSuccess(dispatch, "Unit number saved!");
        }
      })
      .catch((err) => {
        flashError(dispatch, err.response.data);
        setLoading(false);
      });
  };

  const onClickCancel = () => {
    history.goBack();
  };
  console.log(unitNumber);
  if (loading || !unitNumber) {
    return <p>Loading...</p>;
  }

  const handleParticipantslDelete = (data) => {};

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
        <>
          <a
            style={{ color: "#70bbfd", cursor: "pointer" }}
            onClick={() => handleParticipantsEdit(record)}
          >
            Edit
          </a>{" "}
          |
          <a
            style={{ color: "#70bbfd", cursor: "pointer" }}
            onClick={() => handleParticipantslDelete(record)}
          >
            {" "}
            Delete
          </a>
        </>
      ),
    },
  ];

  const toggleModal = () => {
    setDatapartiscipants({
      id: 0,
      event_id: unitId,
      amount: 0,
      award_level_id: 0,
    });
    setVisible(!visible);
  };

  const handleParticipantsEdit = (data) => {
    setDatapartiscipants(data);
    setVisible(!visible);
  };

  if (unitNumber) {
    return (
      <Container className="dashboard">
        <Col md={12}>
          <Card>
            <CardBody style={{ display: "flex" }}>
              <Form onSubmit={onSubmit} initialValues={unitNumber}>
                {({ handleSubmit, form, submitting, pristine, values }) => (
                  <>
                    <form className="form" onSubmit={handleSubmit}>
                      <Row className="w100">
                        <Col md="6" lg="6" xl="6">
                          <h3 className="mb-4">Edit Unit Number Information </h3>
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
                                <span className="form__form-group-label">
                                  Unit
                                </span>
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
            </CardBody>
            <Card>
              <CardBody>
                <Row>
                  <Col md="6" lg="6" xl="6">
                    <Button
                      style={{
                        cursor: "pointer",
                        paddingTop: 3,
                        paddingBottom: 3,
                      }}
                      disabled={loading}
                      className="btn btn-primary"
                      color="#ffffff"
                      onClick={toggleModal}
                    >
                      Participants
                    </Button>
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
              </CardBody>
            </Card>
          </Card>
        </Col>
      </Container>
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
