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
import {Field, Form} from "react-final-form";
// import {formatBytes, formatDuration} from "react-dropzone-uploader/dist/utils";

const DigitalMediaModal = ({organization, isOpen, setOpen, toggle, program, theme, rtl}) => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [media, setMedia] = useState([]);
    const [mediaTypes, setMediaTypes] = useState([]);
    let [template, setTemplate] = useState(null);
    const [uploadedMeta, setUploadedMeta] = useState([]);

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


    useEffect(() => {
        setUploadedMeta({});
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

    const onSubmit = values => {

    console.log(uploadedMeta);
    console.log(values);
    return;

    // let saveUrl = `/organization/${organization.id}/program/${program.id}/digital-media`;
    // axios.post(saveUrl, {'files': files.map(f => f.meta), 'submit': true})
    //   .then((res) => {
    //     console.log(res)
    //     // toggle();
    //     if (res.status === 200) {
    //       // setTemplate(res.data)
    //       dispatch(sendFlashMessage('Media successfully published', 'alert-success'));
    //       if (!template?.id) {
    //         // window.location.reload();
    //       }
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error)
    //     console.log(JSON.stringify(error.response.data.errors));
    //     dispatch(sendFlashMessage(JSON.stringify(error.response.data.errors), 'alert-danger'))
    //     // throw new Error(`API error:${e?.message}`);
    //     setLoading(false)
    //   })

  }

  const modalProps = {
    isOpen, toggle, setOpen
  }

  const handleChangeStatus = ({ meta, file }, status) => {
        alert(status);
    if (status === 'done'){
      setUploadedMeta(meta);
    }
  }


    return (
        <Modal className={`modal-program modal-lg`} {...modalProps}>
          <CloseButton onClick={toggle}/>
          <ModalBody className='modal-lg'>
            <Card>
              <CardBody className='pt-0'>
                <Form
                  onSubmit={onSubmit}
                  validate={validate}
                  render={({handleSubmit, form, submitting, pristine, values }) => (
                    <form className="form" onSubmit={handleSubmit}>

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
                                    getData(value.value)
                                  }
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                          <Col md="6" >
                            <div className="form__form-group">
                                <div className="form__form-group-field  flex-column" style={{position: '', marginTop: '0px'}}>
                                     <Dropzone
                                        getUploadParams={getUploadParams}
                                        accept="image/jpeg, image/png, image/gif"
                                        // accept="image/*,audio/*,video/*"
                                        name="media_upload"
                                        maxFiles={1}
                                        onSubmit={false}
                                        onChangeStatus={handleChangeStatus}
                                       />
                                </div>
                            </div>
                          </Col>
                          <Col md="6" >
                            <div>
                              <Field name="name">
                                <div className="form__form-group">
                                    <div className="form__form-group-field">
                                      <div className="form__form-group-row">
                                          <input type="text" value={uploadedMeta?.name} placeholder="File Name"/>
                                      </div>
                                    </div>
                                  </div>
                              </Field>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                            <Col>
                              <div>
                                <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Save</Button>
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
                                        width: `100px`,
                                        backgroundImage: `url(${process.env.REACT_APP_API_STORAGE_URL + '/' + file.path})`
                                      }}>
                                        <p className="dropzone__img-name">{file.name}</p>
                                        <button className="dropzone__img-delete" type="button"
                                                onClick={e => removeFile(i, e)}>
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
