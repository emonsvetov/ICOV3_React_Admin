import React, {useState} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import axios from 'axios'
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"


const OptimalAmountModal = ({merchant, isOpen, setOpen, toggle, theme, rtl, setTrigger, data}) => {
    const dispatch = useDispatch()
    // console.log(merchant)

    const [loading, setLoading] = useState(false)

    const validate = (values) => {
        let errors = []
        if( !values.denomination )
        errors.denomination = 'please enter denomination'
        if( !values.optimal_value )
        errors.optimal_value = 'please enter optimal_value'
        return errors
    }

    const onSubmit = values => {
        // alert(JSON.stringify(values))
        setLoading(true)
        if( !data )  {
            addValue(values)
        }
        else
        {
            updateValue(values)
        }
    }

    const addValue = (values) => {
        const apiUrl = `/merchant/${merchant.id}/optimalvalue`
        axios.post(apiUrl, values)
        .then( (res) => {
            // console.log(res)
            if(res.status == 200)  {
                dispatch(sendFlashMessage('Optimal Values saved successfully', 'alert-success', 'top'))
                setLoading(false)
                toggle()
                setTrigger( Math.floor(Date.now() / 1000) )
            }
        })
        .catch( error => {
            console.log(error);
            dispatch(sendFlashMessage(<ApiErrorMessage errors={error.response.data} />, 'alert-danger', 'top'))
            setLoading(false)
            // toggle()
        })
    }

    const updateValue = (values) => {
        const apiUrl = `/merchant/${merchant.id}/optimalvalue/${data.id}`
        axios.put(apiUrl, values)
        .then( (res) => {
            console.log(res)
            if(res.status == 200)  {
                dispatch(sendFlashMessage('Optimal Values updated successfully', 'alert-success', 'top'))
                setLoading(false)
                toggle()
                setTrigger( Math.floor(Date.now() / 1000) )
            }
        })
        .catch( error => {
            console.log(error);
            dispatch(sendFlashMessage(<ApiErrorMessage errors={error.response.data} />, 'alert-danger', 'top'))
            setLoading(false)
            // toggle()
        })
    }

    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={toggle} >
        <Form
            onSubmit={onSubmit}
            validate={validate}
            initialValues={data}
        >
        {({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="form " onSubmit={handleSubmit}>
            <ModalHeader className='w100'>
                <Row className='w100'>
                    <Col md="6" lg="6" xl="6">
                        <h3>{data ? 'Edit' : 'Add'} Optimal Value</h3>
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
                    <Col md={6}>
                        <Field name="denomination">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Denomination</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Denomination" />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                    <Col md="6" >
                        <Field name="optimal_value">
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Optimal Amount</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Optimal Amount" />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </Col>
                </Row>

            </ModalBody>
            </form>
        )}
        </Form>
    </Modal>
    )
}
OptimalAmountModal.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired
};

export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl
}))(OptimalAmountModal));

