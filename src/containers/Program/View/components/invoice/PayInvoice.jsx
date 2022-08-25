import React, {useState} from 'react';
import { useEffect } from 'react';
import { Button, ButtonToolbar, Row, Col  } from 'reactstrap';
import {getInvoice} from '@/service/program/invoice';
import {getDues} from './helper/getDues'
import { DebitCredit } from './components/DebitCredit';
import JournalSummary from './components/JournalSummary';

import axios from 'axios'

const PayInvoice = (props) => {
    const [loading, setLoading] = useState(true)
    const [prev, setPrev] = useState(props.invoice)
    const [invoice, setInvoice] = useState(null)
    useEffect( () => {
            getInvoice(props.organization.id, props.program.id, props.invoice.id)
            .then( res => {
                setInvoice(res)
                setLoading(false)
            })
    }, [props])
 
    const onClickApplyPayments = () => {
        
    }

    if(loading) return 'Loading...'
    if(!invoice) return 'Invoice cannot be loaded'

    const dues = getDues(invoice)
    const logoSrc = process.env.REACT_APP_API_STORAGE_URL + "/logo/big_logo.png";

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
                    </table>
                </Col>
            </Row>
        </>
    )
}
export default PayInvoice;