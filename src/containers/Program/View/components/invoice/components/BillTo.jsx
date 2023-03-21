export const BillTo = ({
    invoice
}) => {
    let html = []
    if(invoice?.program?.name) 
    {
        html.push(
            <>{invoice?.program?.name}<br /></>
        )
    }
    if(invoice?.program?.address?.address) 
    {
        html.push(
            <>{invoice.program.address.address}<br /></>
        )
    }
    if(invoice?.program?.address?.address_ext) 
    {
        html.push(
            <>{invoice.program.address.address_ext}<br /></>
        )
    }
    if(invoice?.program?.address?.city || invoice?.program?.address?.zip) 
    {
        html.push(
            <>{invoice.program.address.city}, {invoice.program.address.state.code} {invoice.program.address.zip}<br /></>
        )
    }
    return html
}