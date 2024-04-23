import React from 'react';
import ProgramInfoModal from './ProgramInfoModal';
import ThemeSettingsModal from './ThemeSettingsModal';
import MerchantsModal from './MerchantsModal';
import InvoicesModal from './InvoicesModal';
import DomainsModal from './DomainsModal';
import AccountingModal from './AccountingModal';
import AwardingPointsModal from './AwardingPointsModal';
import EngagementModal from './EngagementModal';
import AddProgramModal from './AddProgramModal';
import DigitalMediaModal from "./DigitalMediaModal";
import EventsDataModal from '../components/event/EventsDataModal';
import EmailTemplateModal from '../EmailTemplate/IndexDataModal'
import ActivateLiveModeProgramModal from "./ActivateLiveModeProgramModal";
import ReportsModal from "./ReportsModal";
import AwardLevelsModal from "./AwardLevelsModal";
import UnitNumbersDataModal from './UnitNumbers/UnitNumberDataModal'
import PositionLevelsModal from './positions/PositionLevelsModal';

const MainModalWrapper = ({name, isOpen, setOpen, toggle}) => {
  const props = {
    isOpen, setOpen, toggle
  }
  return (
    <>
      {
        name === 'general' && <ProgramInfoModal {...props} />
      }
      {
        name === 'merchants' && <MerchantsModal {...props} />
      }
      {
        name === 'invoices' && <InvoicesModal {...props} />
      }
      {
        name === 'domains' && <DomainsModal {...props} />
      }
      {
        name === 'accounting' && <AccountingModal {...props} />
      }
      {
        name === 'awarding' && <AwardingPointsModal {...props} />
      }
      {
        name === 'engagement' && <EngagementModal {...props} />
      }
      {
        name === 'events' && <EventsDataModal {...props} />
      }
      {
        name === 'addprogram' && <AddProgramModal {...props} />
      }
      {
        name === 'users' && <AddProgramModal {...props} />
      }
      {
        name === 'themesettings' && <ThemeSettingsModal {...props} />
      }
      {
        name === 'emailtemplate' && <EmailTemplateModal {...props} />
      }
      {
        name === 'digitalmedia' && <DigitalMediaModal {...props} />
      }
      {
        name === 'activateLiveMode' && <ActivateLiveModeProgramModal {...props} />
      }
      {
        name === 'reports' && <ReportsModal {...props} />
      }
        {
            name === 'AwardLevels' && <AwardLevelsModal {...props} />
        }
      {
        name === 'UnitNumbers' && <UnitNumbersDataModal {...props} />
      }
      {
         name === 'PositionLevels' && <PositionLevelsModal {...props} />
      }
    </>
  )
}

export default MainModalWrapper;
