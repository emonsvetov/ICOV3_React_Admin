import React, {useEffect, useState, useContext} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col, Spinner, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import axios from 'axios'
import renderDropZoneField from '@/shared/components/form/DropZone';
import {useDispatch, flashSuccess, flashError} from "@/shared/components/flash";
import {mapFormDataUploads, unpatchMedia, patchMediaURL, removeFields, isEmpty} from '@/shared/helpers'
import classnames from 'classnames';
import Slider from "@/shared/components/form/Slider"
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {getThemeByName, resetTheme, getTheme, deleteThemeMedia} from '@/service/program/programTheme'
import renderSelectOptionsField from '@/shared/components/form/SelectOptions';
import WYSIWYGEditor from '@/shared/components/form/WYSIWYGEditor'
import { THEME_FONT_FAMILIES  } from './ThemeData';
import ColorPicker from 'material-ui-color-picker'
import { inArray } from '../../../../shared/helpers';

const MEDIA_FIELDS = ['small_logo', 'big_logo', 'hero_banner', 'slider_01', 'slider_02', 'slider_03']
const THEME_IMAGE = {
    'Default' : `${process.env.PUBLIC_URL}/img/theme/Original.png`,
    'Clear' : `${process.env.PUBLIC_URL}/img/theme/Original.png`,
    'Classic' : `${process.env.PUBLIC_URL}/img/theme/New.png`,
}
const THEME_OPTIONS = [
    { value: "Clear", label: "Clear" },
    { value: "Classic", label: "Classic" },
];

const ThemeSettings = ({isOpen, toggle, program, theme, rtl}) => {
    // console.log(program.template)
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [currentTheme, setCurrentTheme] = useState("Default");
    let [template, setTemplate] = useState({})
    // console.log(program)
    const validate = values => {
      // console.log(values)
      let errors = {}
      if( !values.name && !currentTheme )
      {
        errors.name = 'Select a theme'
      }
      if( !values.big_logo && !template.big_logo )
      {
        errors.big_logo = 'Big logo is required'
      }
      if( !values.small_logo && !template.small_logo )
      {
        errors.small_logo = 'Small logo is required'
      }
      if( !values.hero_banner && !template.hero_banner )
      {
        errors.hero_banner = 'hero banner is required'
      }
      if( isEmpty(values.slider_01) && isEmpty(template.slider_01) )
      {
        errors.slider_01 = 'Atleast one slider image is required'
      }
      if( !fontFamily )
      {
        errors.font_family = 'font_family is required'
      }
      // console.log(errors)
      // setError(errors)
      return errors
    }

    const isShowDeleteImage = (fieldName) => {
      if( currentTheme != 'Default' ) {
        if( template?.inherited?.fields && typeof template.inherited.fields === 'object')
        {
          if(inArray(fieldName, template.inherited.fields)) {
            return false
          }
        }
        return true;
      }
    }

    const deleteImage = (name) => {
      console.log(template.inherited)
      return;
      deleteThemeMedia(program.organization_id, program.id, template.id, name)
      .then( res => {
        setTemplate((prevState) => ({
          ...prevState,
          [name]: null,
        }));
      })
    }
    const onSubmitForm = async (values) => {
        values.button_corner = sliderValue;
        values.theme_color = selectedThemeColor;
        values.button_color = selectedColor;
        values.button_bg_color = selectedBGColor;
        values.font_family = fontFamily;
        values.name = currentTheme;
        setLoading(true)
        values = removeFields(values, ["created_at", "updated_at", "is_active"])
        values = unpatchMedia(values, MEDIA_FIELDS)
        let formData = mapFormDataUploads( values )
        let saveUrl = `/organization/${program.organization_id}/program/${program.id}/template`;
        if( template?.id && template.program_id == program.id )  { //Checks if the subprogram uses the parent's template as the default.
            formData.append('_method', 'PUT')
            saveUrl += `/${template.id}`
        }
        axios.post(saveUrl, formData, {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*"
        })
        .then( (res) => {
            // console.log(res)
            // toggle();
            if(res.status === 200)  {
                // setTemplate(res.data)
                getSetTheme(program)
                flashSuccess(dispatch, 'Program Template updated successfully');
                // if( !template?.id)  {
                //     window.location.reload();
                // }
                setLoading(false)
            }
        })
        .catch( error => {
            // console.log(error)
            // console.log(JSON.stringify(error.response.data.errors));
            flashError(dispatch, error.response.data.errors)
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
        // console.log(template)
        // console.log(selectedOption)
        // if(template && selectedOption.value !== template.name)
        // {
          console.log("Get Theme")
          getThemeByName(program.organization_id, program.id, selectedOption.value)
          .then( theme => {
            setTemplate(theme ? theme : {})
          })
        // }
        setCurrentTheme(selectedOption.value);
    };

    const getSetTheme = (program) => {
      getTheme(program.organization_id, program.id)
        .then( theme => {
          setTemplate(theme ? theme : {})
        })
    }

    useEffect(() => {
        if(program && program?.id)
        {
          getSetTheme(program)
        }
    }, [program]);

    // useEffect(() => {
    //     let [option] = THEME_OPTIONS.filter((item) => item.value === template?.name);
    //     // if (!option){
    //     //     [option] = THEME_OPTIONS.filter((item) => item.value === 'Clear');
    //     // }
    //     setCurrentTheme(option.value);
    // }, [template]);

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
        if ( Object.keys(template).length > 0 ){
          setCurrentTheme(template.name);
          setSliderValue(parseInt(template.button_corner))
          setSelectedColor(template.button_color)
          setSelectedThemeColor(template.theme_color)
          setSelectedBGColor(template.button_bg_color)
          setFontFamily(template.font_family)
        } else {
          // setCurrentTheme('Clear');
          setSliderValue(parseInt(0))
          setSelectedColor(null)
          setSelectedThemeColor(null)
          setSelectedBGColor(null)
          setFontFamily(null)
        }
    }, [template])

    template = patchMediaURL( template, MEDIA_FIELDS )

    const onClickResetTheme = () => {
      if( window.confirm( 'Are you sure to reset this theme?'))
      {
        resetTheme(program.organization_id, program.id, template.id)
        .then( res => {
          setTemplate({})
          // const nextTheme = currentTheme === 'Classic' ? 'Clear' : 'Classic';
          // getThemeByName(program.organization_id, program.id, nextTheme)
          // .then( theme => {
          //   setTemplate(theme ? theme : {})
          //   setCurrentTheme(nextTheme);
          // })
        })
      }
    }

    let formError = false;

    // console.log(template.welcome_message = template.welcome_message)

    // console.log(template.slider_01)

    return (
    <Modal className={`modal-program programTemplateModal modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={toggle}>
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
                        <h5 style={{"fontWeight": 500, color:'#999'}}>{program.name}</h5>
                    </Col>
                    <Col md="6" lg="6" xl="6" className='text-right'>
                        <ButtonToolbar className="modal__footer flex justify-content-right w100">
                            <Button outline color="primary" className="mr-3" onClick={toggle}>Close</Button>{' '}
                            {formError = Object.keys(validate(values)).length > 0}
                            {/* {console.log(formError)} */}
                            <Button type="submit" disabled={submitting || formError || currentTheme === 'Default'} className="btn btn-primary" color="#ffffff">Save</Button>
                            {(currentTheme && formError && !submitting && !loading) && <div className="error">Required fields missing</div>}
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
                                    <span className="form__form-group-label thick">Current Theme<span className='error'>*</span></span>
                                    <div className="form__form-group-field flex-column">
                                        <Field
                                          name="name"
                                          component={renderSelectOptionsField}
                                          options={THEME_OPTIONS}
                                          fieldValue={currentTheme}
                                          fieldOnChange={onSelectTheme}
                                          placeholder={' -- select -- '}
                                        />
                                    </div>
                                    <div>&nbsp;</div>
                                    <div>&nbsp;</div>
                                    <Button onClick={() => onClickResetTheme() } disabled={loading || !currentTheme || !template?.id} className="btn btn-primary" color="#ffffff">
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
                                <ColorPicker
                                    name="theme_color"
                                    floatingLabelText={selectedThemeColor}
                                    value={selectedThemeColor}
                                    onChange={color =>{if (color) setSelectedThemeColor(color)}}
                                />
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
                        <Row>
                            <Col xs="12" md="8" lg="8">
                                <div className="form__form-group">
                                    <span className="form__form-group-label thick">Paricipant Homepage Message</span>
                                    <div className="form__form-group-field flex-column">
                                        <Field
                                          name="participant_homepage_message"
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
                                    <span className="form__form-group-label thick">Big Logo</span><span className='error'>*</span>
                                    <div className="form__form-group-field  flex-column">
                                        {currentTheme !== 'Default' && <Field
                                          name="big_logo"
                                          component={renderDropZoneField}
                                          multiple={false}
                                          customHeight
                                          uploadTitle={{type: 'short', displayAlways: true}}
                                        />}
                                        <div className='image-wrap'>
                                            <RenderImage src={template?.big_logo} />
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col xs="12" md="3" lg="3">
                                <div className="form__form-group">
                                    <span className="form__form-group-label thick">Small Logo</span><span className='error'>*</span>
                                    <div className="form__form-group-field flex-column">
                                    {currentTheme !== 'Default' && <Field
                                          name="small_logo"
                                          component={renderDropZoneField}
                                          multiple={false}
                                          customHeight
                                          uploadTitle={{type: 'short', displayAlways: true}}
                                        />}
                                        <div className='image-wrap'>
                                            <RenderImage src={template?.small_logo} />
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col xs="12" md="6" lg="6">
                                <div className="form__form-group">
                                    <span className="form__form-group-label thick">Hero Banner</span><span className='error'>*</span>
                                    <div className="form__form-group-field  flex-column">
                                    {currentTheme !== 'Default' && <Field
                                          name="hero_banner"
                                          component={renderDropZoneField}
                                          multiple={false}
                                          customHeight
                                          uploadTitle={{type: 'short', displayAlways: true}}
                                        />}
                                        <div className='image-wrap'>
                                            <RenderImage src={template?.hero_banner} />
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <p className="form__form-group-label thick">Slider Images<span className='error'>*</span></p>
                        <Row>
                            <Col xs="12" md="4" lg="4">
                                <div className="form__form-group">
                                    <div className="form__form-group-field  flex-column">
                                    {currentTheme !== 'Default' && <Field
                                          name="slider_01"
                                          component={renderDropZoneField}
                                          multiple={false}
                                          customHeight
                                          uploadTitle={{type: 'short', displayAlways: true}}
                                        />}
                                        <div className='image-wrap'>
                                            <RenderImage src={template.slider_01} showDelete={isShowDeleteImage('slider_01')}  name='slider_01' dlcb={deleteImage} />
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col xs="12" md="4" lg="4">
                                <div className="form__form-group">
                                    <div className="form__form-group-field  flex-column">
                                    {currentTheme !== 'Default' && <Field
                                          name="slider_02"
                                          component={renderDropZoneField}
                                          multiple={false}
                                          customHeight
                                          uploadTitle={{type: 'short', displayAlways: true}}
                                        />}
                                        <div className='image-wrap'>
                                            <RenderImage src={template?.slider_02} showDelete={isShowDeleteImage('slider_02')}  name='slider_02' dlcb={deleteImage} />
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col xs="12" md="4" lg="4">
                                <div className="form__form-group">
                                    <div className="form__form-group-field  flex-column">
                                    {currentTheme !== 'Default' && <Field
                                          name="slider_03"
                                          component={renderDropZoneField}
                                          multiple={false}
                                          customHeight
                                          uploadTitle={{type: 'short', displayAlways: true}}
                                        />}
                                        <div className='image-wrap'>
                                            <RenderImage src={template?.slider_03}  showDelete={isShowDeleteImage('slider_03')} name='slider_03' dlcb={deleteImage} />
                                        </div>
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
                                    {currentTheme !== 'Default' && <Slider
                                          max={20}
                                          SliderConfig={SliderConfig}
                                          value={sliderValue}
                                          onChange={updateSliderRange}
                                          name='button_corner'
                                        />}
                                    </div>
                                </div>
                                <div className="form__form-group">
                                    <span className="form__form-group-label thick">Color</span>
                                    <div className="form__form-group-field flex-column">
                                        <ColorPicker
                                            name="color"
                                            floatingLabelText = {selectedColor}
                                            value={selectedColor}
                                            onChange={color =>{if (color) setSelectedColor(color)}}
                                        />
                                    </div>
                                </div>
                                <div className="form__form-group">
                                    <span className="form__form-group-label thick">Background Color</span>
                                    <div className="form__form-group-field flex-column">
                                        <ColorPicker
                                            name="background_color"
                                            floatingLabelText={selectedBGColor}
                                            value={selectedBGColor}
                                            onChange={color =>{if (color) setSelectedBGColor(color)}}
                                        />
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
                                    <span className="form__form-group-label thick">Font Type</span><span className='error'>*</span>
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
                                        {!fontFamily && <span className="form__form-group-error">Font family is required</span>}
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

const RenderImage = ({src, showDelete = false, name, dlcb }) => {
    if( !src || typeof src === 'undefined' ) return ''
    return (
      <div className='dropzone-img position-relative'>
        <a href={src} target='_blank' title='View the picture'>
          <img style={{maxHeight:200}} src={src} />
        </a>
        {(showDelete && dlcb) && <button className="dropzone__img-delete" style={{opacity:1,color:'black',backgroun:'#fff'}} onClick={() => dlcb(name)} type="button">Remove</button>}
      </div>
    )
}

ThemeSettings.propTypes = {
  theme: ThemeProps.isRequired,
  rtl: RTLProps.isRequired,
  organization: PropTypes.object,
  program: PropTypes.object
};

export default withRouter(connect((state) => ({
  theme: state.theme,
  rtl: state.rtl,
  organization: state.organization,
  program: state.program
}))(ThemeSettings));
