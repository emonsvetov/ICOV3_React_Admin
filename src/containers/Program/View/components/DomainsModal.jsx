import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import { Modal, ModalBody, Row, Col, Card, CardBody  } from 'reactstrap';

import CloseButton from "@/shared/components/CloseButton";

const DomainsModal = ({isOpen, toggle, data, theme, rtl}) => {

    const modalProps = {
        isOpen, toggle
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
                                    <h3>Domain settings.</h3>
                                    <h5 className="colorgrey">{data.name}</h5>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12" lg="12" xl="12">
                                <div className="">
                                    {
                                        data.domains.length > 0 &&
                                        data.domains.map( (domain, i) => {
                                            return <div key={`domain-list-${i}`}>
                                                <Link target={`_blank`} className="" to={{pathname:`http://${domain.name}`}}>{domain.name}</Link> → <Link className="" to={`/domains/view/${domain.id}`}>settings</Link>
                                            </div>
                                        })
                                    }
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </ModalBody>
        </Modal>
    )
}

DomainsModal.propTypes = {
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
}))(DomainsModal));
