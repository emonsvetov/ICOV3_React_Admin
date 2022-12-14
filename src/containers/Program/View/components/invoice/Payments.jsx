import React, {useEffect, useState} from 'react';
import { Form, Field } from 'react-final-form';
import {Row, Col, Card, CardTitle, Button} from 'reactstrap';
import PaymentsDataTable from './PaymentsDataTable';
import getPayments from '@/service/program/getPayments';
import renderSelectField from '@/shared/components/form/Select';
import {useDispatch, sendFlashMessage} from "@/shared/components/flash";

import axios from 'axios'


const Payments = (props) => {

    useEffect( () => {
        props.setTrigger(Math.floor(Date.now() / 1000))
    }, [props])

    const dispatch = useDispatch()

    const [trigger, setTrigger] = useState( 0 );

    const [showPaymentInfo, setShowPaymentInfo] = useState(false)

    const reversePayment = async(payment, cb) => {
        // console.log(payment)
        // return;
        const data = {
            journal_event_id: payment.journal_event_id,
            notes: payment.notes,
            amount: parseFloat(payment.amount),
            event_type: payment.event_type
        }
        try {
            const response = await axios.post(
              `/organization/${props.program.organization_id}/program/${props.program.id}/invoice/${payment.invoice_id}/reversepayment`,
                data
            );
            if( response.status === 200)    {
                // console.log(response)
                dispatch(sendFlashMessage(response.data.success, 'alert-success', 'top'))
                props.setTrigger(Math.floor(Date.now() / 1000))
                cb();
            }
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    }

    const PaymentInfo = (props) => {
        
        const [loading, setLoading] = useState(true)
        const [paymentKinds, setPaymentKinds] = useState([])
        const [invoices, setInvoices] = useState([])
        const onSubmitPayment = async(values) => {
            // console.log(values)
            const data = {
                amount: values.amount,
                invoice_id: values.invoice.value,
                payment_kind: values.payment_kind.value,
                notes: values.notes,
            }
            try {
                const response = await axios.post(
                  `/organization/${props.program.organization_id}/program/${props.program.id}/payments`,
                    data
                );
                if( response.status === 200)    {
                    dispatch(sendFlashMessage('Program payment has been submitted', 'alert-success', 'top'))
                    setShowPaymentInfo(false)
                    props.setTrigger(Math.floor(Date.now() / 1000))
                }
            } catch (e) {
                throw new Error(`API error:${e?.message}`);
            }
        }
        const validate = values => {
            let errors = {};
            if( !values.payment_kind ) {
                errors.payment_kind = 'Please select payment kind'
            }
            if( !values.amount || isNaN(parseFloat(values.amount)) ) {
                errors.amount = 'Please enter valid dollar amount'
            }
            if( !values.invoice ) {
                errors.invoice = 'Please select invoice'
            }
            if( !values.notes ) {
                errors.notes = 'Please enter notes'
            }
            return errors;
        }
        useEffect( () => {
            // console.log(props)
            if(props?.organization?.id)  {
                getPayments(props.program.organization_id, props.program.id)
                .then( res => {
                    // console.log(res)
                    if( res.payment_kinds ) {
                        let payment_kinds = []
                        for (const [value, label] of Object.entries(res.payment_kinds)) {
                            // console.log(label)
                            payment_kinds.push({label:label, value:value})
                        }
                        // console.log(payment_kinds)
                        setPaymentKinds(payment_kinds)
                    }
                    if( res.invoices ) {
                        let res_invoices = []
                        for (const [index, invoice] of Object.entries(res.invoices)) {
                            // console.log(label)
                            res_invoices.push({label:invoice.invoice_number, value:invoice.id})
                        }
                        // console.log(payment_kinds)
                        setInvoices(res_invoices)
                    }
                    setLoading(false)
                })
            }
        }, [props])
        if( loading ) return 'Loading...'
        // console.log(invoices)
        return (
            <Row>
                <Col sm="12">
                    <Form
                        onSubmit={onSubmitPayment}
                        validate={validate}
                        initialValues={{
                            
                        }}
                    >
                    {({ handleSubmit, form, submitting, pristine, values }) => (
                        <form className="form" onSubmit={handleSubmit}>
                            <Card body>
                                <CardTitle tag="h4">
                                    Payment Information
                                </CardTitle>
                                <Row>
                                    <Col sm="6">
                                        <div className="form__form-group">
                                            <span className="form__form-group-label">Payment Kind</span>
                                            <div className="form__form-group-field">
                                                <div className="form__form-group-row">
                                                    <Field
                                                        name="payment_kind"
                                                        component={renderSelectField}
                                                        options={paymentKinds}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm="6">
                                        <Field name="amount">
                                            {({ input, meta }) => (
                                                <div className="form__form-group">
                                                    <span className="form__form-group-label">Dollars</span>
                                                    <div className="form__form-group-field">
                                                        <div className="form__form-group-row">
                                                            <input type="text" {...input} placeholder="amount" />
                                                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Field>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="6">
                                        <div className="form__form-group">
                                            <span className="form__form-group-label">Invoice</span>
                                            <div className="form__form-group-field">
                                                <div className="form__form-group-row">
                                                    <Field
                                                        name="invoice"
                                                        component={renderSelectField}
                                                        options={invoices}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm="6">
                                        <Field name="notes">
                                        {({ input, meta }) => (
                                            <div className="form__form-group">
                                                <span className="form__form-group-label">
                                                    Notes
                                                </span>
                                                <div className="form__form-group-field">
                                                    <div className="form__form-group-row">
                                                        <Field
                                                            name="notes"
                                                            component="textarea"
                                                            type="text"
                                                        />
                                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        </Field>
                                    </Col>
                                </Row>
                                
                                <Button type="submit" disabled={submitting} className="btn btn-primary" color="#ffffff">Save Changes</Button>
                            </Card>
                        </form>
                        )}
                    </Form>
                </Col>
            </Row>
        )
    }

    props = {...props, ...{trigger, setTrigger, reversePayment}}

    return (
        <>
            <div className='text-right'><Button onClick={() => setShowPaymentInfo( !showPaymentInfo )} className="btn btn-primary btn-sm" color="#ffffff">Make a Payment</Button></div>
            {showPaymentInfo && <PaymentInfo {...props}/>}
            <PaymentsDataTable {...props}/>
        </>
    )
}

export default Payments