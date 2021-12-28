import React, {useState} from 'react';
import CheckboxField from '@/shared/components/form/CheckboxField';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';
import { Form } from 'react-final-form';
import formValidation from "@/shared/validation/program-engagement";

const AwardingPointsModal = ({isOpen, setOpen, toggle, programId, theme, rtl}) => {
    const [loading, setLoading] = useState(false)
    const onSubmitForm = values => {
        alert(JSON.stringify(values))
        setLoading(true)
        // setTimeout(alert('Allset'), 2000)
        setLoading(false)
    }
    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={() => setOpen(true)}>
        <Form
        onSubmit={onSubmitForm}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={{
            allow_multiple_participants_per_unit:true
        }}
        >
        {({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="form" onSubmit={handleSubmit}>
            <ModalHeader className='w100'>
                <Row className='w100'>
                    <Col md="6" lg="6" xl="6">
                        <h3>Engagement</h3>
                        <h5 className="colorgrey">Resident Gifts</h5>
                    </Col>
                    <Col md="6" lg="6" xl="6" className='text-right'>
                        <ButtonToolbar className="modal__footer flex justify-content-right w100">
                            <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                            <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Save</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
            </ModalHeader>
            <ModalBody className='modal-lg'>
                <Row>
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
                                name="share_sibling_leaderboards"
                                label="Share sibling leaderboards"
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="use_leaderboards"
                                label="Use leaderboards"
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
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
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="share_siblings_peer_to_peer"
                                label="Share sibling's peer to peer"
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="use_hierarchy_p2p"
                                label="Use hierarchy peer 2 peer"
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="use_p2p"
                                label="Use peer to peer"
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="other_in_hierarchy_can_view_social_wall"
                                label="Other programs in this hierarchy can view this programs social wall"
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="program_can_view_others_social_wall"
                                label="This program can view other programs social wall"
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="managers_can_post_messages"
                                label="Managers can post messages"
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="allow_participants_to_view_social_wall_not_logged_into"
                                label="Allow participants to view the social wall of any program he is not currently logged into"
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="uses_social_wall"
                                label="Uses social wall"
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="use_goal_tracker"
                                label="Use goal tracker"
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
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="uses_units"
                                label="Uses units"
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="allow_multiple_participants_per_unit"
                                label="Allow multiple participants per unit"
                            />
                        </div>
                    </Col>
                </Row>
            </ModalBody>
        </form>
        )}
        </Form>
    </Modal>
    )
}
export default AwardingPointsModal;
// ProgramInfo.propTypes = {
//     theme: ThemeProps.isRequired,
//     rtl: RTLProps.isRequired
// };
  
// export default withRouter(connect((state) => ({
//     theme: state.theme,
//     rtl: state.rtl
// }))(ProgramInfo));
