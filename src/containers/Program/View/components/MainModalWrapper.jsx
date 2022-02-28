import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import ProgramInfoModal from './ProgramInfoModal';
import MerchantsModal from './MerchantsModal';
import InvoicesModal from './InvoicesModal';
import AccountingModal from './AccountingModal';
import AwardingPointsModal from './AwardingPointsModal';
import EngagementModal from './EngagementModal';
import AddProgramModal from './AddProgramModal';
// import EventsModal from './EventsModal';
import EventsModal from '../components/event/EventsDataModal';
// import SubProgramsModal from './subprogram/SubProgramsModal'

const MainModalWrapper = ({data, name, isOpen, setOpen, toggle, theme, rtl}) => {
    const props = {
        data, isOpen, setOpen, toggle, theme, rtl
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
        {
            name==='awarding' && <AwardingPointsModal {...props} />
        }
        {
            name==='engagement' && <EngagementModal {...props} />
        }
        {
            name==='events' && <EventsModal {...props} />
        }
        {
            name==='addprogram' && <AddProgramModal {...props} />
        }
        {
            name==='users' && <AddProgramModal {...props} />
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
