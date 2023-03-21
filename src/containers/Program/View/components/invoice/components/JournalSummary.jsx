const JournalSummary = ({
    invoice
}) => {
    if( typeof invoice.journal_summary === 'undefined') return null;
    if( invoice?.journal_summary && !invoice.journal_summary.length > 0) return null;
    console.log(invoice.journal_summary)
    return (
        <>
        <br />
        <h4 className="text-center" style={{border:'1px solid #ccc'}}>Invoice Summary</h4>
        <br />
        <div>
            <table>
                <tbody>
                {
                    invoice.journal_summary.forEach( (i, line) => {
                        if( Number.isInteger(i) )  {
                            return line.forEach((key, value) => {
                                <tr>
                                    <td align="left">{key}</td>
                                    <td align="right">${Number(value).toFixed(2)}</td>
                                </tr>
                            })
                        }
                    })
                }
                    <tr>
                        <td style="border-top: thin black dotted; padding-top: 8px;"><b>Total
                                Charges</b></td>
                        <td align="right"
                            style="border-top: thin black dotted; padding-top: 8px;"><b>${Number(invoice.journal_summary.grand_total).toFixed(2)}</b></td>
                    </tr>
                </tbody>
            </table>
        </div>
        </>
    )
}
export default JournalSummary