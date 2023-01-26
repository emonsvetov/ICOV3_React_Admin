import React, {useEffect, useState, useContext} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col, Spinner, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import axios from 'axios'
import renderDropZoneField from '@/shared/components/form/DropZone';
import {useDispatch, sendFlashMessage} from "@/shared/components/flash";
import {mapFormDataUploads, unpatchMedia, patchMediaURL} from '@/shared/helpers'
import classnames from 'classnames';
import Slider from "@/shared/components/form/Slider"
import { ColorPicker } from 'material-ui-color';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
// import Select, { SelectChangeEvent } from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';

import renderCheckBoxField from '@/shared/components/form/CheckBox';
import renderSelectField from '@/shared/components/form/Select';
import renderSelectOptionsField from '@/shared/components/form/SelectOptions';

import WYSIWYGEditor from '@/shared/components/form/WYSIWYGEditor'
import { THEME_FONT_FAMILIES  } from './ThemeData';
import {SelectOptionsField} from "../../../../shared/components/form/SelectOptions";

const MEDIA_FIELDS = ['small_logo', 'big_logo', 'hero_banner', 'slider_01', 'slider_02', 'slider_03']
const THEME_IMAGE = {
    'Original' : `${process.env.PUBLIC_URL}/img/theme/Original.png`,
    'New' : `${process.env.PUBLIC_URL}/img/theme/New.png`,
}
const THEME_OPTIONS = [
    { value: "Original", label: "Clear" },
    { value: "New", label: "Classic" },
];

const ThemeSettings = ({organization, isOpen, setOpen, toggle, data, theme, rtl}) => {
    // console.log(data);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [currentTheme, setCurrentTheme] = useState();
    const [resetTheme, setResetTheme] = useState(false);
    let [template, setTemplate] = useState(null)
    // console.log(data)
    const onSubmitForm = async (values) => {
        values.resetTheme = resetTheme;
        values.button_corner = sliderValue;
        values.theme_color = selectedThemeColor;
        values.button_color = selectedColor;
        values.button_bg_color = selectedBGColor;
        values.font_family = fontFamily;
        values.name = currentTheme;
        // setLoading(true)
        values = unpatchMedia(values, MEDIA_FIELDS)
        // console.log(values)
        let formData = mapFormDataUploads( values )
        // console.log(formData)
        let saveUrl = `/organization/${data.organization_id}/program/${data.id}/template`;
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
            if(res.status === 200)  {
                setTemplate(res.data)
                dispatch(sendFlashMessage('Program Template updated successfully', 'alert-success'));
                if( !template?.id)  {
                    window.location.reload();
                }
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

    // Tabs Panel
    const [currentActiveTab, setCurrentActiveTab] = useState('1');
    const togglePan = tab => {
        if (currentActiveTab !== tab) setCurrentActiveTab(tab);
    }

    // Slider
    const SliderConfig = [
        {
            value: 0,
            label: "Square",
        },
        {
            value: 20,
            label: "Rounded",
        },
    ];
    const [sliderValue, setSliderValue] = useState(0);
    const updateSliderRange = (e, data) => {
        if (typeof data === 'number' && sliderValue !== data) {
            template.button_corner = data;
            setTemplate(template);
            setSliderValue(data);
            // setSliderValue(6);
        }
    };

    // Theme Color
    const [selectedThemeColor, setSelectedThemeColor] = useState(null);
    const updateThemeColorHandler = (e, data) => {
        setSelectedThemeColor('#'+e.hex);
    };

    // Color
    const [selectedColor, setSelectedColor] = useState(null);
    const updateColorHandler = (e, data) => {
        setSelectedColor('#'+e.hex);
    };

    // BG Color
    const [selectedBGColor, setSelectedBGColor] = useState(null);
    const updateBGColorHandler = (e, data) => {
        setSelectedBGColor('#'+e.hex);
    };

    // Font Type
    const [fontFamily, setFontFamily] = useState(null);
    const fontFamilyHandler = (e, data) => {
        setStylePath("https://fonts.googleapis.com/css?family="+data+":100,300,400,500,700,900");
        setFontFamily(data);
    };

    const [ stylePath, setStylePath ] = useState("https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900");

    const onSelectTheme = (selectedOption) => {
        setCurrentTheme(selectedOption.value);
    };

    useEffect(() => {
        let [option] = THEME_OPTIONS.filter((item) => item.value === template?.name);
        if (!option){
            [option] = THEME_OPTIONS.filter((item) => item.value === 'Original');
        }
        setCurrentTheme(option.value);
    }, [template]);

    useEffect(() => {
        var head = document.head;
        var link = document.createElement("link");

        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = stylePath;

        head.appendChild(link);

        return () => { head.removeChild(link); }

    }, [stylePath]);

    useEffect(() => {
        if (!template && data.template) {
            setTemplate(data.template)
        }

        if (template){
          setSliderValue(parseInt(template.button_corner))
          setSelectedColor(template.button_color)
          setSelectedThemeColor(template.theme_color)
          setSelectedBGColor(template.button_bg_color)
          setFontFamily(template.font_family)
        }
    }, [template, data])

    template = patchMediaURL( template, MEDIA_FIELDS )

    return (
    <Modal className={`modal-program programTemplateModal modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen}
           toggle={toggle}>
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
                            <Button outline color="primary" className="mr-3" onClick={toggle}>Close</Button>{' '}
                            <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Save</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
            </ModalHeader>
            <ModalBody className=''>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                          className={classnames({
                              active:
                                currentActiveTab === '1'
                          })}
                          onClick={() => { togglePan('1'); }}
                        >
                            Theme select
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                          className={classnames({
                              active:
                                currentActiveTab === '2'
                          })}
                          onClick={() => { togglePan('2'); }}
                        >
                            General Settings
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                          className={classnames({
                              active:
                                currentActiveTab === '3'
                          })}
                          onClick={() => { togglePan('3'); }}
                        >
                            Images setup
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                          className={classnames({
                              active:
                                currentActiveTab === '4'
                          })}
                          onClick={() => { togglePan('4'); }}
                        >
                            Buttons wizard
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                          className={classnames({
                              active:
                                currentActiveTab === '5'
                          })}
                          onClick={() => { togglePan('5'); }}
                        >
                            Font styles
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={currentActiveTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm="3">
                                <div className="form__form-group">
                                    <span className="form__form-group-label thick">Current Theme</span>
                                    <div className="form__form-group-field flex-column">
                                        <Field
                                          name="name"
                                          component={renderSelectOptionsField}
                                          options={THEME_OPTIONS}
                                          fieldValue={currentTheme}
                                          fieldOnChange={onSelectTheme}
                                        />
                                    </div>
                                    <div>&nbsp;</div>
                                    <div>&nbsp;</div>
                                    <Button type="submit" onClick={() => setResetTheme(true) } disabled={loading} className="btn btn-primary" color="#ffffff">
                                        Reset theme settings to default
                                    </Button>
                                </div>
                            </Col>
                            <Col sm="9">
                                <div className="button-result">
                                    <br/>
                                    <div
                                      style={{fontFamily: "'" + fontFamily + "', sans-serif", textAlign: 'left'}}
                                    >
                                        <img src={THEME_IMAGE[currentTheme]} className="" alt="" />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <div className="form__form-group">
                            <span className="form__form-group-label thick">Theme Color</span>
                            <div className="form__form-group-field flex-column">
                                <ColorPicker onChange={updateThemeColorHandler} value={selectedThemeColor} />
                            </div>
                        </div>
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
                    </TabPane>
                    <TabPane tabId="3">
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
                    </TabPane>
                    <TabPane tabId="4">
                        <Row>
                            <Col sm="8">
                                <div className="form__form-group">
                                    <span className="form__form-group-label thick">Shape</span>
                                    <div>&nbsp;</div>
                                    <div className="form__form-group-field flex-column">
                                        <Slider
                                          max={20}
                                          SliderConfig={SliderConfig}
                                          value={sliderValue}
                                          onChange={updateSliderRange}
                                          name='button_corner'
                                        />
                                    </div>
                                </div>
                                <div className="form__form-group">
                                    <span className="form__form-group-label thick">Color</span>
                                    <div className="form__form-group-field flex-column">
                                        <ColorPicker onChange={updateColorHandler} value={selectedColor} />
                                    </div>
                                </div>
                                <div className="form__form-group">
                                    <span className="form__form-group-label thick">Background Color</span>
                                    <div className="form__form-group-field flex-column">
                                        <ColorPicker onChange={updateBGColorHandler} value={selectedBGColor} />
                                    </div>
                                </div>
                            </Col>
                            <Col sm="4">
                                <div className="button-result">
                                  <span className="form__form-group-label thick">Result</span>
                                  <br/>
                                  <br/>
                                    <Button
                                        style={{borderRadius: sliderValue, color: selectedColor, backgroundColor: selectedBGColor}}
                                        className="template-button"
                                        onClick={() => {return false;}}>
                                        My Button
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="5">
                        <Row>
                            <Col sm="8">
                                <div className="form__form-group">
                                    <span className="form__form-group-label thick">Font Type</span>
                                    <div className="form__form-group-field flex-column">
                                        <Autocomplete
                                          className='custom_autocomplete'
                                          id="font_family"
                                          options={THEME_FONT_FAMILIES}
                                          sx={{width: 300}}
                                          onChange={fontFamilyHandler}
                                          value={fontFamily}
                                          renderInput={(params) => <TextField {...params}
                                            name='font_family' label="Choose Font" margin="normal"
                                          />}
                                        />
                                    </div>
                                </div>
                            </Col>
                            <Col sm="4">
                                <div className="button-result">
                                    <span className="form__form-group-label thick">Result</span>
                                    <br/>
                                    <br/>
                                    <div
                                      style={{fontFamily: "'" + fontFamily + "', sans-serif", textAlign: 'left'}}
                                      >
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Etiam vulputate, odio sit amet finibus porta, elit nunc lobortis metus,
                                        a gravida metus velit et augue.
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
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

ThemeSettings.propTypes = {
  theme: ThemeProps.isRequired,
  rtl: RTLProps.isRequired,
  organization: Object.isRequired,
  data: Object.isRequired
};

export default withRouter(connect((state) => ({
  theme: state.theme,
  rtl: state.rtl,
  organization: state.organization,
  data: state.program
}))(ThemeSettings));
