import React, {useState} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';

import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import axios from 'axios'
import ReactTableBase from '@/shared/components/table/ReactTableBase';
import formValidation from "@/shared/validation/program-users";
import renderSelectField from '@/shared/components/form/Select';

const ROLES = [
    {label: 'Program Manager', value: 'program_manager'},
    {label: 'Program Manager Read Only', value: 'read_only'},
]

const AddProgramUserModal = ({data, isOpen, setOpen, toggle, theme, rtl}) => {
    const [loading, setLoading] = useState(false)
  
    const onSubmit = (values) => {
        
    };
    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={() => setOpen(true)}>
        <Form onSubmit={onSubmit}
            validate={(values) => formValidation.validateForm(values)}
        >
        {({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="form form--horizontal" onSubmit={handleSubmit}>
            <ModalHeader className='w100'>
                <Row className='w100'>
                    <Col md="6" lg="6" xl="6">
                        <h3>Add a program User</h3>
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
               
            <Row className='w100 pt-5'>
                <Col md={6}>
                    <Field name="first_name">
                    {({ input, meta }) => (
                        <div className="form__form-group">
                            <span className="form__form-group-label">First Name</span>
                            <div className="form__form-group-field">
                                <div className="form__form-group-row">
                                    <input type="text" {...input} placeholder="First Name" />
                                    {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                </div>
                            </div>
                        </div>
                    )}
                    </Field>  
                </Col>
                <Col md={6}>
                    <Field name="last_name">
                    {({ input, meta }) => (
                        <div className="form__form-group">
                            <span className="form__form-group-label">Last Name</span>
                            <div className="form__form-group-field">
                                <div className="form__form-group-row">
                                    <input type="text" {...input} placeholder="Last Name" />
                                    {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                </div>
                            </div>
                        </div>
                    )}
                    </Field>  
                </Col>
                
            </Row>

            <Row className='w100 pt-5'>
                <Col md={6}>
                    <Field name="email">
                    {({ input, meta }) => (
                        <div className="form__form-group">
                            <span className="form__form-group-label">Email</span>
                            <div className="form__form-group-field">
                                <div className="form__form-group-row">
                                    <input type="text" {...input} placeholder="Email" />
                                    {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                </div>
                            </div>
                        </div>
                    )}
                    </Field>  
                </Col>
                <Col md="6" >
                    <div className="form__form-group">
                        <span className="form__form-group-label">Role</span>
                        <div className="form__form-group-field">
                            <Field
                                name="state"
                                component={renderSelectField}
                                options={ROLES}
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
AddProgramUserModal.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired
};
  
export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl
}))(AddProgramUserModal));

