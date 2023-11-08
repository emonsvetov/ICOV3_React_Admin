import React, {useState, useRef} from 'react';
import { useEffect } from 'react';
import { Button, ButtonToolbar, Row, Col  } from 'reactstrap';
import {getPayInvoice, submitInvoicePayment} from '@/service/program/invoice';
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import {getDues} from './helper/getDues'
import JournalSummary from './components/JournalSummary';
import AlertModalWrapper from "@/shared/components/modal/alertModal/AlertModalWrapper"

import axios from 'axios'

const RenderPayments = ({invoice}) => {
    if( !invoice.view_params?.payments || invoice.view_params.payments.length <= 0) return null;

    const RenderPaymentItmes = ({items}) => {
        let rows = []
        items.forEach(payment => {
            rows.push (
                <tr>
                    <td>{payment.created_at}</td>
                    <td>{payment.program_name}</td>
                    <td>{payment.journal_event_type}</td>
                    <td>{parseFloat(payment.amount).toFixed(2)}</td>
                    <td>{payment.notes}</td>
                </tr>
            )
        })
        return rows
    }

    return(
        <>
            <br />
            <div className='table-responsive col'>
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th align="left">Date</th>
                            <th align="left">Program</th>
                            <th align="left">Payment Kind</th>
                            <th align="left">Amount</th>
                            <th align="left">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <RenderPaymentItmes items={invoice.view_params.payments} />
                    </tbody>
                </table>
            </div>
        </>
    )
}

const RenderStatement = ({invoice, getAppliedPayment, onKeyUpAppliedPayment}) => {
    if(invoice.view_params.invoice.statements.length <= 0) return null;
    let html = []
    let total = 0;
    let total_refunds = 0;
    let total_payments = 0;
    let total_due = 0;

    invoice.view_params.invoice.statements.forEach(statement => {
        html.push(
            <tr>
                <td align="left">{statement.program_name}</td>
            </tr>
        )
        if(statement.charges)   {
            for (const [journal_event_type, charge] of Object.entries(statement.charges)) {
                // console.log(`${journal_event_type}: ${charge.total}`);©
                html.push(
                    <tr>
                        <td></td>
                        <td align="right">{journal_event_type}
                        <input type="hidden" name='apply_to_program[]' value={`${statement.program_name}`}></input>
					    <input type="hidden" name='journal_event_type[]' value={`${journal_event_type}`}></input></td>
                        <td align="right">${charge.total}</td>
                        <td align="right">${charge.refunds}</td>
                        <td align="right">${charge.payments}</td>
                        <td align="right">${charge.due}</td>
                        <td>&nbsp;</td>
                        <td align="right">
                            <div className='d-flex align-items-center'>
                                <span>$</span>
                                <input size="6"
                                type="text" placeholder='0.00' value={getAppliedPayment(statement.program_id, journal_event_type)} onChange={(e)=>onKeyUpAppliedPayment(e, statement.program_id, journal_event_type)} />
                            </div>
                        </td>
                    </tr>
                )
                total += charge.total;
                total_refunds += charge.refunds;
                total_payments += charge.payments;
                total_due += charge.due;
            }
        }
    })
    html.push(
        <>
            <tr>
                <td colSpan="9"><hr /></td>
            </tr>
            <tr>
                <td align="right"><b>Total Balance Due</b></td>
                <td></td>
                <td align="right"><b>${total.toFixed(2)}</b></td>
                <td align="right"><b>${total_refunds.toFixed(2)}</b></td>
                <td align="right"><b>${total_payments.toFixed(2)}</b></td>
                <td align="right"><b>${total_due.toFixed(2)}</b></td>
                <td></td>
            </tr>
        </>
    )

    return html
}

const PayInvoice = (props) => {
    const dispatch = useDispatch()
    const alertRef = useRef({});

    const t = new Date();
    const dt_today = t.toLocaleDateString("en-US")

    const notesRef = useRef(`Payment Posting Date: ${dt_today}\nCheck/REF#:`);

    const [loading, setLoading] = useState(true)
    const [prev, setPrev] = useState(props.invoice)
    const [invoice, setInvoice] = useState(null)
    const [checkAmount, setCheckAmount] = useState(0.00)
    const [amountNeedingDispersal, setAmountNeedingDispersal] = useState(0.00)
    const [appliedPayments, setAppliedPayments] = useState(null)

    const handleNotes = (e) => {
        // console.log(e.target.value)
        notesRef.current = e.target.value;
        // console.log(notesRef.current);
    };

    useEffect( () => {
            getPayInvoice(props.program.organization_id, props.program.id, props.invoice.id)
            .then( res => {
                setInvoice(res)
                setLoading(false)
            })
    }, [props])
 
    const onClickApplyPayments = () => {
        // console.log(appliedPayments === false)
        let showError = false
        if( !appliedPayments )   {
            alertRef.current.title = 'Error!'
            alertRef.current.message = 'Invalid check amount or payments not dispersed'
            showError = true
        }
        if(amountNeedingDispersal > 0)  {
            alertRef.current.title = 'Error!'
            alertRef.current.message = 'You have not dispersed all of the money you have set.'
            showError = true
        }   else if(amountNeedingDispersal < 0)   {
            alertRef.current.title = 'Error!'
            alertRef.current.message = 'You have dispersed more money to payments than you have set to disperse.'
            showError = true
        }

        if( showError ) {
            alertRef.current.toggle()
            return
        }

        if(!window.confirm("Are you sure to apply these payments??"))  {
            return;
        }

        // alert("Ready to make payment")
        console.log(appliedPayments)
        // console.log(notesRef.current)
        const formData = {
            applied_payments: appliedPayments,
            notes: notesRef.current
        }
        console.log(formData)
        // return;
        submitInvoicePayment(props.program.organization_id, props.program.id, props.invoice.id, formData)
        .then( res => {
            if( res.success )    {
                dispatch(sendFlashMessage('Invoice payments applied', 'alert-success', 'top'))
                getPayInvoice(props.program.organization_id, props.program.id, props.invoice.id)
                .then( res => {
                    setInvoice(res)
                    setLoading(false)
                })
            }
            console.log(res)
        })
    }


    const onKeyupCheckAmount = (e) => {
        // console.log(e.target.value)
        const check_amount = parseFloat(e.target.value)
        if(isNaN(check_amount)) {
            e.target.value = '';
            return;
        }
        let sumCharges = 0
        if( appliedPayments )    {
            // console.log(appliedPayments)
            // for (const [programId, charge] of Object.entries(appliedPayments)) {
            //     sumCharges += Object.values(charge).reduce((a, b) => a + b);
            // }
            appliedPayments.forEach( appliedPayment => {
                sumCharges += Object.values(appliedPayment.payments).reduce((a, b) => a + b);
            })
        }
        // console.log(sumCharges)
        setAmountNeedingDispersal(check_amount - sumCharges)
        setCheckAmount(e.target.value)
    }

    const onClickDisperseCheckAmount = () => {
        let tmpAmountNeedingDispersal = checkAmount;
        const statements = invoice.view_params?.invoice?.statements;
        if( statements )    {
            // let total_end_balance = Math.abs(invoice.total_end_balance)
            let tmpAppliedPayments = []
            // console.log(total_end_balance)
            statements.forEach((s, i) => {
                // console.log(s.charges)
                let charges = {}
                Object.keys(s.charges).forEach(function (journal_event_type){
                    // console.log(s.charges[journal_event_type]);
                    if( tmpAmountNeedingDispersal >= s.charges[journal_event_type]['due'] )  {
                        charges[journal_event_type] = s.charges[journal_event_type]['due']
                        tmpAmountNeedingDispersal -= s.charges[journal_event_type]['due']
                    }   else {
                        charges[journal_event_type] = tmpAmountNeedingDispersal
                        tmpAmountNeedingDispersal = 0
                    }
                });
                // s.charges.forEach((charge, i) => {

                // })
                // console.log(charges)
                // tmpAppliedPayments[s.program_id] = charges;
                tmpAppliedPayments.push({
                    program_id: s.program_id,
                    payments: charges
                })
            })
            // console.log(tmpAppliedPayments)
            // console.log(tmpAmountNeedingDispersal)
            // tmpAppliedPayments = tmpAppliedPayments.filter(elm => elm); //remove empty elements from sparse array
            setAppliedPayments(tmpAppliedPayments)
            setAmountNeedingDispersal(tmpAmountNeedingDispersal)
        }
    }

    const onKeyUpAppliedPayment = (e, programId, journalEventType) => {
        // const appliedPayment = parseFloat(e.target.value)
        // if(isNaN(appliedPayment)) {
        //     e.target.value = ''
        //     return;
        // }
        // let tmpAppliedPayments = appliedPayments;
        // if(tmpAppliedPayments[programId])   {
        //     tmpAppliedPayments[programId][journalEventType] = appliedPayment
        // }   else {
        //     tmpAppliedPayments[programId] = {
        //         [journalEventType]: appliedPayment
        //     }
        // }
        // console.log(tmpAppliedPayments)
        // setAppliedPayments(tmpAppliedPayments)
    }

    const getAppliedPayment = (programId, journalEventType) => {
        if( !appliedPayments ) return
        let appliedPayment = 0
        appliedPayments.some( paymentItem => {
            if(paymentItem.program_id == programId)    {
                if(paymentItem.payments[journalEventType])  {
                    appliedPayment = paymentItem.payments[journalEventType]
                    return true //break the loop!
                }
            }
        })
        if(appliedPayment>0)
        return parseFloat(appliedPayment).toFixed(2)
    }

    if(loading) return 'Loading...'
    if(!invoice) return 'Invoice cannot be loaded'

    // console.log(invoice)

    const dues = getDues(invoice)
    const logoSrc = process.env.REACT_APP_API_STORAGE_URL + "/logo/big_logo.png";

    // console.log(appliedPayments)

    return (
        <form className='form'>
            <Row className='mb-4'>
                <Col md="3" lg="3" xl="3">
                    <div className="modal__title">
                        <h3 className="mb-4">Pay Invoice </h3>
                    </div>
                </Col>
                <Col md="9" lg="9" xl="9" className="text-right">
                <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button
                    color="primary"
                    className="mr-3"
                    onClick={onClickApplyPayments}
                    >
                    Apply Payments
                    </Button>
                    <Button
                    outline
                    color="primary"
                    className="mr-0"
                    onClick={()=>props.setStep(2)}
                    >
                    Back
                    </Button>
                </ButtonToolbar>
                </Col>
            </Row>
            <Row>
                <Col md="6" lg="6" xl="6">
                    <div className="mb-4">
                        <img src={logoSrc} style={{'maxWidth': '200px'}} />
                    </div>
                </Col>
                <Col md="6" lg="6" xl="6">
                    <div className="text-right float-right">
                        <span className='outline'>Invoice # {invoice.invoice_number}</span>
                        <div className="d-flex justify-content-between">
                            <div>Date: </div>
                            <div>{invoice.date_end}</div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <div>Due Date: </div>
                            <div>{invoice.date_due === invoice.date_end ? 'Due upon receipt' : invoice.date_due}</div>
                        </div>
                        {invoice.invoice_po_number && 
                        <div className="d-flex justify-content-between">
                            <div>PO Number: </div>
                            <div>{invoice.invoice_po_number}</div>
                        </div>}
                        <div className="d-flex justify-content-between">
                            <div>{dues.label}: </div>
                            <div>{dues.amount}</div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <JournalSummary invoice={invoice} />
            </Row>
            <Row className='text-center'>
                <br />
                <h4 className='w100 text-center bordered py-1'><label className="mb-0">Invoice Details</label></h4>
                <br />
            </Row>
            <Row>
                <Col className='table-responsive'>
                    <table border='0' width='100%' className='table table-hover'>
                        <thead>
                            <tr>
                                <td valign="top"><b>Program Name</b></td>
                                <td valign="top" align="right"><b>Needed Payment Type</b></td>
                                <td valign="top" align="right"><b>Total</b></td>
                                <td valign="top" align="right"><b>Refunds</b></td>
                                <td valign="top" align="right"><b>Payments</b></td>
                                <td valign="top" align="right"><b>Amount Due</b></td>
                                <td></td>
                                <td valign="top" align="right"><b>Amount needing dispersal: <br />
                                    <span>${amountNeedingDispersal.toFixed(2)}</span></b>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <RenderStatement invoice={invoice} appliedPayments={appliedPayments} setAppliedPayments={setAppliedPayments} getAppliedPayment={getAppliedPayment} onKeyUpAppliedPayment={onKeyUpAppliedPayment}  />
                        </tbody>
                    </table>
                    <br /> <br />
                    <table width="100%">
                        <tr>
                            <td valign="top"><b>Check Amount:</b></td>
                            <td valign="top">
                            <div className="form__form-group">
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                <input onKeyUp ={onKeyupCheckAmount} name="check_amount" placeholder='0.00' />
                                </div>
                                </div></div>
                                </td>
                            <td>
                                <Button
                                color="primary"
                                className="mx-3 btn-sm"
                                onClick={()=>onClickDisperseCheckAmount()}
                                >Disperse Check Amount</Button>
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td valign="top"><b>Notes:</b></td>
                            <td valign="top" colSpan="2">
                                <textarea name="notes" rows="6" cols="60" onChange={handleNotes} defaultValue={notesRef.current}></textarea>
                            </td>
                            <td valign="bottom">
                                <Button
                                color="primary"
                                className="mx-3"
                                onClick={onClickApplyPayments}
                                >Apply Payments</Button>
                                <AlertModalWrapper alertRef={alertRef} />
                            </td>
                        </tr>
                    </table>
                    <br /> <br />
                    <h4 className='text-center bordered py-1'><label className="mb-0"> Current Payments </label></h4>
                    <RenderPayments invoice={invoice} />
                </Col>
            </Row>
        </form>
    )
}
export default PayInvoice;
