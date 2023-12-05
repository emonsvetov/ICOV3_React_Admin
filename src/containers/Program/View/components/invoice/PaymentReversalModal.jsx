import React from 'react';
import {
  Modal,
  Button,
  Card,
  CardHeader,
  Row,
  Col,
  CardTitle
} from 'reactstrap';
import { Form, Field } from 'react-final-form';

const PaymentReversalModal = ({payment, action, isOpen, setOpen, toggle}) => {
    const onSubmit = values => {
        action({...payment, ...values}, toggle)
    }
    const validate = values => {
        let errors = {};
        if( !values.notes ) {
            errors.notes = 'Please enter notes'
        }
        return errors;
    }
    return (
    <Modal className={`modal-md modal-alert`} isOpen={isOpen} toggle={toggle}>

      <Card className='w-100'>
        <CardHeader tag="h3">
            Payment Reversal
            <Button className='btn btn-lg float-end' close onClick={toggle}/>
        </CardHeader>
        <Row>
                <Col sm="12">
                    <Form
                        onSubmit={onSubmit}
                        validate={validate}
                        initialValues={{
                        }}
                    >
                    {({ handleSubmit, form, submitting, pristine, values }) => (
                        <form className="form" onSubmit={handleSubmit}>
                            <Card body>
                                <CardTitle tag="h4">
                                    Payment Information
                                </CardTitle>
                                <Row>
                                    <Col sm="12" className=''>
                                        <div className="form__form-group">
                                            <div className="form__form-group-field">
                                                <span className="form__form-group-label">Dollars</span>
                                                <div className="form__form-group-row">
                                                    ${parseFloat(payment.amount).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="12" className='text-left pr-0'>
                                        <Field name="notes">
                                        {({ input, meta }) => (
                                            <div className="form__form-group">
                                                <span className="form__form-group-label">
                                                    Notes
                                                </span>
                                                <div className="form__form-group-field">
                                                    <div className="form__form-group-row">
                                                        <Field
                                                            name="notes"
                                                            component="textarea"
                                                            type="text"
                                                        />
                                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        </Field>
                                    </Col>
                                </Row>
                                <Button type="submit" disabled={submitting} className="btn btn-primary btn-sm inline" color="#ffffff">Submit</Button>
                                <Button className="btn btn-sm btn-outline-primary" color="#ffffff">Cancel</Button>
                            </Card>
                        </form>
                        )}
                    </Form>
                </Col>
            </Row>
      </Card>
    </Modal>
  )
}

export default PaymentReversalModal;
