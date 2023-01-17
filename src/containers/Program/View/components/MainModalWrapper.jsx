import React from 'react';
import ProgramInfoModal from './ProgramInfoModal';
import ThemeSettingsModal from './ThemeSettingsModal';
import MerchantsModal from './MerchantsModal';
import InvoicesModal from './InvoicesModal';
import AccountingModal from './AccountingModal';
import AwardingPointsModal from './AwardingPointsModal';
import EngagementModal from './EngagementModal';
import AddProgramModal from './AddProgramModal';
// import EventsModal from './EventsModal';
import EventsDataModal from '../components/event/EventsDataModal';
import EmailTemplateModal from '../EmailTemplate/IndexDataModal'

const MainModalWrapper = ({name, isOpen, setOpen, toggle}) => {
    const props = {
        isOpen, setOpen, toggle
    }
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
            name==='events' && <EventsDataModal {...props} />
        }
        {
            name==='addprogram' && <AddProgramModal {...props} />
        }
        {
            name==='users' && <AddProgramModal {...props} />
        }
        {
            name==='themesettings' && <ThemeSettingsModal {...props} />
        }
        {
            name==='emailtemplate' && <EmailTemplateModal {...props} />
        }
        </>
    )
}
  
export default MainModalWrapper;
