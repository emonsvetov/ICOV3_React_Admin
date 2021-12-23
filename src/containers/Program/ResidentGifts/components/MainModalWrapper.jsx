import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import ProgramInfoModal from './ProgramInfoModal';
import MerchantsModal from './MerchantsModal';
import InvoicesModal from './InvoicesModal';
import AccountingModal from './AccountingModal';

const MainModalWrapper = ({name, isOpen, setOpen, toggle, programId, theme, rtl}) => {
    const props = {
        isOpen, setOpen, toggle, programId, theme, rtl
    }
    // console.log(name)
    return (
        <>
        {
            name==='general' && <ProgramInfoModal {...props} />
        }
        {
            name==='merchants' && <MerchantsModal {...props} />
        }
        {
            name==='invoices' && <InvoicesModal {...props} />
        }
        {
            name==='accounting' && <AccountingModal {...props} />
        }
        </>
    )
}

MainModalWrapper.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired
};
  
export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl
}))(MainModalWrapper));
