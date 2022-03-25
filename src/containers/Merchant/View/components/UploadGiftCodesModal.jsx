import React, {useState, useMemo, useEffect} from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import { Form, Field } from "react-final-form";
import ReactTableBase from "@/shared/components/table/ReactTableBase";
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"
import {makeCsvErrors} from "@/shared/apiTableHelper"
import axios from 'axios'

import {
    Modal,
    ModalBody,
    ModalHeader,
    Button,
    ButtonToolbar,
    Row,
    Col,
  } from "reactstrap";
import COLUMNS from './columns/upload_gift_codes_columns'

function myfunc() {
    return {
        x:10,
        y:20
    }
}

// const {x:mx, y:my} = myfunc()
// console.log(mx)
// console.log(my)
// console.log(x)
// console.log(y)

const UploadGiftCodesModal = ({
    isOpen, toggle, theme, rtl, merchant, setTrigger
}) => {
    const dispatch = useDispatch()

    const [csvFile, setCsvFile] = useState(null);
    const [errorComponent, setErrorComponent] = useState(null);

    // useEffect( () => {
    //     setErrorComponent(null)
    // }, [setErrorComponent])

    // console.log(errorComponent)

    // var [data, setData] = useState([]);
    const tableConfig = {
        isResizable: true,
        isSortable:false
    }

    // const processCSV = (str, delim=',') => {
    //     const headers = str.slice(0,str.indexOf('\n')).split(delim);
    //     const rows = str.slice(str.indexOf('\n')+1).split('\n');
    //     rows.pop();
    //     const newArray = rows.map( row => {
    //         const values = row.split(delim);
    //         const eachObject = headers.reduce((obj, header, i) => {
    //             obj[header] = values[i];
    //             return obj;
    //         }, {})
    //         return eachObject;
    //     })
    //     setCsvData(newArray)
    // }
    function handleUpload() {
        let data = new FormData();
        // if( !csvFile ){
        //   return;
        // }
        data.append('file_medium_info', csvFile)
        axios
        .post(`/merchant/${merchant.id}/giftcode`, data, {
                headers: {
                    "Content-type": "multipart/form-data",
                },       
            }
        )
        .then((res) => {
            console.log(res);
            if (res.status == 200) {
                toggle()
                setTrigger(Math.floor(Date.now() / 1000))
                dispatch(sendFlashMessage('Giftcodes saved successfully', 'alert-success'))
                // alert('success')
            }
        })
        .catch((error) => {
            const errors = error.response.data.errors;
            const csv_errors = errors.file_medium_info;
            // console.log(csv_errors)
            if(typeof csv_errors === 'object')  {
                try{
                    const {columns:csvColumns, rows:csvRows} = makeCsvErrors(csv_errors);
                    setErrorComponent(
                    <ReactTableBase
                        columns={csvColumns}
                        data={csvRows}
                        tableConfig={tableConfig}
                    />)
                    dispatch(sendFlashMessage('Error occurred while validating giftcodes. Please see the errors below', 'alert-danger', 'top'))
                }
                catch(err)
                {
                    console.log(err)
                    // console.log(error.response.data)
                    dispatch(sendFlashMessage(<ApiErrorMessage errors={err.response.data} />, 'alert-danger', 'top'))
                }

                // console.log(csv_errors_json)
            }
            // if( typeof errors)
        });  
    }

    const onSubmit = values => {
        if( csvFile ) handleUpload( )
    }

    const onClickCancel = () => {
        setCsvFile(null)
        setErrorComponent(null)
        toggle()
    }

    const validateMe = (values) => {
        let errors = {};
        // // alert(JSON.stringify(csvFile))
        if ( !csvFile ) {
            errors.name = "Csv file is required";
        }
        // // console.log(csvFile);
        return errors;
    }

    let columns = useMemo( () => COLUMNS, [])

    return(
        <Modal
            className={`modal-merchant-upload-giftcodes modal-lg ${theme.className} ${rtl.direction}-support`}
            isOpen={isOpen}
            toggle={toggle}
        >
            <Form 
                onSubmit={onSubmit}
                validate={validateMe}
            >
            {({ handleSubmit, form, submitting, pristine, values }) => (
            <form className="form" onSubmit={handleSubmit}>
                <ModalHeader className='w100'>
                    <Row className='w100'>
                        <Col md="6" lg="6" xl="6">
                            <h3>Upload Gift Codes to a Merchant</h3>
                            <h5 className="colorgrey">{merchant.name}</h5>
                        </Col>
                        <Col md="6" lg="6" xl="6" className='text-right'>
                            <ButtonToolbar className="modal__footer flex justify-content-right w100">
                                <Button outline color="primary" className="mr-3" onClick={onClickCancel}>Cancel</Button>{' '}
                                <Button type="submit"  className="btn btn-primary" color="#ffffff">Upload</Button>
                            </ButtonToolbar>
                        </Col>
                    </Row>
                </ModalHeader>
                <ModalBody className="modal-lg">
                    <Row>
                        <Col md="6" lg="4" xl="4">
                            <Field name="name">
                                {({ input, meta }) => (
                                <div className="form__form-group">
                                    <span className="form__form-group-label">CSV File</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            <input
                                                type='file'
                                                // accept='.csv'
                                                id='csvFile'
                                                {...input}
                                                onChange={(e) => {
                                                    setCsvFile(e.target.files[0])
                                                }}
                                                value={csvFile?.name.file}
                                            >
                                            </input>
                                            {meta.touched && !csvFile && (
                                            <span className="form__form-group-error">
                                                {meta.error}
                                            </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                )}
                            </Field>
                        </Col>
                    </Row>
                </ModalBody>
            </form>
            )}
            </Form>
            {errorComponent}
        </Modal>
    )
}

UploadGiftCodesModal.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired,
    // merchant: PropTypes.is
};
  
export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
    merchant: state.merchant
}))(UploadGiftCodesModal));
