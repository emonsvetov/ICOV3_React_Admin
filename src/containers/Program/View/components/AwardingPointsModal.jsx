import React, {useState} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import CheckboxField from '@/shared/components/form/CheckboxField';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import formValidation from "@/shared/validation/program-awarding";
import renderRadioButtonField from '@/shared/components/form/RadioButton';
import MONTHS from "@/shared/json/months.json";
import {useDispatch, sendFlashMessage} from "@/shared/components/flash";
import axios from 'axios'
import renderSelectField from '@/shared/components/form/Select'
import { getProgramAction } from '@/redux/actions/programActions';
import {isEqual, clone} from 'lodash';

const prepareForValidation = values => {
    // console.log(values)
    const clean = {
        annual_expire_day: values?.annual_expire_day?.value,
        custom_expire_units: values?.custom_expire_units?.value,
        annual_expire_month: values?.annual_expire_month?.value
    }
    return {...values, ...clean}
}


const getMonthLabelByMonth = number => {
    return MONTHS.find( month => month.number === number)?.label
}

const CUSTOM_UNITS = [];
CUSTOM_UNITS.push({label: 'DAY', value: 'DAY'})
CUSTOM_UNITS.push({label: 'MONTH', value: 'MONTH'})
CUSTOM_UNITS.push({label: 'YEAR', value: 'YEAR'})

const AwardingPointsModal = ({dispatch, organization, data, isOpen, setOpen, toggle, theme, rtl}) => {
    const [loading, setLoading] = useState(false)
    const [month, setMonth] = useState(null)
    const [DAYS, setDAYS] = useState([])
    var [data, setData] = useState(data)
    
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
        if( typeof selectedMonth !== 'object' || !selectedMonth) return;
        let tmpData = clone(data);
        tmpData.expiration_rule_id = 5;
        tmpData.annual_expire_month = selectedMonth.number;
        setData(tmpData);

        // alert(JSON.stringify(selectedMonth))
        setMonth(selectedMonth)
        setDays(selectedMonth)
    }
    const onSubmitForm = async(values) => {
        // alert(JSON.stringify(values.annual_expire_day))
        setLoading(true)
        
        data  = {...data, ...prepareForValidation(values)}
        delete data.unknown //neet to remove when we have all fields
        // alert(JSON.stringify(data))
        // return;
        try {
            const response = await axios.put(`/organization/${data.organization_id}/program/${data.id}`, data);
            setLoading(false)
            if( response.status === 200)    {
                dispatch(
                  getProgramAction(
                    data.organization_id, 
                    data.id
                  )
                )
                dispatch(sendFlashMessage('Program has been updated', 'alert-success'))
                window.location.reload();
            }
        } catch (e) {
            setLoading(false)
            dispatch(sendFlashMessage('Program could not be updated', 'alert-danger'))
            throw new Error(`API error:${e?.message}`);
        }
    }
    // alert(data.annual_expire_day)
    // console.log(data)
    let initialValues = data
    if( typeof initialValues.annual_expire_day !== 'object') {
        const parsedValues = {
            annual_expire_day: {
                label: data.annual_expire_day,
                value: data.annual_expire_day
            },
            annual_expire_month: {
                label: getMonthLabelByMonth(data.annual_expire_month),
                value: data.annual_expire_month
            }
        }
        // alert(data.expiration_rule_id)
        initialValues = {...initialValues, ...parsedValues}
    }
    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={toggle}>
        <Form
        onSubmit={onSubmitForm}
        validate={(values) => formValidation.validateForm(prepareForValidation(values))}
        // validate={validate}
        initialValues={initialValues}
        >
        {({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="form" onSubmit={handleSubmit}>
            <ModalHeader className='w100'>
                <Row className='w100'>
                    <Col md="6" lg="6" xl="6">
                        <h3>Awarding and Points</h3>
                        <h5 className="colorgrey">{data.name}</h5>
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
                <h5 className="thick size16 mb-4">Awarding Settings</h5>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="events_has_limits"
                                label="Set limit in events"
                                checked={data?.events_has_limits}
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
                                checked={data?.event_has_category}
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="has_promotional_award"
                                label="Enable promotional awards"
                                checked={data?.has_promotional_award}
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
                                checked={data?.enable_uploads_while_awarding}
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="enable_schedule_awards"
                                label="Enable scheduled awards"
                                checked={data?.enable_schedule_awards}
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
                                checked={data?.send_points_expire_notices}
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
                                name="allocate"
                                label="Allocate cost to program for premium merchants"
                                checked={data?.allocate}
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
                                checked={data?.awards_limit_amount_override}
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
        </form>
        )}
        </Form>
    </Modal>
    )
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
