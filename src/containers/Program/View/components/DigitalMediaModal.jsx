import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {RTLProps} from '@/shared/prop-types/ReducerProps';
import {Modal, ModalBody, Row, Col, ListGroup, ListGroupItem, Card, CardBody, Button, Tab, TabPane} from 'reactstrap';
import CloseButton from "@/shared/components/CloseButton";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import {useDispatch, sendFlashMessage} from "@/shared/components/flash";
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import {isEmpty} from '@/shared/helpers'
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
  const [currentMedia, setCurrentMedia] = useState(null);
  const [uploadedMeta, setUploadedMeta] = useState({});
  const [iconMeta, setIconMeta] = useState({});
  const [fileName, setFileName] = React.useState("");
  let [dropZoneKey, setDropZoneKey] = useState(0);
  const [tab, setTab] = useState(1);
  const [link, setLink] = useState("");
  const [tempLink, setTempLink] = useState()
  const [menuItems, setMenuItems] = useState([]);
  const [currentMenuItem, setCurrentMenuItem] = useState();
  const [currentForm, setCurrentForm] = useState(null);
  const MAX_SIZE = 10485760
  const [fileUploadSizeError, setFileUploadSizeError] = useState(false)

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

  const handleChangeMedia = (value) =>{
    if(value){
      setCurrentMedia(value)
      getData(value.value)
    }
    else{
      setCurrentMedia(null)
      setMedia([])
    }
    setFileName('')
  }

  const handleChangeForms = (value) =>{
    if(value){
      setCurrentForm({
        value: value.value,
        label: value.label
      })
      setCurrentForm(value)
      getIframe(value.value)
    }
    else{
      setCurrentForm(null)
      setTempLink('')
      setLink('')
    }
  }

  const getData = async (media_type) => {

    const url = axios.defaults.baseURL + `/organization/${organization.id}/program/${program.id}/media/${media_type}`;

    try {
      const response = await axios.get(url);

      const data = response.data;
      setMediaType(media_type);
      setMedia(data);
  
      return data;
    } catch (e) {
      throw new Error(`API error:${e?.message}`);
    }
    
  }

  const getIframe = (value) => {    
    let temp = menuItems.filter(iframe =>  iframe.id === value)[0];    
    setCurrentMenuItem(temp); 
    setLink(temp.menu_link || "")
    setTempLink(temp.menu_link || "");
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

  const onSubmit = values => {
    let saveUrl = `/organization/${organization.id}/program/${program.id}/digital-media`;
    setLoading(true);
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
        setLoading(false)
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
    setLoading(true)
    data.append('program_media_type_id', currentMenuItem.id)
    data.append('name', currentMenuItem.label);
    data.append('is_menu_item', 1);
    data.append('menu_link', tempLink);
    
    axios.post(saveUrl, data)
      .then((res) => {
        if (res.status === 200) {
          loadMediTypes();
          // setTempLink("")
        }
        setLoading(false)
      })
      .catch(error => {
        dispatch(sendFlashMessage(JSON.stringify(error.response.data.errors), 'alert-danger'))
        setLoading(false)
        throw new Error(`API error:${error?.message}`);
      });
  }

  const handleSubmitMenuItem = (linkUrl, inputValue) => {

    setIsLoading(true);
    let saveUrl = axios.defaults.baseURL +  `/organization/${organization.id}/program/${program.id}/digital-media-type`;

    let data = new FormData();
    data.append('name', inputValue);
    data.append('is_menu_item', 1);
    data.append('menu_link', linkUrl);
    
    axios.post(saveUrl, data)
      .then((res) => {
        // console.log(res)
        if (res.status === 200) {
          setCurrentForm({
            value: res.data.program_media_type_id,
            label: toTitleCase(res.data.name)
          })
          let newMenuItem = {
            value: res.data.program_media_type_id,
            url: res.data.menu_link,
            id: res.data.program_media_type_id,
            menu_link:res.data.menu_link,
            label: toTitleCase(res.data.name)
          }
          setCurrentMenuItem(newMenuItem)
          setTempLink('')
          loadMediTypes();
        }
        setIsLoading(false)
      })
      .catch(error => {
        dispatch(sendFlashMessage(JSON.stringify(error.response.data.errors), 'alert-danger'))
        setIsLoading(false)
        throw new Error(`API error:${error?.message}`);
      });
  }

  const validate = values => {    
    let errors = {}
    if (!currentMedia){
      errors.category = 'The category field is required.';
    }
    if (isEmpty(iconMeta)){
      errors.icon_upload = 'The preview image field is required.';
    }
    if (isEmpty(uploadedMeta)){
      errors.media_upload = 'The upload field is required.';
    }
    if (!fileName){
      errors.fileName = 'The file name field is required.';
    }
    return errors
  }

  const modalProps = {
    isOpen, toggle, setOpen
  }

  const handleChangeStatus = ({meta, file}, status) => {
    
    if (status === 'done') {
      let name = meta.name.substr(0, meta.name.lastIndexOf('.'));
      if (!fileName || fileName !== name) {
        setFileName(name);
      }
      setUploadedMeta(meta);
      setFileUploadSizeError(false);
    }
    if (status === "error_file_size"){
      setFileUploadSizeError(true)
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
    data.append('is_menu_item', 0);
    
    axios.post(saveUrl, data)
      .then((res) => {        
        if (res.status === 200) {
          loadMediTypes();
          setMedia([]);
          setMediaType(res.data.program_media_type_id)
          setCurrentMedia({
            value: res.data.program_media_type_id,
            label: toTitleCase(res.data.name)
          })
        }
        setIsLoading(false)
      })
      .catch(error => {
        dispatch(sendFlashMessage(JSON.stringify(error.response.data.errors), 'alert-danger'))
        setIsLoading(false)
        throw new Error(`API error:${error?.message}`);
      });
  }

  const selectCreateIframe = (inputValue) => {
   if (link === "")
    handleSubmitMenuItem(link, inputValue)
  }

  const addMenus = () => {
    if (link !== "") {      
      setTempLink(link); 
    }
  
  }

  const deleteMenu = () => {
    let id = currentMenuItem.id;

    let deleteUrl = axios.defaults.baseURL +  `/organization/${organization.id}/program/${program.id}/digital-media-type-url-delete`;
    let data = new FormData();
    data.append('program_media_type_id', id);
   
    axios.post(deleteUrl, data)
      .then((res) => {        
        if (res.status === 200) {
          loadMediTypes();
          setTempLink("");
          setLink("")
        }
        setLoading(false)
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
    if(tab !== 1){
      setTempLink('')
      setTab(1);
      setCurrentForm(null)
    }
  }

  const setFormsTab = () => {
    if(tab !== 2){
      setMedia([])
      setTab(2);
      setCurrentMedia(null)
    }
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
                  onSubmit={onSubmit}
                  validate={validate}
                  render={({handleSubmit, form, submitting, pristine, values}) => (
                    <form className="form" onSubmit={handleSubmit}>

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
                            <div>
                              <Field name="category">
                                {({ input, meta }) => (
                                  <div className="form__form-group">
                                    <div className="form__form-group-field">
                                      <div className="form__form-group-row" style={{position: '', marginTop: '0px', textTransform:"capitalize", zIndex: 100}}>
                                        <CreatableSelect
                                          name="category"
                                          isClearable
                                          isDisabled={isLoading}
                                          isLoading={isLoading}
                                          options={mediaTypes}
                                          onCreateOption={selectCreateOption}
                                          placeholder='Select or Create a Menu Category'
                                          onChange={ handleChangeMedia }
                                          value={currentMedia}
                                        />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Field>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="4">
                          <Field name="icon_upload">
                            {({input, meta}) => (
                              <div className="form__form-group">
                                <div className="form__form-group-field  flex-column" style={{position: '', marginTop: '0px'}}>
                                  <Dropzone key={dropZoneKey}
                                    getUploadParams={getUploadParams}
                                    accept="image/jpeg, image/png, image/gif"
                                    // accept="image/*,audio/*,video/*"
                                    name="icon_upload"
                                    inputContent="Select Preview Image"
                                    maxFiles={1}
                                    maxSizeBytes ={MAX_SIZE}    
                                    onSubmit={false}
                                    onChangeStatus={handleUploadIcon}
                                  />
                                  {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                </div>
                              </div>
                              )}
                          </Field>
                        </Col>
                        <Col md="4">
                          <Field name='media_upload'>
                            {({input, meta}) => (
                              <div className="form__form-group">
                                <div className="form__form-group-field  flex-column" style={{position: '', marginTop: '0px'}}>
                                  <Dropzone key={dropZoneKey}
                                    getUploadParams={getUploadParams}
                                    accept={fileTypes.join(',')}
                                    name="media_upload"
                                    inputContent="Select File"
                                    maxFiles={1}
                                    onSubmit={false}
                                    maxSizeBytes ={MAX_SIZE}
                                    onChangeStatus={handleChangeStatus}
                                  />
                                </div>
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                {fileUploadSizeError && <p className="form__form-group-error">File Size is too big</p>}
                              </div>
                            )}
                          </Field>
                        </Col>
         
                        <Col md="4">
                          <div>
                            <Field name="fileName">
                              {({input, meta}) => (
                                <div className="form__form-group">
                                  <span className="form__form-group-label">Enter File Name </span>
                                  <div>
                                    <input onChange={onChangeFileName}
                                          name='fileName'
                                          style={{borderWidth: 1, borderColor: 'gray'}}
                                          type="text" value={fileName}
                                          placeholder="File Name"/>
                                    {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
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
                                  onChange={ handleChangeForms }
                                  value={ currentForm }
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
                                  <Button  color="primary" disabled={!link || link === tempLink} className="" onClick={()=>addMenus()}>{!tempLink ? "Add" : "Update"}</Button>
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
                            <Button onClick={saveIframe} disabled={loading} className="btn btn-primary"
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
