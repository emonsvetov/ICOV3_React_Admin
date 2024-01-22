import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {RTLProps} from '@/shared/prop-types/ReducerProps';
import {Modal, ModalBody, Row, Col, Card, CardBody, Button } from 'reactstrap';
import CloseButton from "@/shared/components/CloseButton";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import {useDispatch, sendFlashMessage} from "@/shared/components/flash";
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import {Field, Form} from "react-final-form";
//import ScriptTag from 'react-script-tag';
// import {formatBytes, formatDuration} from "react-dropzone-uploader/dist/utils";

const fileTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.ms-word.document.macroEnabled.12',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.ms-excel.sheet.macroEnabled.12',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.ms-excel.sheet.macroEnabled.12',
  'application/msexcel',
  'application/x-msexcel',
  'application/x-ms-excel',
  'application/x-excel',
  'application/x-dos_ms_excel',
  'application/xls',
  'application/x-xls',
  'application/x-msi',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/xml',
  'application/xml',
  'text/html',
  'application/rtf',
  'text/csv',
  'application/x-afp',
  'image/*',
  'audio/*',
  'video/*',
];

const DigitalMediaModal = ({organization, isOpen, setOpen, toggle, program, theme, rtl}) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [media, setMedia] = useState([]);
  const [mediaTypes, setMediaTypes] = useState([]);
  const [mediaType, setMediaType] = useState('');
  const [uploadedMeta, setUploadedMeta] = useState({});
  const [iconMeta, setIconMeta] = useState({});
  const [fileName, setFileName] = React.useState("");
  let [dropZoneKey, setDropZoneKey] = useState(0);
  const [tab, setTab] = useState(1);
  const [link, setLink] = useState("");
  const [tempLink, setTempLink] = useState()
  const [menuItems, setMenuItems] = useState([]);
  const [currentMenuItem, setCurrentMenuItem] = useState();

  const loadMediTypes = async () => {
    try {
      const response = await axios.get(`/organization/${organization.id}/program/${program.id}/digital-media-type`);
      if (response.data.length === 0) return {results: [], count: 0}
      
      let options = [];
      let menuItems = [];
      response.data.map(row => {
        if (row.is_menu_item === 1) {
          menuItems.push({
            value: row.program_media_type_id,
            url: row.menu_link,
            id: row.program_media_type_id,
            menu_link:row.menu_link,
            label: toTitleCase(row.name)
          })
        }
        else {
          options.push({
            value: row.program_media_type_id,
            label: toTitleCase(row.name)
          });
         
        }
      })
      setMediaTypes(options);
      setMenuItems(menuItems);      
    } catch (e) {
      throw new Error(`API error:${e?.message}`);
    }
  }

  const getData = async (media_type) => {

    const url = axios.defaults.baseURL + `/organization/${organization.id}/program/${program.id}/media/${media_type}`;

    try {
      const response = await axios.get(url);

      const data = response.data;
      setMediaType(media_type);
      setMedia(data);
      
      let temp = menuItems.filter(iframe =>  iframe.id === media_type)[0];    
      setCurrentMenuItem(temp);
      setTempLink(temp.menu_link);

      return data;
    } catch (e) {
      throw new Error(`API error:${e?.message}`);
    }
    
  }

  const getIframe = (value) => {    
    let temp = menuItems.filter(iframe =>  iframe.id === value)[0];    
    setCurrentMenuItem(temp); 

    setTempLink(temp.menu_link);
    getData(temp.id);
  }

  const saveIframe = () => {
    saveLinkForIframe();
  }

  useEffect(() => {
    loadMediTypes();
  }, []);

  const getUploadParams = ({meta}) => {
    const headers = {
      'Authorization': axios.defaults.headers.common['Authorization'],
    }
    const fields = {'fileId': meta.id}
    return {
      url: axios.defaults.baseURL + `/organization/${organization.id}/program/${program.id}/digital-media/upload`,
      headers,
      fields
    }
  }

  const removeFile = (index, file, e) => {
    e.preventDefault();

    const response = axios.delete(
        `/organization/${organization.id}/program/${program.id}/programMedia/${file.id}/digital-media`
    );

    const items = media.filter(item => item.id != file.id);
    setMedia(items);
  };

  const handleSubmit = values => {
    let saveUrl = `/organization/${organization.id}/program/${program.id}/digital-media`;

    let data = new FormData();
    data.append('file', JSON.stringify(uploadedMeta))
    data.append('icon', JSON.stringify(iconMeta))
    data.append('name', fileName)
    data.append('mediaType', mediaType)

    axios.post(saveUrl, data)
      .then((res) => {
        // console.log(res)
        if (res.status === 200) {
            //dispatch(sendFlashMessage('Media successfully published', 'alert-success'));
            getData(mediaType);
            setUploadedMeta({})
            setIconMeta({})
            setFileName('');
            dropZoneKey++;
            setDropZoneKey( dropZoneKey );

        }
      })
      .catch(error => {
        console.log(JSON.stringify(error.response.data.errors));
        dispatch(sendFlashMessage(JSON.stringify(error.response.data.errors), 'alert-danger'))
        setLoading(false)
        throw new Error(`API error:${error?.message}`);
      })
  }

  const saveLinkForIframe = () => {
    let saveUrl = axios.defaults.baseURL +  `/organization/${organization.id}/program/${program.id}/digital-media-type-iframe`;
    let data = new FormData();
    
    data.append('program_media_type_id', currentMenuItem.id)
    data.append('name', currentMenuItem.label);
    data.append('is_menu_item', 1);
    data.append('menu_link', tempLink);
    
    axios.post(saveUrl, data)
      .then((res) => {
        if (res.status === 200) {
          loadMediTypes();
          setTempLink("")
        }
      })
      .catch(error => {
        dispatch(sendFlashMessage(JSON.stringify(error.response.data.errors), 'alert-danger'))
        setLoading(false)
        throw new Error(`API error:${error?.message}`);
      });
  }

  const handleSubmitMenuItem = (linkUrl, inputValue) => {

    let saveUrl = axios.defaults.baseURL +  `/organization/${organization.id}/program/${program.id}/digital-media-type`;

    let data = new FormData();
    data.append('name', inputValue);
    data.append('is_menu_item', 1);
    data.append('menu_link', linkUrl);
    
    axios.post(saveUrl, data)
      .then((res) => {
        // console.log(res)
        if (res.status === 200) {
          loadMediTypes();
        }
      })
      .catch(error => {
        dispatch(sendFlashMessage(JSON.stringify(error.response.data.errors), 'alert-danger'))
        setLoading(false)
        throw new Error(`API error:${error?.message}`);
      });
  }

  const validate = values => {
    let errors = {}
    if (!mediaType){
      errors.category = 'The category field is required.';
    }
    return errors
  }

  const modalProps = {
    isOpen, toggle, setOpen
  }

  const handleChangeStatus = ({meta, file}, status) => {
    if (status === 'done') {
      if (!fileName) {
        setFileName(meta.name.substr(0, meta.name.lastIndexOf('.')));
      }
      setUploadedMeta(meta);
    }
  }

  const handleUploadIcon = ({meta, file}, status) => {
    if (status === 'done') {
      setIconMeta(meta);
    }
  }

  const onChangeFileName = (event) => {
    setFileName(event.target.value);
  }

  const onChangeLinkUrl = (event) => {
    setLink(event.target.value)
  }

  const selectCreateOption = (inputValue) => {
  
    let saveUrl = axios.defaults.baseURL +  `/organization/${organization.id}/program/${program.id}/digital-media-type`;

    let data = new FormData();
    data.append('name', inputValue);
    data.append('is_menu_item', 1);

    axios.post(saveUrl, data)
      .then((res) => {        
        if (res.status === 200) {
          menuItems.push({
            id: res.data.program_media_type_id,
            label: res.data.name,
            // menu_link: res.data.menu_link,
            // url: res.data.menu_link,
            // value: res.data.program_media_type_id
          });          
          setMenuItems(menuItems);
          setMedia([]);
        }
      })
      .catch(error => {
        dispatch(sendFlashMessage(JSON.stringify(error.response.data.errors), 'alert-danger'))
        setLoading(false)
        throw new Error(`API error:${error?.message}`);
      });
  }

  const selectCreateIframe = (inputValue) => {
   if (link === "")
    handleSubmitMenuItem(link, inputValue)
  }

  const addMenus = () => {
    if (link !== "") {      
      setLink("");
      setTempLink(link);     
    }
  
  }

  const deleteMenu = () => {
    let id = currentMenuItem.id;

    let deleteUrl = axios.defaults.baseURL +  `/organization/${organization.id}/program/${program.id}/digital-media-type-url-delete`;

    let data = new FormData();
    data.append('program_media_type_id', id);
   debugger
    axios.post(deleteUrl, data)
      .then((res) => {        
        if (res.status === 200) {
          let temp_array = [...menuItems];
          temp_array.splice(id, 1);
          setMenuItems(temp_array);
          setTempLink("");
        }
      })
      .catch(error => {
        console.log(error)
        console.log(JSON.stringify(error.response.data.errors));
        dispatch(sendFlashMessage(JSON.stringify(error.response.data.errors), 'alert-danger'))
        setLoading(false)
        throw new Error(`API error:${error?.message}`);
      });    
  }

  const setMediaTab = () => {
    setTab(1);
  }

  const setFormsTab = () => {
    setTab(2);
  }

  function toTitleCase(str) {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
      return match.toUpperCase();
    })
  }

  return (
    <Modal className={`modal-program modal-lg`} {...modalProps}>
      <CloseButton onClick={toggle}/>
      <ModalBody className='modal-lg'>
        <Card>
          <CardBody className='pt-0'>
              {tab === 1 ?
                <Form
                  onSubmit={handleSubmit}
                  validate={validate}
                  render={({handleSubmit, form, submitting, pristine, values}) => (
                    <form className="form" onSubmit={handleSubmit}>

                      <Row>
                        <Col md="12" lg="12" xl="12">
                          <div className="card__title">
                            <h3>Upload Digital Media</h3>
                            <h5 className="colorgrey">{program.name}</h5>
                            <div style={{paddingTop: '25px', paddingBottom:'25px'}}>
                              <Button  color="primary" className="mr-3" onClick={()=>setTab(1)}>media</Button>
                              <Button  color="primary" className="mr-3" onClick={()=>setTab(2)}>forms</Button>
                            </div>
                            <div>
                              <Field name="category">
                                {({ input, meta }) => (
                                  <div className="form__form-group">
                                    <div className="form__form-group-field">
                                      <div className="form__form-group-row" style={{position: '', marginTop: '0px', textTransform:"capitalize"}}>
                                        <CreatableSelect
                                          name="category"
                                          isClearable
                                          isDisabled={isLoading}
                                          isLoading={isLoading}
                                          options={mediaTypes}
                                          style={{textTransform:"loweracase"}}
                                          onCreateOption={selectCreateOption}
                                          placeholder='Select or Create a Menu Category'
                                          onChange={value =>
                                            getData(value.value)
                                          }
                                        />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Field>

                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="4">
                          <div className="form__form-group">
                            <div className="form__form-group-field  flex-column" style={{position: '', marginTop: '0px'}}>
                              <Dropzone key={dropZoneKey}
                                getUploadParams={getUploadParams}
                                accept="image/jpeg, image/png, image/gif"
                                // accept="image/*,audio/*,video/*"
                                name="media_upload"
                                inputContent="Select Preview Image"
                                maxFiles={1}
                                onSubmit={false}
                                onChangeStatus={handleUploadIcon}
                              />
                            </div>
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="form__form-group">
                            <div className="form__form-group-field  flex-column" style={{position: '', marginTop: '0px'}}>
                              <Dropzone key={dropZoneKey}
                                getUploadParams={getUploadParams}
                                accept={fileTypes.join(',')}
                                name="media_upload"
                                inputContent="Select File"
                                maxFiles={1}
                                onSubmit={false}
                                onChangeStatus={handleChangeStatus}
                              />
                            </div>
                          </div>
                        </Col>
                        <Col md="4">
                          <div>
                            <Field name="name">
                              {({input, meta}) => (
                                <div className="form__form-group">
                                  <span className="form__form-group-label">Enter File Name </span>
                                  <div>
                                    <input onChange={onChangeFileName}
                                          style={{borderWidth: 1, borderColor: 'gray'}}
                                          type="text" value={fileName}
                                          placeholder="File Name"/>
                                  </div>
                                </div>
                              )}
                            </Field>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div>
                            <Button type="submit" disabled={loading} className="btn btn-primary"
                                    color="#ffffff">Save</Button>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          {media && media.length > 0
                            && (
                              <div className="dropzone__imgs-wrapper">
                                {media.map((file, i) => (
                                  <div className="dropzone__img" key={file.name} style={{
                                    border: '1px solid grey',
                                    width: `125px`,
                                    backgroundImage: `url(${process.env.REACT_APP_API_STORAGE_URL + '/' + file.icon_path})`
                                  }}>
                                    <p className="dropzone__img-name">{file.name}</p>
                                    <button className="dropzone__img-delete" type="button"
                                            onClick={e => removeFile(i, file, e)}>
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                        </Col>
                      </Row>

                    </form>
                  )}
                />
                 :                 
                  <>
                      <Row>
                        <Col md="12" lg="12" xl="12">
                          <div className="card__title">
                            <h3>Upload Digital Media</h3>
                            <h5 className="colorgrey">{program.name}</h5>
                            <div style={{paddingTop: '25px', paddingBottom:'25px'}}>
                              <Button  color="primary" className="mr-3" onClick={setMediaTab}>media</Button>
                              <Button  color="primary" className="mr-3" onClick={setFormsTab}>forms</Button>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <div className="form__form-group">
                            <div className="form__form-group-field  flex-column" style={{position: '', marginTop: '0px', textTransform:"capitalize"}}>
                              <CreatableSelect
                                  name="category"
                                  isClearable
                                  isDisabled={isLoading}
                                  isLoading={isLoading}
                                  options={menuItems}
                                  onCreateOption={selectCreateIframe}
                                  placeholder='Select or Create a Menu Category'
                                  onChange={value =>
                                    getIframe(value.value)
                                  }
                                />

                            </div>
                          </div>
                          <div className="form__form-group">
                            <span className="form__form-group-label">Link </span>
                              <div className='table-filter-form form row'>
                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                  <input onChange={onChangeLinkUrl}
                                      style={{borderWidth: 1, borderColor: 'gray', maxWidth:'200px'}}
                                      type="text" value={link}
                                      placeholder="Link Url"/>
                                </div>
                                <div className='col'>      
                                  <Button  color="primary" className="" onClick={()=>addMenus()}>Add</Button>
                                </div>
                              </div>
                          </div>
                        </Col>
                      </Row>
                      {tempLink&&
                       <div className='table-filter-form form row'>
                          <div className='col-sm-8 col-md-8 col-lg-8'>
                              <h4>{tempLink}</h4>
                          </div>
                          <div className='col'>      
                            <Button  color="primary" className="" onClick={()=>deleteMenu()}>Delete</Button>
                          </div>
                        </div>
                        
                      }                     
                      <Row>
                        <Col>
                          {media && media.length > 0
                            && (
                              <div className="dropzone__imgs-wrapper">
                                {media.map((file, i) => (
                                  <div className="dropzone__img" key={file.name} style={{
                                    border: '1px solid grey',
                                    width: `125px`,
                                    backgroundImage: `url(${process.env.REACT_APP_API_STORAGE_URL + '/' + file.icon_path})`
                                  }}>
                                    <p className="dropzone__img-name">{file.name}</p>
                                    <button className="dropzone__img-delete" type="button"
                                            onClick={e => removeFile(i, file, e)}>
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div>
                            <Button onClick={saveIframe} className="btn btn-primary"
                                    color="#ffffff">Save</Button>
                          </div>
                        </Col>
                      </Row>
                    </>
    
              }
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  )
}

const RenderImage = ({src}) => {
  if (!src || typeof src === 'undefined') return ''
  return (
    <div className='dropzone-img'>
      <a href={src} target='_blank' title='View the picture'>
        <img style={{maxHeight: 200}} src={src}/>
      </a>
    </div>
  )
}



DigitalMediaModal.propTypes = {
  rtl: RTLProps.isRequired,
  organization: Object.isRequired,
  data: Object.isRequired
};

export default withRouter(connect((state) => ({
  rtl: state.rtl,
  organization: state.organization,
  program: state.program
}))(DigitalMediaModal));
