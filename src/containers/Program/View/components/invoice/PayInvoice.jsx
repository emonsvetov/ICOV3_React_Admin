import React, {useState} from 'react';
import { useEffect } from 'react';
import { Button, ButtonToolbar, Row, Col  } from 'reactstrap';
import {getPayInvoice} from '@/service/program/invoice';
import {getDues} from './helper/getDues'
import JournalSummary from './components/JournalSummary';

import axios from 'axios'

const RenderPayments = ({invoice}) => {
    if( !invoice.view_params?.payments || invoice.view_params.payments.length <= 0) return null;
    return(
        <>
            <br />
            <div>
                <table>
                    <tr>
                        <th align="left">Date</th>
                        <th align="left">Program</th>
                        <th align="left">Payment Kind</th>
                        <th align="left">Amount</th>
                        <th align="left">Notes</th>
                    </tr>
                    {invoice.view_params.payments.foreach(payment => {
                        return (
                            <tr>
                                <td>{payment.journal_event_timestamp}</td>
                                <td>{payment.program_name}</td>
                                <td>{payment.journal_event_type}</td>
                                <td>{payment.amount.toFixed(2)}</td>
                                <td>{payment.notes}</td>
                            </tr>
                        )
                    })}
                </table>
            </div>
        </>
    )
}

const RenderStatement = ({invoice}) => {
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
                console.log(`${journal_event_type}: ${charge.total}`);
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
                        <td align="right">$<input class="program_dispersal" size="6"
                            type="text" name='applied_payment[]' value='0.00'
                            id={`${statement.program_id}-${journal_event_type.replace(/\s/g, '-')}`}></input>
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
                <td colspan="9"><hr /></td>
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
    const [loading, setLoading] = useState(true)
    const [prev, setPrev] = useState(props.invoice)
    const [invoice, setInvoice] = useState(null)
    useEffect( () => {
            getPayInvoice(props.organization.id, props.program.id, props.invoice.id)
            .then( res => {
                setInvoice(res)
                setLoading(false)
            })
    }, [props])
 
    const onClickApplyPayments = () => {
        
    }

    if(loading) return 'Loading...'
    if(!invoice) return 'Invoice cannot be loaded'

    console.log(invoice)

    const dues = getDues(invoice)
    const logoSrc = process.env.REACT_APP_API_STORAGE_URL + "/logo/big_logo.png";
    const t = new Date();
    const dt_today = t.toLocaleDateString("en-US")

    return (
        <>
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
                    onClick={()=>onClickApplyPayments()}
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
            <JournalSummary invoice={invoice} />
            <br />
            <h4 className="text-center" style={{border:'1px solid #ccc'}}>Invoice Details</h4>
            <br />
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
                                    <span id="amount_left_to_disperse">$0.00</span></b>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <RenderStatement invoice={invoice} />
                        </tbody>
                    </table>
                    <br /> <br />
                    <table width="100%">
                        <tr>
                            <td valign="top"><b>Check Amount:</b></td>
                            <td valign="top"><input name="check_amount" value="0.00" /></td>
                            <td>
                                <div class="button-container">
                                    <a href="#" class="inner-button disperse-check-button">Disperse
                                        Check Amount</a>
                                </div>
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td valign="top"><b>Notes:</b></td>
                            <td valign="top" colspan="2">
                                <textarea name="notes" rows="6" cols="60">{`Payment Posting Date: ${dt_today}\nCheck/REF#:`}</textarea>
                            </td>
                            <td valign="bottom">
                                <div class="button-container">
                                    <input type="submit" class="inner-button" value="Apply Payments"
                                        id="apply-payments" />
                                </div>
                            </td>
                        </tr>
                    </table>
                    <br /> <br />
                    <div class="invoice-detail">
                        <label> Current Payments </label>
                    </div>
                    <RenderPayments invoice={invoice} />
                </Col>
            </Row>
        </>
    )
}
export default PayInvoice;