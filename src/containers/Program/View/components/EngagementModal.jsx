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
    // console.log(values)
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
                      checked={data?.uses_social_wall}
                      onChange={() => {data.uses_social_wall = !data.uses_social_wall}}
                    />
                  </div>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="allow_hierarchy_to_view_social_wall"
                      label="Other programs in this hierarchy can view this programs social wall"
                      checked={data?.allow_hierarchy_to_view_social_wall}
                      onChange={() => {data.allow_hierarchy_to_view_social_wall = !data.allow_hierarchy_to_view_social_wall}}
                    />
                  </div>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="can_view_hierarchy_social_wall"
                      label="This program can view other programs social wall"
                      checked={data?.can_view_hierarchy_social_wall}
                      onChange={() => {data.can_view_hierarchy_social_wall = !data.can_view_hierarchy_social_wall}}
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
                      checked={data?.managers_can_post_social_wall_messages}
                      onChange={() => {data.managers_can_post_social_wall_messages = !data.managers_can_post_social_wall_messages}}
                    />
                  </div>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="social_wall_separation"
                      label="Allow participants to view the social wall of any program he is not currently logged into"
                      checked={data?.social_wall_separation}
                      onChange={() => {data.social_wall_separation = !data.social_wall_separation}}
                    />
                  </div>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="remove_social_from_pending_deactivation"
                      label="Remove Social From Pending Deactivation View"
                      checked={data?.remove_social_from_pending_deactivation}
                      onChange={() => {data.remove_social_from_pending_deactivation = !data.remove_social_from_pending_deactivation}}
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
                      checked={data?.uses_leaderboards}
                      onChange={() => {data.uses_leaderboards = !data.uses_leaderboards}}
                    />
                  </div>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="allow_view_leaderboards_not_logged_into"
                      label="Allow participants to view leaderboards of any program he is not currently logged into"
                      checked={data?.allow_view_leaderboards_not_logged_into}
                      onChange={() => {data.allow_view_leaderboards_not_logged_into = !data.allow_view_leaderboards_not_logged_into}}
                    />
                  </div>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="share_siblings_leader_board"
                      label="Share sibling leaderboards"
                      checked={data?.share_siblings_leader_board}
                      onChange={() => {data.share_siblings_leader_board = !data.share_siblings_leader_board}}
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
                      checked={data?.use_one_leaderboard}
                      onChange={() => {data.use_one_leaderboard = !data.use_one_leaderboard}}
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
                      checked={data?.uses_peer2peer}
                      label="Enable Peer to Peer"
                      onChange={() => {data.uses_peer2peer = !data.uses_peer2peer}}
                    />
                  </div>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="allow_award_peers_not_logged_into"
                      label="Allow participants to award peers in any program he is not currently logged into"
                      checked={data?.allow_award_peers_not_logged_into}
                      onChange={() => {data.allow_award_peers_not_logged_into = !data.allow_award_peers_not_logged_into}}
                    />
                  </div>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="allow_search_peers_not_logged_into"
                      label="Allow participants to search for peers in any program he is not currently logged into"
                      checked={data?.allow_search_peers_not_logged_into}
                      onChange={() => {data.allow_search_peers_not_logged_into = !data.allow_search_peers_not_logged_into}}
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
                      checked={data?.uses_hierarchy_peer2peer}
                      onChange={() => {data.uses_hierarchy_peer2peer = !data.uses_hierarchy_peer2peer}}
                    />
                  </div>
                </Col>
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <CheckboxField
                      name="share_siblings_peer2peer"
                      label="Share sibling's peer to peer"
                      checked={data?.share_siblings_peer2peer}
                      onChange={() => {data.share_siblings_peer2peer = !data.share_siblings_peer2peer}}
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
                      checked={data?.uses_goal_tracker}
                      onChange={() => {data.uses_goal_tracker = !data.uses_goal_tracker}}
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
                        <CheckboxField 
                          name="uses_units" 
                          label="Uses units" 
                          checked={data?.uses_units}
                          onChange={() => {data.uses_units = !data.uses_units}}
                        />
                      </div>
                      <div className="form__form-group">
                        <CheckboxField
                          name="allow_multiple_participants_per_unit"
                          label="Allow multiple participants per unit"
                          checked={data?.allow_multiple_participants_per_unit}
                          onChange={() => {data.allow_multiple_participants_per_unit = !data.allow_multiple_participants_per_unit}}
                        />
                      </div>
                    </Col>
                    <Col sm="6" md="6" lg="4" xl="4">
                      <div className="form__form-group">
                        <CheckboxField
                          name="enable_how_are_you_feeling"
                          label="How are you feeling"
                          checked={data?.enable_how_are_you_feeling}
                          onChange={() => {data.enable_how_are_you_feeling = !data.enable_how_are_you_feeling}}
                        />
                      </div>
                      <div className="form__form-group">
                        <CheckboxField
                          name="enable_referrals"
                          label="Referrals"
                          checked={data?.enable_referrals}
                          onChange={() => {data.enable_referrals = !data.enable_referrals}}
                        />
                      </div>
                    </Col>
                    <Col sm="6" md="4" lg="4" xl="4">
                      <div className="form__form-group">
                        <CheckboxField
                          name="allow_milestone_award"
                          label="Allow Milestone Awards"
                          checked={data?.allow_milestone_award}
                          onChange={() => {data.allow_milestone_award = !data.allow_milestone_award}}
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
