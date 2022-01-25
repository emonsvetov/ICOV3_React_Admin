import React, {useState, useEffect, useMemo} from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import { Form, Field } from "react-final-form";
import ReactTableBase from "@/shared/components/table/ReactTableBase";
import renderFileInputField from '@/shared/components/form/FileInput';
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

const UploadGiftCodesModal = ({
    isOpen, toggle, data, theme, rtl
}) => {
    const [csvRows, setCsvData] = useState([]);
    const [csvFile, setCsvFile] = useState(null);

    // var [data, setData] = useState([]);
    const tableConfig = {
        isResizable: true
    }

    const processCSV = (str, delim=',') => {
        const headers = str.slice(0,str.indexOf('\n')).split(delim);
        const rows = str.slice(str.indexOf('\n')+1).split('\n');
        rows.pop();
        const newArray = rows.map( row => {
            const values = row.split(delim);
            const eachObject = headers.reduce((obj, header, i) => {
                obj[header] = values[i];
                return obj;
            }, {})
            return eachObject;
        })
        setCsvData(newArray)
    }
    const submit = (file) => {
        // const file = csvFile;
        const reader = new FileReader();

        reader.onload = function(e) {
            const text = e.target.result;
            console.log(text);
            processCSV(text) // plugged in here
        }
        reader.readAsText(file);
    }

    const onSubmit = values => {
        // alert(JSON.stringify(values))
        if( values.name )   submit( values.name.file )
    }

    const validate = values => {
        let errors = {};
        // alert(JSON.stringify(values))
        if (!values.name) {
            errors.name = "Csv file is required";
        }
        // console.log(csvFile);
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
                validate={validate}
            >
            {({ handleSubmit, form, submitting, pristine, values }) => (
            <form className="form" onSubmit={handleSubmit}>
                <ModalHeader className='w100'>
                    <Row className='w100'>
                        <Col md="6" lg="6" xl="6">
                            <h3>Upload Gift Codes to a Merchant</h3>
                            <h5 className="colorgrey">{data.name}</h5>
                        </Col>
                        <Col md="6" lg="6" xl="6" className='text-right'>
                            <ButtonToolbar className="modal__footer flex justify-content-right w100">
                                <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                                <Button type="submit"  className="btn btn-primary" color="#ffffff">Upload</Button>
                            </ButtonToolbar>
                        </Col>
                    </Row>
                </ModalHeader>
                <ModalBody className="modal-lg">
                    <Row>
                        <Col md="6" lg="4" xl="4">
                            <div className="form__form-group">
                                    <Field
                                        name="name"
                                        component={renderFileInputField}
                                    />
                                    {/* <Field name="name">
                                        {({ input, meta }) => (
                                        <div className="form__form-group">
                                            <span className="form__form-group-label">CSV File</span>
                                            <div className="form__form-group-field">
                                                <div className="form__form-group-row">
                                                    <input
                                                        type='file'
                                                        accept='.csv'
                                                        id='csvFile'
                                                        {...input}
                                                        onChange={(e) => {
                                                            setCsvFile(e.target.files[0])
                                                            // submit(e.target.files[0])
                                                        }}
                                                        value={csvFile}
                                                    >
                                                    </input>
                                                    {meta.touched && meta.error && (
                                                    <span className="form__form-group-error">
                                                        {meta.error}
                                                    </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        )}
                                    </Field> */}
                            </div>
                        </Col>
                    </Row>
                    <ReactTableBase
                        columns={columns}
                        data={csvRows}
                        key={'modified'}
                        tableConfig={tableConfig}
                    />
                </ModalBody>
            </form>
            )}
            </Form>
        </Modal>
    )
}

UploadGiftCodesModal.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired
};
  
export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl
}))(UploadGiftCodesModal));