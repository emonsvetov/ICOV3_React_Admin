import {Row, Col} from 'reactstrap';
import { DebitCredit } from './StatementDebitCredit';

const StatementDataTable = ({statement, loading}) => {
    console.log(loading)
    if( loading ) return <div className='text-center'>Loading...</div>
    if( !statement ) return '';
    console.log(statement)
    const sData = statement
    return (
        <>
        <h4 class="text-center bordered mb-3">Statement Details</h4>
        <Row>
            <Col md="6">
                <div>
                    <p>
                        3801 PGA Blvd <br /> Suite 600 <br /> Palm Beach Gardens, FL 33410
                    </p>
                </div>
                <div>
                    <p>
                        <br />Bill TO : <br />
                        {statement.address_info &&
                            <>
                                {statement.address_info.address}
                                <br />
                                {
                                    statement.address_info.address_ext && 
                                    <>{statement.address_info.address_ext}<br /></>
                                }
                                {
                                (statement.address_info.city || statement.address_info.zip) && 
                                <>{statement.address_info.city}, {statement.address_info.state.code} {statement.address_info.zip}<br /></>
                                }
                            </>
                        }
                        <br />
                    </p>
                </div>
            </Col>
            <Col md="6">
                <div className='float-right'>
                    <div class="d-flex justify-content-between">
                        <div className='pr-2'>Date: </div><div>{sData.end_date}</div>
                    </div>
                    <div class="d-flex justify-content-between">
                        <div className='pr-2'>Total Due: </div>
                        <div><b><u>${parseFloat(sData.total_end_balance).toFixed(2)}</u></b></div>
                    </div>
                </div>
            </Col>
        </Row>
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
                        <DebitCredit sData={sData} />
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td align="right"><strong class="invoice-total">Total Due:</strong>
                            </td>
                            <td align="right">
                                <strong class="invoice-total">${Number(Math.round(sData.total_end_balance) * -1).toFixed(2)}</strong>
                            </td>
			            </tr>
                    </tbody>
                </table>
            </Col>
        </Row>
        </>
    )
}

export default StatementDataTable