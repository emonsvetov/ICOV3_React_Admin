import React, {useState} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import renderSelectField from '@/shared/components/form/Select';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import axios from 'axios'

import formValidation from "@/shared/validation/program-accounting";


const SUB_MERCHANTS = [
    {label: 'Amozon', value: 'amozon'},
    {label: 'BEST BUY', value: 'best_buy'},
    {label: 'CVS', value: 'cvs'},
]

const DIRECT_ANSCESTORS  = [
    {label: 'NONE', value: 'none'},
    
]

const AddCallbackModal = ({data, isOpen, setOpen, toggle, theme, rtl}) => {
    const [loading, setLoading] = useState(false)

    
    const submit = (file) => {
        // const file = csvFile;
        const reader = new FileReader();

    }

    const onSubmit = values => {
    
        // setLoading(true)
        // axios.post('/organization/1/program', values)
        // .then( (res) => {
        
        //     if(res.status == 200)  {
        
        //         window.location = '/program?message=New program added successfully!'
        //     }
        // })
        // .catch( error => {
        //     console.log(error.response.data);
        //     setErrors(error.response.data);
        //     setLoading(false)
        // })
    }

    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={() => setOpen(true)}>
        <Form 
            onSubmit={onSubmit}
            validate={(values) => formValidation.validateForm(values)}
            initialValues={{
                    
            }}
        >
        {({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="form " onSubmit={handleSubmit}>
            <ModalHeader className='w100'>
                <Row className='w100'>
                    <Col md="6" lg="6" xl="6">
                        <h3>Add Callback</h3>
                    </Col>
                    <Col md="6" lg="6" xl="6" className='text-right'>
                        <ButtonToolbar className="modal__footer flex justify-content-right w100">
                            <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                            <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Save</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
            </ModalHeader>
            <ModalBody className="modal-lg">
                
                
                <Row className='w100'>
                    <Col md="12" >
                        <div className="form__form-group">
                            <span className="form__form-group-label">Select from the dropdown list to add as a submerchant </span>
                            <div className="form__form-group-field">
                                <Field
                                    name="sub_merchant"
                                    component={renderSelectField}
                                    options={SUB_MERCHANTS}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col md="12" >
                        <div className="form__form-group">
                            <span className="form__form-group-label">Select from the dropdown list to add as a Direct Anscestor</span>
                            <div className="form__form-group-field">
                                <Field
                                    name="direct_anscestor"
                                    component={renderSelectField}
                                    options={DIRECT_ANSCESTORS}
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
AddCallbackModal.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired
};
  
export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl
}))(AddCallbackModal));

