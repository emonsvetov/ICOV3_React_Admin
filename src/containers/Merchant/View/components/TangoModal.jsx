import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import axios from 'axios'
import { Form, Field } from 'react-final-form';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';

import { sendFlashMessage, ApiErrorMessage } from "@/shared/components/flash"

const saveTangoOrderApi = async(merchantId, toaId, data) => {
  const response = await axios.put(`/merchant/${merchantId}/toa/${toaId}`, data)
  return response
}

//DefaultComponent
const TangoModal = ({theme, rtl, toaId, toggle, isOpen, merchant, errorDispatcher, successDispatcher}) => {
  console.log(merchant)
  const [loading, setLoading] = useState(false)
  const [tangoOrdersApi, setTangoOrdersApi] = useState({})
  useEffect( () => {
    if( merchant?.tango_orders_api)   {
      // getTangoApi(toaId) //make to load from live
      setTangoOrdersApi( merchant.tango_orders_api )
    }
  }, [toaId, merchant])
  const validate = values => {
  }
  const onSubmitForm = values => {
    // setLoading(true)
    saveTangoOrderApi(merchant.id, toaId, values)
    .then( res => {
      console.log(res)
      successDispatcher( "Saved successfully!" )
      setLoading(false)
    })
    .catch((err) => {
      console.log(err)
      errorDispatcher( err.errors )
      setLoading(false);
    });
  }
//   {
//     "id": 7,
//     "platform_name": "Incentco",
//     "platform_key": "MSXLVAWbbkictKYAUKyRjMZPlK&jwrFPLCt?Z@XrZUOYe",
//     "platform_url": "https://integration-www.tangocard.com/raas_api_console/v2/",
//     "platform_mode": "sandbox",
//     "account_identifier": "incentcoacct",
//     "account_number": "bYUfRTgz8J",
//     "customer_number": "incentcocust",
//     "udid": "U426141",
//     "etid": "E000000",
//     "status": "1",
//     "user_id": 486149,
//     "name": "Sandbox API",
//     "is_test": "1",
//     "created_at": "2021-03-22T22:44:09.000000Z",
//     "updated_at": "2021-03-22T22:44:09.000000Z",
//     "toa_merchant_min_value": 0,
//     "toa_merchant_max_value": 0
// }      
  return(
    <Modal className={`merchant-tangoApi modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={toggle} style={{maxWidth:800}}>
      <Form
        onSubmit={onSubmitForm}
        validate={validate}
        initialValues={tangoOrdersApi}
      >
      {({ handleSubmit, form, submitting, pristine, values }) => (
      <form className="form" onSubmit={handleSubmit}>
        <ModalHeader className='w100'>
            <Row>
                <Col md="12" lg="12" xl="12" className='text-right'>
                    <ButtonToolbar className="modal__footer flex justify-content-right w100">
                        <Button outline color="primary" className="mr-3" onClick={toggle}>Close</Button>{' '}
                        <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Save</Button>
                    </ButtonToolbar>
                </Col>
            </Row>
        </ModalHeader>
        <ModalBody className='modal-lg'>
          <h5 className='thick size16 mb-4'>Tango API Details</h5>
          <Row>
              <Col md="6" lg="4" xl="4">
                <Field name="name">
                {({ input, meta }) => (
                <div className="form__form-group">
                    <span className="form__form-group-label">Name</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-row">
                            <input type="text" {...input} placeholder="Name" />
                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                        </div>
                    </div>
                </div>
                )}
              </Field>
            </Col>
            <Col md="6" lg="8" xl="8">
                <Field name="platform_url">
                {({ input, meta }) => (
                <div className="form__form-group">
                    <span className="form__form-group-label">Platform URL</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-row">
                            <input type="text" {...input} placeholder="Platform URL" />
                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                        </div>
                    </div>
                </div>
                )}
              </Field>
            </Col>
          </Row>
          <Row>
              <Col md="6" lg="6" xl="6">
                <Field name="platform_name">
                {({ input, meta }) => (
                <div className="form__form-group">
                    <span className="form__form-group-label">Platform name</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-row">
                            <input type="text" {...input} placeholder="Platform name" />
                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                        </div>
                    </div>
                </div>
                )}
              </Field>
            </Col>
            <Col md="6" lg="6" xl="6">
                <Field name="platform_mode">
                {({ input, meta }) => (
                <div className="form__form-group">
                    <span className="form__form-group-label">Platform Mode</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-row">
                            <input type="text" {...input} placeholder="Platform URL" />
                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                        </div>
                    </div>
                </div>
                )}
              </Field>
            </Col>
          </Row>
          <Row>
              <Col md="6" lg="4" xl="4">
                <Field name="account_identifier">
                {({ input, meta }) => (
                <div className="form__form-group">
                    <span className="form__form-group-label">Account identifier</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-row">
                            <input type="text" {...input} placeholder="Account identifier" />
                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                        </div>
                    </div>
                </div>
                )}
              </Field>
            </Col>
            <Col md="6" lg="8" xl="8">
                <Field name="platform_key">
                {({ input, meta }) => (
                <div className="form__form-group">
                    <span className="form__form-group-label">Platform key</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-row">
                            <input type="text" {...input} placeholder="Platform key" />
                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                        </div>
                    </div>
                </div>
                )}
              </Field>
            </Col>
          </Row>

          <Row>
              <Col md="6" lg="6" xl="6">
                <Field name="account_number">
                {({ input, meta }) => (
                <div className="form__form-group">
                    <span className="form__form-group-label">account_number</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-row">
                            <input type="text" {...input} placeholder="account_number" />
                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                        </div>
                    </div>
                </div>
                )}
              </Field>
            </Col>
            <Col md="6" lg="6" xl="6">
                <Field name="customer_number">
                {({ input, meta }) => (
                <div className="form__form-group">
                    <span className="form__form-group-label">customer_number</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-row">
                            <input type="text" {...input} placeholder="customer_number" />
                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                        </div>
                    </div>
                </div>
                )}
              </Field>
            </Col>
          </Row>
          <Row>
              <Col md="6" lg="6" xl="6">
                <Field name="udid">
                {({ input, meta }) => (
                <div className="form__form-group">
                    <span className="form__form-group-label">udid</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-row">
                            <input type="text" {...input} placeholder="udid" />
                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                        </div>
                    </div>
                </div>
                )}
              </Field>
            </Col>
            <Col md="6" lg="6" xl="6">
                <Field name="etid">
                {({ input, meta }) => (
                <div className="form__form-group">
                    <span className="form__form-group-label">etid</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-row">
                            <input type="text" {...input} placeholder="etid" />
                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                        </div>
                    </div>
                </div>
                )}
              </Field>
            </Col>
          </Row>
          <Row>
              <Col md="6" lg="6" xl="6">
                <Field name="toa_merchant_min_value">
                {({ input, meta }) => (
                <div className="form__form-group">
                    <span className="form__form-group-label">toa_merchant_min_value</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-row">
                            <input type="text" {...input} placeholder="toa_merchant_min_value" />
                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                        </div>
                    </div>
                </div>
                )}
              </Field>
            </Col>
            <Col md="6" lg="6" xl="6">
                <Field name="toa_merchant_max_value">
                {({ input, meta }) => (
                <div className="form__form-group">
                    <span className="form__form-group-label">toa_merchant_max_value</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-row">
                            <input type="text" {...input} placeholder="toa_merchant_max_value" />
                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                        </div>
                    </div>
                </div>
                )}
              </Field>
            </Col>
          </Row>
          <Row>
              <Col md="6" lg="6" xl="6">
                <Field name="status">
                {({ input, meta }) => (
                <div className="form__form-group">
                    <span className="form__form-group-label">Status</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-row">
                            <input type="text" {...input} placeholder="Status" />
                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                        </div>
                    </div>
                </div>
                )}
              </Field>
            </Col>
            <Col md="6" lg="6" xl="6">
                <Field name="is_test">
                {({ input, meta }) => (
                <div className="form__form-group">
                    <span className="form__form-group-label">is_test</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-row">
                            <input type="text" {...input} placeholder="is_test" />
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

const mapDispatchToProps = dispatch => ({
  errorDispatcher: (error) => dispatch(sendFlashMessage(<ApiErrorMessage errors={error} />, 'alert-danger', 'top')),
  successDispatcher: (msg) => dispatch(sendFlashMessage(msg, 'alert-success', 'top')),
});
export default connect((state) => ({
  theme: state.theme,
  rtl: state.rtl,
  merchant: state.merchant,
}), mapDispatchToProps)(TangoModal);