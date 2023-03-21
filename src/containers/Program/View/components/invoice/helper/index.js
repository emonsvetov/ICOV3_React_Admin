export const isInvoiceTypeOnDemand = (invoice) => {
    if(invoice?.invoice_type?.name) {
        if(invoice.invoice_type.name === 'On-Demand') return true;
        return false;
    }
}

export const isInvoiceTypeCreditCard = (invoice) => {
    if(invoice?.invoice_type?.name) {
        if(invoice.invoice_type.name === 'Credit Card Deposit') return true;
        return false;
    }
}

export const isJournalEventTypeProgramPays = (journal_event_type) => {
    const options = [
        'Program pays for fixed fee',
        'Program pays for points',
        'Program pays for setup fee',
        'Program pays for admin fee',
        'Program pays for usage fee',
        'Program pays for deposit fee',
        'Program pays for convenience fee',
        'Program pays for monies pending',
        'Program pays for points transaction fee'
    ]
    return options.filter(option => option.includes(journal_event_type)).length > 0
}

