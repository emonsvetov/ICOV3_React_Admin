
export const DebitCredit = ({sData}) => {

    const RenderItem = ({row}) => {
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
            </tr>
        )
    
        html.push(
            <>
                <tr>
                    <td></td>
                    <td>
                        Previous Balance ({sData.previous_balance_date})
                    </td>
                    <td></td>
                    <td align="right"></td>
                    <td align="right">
                        ${(info.start_balance * -1).toFixed(2)}
                    </td>
                </tr>
                <tr>
                    <td colSpan={5}></td>
                </tr>
            </>
        )
    
        info.credits.forEach( row => {
            if(row.amount == 0) 
            {
                return;
            }
            html.push(
                <tr>
                    <td></td>
                    <td>C-{row.friendly_journal_event_type}{
                        row?.event_name && row.event_name && ' - ' + row.event_name
                    } ({row.created_at})</td>
                    <td align="right">{Number(row.qty).toFixed(2)}</td>
                    <td align="right">{Number(row.ea).toFixed(2)}</td>
                    <td align="right">{Number(row.amount*-1).toFixed(2)}</td>
                </tr>
            )
        })
    
        if( info?.debits && info.debits.length > 0 )    
        {
            info.debits.forEach( row => {
                if(row.amount == 0) return;
                html.push(
                    <tr>
                        <td></td>
                        <td>D-{row.friendly_journal_event_type}{
                            row?.event_name && row.event_name && ' - ' + row.event_name
                        }</td>
                        <td align="right">{Number(row.qty).toFixed(2)}</td>
                        <td align="right">{Number(row.ea).toFixed(2)}</td>
                        <td align="right">{Number(row.amount*-1).toFixed(2)}</td>
                    </tr>
                )
            })
        }
        
        html.push(
            <>
                <tr>
                    <td colspan="1" align="right">
                        <strong className="invoice-sub-total">
                        {info.program_name}
                        </strong>
                    </td>
                    <td colspan="4" align="right" style={{"borderTop": "thin black dotted","paddingTop": "8px"}}>
                    <strong className="invoice-sub-total">${Number(Math.round(info.end_balance) * -1).toFixed(2)}</strong>
                    </td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                </tr>
            </>
        )
        return html
    }

    if(!sData || !sData?.statement || sData?.statement.length <=0 ) return 'No statement found!'

    let html = []
    sData.statement.forEach( (row, i) => {
        html.push(<RenderItem row={row} key={`statement-item-${i}`} />)
    })
    return html
}