import React, {useState} from 'react';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import axios from 'axios'
// import {useDispatch} from 'react-redux';
// import {sendModalFlashMessage} from '@/redux/actions/flashActions';
// import ModalFlashMessage from "@/shared/components/flash/ModalFlashMessage";

import {useDispatch, sendFlashMessage} from "@/shared/components/flash";
import {PROGRAM_TYPES, PROGRAM_STATUSES} from "@/shared/options";
import {labelizeNamedData, labelizeNamedRow} from '@/shared/helpers'

import renderCheckBoxField from '@/shared/components/form/CheckBox';
import renderSelectField from '@/shared/components/form/Select';
// import US_STATES from "@/shared/json/usstates.json";
import getStatesByCountry from "@/service/getStatesByCountry";
import getProgramStatusList from '@/service/program/getProgramStatusList'
import formValidation from "@/shared/validation/program-info";
import { useEffect } from 'react';

const COUNTRY_ID = 223;

const prepareForValidation = values => {
    const clean = {state_id: values.state_id?.value}
    // console.log(clean)
    return {...values, ...clean}
}

const ProgramInfo = ({organization, isOpen, setOpen, toggle, data, theme, rtl}) => {
    const dispatch = useDispatch();
    const [statusOptions, setStatusOptions] = React.useState([])
    const [loading, setLoading] = useState(false)
    const [states, setStates] = useState(null)
    var [data, setData] = useState(data)
    useEffect( () => {
        if( organization?.id )
        {
            getStatesByCountry(223)
            .then( result => {
                setStates(labelizeNamedData(result))
            })

            getProgramStatusList( organization.id )
            .then( list => {
                setStatusOptions(labelizeNamedData(list, ["id", "status"]))
            })
        }
        // alert(COUNTRY_ID);
    }, [organization])
    // console.log(data)
    const onSubmitForm = async (values) => {
        // setLoading(true)
        // alert(values.state.value)
        // console.log(values.address)
        if( !values.address )   {
            values.address = {
                country_id: COUNTRY_ID
            }
        }
        if(values?.state_id?.value) {
            values.address.state_id =  values.state_id.value
        }
        const state_id = values["state_id"];
        const status = values["status"];
        // console.log(status)
        delete values["state_id"];
        
        values.type = values?.type?.value
        values.status_id = values?.status?.value
        const savedata  = {...data, ...values}

        delete savedata["status"];
        
        // console.log(savedata)
        // alert(JSON.stringify(savedata))
        // return;
        try {
            const response = await axios.put(`/organization/${data.organization_id}/program/${savedata.id}`, savedata);
            // console.log(response)
            
            setLoading(false)
            // console.log(state_id)
            setData( {...savedata, ...{state_id, status}} )
            if( response.status === 200)    {
                toggle()
                dispatch(sendFlashMessage('Program has been updated', 'alert-success', 'top'))
            }
        } catch (e) {
            setLoading(false)
            dispatch(sendFlashMessage('Program could not be updated', 'alert-danger', 'top'))
            throw new Error(`API error:${e?.message}`)
        }
        // setTimeout(alert('Allset'), 2000)
    }
    // data = patch4Select(data, 'state')
    // console.log(data)
    if( !data.state_id )    {
        data.state_id = data.address?.state ? {label: data.address.state.name, value: String(data.address.state.id)} : null;
    }
    // console.log(data.state_id)
    const statusSelected = labelizeNamedRow(data.status, ['id', 'status'])
    // console.log(statusSelected)
    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={() => setOpen(true)}>
        <Form
                onSubmit={onSubmitForm}
                validate={(values) => formValidation.validateForm(prepareForValidation(values))}
                initialValues={{
                    name: data.name,
                    type: {value:data.type, label: PROGRAM_TYPES.find( ptype => ptype.value === data.type)?.label},
                    external_id: data.external_id,
                    corporate_entity: data.corporate_entity,
                    address: data.address,
                    cc_email_list: data.cc_email_list,
                    bcc_email_list: data.bcc_email_list,
                    sub_program_groups: data.sub_program_groups,
                    archive_program: data.archive_program,
                    deactivate_account: data.deactivate_account,
                    enable_global_search: data.enable_global_search,
                    factor_valuation: data.factor_valuation,
                    prefix: data.prefix,
                    public_contact_email: data.public_contact_email,
                    status: statusSelected,
                    state_id: data.state_id
                }}
            >
            {({ handleSubmit, form, submitting, pristine, values }) => (
                <form className="form" onSubmit={handleSubmit}>
        <ModalHeader className='w100'>
            <Row className='w100'>
                <Col md="6" lg="6" xl="6">
                    <h3 style={{"fontWeight": 500}}>General</h3>
                    <h5 style={{"fontWeight": 500, color:'#999'}}>{data.name}</h5>
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
                                    <span className="form__form-group-label">Program Type</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            <Field
                                                name="type"
                                                component={renderSelectField}
                                                options={PROGRAM_TYPES}
                                            />
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
                                />
                            </div>
                            <div className="form__form-group">
                                <Field
                                    name="archive_program"
                                    type="checkbox"
                                    component={renderCheckBoxField}
                                    label="Archive program"
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
                            <Field name="status">
                            {({ input, meta }) => (
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Status</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            <Field
                                                name="status"
                                                component={renderSelectField}
                                                options={statusOptions}
                                            />
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
                                    // defaultChecked={data.enable_global_search}
                                />    
                            </div> 
                            <div className="form__form-group">
                                <Field
                                    name="deactivate_account"
                                    type="checkbox"
                                    component={renderCheckBoxField}
                                    label="Deactivate account"
                                    // defaultChecked={data.deactivate_account}
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
                            <Field name="address.address">
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
                            <Field name="address.address_ext">
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
                            <Field name="address.city">
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
                                <Field name="address.zip">
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
                                <div className="form__form-group">
                                    <span className="form__form-group-label">State</span>
                                    <div className="form__form-group-field">
                                        <Field
                                            name="state_id"
                                            component={renderSelectField}
                                            options={states}
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
export default ProgramInfo;
// ProgramInfo.propTypes = {
//     theme: ThemeProps.isRequired,
//     rtl: RTLProps.isRequired
// };
  
// export default withRouter(connect((state) => ({
//     theme: state.theme,
//     rtl: state.rtl
// }))(ProgramInfo));
