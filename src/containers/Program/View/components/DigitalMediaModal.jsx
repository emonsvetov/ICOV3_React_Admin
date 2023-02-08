import React, {useState} from 'react';
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


const options = [
    {value: "Brochures", label: "Brochures"},
    {value: "Newsletters", label: "Newsletters"},
    {value: "Training", label: "Training"},
    {value: "Videos", label: "Videos"}
];

const MEDIA_FIELDS = ['media']

const DigitalMediaModal = ({organization, isOpen, setOpen, toggle, data, theme, rtl}) => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    let [template, setTemplate] = useState(null)

    const handleSubmit = async (files, values ) => {
        let formData = new FormData();
        formData.append('files[]', files.map(f => f.meta));
        formData.append('_method', 'PUT')
        for (let key of formData.entries()) {
            console.log(key[0] + ', ' + key[1]);
        }

        let saveUrl = `/organization/${data.organization_id}/program/${data.id}/digitalmedia`;
        axios.post(saveUrl, formData, {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*"
        })
            .then( (res) => {
                 console.log(res)
                toggle();
                if(res.status === 200)  {
                    setTemplate(res.data)
                    dispatch(sendFlashMessage('Media successfully published', 'alert-success'));
                    if( !template?.id)  {
                        window.location.reload();
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

        console.log(Object)
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
                                                <h5 className="colorgrey">{data.name}</h5>
                                                <div style={{paddingTop: '25px'}}></div>
                                                <div>
                                                    <CreatableSelect
                                                        name="category"
                                                        isClearable
                                                        isDisabled={isLoading}
                                                        isLoading={isLoading}
                                                        options={options}
                                                        placeholder='Select or Create a Menu Category'
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
                                                        name="media_upload"
                                                        onSubmit={handleSubmit}
                                                    />
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
    data: state.program
}))(DigitalMediaModal));
