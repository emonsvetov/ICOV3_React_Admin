import React, {useEffect, useState} from 'react';
import { Button, ButtonToolbar, Row, Col  } from 'reactstrap';
import {getInvoice} from '@/service/program/invoice';
import {getDues} from './helper/getDues'
import {BillTo} from './components/BillTo'
import { DebitCredit } from './components/DebitCredit';
import JournalSummary from './components/JournalSummary';
import axios from 'axios'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

const ViewInvoice = (props) => {
    const [loading, setLoading] = useState(true)
    const [invoice, setInvoice] = useState(null)
    console.log(props)
    useEffect( () => {
            getInvoice(props.program.organization_id, props.program.id, props.invoice.id)
            .then( res => {
                setInvoice(res)
                setLoading(false)
            })
    }, [props])
    const onClickDownloadInvoice = () => {
        // console.log(props)
        // console.log(invoice)
        axios.get(`/organization/${invoice.program.organization_id}/program/${invoice.program_id}/invoice/${invoice.id}/download`,
        {
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/pdf'
            }
        })
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${invoice.invoice_number}.pdf`); //or any other extension
            document.body.appendChild(link);
            link.click();
        })
        .catch((error) => console.log(error));
    }
    const onClickPayInvoice = () => {
        props.setStep(3)
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
                        <h3 className="mb-4">View Invoice </h3>
                    </div>
                </Col>
                <Col md="9" lg="9" xl="9" className="text-right">
                <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button
                    color="primary"
                    className="mr-3"
                    onClick={()=>onClickDownloadInvoice()}
                    >
                    Download Invoice
                    </Button>
                    {

                        props.auth?.isSuperAdmin &&
                        <Button
                            color="primary"
                            className="mr-3"
                            onClick={() => onClickPayInvoice()}
                        >
                            Pay Invoice
                        </Button>
                    }
                    <Button
                    outline
                    color="primary"
                    className="mr-0"
                    onClick={()=>props.setStep(0)}
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
                    <div className="mb-2">
                        <p>
                            3801 PGA Blvd <br /> Suite 600 <br /> Palm Beach Gardens, FL 33410
                        </p>
                    </div>
                    <div>
			            <p>
                         Bill To : <br />
                         <BillTo invoice={invoice} key={'billto-item'} />
                        </p>
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
                    <div style={{clear: 'both', 'fontSize': '11px'}}>
                        <br />
                        <table className='float-right'>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td><u>Wire Transfer</u></td>
                                    <td><u>ACH Payment</u></td>
                                </tr>
                                <tr>
                                    <td>Routing Number (RTN/ABA):</td>
                                    <td>021000021</td>
                                    <td>102001017</td>
                                </tr>
                                <tr>
                                    <td>Account Number:</td>
                                    <td>138091170</td>
                                    <td>138091170</td>
                                </tr>
                                <tr>
                                    <td>Bank:</td>
                                    <td>Chase Bank, NA</td>
                                    <td>Chase Bank, NA</td>
                                </tr>
                                <tr>
                                    <td valign="top">Address:</td>
                                    <td>2696 S Colorado Blvd&nbsp;&nbsp;&nbsp;<br /> Denver, CO 80222
                                    </td>
                                    <td>2696 S Colorado Blvd<br /> Denver, CO 80222
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Col>
            </Row>
            <JournalSummary invoice={invoice} />
            <br />
            <h4 className="text-center" style={{border:'1px solid #ccc'}}>Invoice Details</h4>
            <br />
            <Row>
                <Col className='table-responsive'>
                    <table className='table table-hover'>
                        <tbody>
                            <tr>
                                <th>Program</th>
                                <th>Description</th>
                                <th align="right">Qty</th>
                                <th align="right">Price</th>
                                <th align="right">Total</th>
                            </tr>
                            <DebitCredit invoice={invoice} />
                        </tbody>
                    </table>
                </Col>
            </Row>
        </>
    )
}

export default withRouter(connect((props) => ({
    auth: props.auth
}))(ViewInvoice));
//export default ViewInvoice;