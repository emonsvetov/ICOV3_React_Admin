import React, {useState} from 'react';
import CheckboxField from '@/shared/components/form/CheckboxField';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import axios from 'axios'
import {useDispatch, sendFlashMessage} from "@/shared/components/flash";
import formValidation from "@/shared/validation/program-accounting";

const AccountingModal = ({data, isOpen, setOpen, toggle, theme, rtl}) => {
    const [loading, setLoading] = useState(false)
    var [data, setData] = useState(data)

    const dispatch = useDispatch();

    const onSubmitForm = async(values) => {
        setLoading(true)
        data  = {...data, ...values}
        // alert(JSON.stringify(data))
        try {
            const response = await axios.put(`/organization/1/program/${data.id}`, data);
            // console.log(response)
            setLoading(false)
            setData( values )
            if( response.status === 200)    {
                dispatch(sendFlashMessage('Program has been updated', 'alert-success', 'top'))
            }
        } catch (e) {
            setLoading(false)
            dispatch(sendFlashMessage('Program could not be updated', 'alert-danger', 'top'))
            throw new Error(`API error:${e?.message}`);
        }
    }
    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={() => setOpen(true)}>
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
            administrative_fee: data.administrative_fee,
            bill_parent_program: data. bill_parent_program,
            percent_total_spend_rebate: data. percent_total_spend_rebate,
            expiration_rebate_percentage: data. expiration_rebate_percentage,
            discount_rebate_percentage: data.discount_rebate_percentage,
            reserve_percentage: data.reserve_percentage,
            transaction_fee: data. transaction_fee,
            allow_creditcard_deposits: data.allow_creditcard_deposits,
            create_invoices: data.create_invoices,
            is_pay_in_advance: data.is_pay_in_advance,
            country: data.country,
            budget_summary: data.budget_summary,
            use_budget_cascading: data.use_budget_cascading
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
                                name="use_budget_cascading"
                                label="Use budget cascading"
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <CheckboxField 
                            name="budget_summary"
                            label="Enable budget summary"
                        />
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
                                label="Pay in advance"
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="create_invoices"
                                label="Create invoice"
                            />
                        </div>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <div className="form__form-group">
                            <CheckboxField 
                                name="allow_creditcard_deposits"
                                label="Allow credit card deposit"
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
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Transaction fee
    " />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
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
                        <Field name="bill_parent_program">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Bill parent program</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Bill parent program" />
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
                        <Field name="administrative_fee">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Admin fee</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Admin fee" />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <Field name="calculation">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Calculation</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Calculation" />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                    <Col md="6" lg="4" xl="4">
                        <Field name="fee_amount">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Fee amount</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Fee amount" />
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
            </ModalBody>
        </form>
        )}
        </Form>
    </Modal>
    )
}
export default AccountingModal;
// ProgramInfo.propTypes = {
//     theme: ThemeProps.isRequired,
//     rtl: RTLProps.isRequired
// };
  
// export default withRouter(connect((state) => ({
//     theme: state.theme,
//     rtl: state.rtl
// }))(ProgramInfo));
