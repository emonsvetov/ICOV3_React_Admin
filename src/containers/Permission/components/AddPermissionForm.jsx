import React, {useState, useEffect} from 'react';
import { Form, Field } from 'react-final-form';
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import {isEmpty} from '@/shared/helpers';
import arrayCheckbox from '@/shared/components/form/ArrayCheckbox';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import axios from 'axios';

import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"

const AddPermissionForm = ({organization}) => {

    const fetchRoles = async ( id ) => {
        try {
            const response = await axios.get(`/organization/${organization.id}/role?minimal=1`);
            return response.data;
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    }

    // alert(JSON.stringify(organization))

    const dispatch = useDispatch()

    const [loading, setLoading] = useState(true)
    let [roles, setRoles] = useState(null);

    useEffect( ()=>{
        // alert( JSON.stringify(organization))
        setLoading(true)
        if( !isEmpty(organization) ) {
            fetchRoles()
            .then( response => {
                setRoles(response)
                setLoading(false)
            })
        }
    }, [organization])

    const onSubmit = values => {

        // alert(JSON.stringify(values))

        // return;

        setLoading(true)
        axios.post(`/organization/${organization.id}/permission`, values)
        .then( (res) => {
            if(res.status == 200)  {
                // dispatch(sendFlashMessage('Permission created successfully', 'alert-success'))
                window.location = '/permissions?message=Permission created successfully'
            }
        })
        .catch( error => {
            console.log(error);
            dispatch(sendFlashMessage(<ApiErrorMessage errors={error.response.data} />, 'alert-danger'))
            setLoading(false)
        })
    }
    
    const onClickCancel = () => {
        window.history.back()
    }

    if( loading ) return <p>Loading...</p>
    
    return (
    <Form
        onSubmit={onSubmit}
        validate={validate}
        initialValues={{
            name: '',
            roles: []
        }}
        mutators={{
            ...arrayMutators
        }}
    >
    {({ handleSubmit, form, submitting, pristine, values }) => (
    <form className="form" onSubmit={handleSubmit}>
        <Row className='w100'>
            <Col md="6" lg="6" xl="6">
                <h3 className="mb-4">Add Permission</h3>
            </Col>
            <Col md="6" lg="6" xl="6" className='text-right'>
                <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button outline color="primary" className="mr-3" onClick={onClickCancel}>Cancel</Button>{' '}
                    <Button type="submit" disabled={loading || pristine} className="btn btn-primary" color="#ffffff">Save</Button>
                </ButtonToolbar>
            </Col>
        </Row>
        <Row>
            <Col md="6" >
                <Field name="name"
                >
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Permission Name</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Permission Name" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>
            </Col>
        </Row>
        <Row>
            <Col md="6" >
                <h4 className="mb-4">Attach to Roles</h4>
                <FieldArray
                    name="roles"
                    component={arrayCheckbox}
                    options={roles}
                />
            </Col>
        </Row>
    </form>
    )}
  </Form>
)}

const validate = values => {
    let errors = []
    if( values.name === "" || typeof values.name === 'undefined')
        errors.name = "Permission name is required"
    return errors
}

export default AddPermissionForm;
