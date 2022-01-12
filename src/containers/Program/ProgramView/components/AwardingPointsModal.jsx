import React, {useState} from 'react';
import Select from 'react-select';
import CheckboxField from '@/shared/components/form/CheckboxField';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import formValidation from "@/shared/validation/program-awarding";
import renderRadioButtonField from '@/shared/components/form/RadioButton';
import MONTHS from "@/shared/json/months.json";
import {useDispatch, sendFlashMessage} from "@/shared/components/flash";
import axios from 'axios'
import renderSelectField from '@/shared/components/form/Select'

const prepareForValidation = values => {
    const clean = {
        annual_expire_day: values?.annual_expire_day?.value,
        annual_expire_month: values?.annual_expire_month?.number
    }
    return {...values, ...clean}
}

const getMonthLabelByMonth = number => {
    return MONTHS.find( month => month.number === number)?.label
}

const AwardingPointsModal = ({data, isOpen, setOpen, toggle, theme, rtl}) => {
    const [loading, setLoading] = useState(false)
    const [month, setMonth] = useState(null)
    const [DAYS, setDAYS] = useState([])
    var [data, setData] = useState(data)

    const dispatch = useDispatch();
    
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
            const response = await axios.put(`/organization/1/program/${data.id}`, data);
            // console.log(response)
            setLoading(false)
            setData( values )
            if( response.status === 200)    {
                dispatch(sendFlashMessage('Program has been updated', 'alert-success'))
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
    // console.log(initialValues)
    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={() => setOpen(true)}>
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
                            <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
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
                <h5 className="thick size16 mb-4">Points Settings</h5>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <Field
                                name="expiration_rule_id"
                                component={renderRadioButtonField}
                                label="End of year"
                                radioValue="1"
                                value={data.expiration_rule_id}
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <Field
                                name="expiration_rule_id"
                                component={renderRadioButtonField}
                                label="Two years"
                                radioValue="2"
                                value={data.expiration_rule_id}
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
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
                    <Col md="6" lg="4" xl="4">
                        <Field name="custom_expire_units">
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
                                name=""
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
