import React, {useState} from 'react';
import Select from 'react-select';
import CheckboxField from '@/shared/components/form/CheckboxField';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import formValidation from "@/shared/validation/program-accounting";
import renderRadioButtonField from '@/shared/components/form/RadioButton';
import MONTHS from "@/shared/json/months.json";

const AwardingPointsModal = ({isOpen, setOpen, toggle, programId, theme, rtl}) => {
    const [loading, setLoading] = useState(false)
    const [month, setMonth] = useState(null)
    const [day, setDay] = useState(null)
    const [DAYS, setDAYS] = useState([])
    const setDays = (seletedMonth) => {
        setDAYS([])
        if( typeof seletedMonth !== 'object' || !seletedMonth) return;
        var days = []
        for( var i=1;i<=seletedMonth.days;i++ )  {
            days.push({label:i, value:i});
        }
        setDAYS(days)
    }
    const handleMonthChange = (selectedMonth) => {
        setMonth(selectedMonth)
        setDays(selectedMonth)
    }
    const handleDayChange = (selectedDay) => {
        setDay(selectedDay)
    }
    const onSubmitForm = values => {
        alert(JSON.stringify(values))
        setLoading(true)
        // setTimeout(alert('Allset'), 2000)
        setLoading(false)
    }
    const monthPlaceholder = month ? month.label : 'Month'
    const dayPlaceholder = day ? day.label : 'Day'
    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={() => setOpen(true)}>
        <Form
        onSubmit={onSubmitForm}
        validate={(values) => formValidation.validateForm(values)}
        // validate={validate}
        initialValues={{
            // program_type: "Employee"
        }}
        >
        {({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="form" onSubmit={handleSubmit}>
            <ModalHeader className='w100'>
                <Row className='w100'>
                    <Col md="6" lg="6" xl="6">
                        <h3>Awarding and Points</h3>
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
                <h5 class="thick size16 mb-4">Awarding Settings</h5>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="set_limit_in_events"
                                label="Set limit in events"
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="enable_categories_for_events"
                                label="Enable categories for events"
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="enable_promotional_awards"
                                label="Enable promotional awards"
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="enable_uploading_documents_while_awarding"
                                label="Enable uploading documents while awarding"
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="enable_scheduled_awards"
                                label="Enable scheduled awards"
                            />
                        </div>
                    </Col>
                </Row>
                <h5 class="thick size16 mb-4">Points Settings</h5>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <Field
                                name="points_timeframe"
                                component={renderRadioButtonField}
                                label="End of year"
                                radioValue="end_of_year"
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <Field
                                name="points_timeframe"
                                component={renderRadioButtonField}
                                label="Two years"
                                radioValue="two_years"
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <Field name="custom_expiration_offset">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Custom expiration offset</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Custom expiration offset" />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <Field name="custom_expiration_units">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Custom expiration units</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Custom expiration units" />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <Field name="month" component="select">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Month</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <Select
                                            value={month}
                                            onChange={handleMonthChange}
                                            options={MONTHS}
                                            clearable={false}
                                            className="react-select"
                                            placeholder={monthPlaceholder}
                                            classNamePrefix="react-select"
                                        />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <Field name="day" component="select">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Day</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <Select
                                            value={day}
                                            onChange={handleDayChange}
                                            options={DAYS}
                                            clearable={false}
                                            className="react-select"
                                            placeholder={dayPlaceholder}
                                            classNamePrefix="react-select"
                                        />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="send_points_expiration_notice"
                                label="Send points expiration notice"
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <Field name="notify_participant_of_expiring_points_by">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Notify participant of expiring points by</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Notify participant of expiring points by" />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="allocate_cost_to_program_for_premium_merchants"
                                label="Allocate cost to program for premium merchants"
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <Field name="amount_override_percentage">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Amount override percentage</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Amount override percentage" />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="limit_award_amount_override"
                                label="Limit(prevent) award amount override"
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <Field name="enter_new_points_ratio">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Enter new points ratio</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Enter new points ratio" />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
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
