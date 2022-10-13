import {isInvoiceTypeOnDemand, isInvoiceTypeCreditCard, isJournalEventTypeProgramPays} from '../helper'

const RenderItem = ({invoice, row}) => {
    if(!row?.info) return null
    const info = row.info
    let html = []
    html.push(
        <tr>
            <td>
               {row.info.program_name}
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    )
    let subtotals = 0
    if( info?.debits && info.debits.length > 0 )    
    {
        if( isInvoiceTypeOnDemand(invoice) || isInvoiceTypeCreditCard(invoice)) 
        {
            html.push(
                <tr>
                    <td></td>
                    <td bgcolor='#dddddd' colspan='4'>Charges</td>
                </tr>
            )
        }
        info.debits.forEach( row => {
            if(row.amount == 0) return;
            subtotals += row.amount
            html.push(
                <tr>
                    <td></td>
                    <td>{row.friendly_journal_event_type}{
                        row?.event_name && row.event_name && ' - ' + row.event_name
                    }{
                        row?.ledger_code && row.ledger_code && ' - ' + row.ledger_code
                    }</td>
                    <td align="right">{Number(row.qty).toFixed(2)}</td>
                    <td align="right">{Number(row.ea).toFixed(2)}</td>
                    <td align="right">{Number(row.amount*-1).toFixed(2)}</td>
                </tr>
            )
        })

        info.credits.forEach( row => {
            if(isJournalEventTypeProgramPays(row.journal_event_type)) 
            {
                return;
            }
            if(row.amount == 0) 
            {
                return;
            }
            subtotals += row.amount
            html.push(
                <tr>
                    <td></td>
                    <td>{row.friendly_journal_event_type}{
                        row?.event_name && row.event_name && ' - ' + row.event_name
                    }</td>
                    <td align="right">{Number(row.qty).toFixed(2)}</td>
                    <td align="right">{Number(row.ea).toFixed(2)}</td>
                    <td align="right">{Number(row.amount*-1).toFixed(2)}</td>
                </tr>
            )
        })

        html.push(
            <>
                <tr>
                    <td colspan="1" align="right">
                        <strong className="invoice-sub-total">
                        {row.info.program_name}
                        </strong>
                    </td>
                    <td colspan="4" align="right" style={{"borderTop": "thin black dotted","paddingTop": "8px"}}>
                    <strong className="invoice-sub-total">${Number(subtotals*-1).toFixed(2)}</strong>
                    </td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                </tr>
            </>
        )
    }
    return html
}

export const DebitCredit = ({invoice}) => {

    let html = []
    if(invoice?.invoices && invoice.invoices.length > 0)    {
        // console.log(invoice?.invoices)
        invoice.invoices.forEach( (row, i) => {
            html.push(<RenderItem invoice={invoice} row={row} key={`invoice-item-${i}`} />)
        })
    }
    return html
}