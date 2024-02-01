import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import CheckboxField from '@/shared/components/form/CheckboxField';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import formValidation from "@/shared/validation/program-awarding";
import renderRadioButtonField from '@/shared/components/form/RadioButton';
import MONTHS from "@/shared/json/months.json";
import { useDispatch, sendFlashMessage } from "@/shared/components/flash";
import axios from 'axios'
import renderSelectField from '@/shared/components/form/Select'
import { getProgramAction } from '@/redux/actions/programActions';
import { isEqual, clone } from 'lodash';

const prepareForValidation = values => {
    const clean = {
        annual_expire_day: values?.annual_expire_day?.value,
        custom_expire_units: values?.custom_expire_units?.value,
        annual_expire_month: values?.annual_expire_month?.value
    }
    return { ...values, ...clean }
}

const getMonthLabelByMonth = number => {
    return MONTHS.find(month => month.number === number)?.label
}

const CUSTOM_UNITS = [
    { label: 'DAY', value: 'DAY' },
    { label: 'MONTH', value: 'MONTH' },
    { label: 'YEAR', value: 'YEAR' }
];

const AwardingPointsModal = ({ dispatch, organization, data, isOpen, setOpen, toggle, theme, rtl }) => {
    const [loading, setLoading] = useState(false);
    const [DAYS, setDAYS] = useState([]);
    const [modalData, setModalData] = useState(data);

    const setDays = (selectedMonth) => {
        setDAYS([]);
        if (typeof selectedMonth !== 'object' || !selectedMonth) return;
        var days = [];
        for (var i = 1; i <= selectedMonth.days; i++) {
            days.push({ label: i, value: i });
        }
        setDAYS(days);
    }

    const handleMonthChange = (selectedMonth) => {
        if (typeof selectedMonth !== 'object' || !selectedMonth) return;
        let tmpData = clone(modalData);
        tmpData.expiration_rule_id = 5;
        tmpData.annual_expire_month = selectedMonth.number;
        setModalData(tmpData);

        setDays(selectedMonth);
    }

    const onSubmitForm = async (values) => {
        setLoading(true);

        const updatedData = { ...modalData, ...prepareForValidation(values) };
        delete updatedData.unknown;

        try {
            const response = await axios.put(`/organization/${updatedData.organization_id}/program/${updatedData.id}`, updatedData);
            setLoading(false);

            if (response.status === 200) {
                dispatch(getProgramAction(updatedData.organization_id, updatedData.id));
                dispatch(sendFlashMessage('Program has been updated', 'alert-success'));
                window.location.reload(); // Consider using React state instead of reloading the entire page.
            }
        } catch (e) {
            setLoading(false);
            dispatch(sendFlashMessage('Program could not be updated', 'alert-danger'));
            throw new Error(`API error:${e?.message}`);
        }
    }

    let initialValues = modalData;

    if (typeof initialValues.annual_expire_day !== 'object') {
        const parsedValues = {
            annual_expire_day: {
                label: modalData.annual_expire_day,
                value: modalData.annual_expire_day
            },
            annual_expire_month: {
                label: getMonthLabelByMonth(modalData.annual_expire_month),
                value: modalData.annual_expire_month
            }
        }
        initialValues = { ...initialValues, ...parsedValues };
    }

    return (
        <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={toggle}>
            <Form
                onSubmit={onSubmitForm}
                validate={(values) => formValidation.validateForm(prepareForValidation(values))}
                initialValues={initialValues}
            >
                {({ handleSubmit, form, submitting, pristine, values }) => (
                    <form className="form" onSubmit={handleSubmit}>
                        <ModalHeader className='w100'>
                            <Row className='w100'>
                                <Col md="6" lg="6" xl="6">
                                    <h3>Awarding and Points</h3>
                                    <h5 className="colorgrey">{modalData.name}</h5>
                                </Col>
                                <Col md="6" lg="6" xl="6" className='text-right'>
                                    <ButtonToolbar className="modal__footer flex justify-content-right w100">
                                        <Button outline color="primary" className="mr-3" onClick={toggle}>Close</Button>{' '}
                                        <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Save</Button>
                                    </ButtonToolbar>
                                </Col>
                            </Row>
                        </ModalHeader>
                        <ModalBody className='modal-lg'>
                            <ModalBody className='modal-lg'>
                                <h5 className="thick size16 mb-4">Awarding Settings</h5>
                                <Row>
                                    <Col md="6" lg="4" xl="4">
                                        <div className="form__form-group">
                                            <CheckboxField
                                                name="events_has_limits"
                                                label="Set limit in events"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6" lg="4" xl="4">
                                        <div className="form__form-group">
                                            <CheckboxField
                                                name="event_has_category"
                                                label="Enable categories for events"
                                            />
                                        </div>
                                    </Col>
                                    <Col md="6" lg="4" xl="4">
                                        <div className="form__form-group">
                                            <CheckboxField
                                                name="has_promotional_award"
                                                label="Enable promotional awards"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6" lg="4" xl="4">
                                        <div className="form__form-group">
                                            <CheckboxField
                                                name="enable_uploads_while_awarding"
                                                label="Enable uploading documents while awarding"
                                            />
                                        </div>
                                    </Col>
                                    <Col md="6" lg="4" xl="4">
                                        <div className="form__form-group">
                                            <CheckboxField
                                                name="enable_schedule_awards"
                                                label="Enable scheduled awards"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <h5 className="thick size16 mb-4">Points Expiration Rules:</h5>
                                <Row>
                                    <Col md="6" >
                                        <Field
                                            name="expiration_rule_id"
                                            component={renderRadioButtonField}
                                            label="End of Next Year"
                                            radioValue={Number('3')}
                                            value={data.expiration_rule_id}
                                        />
                                        <h5 className="colorgrey label-margin-left">Expiration date is the end of the following year</h5>
                                        <Field
                                            name="expiration_rule_id"
                                            component={renderRadioButtonField}
                                            label="2 Years"
                                            radioValue={Number('7')}
                                            value={data.expiration_rule_id}
                                        />
                                        <h5 className="colorgrey label-margin-left">Expiration date is the end of the next following year</h5>
                                        <Field
                                            name="expiration_rule_id"
                                            component={renderRadioButtonField}
                                            label="Custom"
                                            radioValue={Number('4')}
                                            value={data.expiration_rule_id}
                                        />
                                        <h5 className="colorgrey label-margin-left">Expiration date is user specified</h5>

                                        <Row className="label-margin-left">
                                            <Col md="6" >
                                                <Field name="custom_expire_offset">
                                                    {({ input, meta }) => (
                                                        <div className="form__form-group">
                                                            <span className="form__form-group-label">Custom expiration offset</span>
                                                            <div className="form__form-group-field">
                                                                <div className="form__form-group-row">
                                                                    <input type="number" {...input} placeholder="Custom expiration offset" />
                                                                    {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Field>
                                            </Col>
                                            <Col md="6">
                                                <div className="form__form-group">
                                                    <span className="form__form-group-label">Custom expiration units</span>
                                                    <div className="form__form-group-field">
                                                        <div className="form__form-group-row">
                                                            <Field
                                                                name="custom_expire_units"
                                                                component={renderSelectField}
                                                                options={CUSTOM_UNITS}
                                                                placeholder={''}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Field
                                            name="expiration_rule_id"
                                            component={renderRadioButtonField}
                                            label="Annual"
                                            radioValue={Number('5')}
                                            value={data.expiration_rule_id}
                                        />
                                        <h5 className="colorgrey label-margin-left">Expiration date a specified Month and Day each year.</h5>
                                        <Row className="label-margin-left">
                                            <Col md="6" lg="4" xl="4">
                                                <div className="form__form-group">
                                                    <span className="form__form-group-label">Month</span>
                                                    <div className="form__form-group-field">
                                                        <div className="form__form-group-row">
                                                            <Field
                                                                name="annual_expire_month"
                                                                options={MONTHS}
                                                                // onChange={handleMonthChange}
                                                                placeholder={"Month"}
                                                                component={renderSelectField}
                                                                parse={value => {
                                                                    handleMonthChange(value)
                                                                    return value;
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md="6" lg="4" xl="4">
                                                <div className="form__form-group">
                                                    <span className="form__form-group-label">Day</span>
                                                    <div className="form__form-group-field">
                                                        <div className="form__form-group-row">
                                                            <Field
                                                                name="annual_expire_day"
                                                                component={renderSelectField}
                                                                options={DAYS}
                                                                placeholder={'Day'}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                    </Col>
                                </Row>


                                <Row>
                                    <Col md="6" lg="4" xl="4">
                                        <div className="form__form-group">
                                            <CheckboxField
                                                name="send_points_expire_notices"
                                                label="Send points expiration notice"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6" lg="4" xl="4">
                                        <Field name="unknown">
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
                                        <Field name="amount_override_limit_percent">
                                            {({ input, meta }) => (
                                                <div className="form__form-group">
                                                    <span className="form__form-group-label">Amount override percentage</span>
                                                    <div className="form__form-group-field">
                                                        <div className="form__form-group-row">
                                                            <input type="number" {...input} placeholder="Amount override percentage" />
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
                                                name="awards_limit_amount_override"
                                                label="Limit(prevent) award amount override"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6" lg="4" xl="4">
                                        <Field name="unknown">
                                            {({ input, meta }) => (
                                                <div className="form__form-group">
                                                    <span className="form__form-group-label">Enter new points ratio</span>
                                                    <div className="form__form-group-field">
                                                        <div className="form__form-group-row">
                                                            <input type="number" {...input} placeholder="Enter new points ratio" />
                                                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Field>
                                    </Col>
                                </Row>
                            </ModalBody>
                        </ModalBody>
                    </form>
                )}
            </Form>
        </Modal>
    );
}

AwardingPointsModal.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired,
    organization: Object.isRequired,
    data: Object.isRequired
};

export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
    organization: state.organization,
    data: state.program
}))(AwardingPointsModal));
