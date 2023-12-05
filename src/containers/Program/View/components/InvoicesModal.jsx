import React, {useState} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types'
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import { Modal, ModalBody, Row, Col, ListGroup, ListGroupItem,Card, CardBody  } from 'reactstrap';

// import { Form, Field } from 'react-final-form';
// import Select from 'react-select';
import Invoices from './invoice/Invoices';
import StatementTabContent from './invoice/Statement';
import PaymentsTabContent from './invoice/Payments';
import TransferMoniesTabContent from './invoice/TransferMonies';
import CloseButton from "@/shared/components/CloseButton";

const TAB_MENU_LINKS = [
    {
        value: 'invoices',
        label: 'Invoices'
    },
    {
        value: 'statement',
        label: 'Statements'
    },
    {
        value: 'payments',
        label: 'Payments'
    },
    {
        value: 'transfermonies',
        label: 'Transfer Monies'
    }
]

const InvoicesModal = ({organization, isOpen, setOpen, toggle, data, theme, rtl}) => {
    const [activeTab, setActiveTab] = useState('invoices')

    const RenderItem = ({item, key}) => {
        return (<ListGroupItem
        className={activeTab === item.value ? 'selected' : ''}
        href="#" 
        tag="a" 
        key={`${key}-renderItem`} 
        onClick={()=>setActiveTab(item.value)}>{item.label}</ListGroupItem>)
    }

    const modalProps = {
        isOpen, toggle, setOpen
    }

    const componentProps = {
        ...modalProps, ...{organization, theme, rtl, program: data}
    }
    
    return (
        <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} {...modalProps}>
            <CloseButton onClick={toggle} />
            <ModalBody className='modal-lg'>
                <Card>
                    <CardBody className='pt-0'>
                        <Row>
                            <Col md="12" lg="12" xl="12">
                                <div className="card__title">
                                    <h3>Invoices and Statements</h3>
                                    <h5 className="colorgrey">{data.name}</h5>
                                </div>
                            </Col>
                        </Row>
                        <Row className='pl-2'>
                            <Col md={12} className='view-tabbed-menu pl-0'>
                                <ListGroup horizontal>
                                {
                                    TAB_MENU_LINKS.map( (item, i) => <RenderItem item={item} key={'menu-item-'+i} />)
                                }
                                </ListGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} className={'py-4'}>
                                {activeTab === 'invoices' && <Invoices {...componentProps}  />}
                                {activeTab === 'payments' && <PaymentsTabContent {...componentProps}  />}
                                {activeTab === 'statement' && <StatementTabContent {...componentProps}  />}
                                {activeTab === 'transfermonies' && <TransferMoniesTabContent {...componentProps}  />}
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </ModalBody>
        </Modal>
    )
}

InvoicesModal.propTypes = {
  theme: ThemeProps.isRequired,
  rtl: RTLProps.isRequired,
  setOpen: PropTypes.func.isRequired,
  organization: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default withRouter(connect((state) => ({
  theme: state.theme,
  rtl: state.rtl,
  organization: state.organization,
  data: state.program
}))(InvoicesModal));
