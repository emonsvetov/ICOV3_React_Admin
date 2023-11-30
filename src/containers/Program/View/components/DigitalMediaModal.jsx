import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {RTLProps} from '@/shared/prop-types/ReducerProps';
import {Modal, ModalBody, Row, Col, Card, CardBody, Button} from 'reactstrap';
import CloseButton from "@/shared/components/CloseButton";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import {useDispatch, sendFlashMessage} from "@/shared/components/flash";
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import {Field, Form} from "react-final-form";
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

  const loadMediTypes = async () => {
    try {
      const response = await axios.get(`/organization/${organization.id}/program/${program.id}/digital-media-type`);
      if (response.data.length === 0) return {results: [], count: 0}

      let options = [];

      response.data.map(row => {
        options.push({
          value: row.program_media_type_id,
          label: row.name
        });
      })
      setMediaTypes(options);
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
      return data;
    } catch (e) {
      throw new Error(`API error:${e?.message}`);
    }
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

  const selectCreateOption = (inputValue) => {

    let saveUrl = axios.defaults.baseURL +  `/organization/${organization.id}/program/${program.id}/digital-media-type`;

    let data = new FormData();
    data.append('name', inputValue);

    axios.post(saveUrl, data)
      .then((res) => {
        // console.log(res)
        if (res.status === 200) {
              mediaTypes.push({
                  value: res.data.program_media_type_id,
                  label: inputValue
              });
              setMediaTypes(mediaTypes);
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

  return (
    <Modal className={`modal-program modal-lg`} {...modalProps}>
      <CloseButton onClick={toggle}/>
      <ModalBody className='modal-lg'>
        <Card>
          <CardBody className='pt-0'>
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
                        <div style={{paddingTop: '25px'}}></div>
                        <div>
                          <Field name="category">
                            {({ input, meta }) => (
                              <div className="form__form-group">
                                <div className="form__form-group-field">
                                  <div className="form__form-group-row">
                                    <CreatableSelect
                                      name="category"
                                      isClearable
                                      isDisabled={isLoading}
                                      isLoading={isLoading}
                                      options={mediaTypes}
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
