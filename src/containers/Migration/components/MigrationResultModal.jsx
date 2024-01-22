import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {ThemeProps, RTLProps} from '@/shared/prop-types/ReducerProps';
import {Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col} from 'reactstrap';
import {Form, Field} from 'react-final-form';
import axios from 'axios'

const MigrationResult = ({isOpen, toggle, theme, data, rtl, migrationResultAccount}) => {
    const [loading, setLoading] = useState(false)

    return (
        <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen}
               toggle={toggle}>
            <ModalHeader className='w100'>
                <Row className='w100'>
                    <Col md="6" lg="6" xl="6">
                        <h3 style={{"fontWeight": 500}}>Result</h3>
                    </Col>
                    <Col md="6" lg="6" xl="6" className='text-right'>
                        <ButtonToolbar className="modal__footer flex justify-content-right w100">
                            <Button outline color="primary" className="mr-3" onClick={toggle}>Close</Button>{' '}
                        </ButtonToolbar>
                    </Col>
                </Row>
            </ModalHeader>
            <ModalBody className='modal-lg'>
                <h5 className='thick size16 mb-4'>Program Account Holder Id: {migrationResultAccount}</h5>
                <Row>
                    <Col md="12">
                        {data}
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    )
}

MigrationResult.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired,
    organization: Object.isRequired,
};

export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
    organization: state.organization,
}))(MigrationResult));
