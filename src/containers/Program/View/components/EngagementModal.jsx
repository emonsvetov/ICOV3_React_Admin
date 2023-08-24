import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ThemeProps, RTLProps } from "@/shared/prop-types/ReducerProps";
import CheckboxField from "@/shared/components/form/CheckboxField";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  ButtonToolbar,
  Row,
  Col,
} from "reactstrap";
import { Form } from "react-final-form";
import formValidation from "@/shared/validation/program-engagement";
import axios from "axios";
import { sendFlashMessage } from "@/shared/components/flash";
import { getProgramAction } from "@/redux/actions/programActions";

const EngagementModal = ({
  dispatch,
  data,
  isOpen,
  toggle,
  theme,
  rtl,
}) => {
  const [loading, setLoading] = useState(false);

  const onSubmitForm = async (values) => {
    setLoading(true);
    data = { ...data, ...values };
    // console.log(data);return;
    // alert(JSON.stringify(data))
    try {
      const response = await axios.put(
        `/organization/${data.organization_id}/program/${data.id}`,
        data
      );
      // console.log(response)
      setLoading(false);
      // setData( data )
      if (response.status === 200) {
        dispatch(
          sendFlashMessage("Program has been updated", "alert-success", "top")
        );
        dispatch(getProgramAction(data.organization_id, data.id));
      }
    } catch (e) {
      setLoading(false);
      dispatch(
        sendFlashMessage("Program could not be updated", "alert-danger", "top")
      );
      throw new Error(`API error:${e?.message}`);
    }
  };
  return (
    <Modal
      className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`}
      isOpen={isOpen}
      toggle={toggle}
    >
      <Form
        onSubmit={onSubmitForm}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={data}
      >
        {({ handleSubmit, form, submitting, pristine, values }) => (
          <form className="form" onSubmit={handleSubmit}>
            <ModalHeader className="w100">
              <Row className="w100">
                <Col md="6" lg="6" xl="6">
                  <h3>Engagement</h3>
                </Col>
                <Col md="6" lg="6" xl="6" className="text-right">
                  <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button
                      outline
                      color="primary"
                      className="mr-3"
                      onClick={toggle}
                    >
                      Close
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
            </ModalHeader>
            <ModalBody className="modal-lg">
              <Row>
                <Col>
                  <h4 className="padding-10">Social Wall: </h4>
                </Col>
              </Row>
              <Row>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="uses_social_wall"
                      label="Enable Social Wall"
                    />
                  </div>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="allow_hierarchy_to_view_social_wall"
                      label="Other programs in this hierarchy can view this programs social wall"
                    />
                  </div>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="can_view_hierarchy_social_wall"
                      label="This program can view other programs social wall"
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="managers_can_post_social_wall_messages"
                      label="Managers can post messages"
                    />
                  </div>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="social_wall_separation"
                      label="Allow participants to view the social wall of any program he is not currently logged into"
                    />
                  </div>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="remove_social_from_pending_deactivation"
                      label="Remove Social From Pending Deactivation View"
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className="padding-10">Leaderboards: </h4>
                </Col>
              </Row>
              <Row>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="uses_leaderboards"
                      label="Enable Leaderboards"
                    />
                  </div>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="allow_view_leaderboards_not_logged_into"
                      label="Allow participants to view leaderboards of any program he is not currently logged into"
                    />
                  </div>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="share_siblings_leader_board"
                      label="Share sibling leaderboards"
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="use_one_leaderboard"
                      label="Use one leaderboard"
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col>
                  <h4 className="padding-10">Peer to Peer: </h4>
                </Col>
              </Row>
              <Row>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="uses_peer2peer"
                      label="Enable Peer to Peer"
                    />
                  </div>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="allow_award_peers_not_logged_into"
                      label="Allow participants to award peers in any program he is not currently logged into"
                    />
                  </div>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="allow_search_peers_not_logged_into"
                      label="Allow participants to search for peers in any program he is not currently logged into"
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="uses_hierarchy_peer2peer"
                      label="Use hierarchy peer 2 peer"
                    />
                  </div>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="share_siblings_peer2peer"
                      label="Share sibling's peer to peer"
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col>
                  <h4 className="padding-10">Goals: </h4>
                </Col>
              </Row>
              <Row>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="uses_goal_tracker"
                      label="Enable goal tracker"
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className="padding-10">Other: </h4>
                </Col>
              </Row>
              <Row>
                    <Col sm="6" md="6" lg="4" xl="4">
                      <div className="form__form-group">
                        <CheckboxField name="uses_units" label="Uses units" />
                      </div>
                      <div className="form__form-group">
                        <CheckboxField
                          name="allow_multiple_participants_per_unit"
                          label="Allow multiple participants per unit"
                        />
                      </div>
                    </Col>
                    <Col sm="6" md="6" lg="4" xl="4">
                      <div className="form__form-group">
                        <CheckboxField
                          name="enable_how_are_you_feeling"
                          label="How are you feeling"
                        />
                      </div>
                      <div className="form__form-group">
                        <CheckboxField
                          name="enable_referrals"
                          label="Referrals"
                        />
                      </div>
                    </Col>
                    <Col sm="6" md="4" lg="4" xl="4">
                      <div className="form__form-group">
                        <CheckboxField
                          name="allow_milestone_award"
                          label="Allow Milestone Awards"
                        />
                      </div>
                    </Col>
                  </Row>
            </ModalBody>
          </form>
        )}
      </Form>
    </Modal>
  );
};

EngagementModal.propTypes = {
  theme: ThemeProps.isRequired,
  rtl: RTLProps.isRequired,
  data: Object.isRequired,
};

export default withRouter(
  connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
    data: state.program,
  }))(EngagementModal)
);
