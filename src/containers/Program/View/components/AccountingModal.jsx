import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import CheckboxField from '@/shared/components/form/CheckboxField';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import axios from 'axios'
import {sendFlashMessage} from "@/shared/components/flash";
import formValidation from "@/shared/validation/program-accounting";
import { getProgramAction } from '@/redux/actions/programActions';
import renderSelectField from '@/shared/components/form/Select';
import {isObject} from "../../../../shared/helpers";
import TooltipPopup from '@/shared/components/form/TooltipPopup';
import { BUDGET_INFO_POPUP_DATA } from './BudgetCascadingPopupData';

const prepareForValidation = values => {

    const clean = {
        transaction_fee: values?.transaction_fee ?? null,
        administrative_fee: values?.administrative_fee ?? null,
        balance_threshold: values?.balance_threshold ?? null,
        bill_parent_program: values?.bill_parent_program ?? null,
        administrative_fee_factor: values?.administrative_fee_factor ?? null,
        administrative_fee_calculation: values?.administrative_fee_calculation ?? 'participants',
        calculation: values?.calculation ?? null,
        convenience_fee: values?.convenience_fee ?? null,
        country: values?.country ?? null,
        deposit_fee: values?.deposit_fee ?? null,
        discount_rebate_percentage: values?.discount_rebate_percentage ?? null,
        expiration_rebate_percentage: values?.expiration_rebate_percentage ?? null,
        fee_amount: values?.fee_amount ?? null,
        fixed_fee: values?.fixed_fee ?? null,
        invoice_po_number: values?.invoice_po_number ?? null,
        is_pay_in_advance: values?.is_pay_in_advance ?? null,
        low_balance_email: values?.low_balance_email ?? null,
        monthly_usage_fee: values?.monthly_usage_fee ?? null,
        percent_total_spend_rebate: values?.percent_total_spend_rebate ?? null,
        reserve_percentage: values?.reserve_percentage ?? null,
    }
    return {...values, ...clean}
}


const AccountingModal = ({dispatch, organization, data, isOpen, setOpen, toggle, theme, rtl}) => {
    const [loading, setLoading] = useState(false)
    const [programTransactionFee, setProgramTransactionFee] = useState([])
    const [openTooltipPopup, setTooltipPopup] = useState(null);

    const handleCloseTooltipPopup = () => {
        setTooltipPopup(null);
    };
  
    const handleOpenTooltipPopup = (title) => {
        setTooltipPopup(title);
    };

    const onSubmitForm = async(values) => {
        setLoading(true)
        if (data.program_extras) {
            if (isObject(values.administrative_fee_calculation)) {
                data.program_extras.administrative_fee_calculation = values.administrative_fee_calculation.value;
            } else {
                data.program_extras.administrative_fee_calculation = values.administrative_fee_calculation;
            }

            data.program_extras.administrative_fee = values.administrative_fee;
            data.program_extras.administrative_fee_factor = values.administrative_fee_factor;
        }
        data.program_transaction_fee = programTransactionFee;
        data  = {...data, ...prepareForValidation(values)}
        // alert(JSON.stringify(data))
        try {
            const response = await axios.put(`/organization/${data.organization_id}/program/${data.id}`, data);
            setLoading(false)
            if (response.status === 200) {
                dispatch(
                    getProgramAction(
                        data.organization_id,
                        data.id
                    )
                )
                dispatch(sendFlashMessage('Program has been updated', 'alert-success', 'top'))
            }
        } catch(error) {
            setLoading(false)
            let errMessage = '';
            if (error.response) {
                let tmp = [];
                if (error.response.data && error.response.data.errors) {
                    errMessage = Object.keys(error.response.data.errors).map(key =>
                        error.response.data.errors[key]
                    )
                }
            } else if (error.request) {
                errMessage = error.request;
            } else if (error.message)  {
                errMessage = error.message;
            }
            errMessage = JSON.stringify(errMessage);
            dispatch(sendFlashMessage('Program could not be updated.' + ' ' + errMessage, 'alert-danger', 'top'))
        }
    }

    useEffect(() => {
        setProgramTransactionFee(data.program_transaction_fee)
    }, [data.program_transaction_fee]);

    if( !organization || !data) return 'loading...'

    const handleChangeTierAmount = (index, value) => {
        const newData = [...programTransactionFee];
        newData[index].tier_amount = value;
        setProgramTransactionFee(newData)
    };


    const handleChangeTransactionFee = (index, value) => {
        const newData = [...programTransactionFee];
        newData[index].transaction_fee = value;
        setProgramTransactionFee(newData)
    };


    const handleRemoveTier = (index) => {
        const newData = [...programTransactionFee];
        newData.splice(index, 1);
        console.log(newData)
        setProgramTransactionFee(newData)
    };

    const handleAddTier = () => {
        const newData = [...programTransactionFee, { tier_amount: '', transaction_fee: '' }];
        setProgramTransactionFee(newData)
    };

    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={toggle}>
        <Form
        onSubmit={onSubmitForm}
        validate={(values) => formValidation.validateForm(values)}
        // validate={validate}
        initialValues={{
            invoice_po_number: data.invoice_po_number,
            accounts_receivable_email: data.accounts_receivable_email,
            monthly_usage_fee: data.monthly_usage_fee,
            convenience_fee: data.convenience_fee,
            fixed_fee: data.fixed_fee,
            deposit_fee: data.deposit_fee,
            bill_parent_program: data.bill_parent_program,
            percent_total_spend_rebate: data.percent_total_spend_rebate,
            expiration_rebate_percentage: data.expiration_rebate_percentage,
            discount_rebate_percentage: data.discount_rebate_percentage,
            administrative_fee_calculation: data.program_extras? data.program_extras.administrative_fee_calculation: 'participants',
            administrative_fee: data.program_extras ? data.program_extras.administrative_fee : '0',
            administrative_fee_factor: data.program_extras ? data.program_extras.administrative_fee_factor: 0,
            allow_creditcard_deposits: data.program_extras ? data.program_extras.allow_creditcard_deposits: 0,
            reserve_percentage: data.reserve_percentage,
            transaction_fee: data.transaction_fee,
            create_invoices: data.create_invoices,
            is_pay_in_advance: data.is_pay_in_advance,
            country: data.country,
            budget_summary: data.budget_summary,
            use_budget_cascading: data.use_budget_cascading,
            send_balance_threshold_notification: data.send_balance_threshold_notification,
            balance_threshold: data.balance_threshold,
            low_balance_email: data.low_balance_email
        }}
        >
        {({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="form" onSubmit={handleSubmit}>
            <ModalHeader className='w100'>
                <Row className='w100'>
                    <Col md="6" lg="6" xl="6">
                        <h3>Accounting</h3>
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
                <Row>
                    <Col md="4" lg="4" xl="4">
                        <div className="d-flex">
                            <CheckboxField 
                                name="use_budget_cascading"
                                label="Use budget cascading"
                                checked={data.use_budget_cascading}
                                onChange={() => {data.use_budget_cascading = !data.use_budget_cascading}}
                            />
                            <TooltipPopup openTooltipPopup={openTooltipPopup} handleCloseTooltipPopup={handleCloseTooltipPopup} 
                              handleOpenTooltipPopup={() => handleOpenTooltipPopup('use_budget_cascading')} title="use_budget_cascading" 
                              text={BUDGET_INFO_POPUP_DATA.budgetCascadingInfoTitle}>
                                <span className="ml-2">?</span>
                            </TooltipPopup>
                        </div>
                    </Col>
                    <Col md="4" lg="4" xl="4">
                        <div className='d-flex'>
                            <CheckboxField 
                               name="budget_summary"
                               label="Enable budget summary"
                               checked={data.budget_summary}
                               onChange={() => {data.budget_summary = !data.budget_summary}}
                            />
                            <TooltipPopup openTooltipPopup={openTooltipPopup} handleCloseTooltipPopup={handleCloseTooltipPopup} 
                               handleOpenTooltipPopup={()=>handleOpenTooltipPopup("budget_summary")} title="budget_summary" 
                               text={BUDGET_INFO_POPUP_DATA.budgetSummaryInfoTitle}> 
                                <span className="ml-2">?</span>
                            </TooltipPopup>
                        </div>
                    </Col>
                    <Col md="4" lg="4" xl="4">
                        <div className='d-flex'>
                          <CheckboxField
                                name="use_cascading_approvals"
                                label="Use Cascading Approvals"
                                checked={data.use_cascading_approvals}
                                onChange={() => {data.use_cascading_approvals = !data.use_cascading_approvals}}
                            />
                            <TooltipPopup openTooltipPopup={openTooltipPopup} handleCloseTooltipPopup={handleCloseTooltipPopup} 
                                handleOpenTooltipPopup={()=>handleOpenTooltipPopup("use_cascading_approvals")} title="use_cascading_approvals" 
                                text={BUDGET_INFO_POPUP_DATA.cascadingApproval}>
                                <span className="ml-2">?</span>
                            </TooltipPopup>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <Field name="country">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Country</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Country" />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                </Row>
                <Row className='w100'>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="is_pay_in_advance"
                                label="Pay in Advance"
                                checked={!data.invoice_for_awards}
                                disabled={data.invoice_for_awards}
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField
                                name="invoice_for_awards"
                                label="Invoice for Awards"
                                checked={data.invoice_for_awards}
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="create_invoices"
                                label="Create invoice"
                                checked={data.create_invoices}
                                onChange={() => {data.create_invoices = !data.create_invoices}}
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="allow_creditcard_deposits"
                                label="Allow credit card deposit"
                                checked={data.program_extras ? data.program_extras.allow_creditcard_deposits : 0}
                                onChange={() => {
                                    data.program_extras.allow_creditcard_deposits = !data.program_extras.allow_creditcard_deposits
                                }}
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <Field name="transaction_fee">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Transaction fee</span>
                                    {programTransactionFee.map((item, index) => (
                                        <Row key={index}>
                                            <Col md="6" lg="4" xl="4">
                                               <input
                                                   style={{width:'90px'}}
                                                    placeholder="Tier Amount"
                                                    title="Tier Amount"
                                                    value={item.tier_amount}
                                                    onChange={(e) => handleChangeTierAmount(index, e.target.value)}
                                                />
                                            </Col>
                                            <Col md="6" lg="4" xl="6">
                                                <input
                                                    style={{width:'120px'}}
                                                    placeholder="Transaction Fee"
                                                    title="Transaction Fee"
                                                    value={item.transaction_fee}
                                                    onChange={(e) => handleChangeTransactionFee(index, e.target.value)}
                                                />
                                            </Col>
                                            <Col md="4" lg="6" xl="1">
                                                <span style={{cursor: "pointer",color:'#4ce1b6'}} onClick={() => handleRemoveTier(index)}>Remove</span>
                                            </Col>
                                        </Row>
                                    ))}
                                    <Row>
                                        <Col><span style={{cursor: "pointer",color:'#4ce1b6'}}
                                                   onClick={handleAddTier}>Add Tier Amount</span></Col>
                                    </Row>

                            </div>
                        )}
                        </Field>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <Field name="reserve_percentage">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Reserved percentage</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Reserved percentage" />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <Field name="discount_rebate_percentage">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Discount rebate percentage</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Discount rebate percentage" />
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
                        <Field name="expiration_rebate_percentage">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Expiration rebate percentage</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Expiration rebate percentage" />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <Field name="percent_total_spend_rebate">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Rebate percentage of total spend</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Rebate percentage of total spend" />
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
                                name="bill_direct"
                                label="Bill parent program"
                                checked={data.program_extras ? data.program_extras.bill_direct : 0}
                                onChange={() => {data.program_extras.bill_direct = !data.program_extras.bill_direct}}
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <Field name="administrative_fee_factor">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Custom Factor</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Custom Factor" />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <Field name="Calculation">
                            {({ input, meta }) => (
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Calculation</span>
                                    <Field
                                        name="administrative_fee_calculation"
                                        component={renderSelectField}
                                        options={[
                                            {label: "Participants", value: "participants"},
                                            {label: "Units", value: "units"},
                                            {label: "Custom", value: "custom"}
                                        ]}
                                    />
                                </div>
                            )}
                        </Field>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <Field name="administrative_fee">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Fee amount</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input}
                                               placeholder="Fee amount"
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
                        <Field name="deposit_fee">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Deposit fee</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Deposit fee" />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <Field name="fixed_fee">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Fixed fee</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Fixed fee" />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <Field name="convenience_fee">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Convenience fee</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Convenience fee" />
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
                        <Field name="monthly_usage_fee">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Monthly usage fee</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Monthly usage fee" />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <Field name="accounts_receivable_email">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Accounts receivable email</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Accounts receivable email" />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <Field name="invoice_po_number">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Invoice PO number</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Invoice PO number" />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <hr/>
                        <h4 style={{marginBottom: '10px'}}>Balance Notfication</h4>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField
                              name="send_balance_threshold_notification"
                              label="Send the Low Deposit Balance Notification"
                              checked={data.send_balance_threshold_notification}
                              onChange={() => {data.send_balance_threshold_notification = !data.send_balance_threshold_notification}}
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <Field name="balance_threshold">
                            {({ input, meta }) => (
                              <div className="form__form-group">
                                  <span className="form__form-group-label">Balance Threshold</span>
                                  <div className="form__form-group-field">
                                      <div className="form__form-group-row">
                                          <input type="text" {...input} placeholder="" />
                                          {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                      </div>
                                  </div>
                              </div>
                            )}
                        </Field>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <Field name="low_balance_email">
                            {({ input, meta }) => (
                              <div className="form__form-group">
                                  <span className="form__form-group-label">Low Deposit Balance Email</span>
                                  <div className="form__form-group-field">
                                      <div className="form__form-group-row">
                                          <input type="text" {...input} placeholder="" />
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
AccountingModal.propTypes = {
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
}))(AccountingModal));