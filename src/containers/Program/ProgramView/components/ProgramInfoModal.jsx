import React, {useState} from 'react';
import renderCheckBoxField from '@/shared/components/form/CheckBox';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import Select from 'react-select';
import US_STATES from "@/shared/json/usstates.json";

const ProgramInfo = ({isOpen, setOpen, toggle, data, theme, rtl}) => {
    const [loading, setLoading] = useState(false)
    const [usState, setUsState] = useState(null)
    var [data, setData] = useState(data)
    const handleStateChange = (selectedState) => {
        // alert(JSON.stringify(selectedOption))
        setUsState(selectedState)
    }
    const onSubmitForm = values => {
        alert(JSON.stringify(values))
        setLoading(true)
        // setTimeout(alert('Allset'), 2000)
        setLoading(false)
    }
    const validate = values => {
        // let errors = {};
        // if (!values.name) {
        //     errors.name = "Program name is required";
        // }
        // return errors;
    }
    const statePlaceholder = usState ? usState.label : 'State'
    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={() => setOpen(true)}>
        <Form
                onSubmit={onSubmitForm}
                validate={validate}
                initialValues={{
                    name: data.name,
                    external_id: data.external_id,
                    corporate_entity: data.corporate_entity,
                    address: data.address,
                    address_ext: data.address_ext,
                    city: data.city,
                    state: data.state,
                    cc_email_list: data.cc_email_list,
                    bcc_email_list: data.bcc_email_list,
                    sub_program_groups: data.sub_program_groups,
                    archive_program: data.archive_program,
                    deactivate_account: data.deactivate_account,
                    enable_global_search: data.enable_global_search,
                    factor_valuation: data.factor_valuation,
                    prefix: data.prefix,
                    public_contact_email: data.public_contact_email,
                    external_id: data.external_id,
                    external_id: data.external_id,
                    external_id: data.external_id,
                    external_id: data.external_id,
                    external_id: data.external_id,
                    external_id: data.external_id,
                    external_id: data.external_id,
                }}
            >
            {({ handleSubmit, form, submitting, pristine, values }) => (
                <form className="form" onSubmit={handleSubmit}>
        <ModalHeader className='w100'>
            <Row className='w100'>
                <Col md="6" lg="6" xl="6">
                    <h3 style={{"font-weight": 500}}>General</h3>
                    <h5 style={{"font-weight": 500, color:'#999'}}>{data.name}</h5>
                </Col>
                <Col md="6" lg="6" xl="6" className='text-right'>
                    <ButtonToolbar className="modal__footer flex justify-content-right w100">
                        <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                        <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Save</Button>
                    </ButtonToolbar>
                </Col>
            </Row>
        </ModalHeader>
        <ModalBody className='modal-lg'>
                    <h5 className='thick size16 mb-4'>Program Information</h5>
                    <Row className='w100'>
                        <Col md="6" lg="4" xl="4">
                            <Field name="name">
                            {({ input, meta }) => (
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Program name</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            <input type="text" {...input} placeholder="Program name" />
                                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Field>

                            <Field name="external_id">
                            {({ input, meta }) => (
                                <div className="form__form-group">
                                    <span className="form__form-group-label">External ID</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            <input type="text" {...input} placeholder="External ID" />
                                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Field>

                            <Field name="type">
                            {({ input, meta }) => (
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Type</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            <input type="text" {...input} placeholder="Type" />
                                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Field>
                            <div className="form__form-group">
                                <Field
                                    name="sub_program_groups"
                                    type="checkbox"
                                    component={renderCheckBoxField}
                                    label="Create sub program groups"
                                    // initialValue={item.defaultChecked}
                                    // disabled={item.disabled}
                                    // className={className}
                                />
                            </div>
                            <div className="form__form-group">
                                <Field
                                    name="archive_program"
                                    type="checkbox"
                                    component={renderCheckBoxField}
                                    label="Archive program"
                                    // initialValue={item.defaultChecked}
                                    // disabled={item.disabled}
                                    // className={className}
                                />
                            </div>

                            <Field name="factor_valuation">
                            {({ input, meta }) => (
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Factor for points valuation</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            <input type="text" {...input} placeholder="Factor for points validation" />
                                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Field>
                        </Col>
                        <Col md="6" lg="4" xl="4">
                            <Field name="default_user">
                            {({ input, meta }) => (
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Default user</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            <input type="text" {...input} placeholder="Default user" />
                                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Field>
                            <Field name="corporate_entity">
                            {({ input, meta }) => (
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Corporate entity</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            <input type="text" {...input} placeholder="Corporate entity" />
                                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Field>
                            <Field name="spaceholder">
                            {({ input, meta }) => (
                                <div className="form__form-group invisible">
                                    <span className="form__form-group-label">xxxxxxx</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            <input type="text" {...input} placeholder="xxxxxxxx" />
                                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Field>
                            <div className="form__form-group">
                                <Field
                                    name="enable_global_search"
                                    type="checkbox"
                                    component={renderCheckBoxField}
                                    label="Enable global search"
                                />    
                            </div> 
                            <div className="form__form-group">
                                <Field
                                    name="deactivate_account"
                                    type="checkbox"
                                    component={renderCheckBoxField}
                                    label="Deactivate account"
                                />   
                            </div>
                        </Col>
                        <Col md="6" lg="4" xl="4">
                            <Field name="public_contact_email">
                            {({ input, meta }) => (
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Public contact email</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            <input type="text" {...input} placeholder="Public contact email" />
                                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Field>  
                        </Col>
                    </Row>
                    <h5 className='thick size16 mb-4'>Email Settings</h5>
                    <Row className='w100'>
                        <Col md="6" lg="4" xl="4">
                            <Field name="prefix">
                            {({ input, meta }) => (
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Prefix</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            <input type="text" {...input} placeholder="Prefix" />
                                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Field>
                            <Field name="bcc_email_list">
                            {({ input, meta }) => (
                                <div className="form__form-group">
                                    <span className="form__form-group-label">BCC Email List</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            <input type="text" {...input} placeholder="BCC Email List" />
                                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Field>
                            <Field name="cc_email_list">
                            {({ input, meta }) => (
                                <div className="form__form-group">
                                    <span className="form__form-group-label">CC Email List</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            <input type="text" {...input} placeholder="CC Email List" />
                                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Field>
                            <Field name="notification_email_list">
                            {({ input, meta }) => (
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Notification email list</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            <input type="text" {...input} placeholder="Notification email list" />
                                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Field>  
                        </Col>
                    </Row>
                    <h5 className='thick size16 mb-4'>Address Settings</h5>
                    <Row className='w100'>
                        <Col md="6" lg="4" xl="4">
                            <Field name="address">
                            {({ input, meta }) => (
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Address</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            <input type="text" {...input} placeholder="Address" />
                                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Field>  
                        </Col>
                        <Col md="6" lg="4" xl="4">
                            <Field name="address_ext">
                            {({ input, meta }) => (
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Address line 2</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            <input type="text" {...input} placeholder="Address line 2" />
                                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Field>  
                        </Col>
                    </Row>
                    <Row className='w100'>
                        <Col md="6" lg="4" xl="4">
                            <Field name="city">
                            {({ input, meta }) => (
                                <div className="form__form-group">
                                    <span className="form__form-group-label">City</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            <input type="text" {...input} placeholder="City" />
                                            {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Field>  
                            </Col>
                            <Col md="6" lg="4" xl="4">
                                <Field name="zip">
                                {({ input, meta }) => (
                                    <div className="form__form-group">
                                        <span className="form__form-group-label">Zip</span>
                                        <div className="form__form-group-field">
                                            <div className="form__form-group-row">
                                                <input type="text" {...input} placeholder="Zip" />
                                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                </Field>  
                            </Col>
                            <Col md="6" lg="4" xl="4">
                                <Field name="state" component="select">
                                {({ input, meta }) => (
                                    <div className="form__form-group">
                                    <span className="form__form-group-label">State</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                    <Select
                                        value={usState}
                                        onChange={handleStateChange}
                                        options={US_STATES}
                                        clearable={false}
                                        className="react-select"
                                        placeholder={statePlaceholder}
                                        classNamePrefix="react-select"
                                    />
                                    {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                            </div>
                                        </div>
                                )}
                                </Field>
                                {/* <Field name="state">
                                    {({ input, meta }) => (
                                        <div className="form__form-group">
                                            <span className="form__form-group-label">State</span>
                                            <div className="form__form-group-field">
                                                <div className="form__form-group-row">
                                                    <input type="text" {...input} placeholder="State" />
                                                    {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    </Field>   */}
                            </Col>
                        </Row>
                
        </ModalBody>
        </form>
            )}
            </Form>
    </Modal>
    )
}
export default ProgramInfo;
// ProgramInfo.propTypes = {
//     theme: ThemeProps.isRequired,
//     rtl: RTLProps.isRequired
// };
  
// export default withRouter(connect((state) => ({
//     theme: state.theme,
//     rtl: state.rtl
// }))(ProgramInfo));