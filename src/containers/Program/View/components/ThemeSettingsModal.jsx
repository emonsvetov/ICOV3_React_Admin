import React, {useState} from 'react';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import axios from 'axios'
import renderDropZoneField from '@/shared/components/form/DropZone';
import {useDispatch, sendFlashMessage} from "@/shared/components/flash";
import {mapFormDataUploads, unpatchMedia, patchMediaURL} from '@/shared/helpers'

import renderCheckBoxField from '@/shared/components/form/CheckBox';
import renderSelectField from '@/shared/components/form/Select';
import US_STATES from "@/shared/json/usstates.json";

import WYSIWYGEditor from '@/shared/components/form/WYSIWYGEditor'

const MEDIA_FIELDS = ['small_logo', 'big_logo']

const ThemeSettings = ({organization, isOpen, setOpen, toggle, data, theme, rtl}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    let [template, setTemplate] = useState(data.template)
    // console.log(data)
    const onSubmitForm = async (values) => {
        // setLoading(true)
        values = unpatchMedia(values, MEDIA_FIELDS)
        // console.log(values)
        let formData = mapFormDataUploads( values )
        // console.log(formData)
        let saveUrl = `/organization/${organization.id}/program/${data.id}/template`;
        if( template?.id)  {
            formData.append('_method', 'PUT')
            saveUrl += `/${template.id}`
        }
        axios.post(saveUrl, formData, {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*"
        })
        .then( (res) => { 
            // console.log(res)
            toggle();
            if(res.status == 200)  {
                setTemplate(res.data)
                dispatch(sendFlashMessage('Program Template updated successfully', 'alert-success'))
            }
        })
        .catch( error => {
            // console.log(error)
            // console.log(JSON.stringify(error.response.data.errors));
            dispatch(sendFlashMessage(JSON.stringify(error.response.data.errors), 'alert-danger'))
            // throw new Error(`API error:${e?.message}`);
            setLoading(false)
        })
    }
    template = patchMediaURL( template, MEDIA_FIELDS )
    console.log(template)
    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={() => setOpen(true)}>
        <Form
            onSubmit={onSubmitForm}
            validate={validate}
            initialValues={template}
        >
        {({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="form" onSubmit={handleSubmit}>
            <ModalHeader className='w100'>
                <Row className='w100'>
                    <Col md="6" lg="6" xl="6">
                        <h3 style={{"fontWeight": 500}}>Theme Options</h3>
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
                <h5 className='thick size16 mb-4'>Program Web Resources</h5>
                <Row>
                    <Col md="8" lg="8" xl="8">
                        <div className="form__form-group">
                            <span className="form__form-group-label">Big Logo</span>
                            <div className="form__form-group-field  flex-column">
                                <Field
                                name="big_logo"
                                component={renderDropZoneField}
                                multiple={false}
                                customHeight
                                />
                                Current Big Logo <RenderImage src={template?.big_logo} />
                            </div>
                        </div>
                        <div className="form__form-group">
                            <span className="form__form-group-label">Small Logo</span>
                            <div className="form__form-group-field flex-column">
                                <Field
                                name="small_logo"
                                component={renderDropZoneField}
                                multiple={false}
                                customHeight
                                />
                                Current Small Logo <RenderImage src={template?.small_logo} />
                            </div>
                        </div>
                        <div className="form__form-group">
                            <span className="form__form-group-label">Welcome Message</span>
                            <div className="form__form-group-field flex-column">
                                <Field
                                    name="welcome_message"
                                    component={WYSIWYGEditor}
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
)}

const RenderImage = ({src}) => {
    if( !src || typeof src === 'undefined' ) return ''
    return (
        <div className='dropzone-img'>
            <img src={src} />
        </div>
    )
}

const validate = values => {
    let errors = {}
    return errors
}

export default ThemeSettings;
// ThemeSettings.propTypes = {
//     theme: ThemeProps.isRequired,
//     rtl: RTLProps.isRequired
// };
  
// export default withRouter(connect((state) => ({
//     theme: state.theme,
//     rtl: state.rtl
// }))(ThemeSettings));
