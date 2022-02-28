import React, {useState} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';

import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import axios from 'axios'
import ReactTableBase from '@/shared/components/table/ReactTableBase';
import formValidation from "@/shared/validation/program-accounting";
import renderSelectField from '@/shared/components/form/Select';

import US_STATES from "@/shared/json/usstates.json";
const AddSubProgramModal = ({data, isOpen, setOpen, toggle, theme, rtl}) => {
    const [loading, setLoading] = useState(false)

    const [csvRows, setCsvData] = useState([]);
    const [csvFile, setCsvFile] = useState();
    const [isEditable, setIsEditable] = useState(false);
    const [isResizable, setIsResizable] = useState(true);

  
    const onSubmit = (values) => {
      
      
      
        
    };
    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={() => setOpen(true)}>
        <Form onSubmit={onSubmit}>
        {({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="form form--horizontal" onSubmit={handleSubmit}>
            <ModalHeader className='w100'>
                <Row className='w100'>
                    <Col md="6" lg="6" xl="6">
                        <h3>Add a sub program</h3>
                    </Col>
                    <Col md="6" lg="6" xl="6" className='text-right'>
                        <ButtonToolbar className="modal__footer flex justify-content-right w100">
                            <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                            <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Add</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
            </ModalHeader>
            <ModalBody className="modal-lg">
               
              <Row>
                <Col md="6" >
                    <div className="form__form-group">
                        <span className="form__form-group-label">Sub Program</span>
                        <div className="form__form-group-field">
                            <Field
                                name="sub_program"
                                component={renderSelectField}
                                options={US_STATES}
                            />
                        </div>
                    </div>
                </Col>
                <Col md="6" >
                    <div className="form__form-group">
                        <span className="form__form-group-label">Direct Anscestor</span>
                        <div className="form__form-group-field">
                            <Field
                                name="direct_anscestor"
                                component={renderSelectField}
                                options={US_STATES}
                            />
                        </div>
                    </div>
                </Col>
              </Row>
                
            </ModalBody>
            </form>
        )}
        </Form>
    </Modal>
    )
}
AddSubProgramModal.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired
};
  
export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl
}))(AddSubProgramModal));

