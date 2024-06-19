export const getDues = (invoice) => {
    if(invoice.invoice_type.name==='On-Demand' || invoice.invoice_type.name==='Credit Card Deposit') 
    {
       return {
            label: 'Total Due',
            amount: `$${(invoice.total_end_balance * -1).toFixed(2)}`
       }
    }   
    else 
    {
        if( invoice.invoice_type.name==='Monthly' )  {
            return {
                label: 'Invoice Total',
                amount: `$${(invoice.custom_invoice_amount).toFixed(2)}`
            }
        }   else {
            return {
                label: 'Balance Due',
                amount: `$${(invoice.total_end_balance * -1).toFixed(2)}`
            }
        }
    }
}