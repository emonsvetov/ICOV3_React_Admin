import React, {useState} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';

import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import axios from 'axios'
import ReactTableBase from '@/shared/components/table/ReactTableBase';
// import formValidation from "@/shared/validation/program-accounting";
import renderFileInputField from '@/shared/components/form/FileInput';

import {GIFT_CODES_COLUMNS} from './columns'

const UploadGiftCodesModal = ({data, isOpen, setOpen, toggle, theme, rtl}) => {
    const [loading, setLoading] = useState(false)

    const [csvRows, setCsvData] = useState([]);
    const [csvFile, setCsvFile] = useState();
    const [isEditable, setIsEditable] = useState(false);
    const [isResizable, setIsResizable] = useState(true);

    
    const tableConfig = {
        isEditable,
        isResizable,    
    };
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

    const onSubmitForm = (values) => {
        if(csvFile)
            submit()
    }
    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={() => setOpen(true)}>
        <Form onSubmit={(values) => {
                if(csvFile)
                    submit()
            }}>
        {({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="form form--horizontal" onSubmit={handleSubmit}>
            <ModalHeader className='w100'>
                <Row className='w100'>
                    <Col md="6" lg="6" xl="6">
                        <h3>Upload Gift Codes to a Merchant</h3>
                    </Col>
                    <Col md="6" lg="6" xl="6" className='text-right'>
                        <ButtonToolbar className="modal__footer flex justify-content-right w100">
                            <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                            <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Upload</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
            </ModalHeader>
            <ModalBody className="modal-lg">
               
                <Row>
                    <Col md="12" >
                        <div className="form__form-group">
                            <span className="form__form-group-label">CSV file</span>
                            <div className="form__form-group-field">
                                <Field
                                    name="name"
                                    component={renderFileInputField}
                                    accept='.csv'
                                    parse={value => {
                                        submit(value.file)
                                        return value;
                                    }}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
                
                                
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
                                                            submit(e.target.files[0])
                                                            // setCsvFile(e.target.files[0])
                                                        }}
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

                        

                <ReactTableBase
                    columns={GIFT_CODES_COLUMNS}
                    data={csvRows}
                    key={isResizable || isEditable ? 'modified' : 'common'}
            
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

