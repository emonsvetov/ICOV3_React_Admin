import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import { RTLProps} from '@/shared/prop-types/ReducerProps';
import {Modal, ModalBody, Row, Col, ListGroup, ListGroupItem, Card, CardBody, Button} from 'reactstrap';
import CloseButton from "@/shared/components/CloseButton";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import {useDispatch, sendFlashMessage} from "@/shared/components/flash";
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import {isEmpty} from '@/shared/helpers'
// import {formatBytes, formatDuration} from "react-dropzone-uploader/dist/utils";

const MEDIA_FIELDS = ['media']

const DigitalMediaModal = ({organization, isOpen, setOpen, toggle, program, theme, rtl}) => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [media, setMedia] = useState([]);
    const [mediaTypes, setMediaTypes] = useState([]);
    let [template, setTemplate] = useState(null);


    const loadMediTypes = async () => {
        try{
            const response=await axios.get(`/digital-medias`);
            if(response.data.length===0) return {results: [], count: 0}

            let options=[];

            console.log(response.data);
            response.data.map(row => {
                options.push({
                    value: row.program_media_type_id,
                    label: row.name
                });
            })
            setMediaTypes(options);
        } catch(e) {
            throw new Error(`API error:${e?.message}`);
        }
    }

    const getData = async ( media_type ) => {

        const url = `/organization/${organization.id}/program/${program.id}/media/${media_type}`;

        try {
            const response = await axios.get(url);

            const data = response.data;
            setMedia(data);
            return data;
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    }


    const NoInputLayout = (props) => {
        const {
            input,
            previews,
            submitButton,
            dropzoneProps,
            files,
            extra: { maxFiles },
        } = props

        return (
          <div {...dropzoneProps}>
              {previews}

              {files.length < maxFiles && input}

              {files.length > 0 && submitButton}
          </div>
        )
    }

    const Input = (props) => {
        const {
            className,
            labelClassName,
            labelWithFilesClassName,
            style,
            labelStyle,
            labelWithFilesStyle,
            getFilesFromEvent,
            accept,
            multiple,
            disabled,
            content,
            withFilesContent,
            onFiles,
            files,
        } = props

        return (
          <>

              <label
                className={files.length > 0 ? labelWithFilesClassName : labelClassName}
                style={files.length > 0 ? labelWithFilesStyle : labelStyle}
              >
                  {files.length > 0 ? withFilesContent : content}
                  <input
                    className={className}
                    style={style}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    onChange={async e => {
                        const target = e.target
                        const chosenFiles = await getFilesFromEvent(e)
                        onFiles(chosenFiles)
                        //@ts-ignore
                        target.value = null
                    }}
                  />
              </label>
          </>
        )
    }

    const Preview = (props) => {
        const {
            className,
            imageClassName,
            style,
            imageStyle,
            fileWithMeta: { cancel, remove, restart },
            meta: { name = '', percent = 0, size = 0, previewUrl, status, duration, validationError },
            isUpload,
            canCancel,
            canRemove,
            canRestart,
            extra: { minSizeBytes },
        } = props

        let title = `${name || '?'}, ${size}`
        if (duration) title = `${title}, ${duration}`

        if (status === 'error_file_size' || status === 'error_validation') {
            return (
              <div className={className} style={style}>
                  <span className="dzu-previewFileNameError">{title}</span>
                  {status === 'error_file_size' && <span>{size < minSizeBytes ? 'File too small' : 'File too big'}</span>}
                  {status === 'error_validation' && <span>{String(validationError)}</span>}
                  {canRemove && <span className="dzu-previewButton" onClick={remove} />}
              </div>
            )
        }

        if (status === 'error_upload_params' || status === 'exception_upload' || status === 'error_upload') {
            title = `${title} (upload failed)`
        }
        if (status === 'aborted') title = `${title} (cancelled)`

        return (
          <div className={className} style={style}>
              {previewUrl &&
                <>
                <img className={imageClassName} style={imageStyle} src={previewUrl} alt={title} title={title} />
                    <input type="text" name="name" placeholder="File Name" />
                </>
              }
              {!previewUrl && <span className="dzu-previewFileName">{title}</span>}

              <div className="dzu-previewStatusContainer">
                  {isUpload && (
                    <progress max={100} value={status === 'done' || status === 'headers_received' ? 100 : percent} />
                  )}

                  {status === 'uploading' && canCancel && (
                    <span className="dzu-previewButton"  onClick={cancel} />
                  )}
                  {status !== 'preparing' && status !== 'getting_upload_params' && status !== 'uploading' && canRemove && (
                    <span className="dzu-previewButton"  onClick={remove} />
                  )}
                  {['error_upload_params', 'exception_upload', 'error_upload', 'aborted', 'ready'].includes(status) &&
                    canRestart && <span className="dzu-previewButton"  onClick={restart} />}
              </div>
          </div>
        )
    }

    useEffect(() => {
        loadMediTypes();
      }, []);

    const getUploadParams = ({ meta }) => {
        const headers = {
            'Authorization': axios.defaults.headers.common['Authorization'],
        }
        const fields = {'fileId': meta.id}
        return { url: axios.defaults.baseURL+`/organization/${organization.id}/program/${program.id}/digital-media`, headers, fields }
    }

    const removeFile = (index, e) => {
        e.preventDefault();
        alert('Delete');
        console.log('Delete');
    };

    const onSelectChange = (value) => {
        getData( value.value );
    };

    const handleSubmit = async (files, values ) => {
        let saveUrl = `/organization/${organization.id}/program/${program.id}/digital-media`;
        axios.post(saveUrl, {'files':files.map(f => f.meta), 'submit': true})
            .then( (res) => {
                 console.log(res)
                // toggle();
                if(res.status === 200)  {
                    // setTemplate(res.data)
                    dispatch(sendFlashMessage('Media successfully published', 'alert-success'));
                    if( !template?.id)  {
                        // window.location.reload();
                    }
                }
            })
            .catch( error => {
                 console.log(error)
                 console.log(JSON.stringify(error.response.data.errors));
                dispatch(sendFlashMessage(JSON.stringify(error.response.data.errors), 'alert-danger'))
                // throw new Error(`API error:${e?.message}`);
                setLoading(false)
            })

    }

    const modalProps = {
        isOpen, toggle, setOpen
    }


    return (
        <Modal className={`modal-program modal-lg`} {...modalProps}>
            <CloseButton onClick={toggle}/>
            <ModalBody className='modal-lg'>
                            <Card>
                                <CardBody className='pt-0'>
                                    <Row>
                                        <Col md="12" lg="12" xl="12">
                                            <div className="card__title">
                                                <h3>Upload Digital Media</h3>
                                                <h5 className="colorgrey">{program.name}</h5>
                                                <div style={{paddingTop: '25px'}}></div>
                                                <div>
                                                    <CreatableSelect
                                                        name="category"
                                                        isClearable
                                                        isDisabled={isLoading}
                                                        isLoading={isLoading}
                                                        options={mediaTypes}
                                                        placeholder='Select or Create a Menu Category'
                                                        onChange={value =>
                                                            onSelectChange(value)
                                                          }
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>

                                        <Col>
                                            <div className="form__form-group">
                                                <div className="form__form-group-field  flex-column" style={{position: '', marginTop: '0px'}}>
                                                    <Dropzone
                                                      getUploadParams={getUploadParams}
                                                      accept="image/jpeg, image/png, image/gif"
                                                      // accept="image/*,audio/*,video/*"
                                                      name="media_upload"
                                                        onSubmit={handleSubmit}
                                                      LayoutComponent={NoInputLayout}
                                                      InputComponent={Input}
                                                      PreviewComponent={Preview}
                                                    />
                                                    {media && media.length > 0
                                                      && (
                                                        <div className="dropzone__imgs-wrapper">
                                                            {media.map((file, i) => (
                                                              <div className="dropzone__img" key={file.name} style={{ width: `100px`, backgroundImage: `url(${process.env.REACT_APP_API_STORAGE_URL + '/' + file.path})` }}>
                                                                  <p className="dropzone__img-name">{file.name}</p>
                                                                  <button className="dropzone__img-delete" type="button" onClick={e => removeFile(i, e)}>
                                                                      Remove
                                                                  </button>
                                                              </div>
                                                            ))}
                                                        </div>
                                                      )}
                                                </div>
                                            </div>
                                        </Col>

                                    </Row>
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

const validate = values => {
    let errors = {}
    return errors
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
