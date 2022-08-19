import React, {useEffect, useState} from 'react';
import {Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col, Spinner} from 'reactstrap';
import { Form, Field } from 'react-final-form';
import axios from 'axios'
import renderDropZoneField from '@/shared/components/form/DropZone';
import {useDispatch, sendFlashMessage} from "@/shared/components/flash";
import {mapFormDataUploads, unpatchMedia, patchMediaURL} from '@/shared/helpers'

import renderCheckBoxField from '@/shared/components/form/CheckBox';
import renderSelectField from '@/shared/components/form/Select';
import US_STATES from "@/shared/json/usstates.json";

import WYSIWYGEditor from '@/shared/components/form/WYSIWYGEditor'

const MEDIA_FIELDS = ['small_logo', 'big_logo', 'hero_banner', 'slider_01', 'slider_02', 'slider_03']

const ThemeSettings = ({organization, isOpen, setOpen, toggle, data, theme, rtl}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    let [template, setTemplate] = useState(null)
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

    useEffect(() => {
        if (!template && data.template) {
            setTemplate(data.template)
        }
    }, [template, data])

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
            <ModalBody className='modal-lg programTemplateModal'>
                <Row>
                    <Col xs="12" md="3" lg="3">
                        <div className="form__form-group">
                            <span className="form__form-group-label thick">Big Logo</span>
                            <div className="form__form-group-field  flex-column">
                                <Field
                                name="big_logo"
                                component={renderDropZoneField}
                                multiple={false}
                                customHeight
                                uploadTitle={{type: 'short', displayAlways: true}}
                                />
                                <p className='image-wrap'>
                                    <RenderImage src={template?.big_logo} />
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col xs="12" md="3" lg="3">
                        <div className="form__form-group">
                            <span className="form__form-group-label thick">Small Logo</span>
                            <div className="form__form-group-field flex-column">
                                <Field
                                name="small_logo"
                                component={renderDropZoneField}
                                multiple={false}
                                customHeight
                                uploadTitle={{type: 'short', displayAlways: true}}
                                />
                                <p className='image-wrap'>
                                    <RenderImage src={template?.small_logo} />
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col xs="12" md="6" lg="6">
                        <div className="form__form-group">
                            <span className="form__form-group-label thick">Hero Banner</span>
                            <div className="form__form-group-field  flex-column">
                                <Field
                                  name="hero_banner"
                                  component={renderDropZoneField}
                                  multiple={false}
                                  customHeight
                                  uploadTitle={{type: 'short', displayAlways: true}}
                                />
                                <p className='image-wrap'>
                                    <RenderImage src={template?.hero_banner} />
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
                <p className="form__form-group-label thick">Slider Images</p>
                <Row>
                    <Col xs="12" md="4" lg="4">
                        <div className="form__form-group">
                            <div className="form__form-group-field  flex-column">
                                <Field
                                  name="slider_01"
                                  component={renderDropZoneField}
                                  multiple={false}
                                  customHeight
                                  uploadTitle={{type: 'short', displayAlways: true}}
                                />
                                <p className='image-wrap'>
                                    <RenderImage src={template?.slider_01} />
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col xs="12" md="4" lg="4">
                        <div className="form__form-group">
                            <div className="form__form-group-field  flex-column">
                                <Field
                                  name="slider_02"
                                  component={renderDropZoneField}
                                  multiple={false}
                                  customHeight
                                  uploadTitle={{type: 'short', displayAlways: true}}
                                />
                                <p className='image-wrap'>
                                    <RenderImage src={template?.slider_02} />
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col xs="12" md="4" lg="4">
                        <div className="form__form-group">
                            <div className="form__form-group-field  flex-column">
                                <Field
                                  name="slider_03"
                                  component={renderDropZoneField}
                                  multiple={false}
                                  customHeight
                                  uploadTitle={{type: 'short', displayAlways: true}}
                                />
                                <p className='image-wrap'>
                                    <RenderImage src={template?.slider_03} />
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
                <p>&nbsp;</p>
                <Row>
                    <Col xs="12" md="8" lg="8">
                        <div className="form__form-group">
                            <span className="form__form-group-label thick">Welcome Message</span>
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
            <a href={src} target='_blank' title='View the picture'>
                <img style={{maxHeight:200}} src={src} />
            </a>
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
