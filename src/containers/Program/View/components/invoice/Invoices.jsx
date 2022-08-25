import React, {useState} from 'react';
import InvoiceDataTable from './InvoiceDataTable';
import CreateInvoiceForm from './CreateInvoiceForm';
import ViewInvoice from './ViewInvoice';
import PayInvoice from './PayInvoice';

const Invoices = (props) => {
    const [step, setStep] = useState(0);
    const [invoice, setInvoice] = useState(null);
    props = {
        ...props,
        setStep
    }
    return (
        <>
        { step === 0 && <InvoiceDataTable setInvoice={setInvoice} {...props}  />}
        { step === 1 && props.program.is_pay_in_advance == 1 && <CreateInvoiceForm {...props} />}
        { step === 2 && <ViewInvoice invoice={invoice} {...props} />}
        { step === 3 && <PayInvoice invoice={invoice} {...props} />}
        </>
    )
}

export default Invoices;