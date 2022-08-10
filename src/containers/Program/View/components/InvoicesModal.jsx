import React, {useMemo, useState, useEffect} from 'react';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col, ListGroup, ListGroupItem,Card, CardBody  } from 'reactstrap';
// import { Form, Field } from 'react-final-form';
// import Select from 'react-select';
import Invoices from './invoice/Invoices';
import StatementsTabContent from './invoice/Statements';
import PaymentsTabContent from './invoice/Payments';
import TransferMoniesTabContent from './invoice/TransferMonies';

const TAB_MENU_LINKS = [
    {
        value: 'invoices',
        label: 'Invoices'
    },
    {
        value: 'statements',
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

const InvoiceModal = ({organization, isOpen, setOpen, toggle, data, theme, rtl}) => {
    const LOGO_PUBLIC_URL = `${process.env.PUBLIC_URL}/img/logo`;
    const [activeTab, setActiveTab] = useState('invoices')
    // console.log(LOGO_PUBLIC_URL)

    const RenderItem = ({item, key}) => {
        return (<ListGroupItem
        className={activeTab === item.value ? 'selected' : ''}
        href="#" 
        tag="a" 
        key={key} 
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
            <ModalBody className='modal-lg'>
                <Card>
                    <CardBody className='pt-0'>
                        <Row>
                            <Col md="12" lg="12" xl="12">
                                <div className="card__title">
                                    <h3>Invoice and Statement</h3>
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
                                {activeTab == 'invoices' && <Invoices {...componentProps}  />}   
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </ModalBody>
        </Modal>
    )
}

export default InvoiceModal;
// ProgramInfo.propTypes = {
//     theme: ThemeProps.isRequired,
//     rtl: RTLProps.isRequired
// };
  
// export default withRouter(connect((state) => ({
//     theme: state.theme,
//     rtl: state.rtl
// }))(ProgramInfo));
