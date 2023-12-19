import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import renderSelectField from '@/shared/components/form/Select';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col, Spinner } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import axios from 'axios'
import {patch4Select, flatten} from '@/shared/helpers'

const SKIP = [
    {label: '1-800-Flowers', value: '1'}
]

// const skipExisting = (data) => {
//     let newData = []
//     data.map( row => {
//         newData.push( {label:row.name, value:row.id} )
//     })
//     return newData;
// }

const DIRECT_ANSCESTORS  = [
    {label: 'NONE', value: 'none'},
]

const AddSubmerchantModal = ({isOpen, setOpen, toggle, theme, rtl, merchant, organization, setTrigger}) => {

    const [loadingMerchants, setLoadingMerchants] = useState(false)
    const [loadingSubMerchants, setLoadingSubMerchants] = useState(false)
    const [loading, setLoading] = useState(false)
    const [merchants, setMerchants] = useState(null)
    const [subMerchants, setSubMerchants] = useState(null)

    const fetchMerchants = async ( ) => {
        try {
            console.log('fetching merchants')
            const response = await axios.get(`/organization/${organization.id}/merchant?minimal=true`);
            // console.log(response);
            return response.data;
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    };

    const fetchSubMerchants = async ( ) => {
        try {
            console.log('fetching sub merchants')
            const response = await axios.get(`/merchant/${merchant.id}/submerchant?minimal=true`);
            // console.log(response);
            return flatten(response.data)
            // return response.data;
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    };

    const convertIdNameToLabelValue = (data) => {
        if( !data ) return;
        let newData = []
        data.map( row => {
            if(row.id == merchant.id) return; //skip current merchant
            newData.push( {label:row.name, value:row.id} )
        })
        return newData;
    }

    useEffect( ()=>{
        if( isOpen )    {
            setLoadingMerchants(true)
            fetchMerchants()
            .then( response => {
                setMerchants(response)
                setLoadingMerchants(false)
            })
        }
    }, [isOpen])

    useEffect( ()=>{
        if( isOpen )    {
            setLoadingSubMerchants(true)
            fetchSubMerchants()
            .then( response => {
                setSubMerchants(response)
                setLoadingSubMerchants(false)
            })
        }
    }, [isOpen])

    const validate = ( values ) => {
        // alert( JSON.stringify(values.merchant) )
        let errors = {};
        if ( !values.merchant ) {
            errors.merchant = "Please select a merchant";
        } else if ( values.merchant.value === merchant.id ) {
            errors.merchant = "Invalid merchant selection";
        }
        // alert( values.merchant )
        // alert( merchant.id )
        return errors;
    }

    const onSubmit = values => {
        setLoading(true)
        axios.post(`/merchant/${merchant.id}/submerchant`, {merchant_id: values.merchant.value, anscestor_id: values.anscestor?.value})
        .then( (res) => {
            // console.log(res)
            if(res.status == 200)  {
                setTrigger( Math.floor(Date.now() / 1000) )
                setOpen(false)
                // window.location = '/program?message=New program added successfully!'
            }
        })
        .catch( error => {
            console.log(error.response.data);
            // setErrors(error.response.data);
            setLoading(false)
        })
    }

    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={toggle}>
        <Form 
            onSubmit={onSubmit}
            validate={validate}
            initialValues={{
                // merchant:patch4Select(merchants)
            }}
        >
        {({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="form " onSubmit={handleSubmit}>
            <ModalHeader className='w100'>
                <Row className='w100'>
                    <Col md="6" lg="6" xl="6">
                        <h3>Add Sub Merchant</h3>
                    </Col>
                    <Col md="6" lg="6" xl="6" className='text-right'>
                        <ButtonToolbar className="modal__footer flex justify-content-right w100">
                            <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                            <Button type="submit" disabled={loadingMerchants || loadingSubMerchants} className="btn btn-primary" color="#ffffff">Save</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
            </ModalHeader>
            <ModalBody className="modal-lg">
                <Row className='w100'>
                    <Col md="6" >
                        <div className="form__form-group">
                            <span className="form__form-group-label">Select from the dropdown list to add as a submerchant </span>
                            <div className="form__form-group-field position-relative">
                                <Field
                                    name="merchant"
                                    component={renderSelectField}
                                    options={convertIdNameToLabelValue(merchants)}
                                />
                                {loadingSubMerchants && <Spinner animation="border" size="sm" className='input-spinner' variant="warning" />}
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className='w100'>
                    <Col md="6" >
                        <div className="form__form-group">
                            <span className="form__form-group-label">Select from the dropdown list to add as a Direct Anscestor</span>
                            <div className="form__form-group-field position-relative">
                                <Field
                                    name="anscestor"
                                    component={renderSelectField}
                                    options={convertIdNameToLabelValue(subMerchants)}
                                />
                                {loadingMerchants && <Spinner animation="border" size="sm" className='input-spinner' variant="warning" />}
                            </div>
                        </div>
                    </Col>
                </Row>
            </ModalBody>
            </form>
        )}
        </Form>
    </Modal>
    )
}
AddSubmerchantModal.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired
};
  
export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
    organization: state.organization
}))(AddSubmerchantModal));

