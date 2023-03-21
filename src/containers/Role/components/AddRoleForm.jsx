import React, {useState, useEffect} from 'react';
import { Form, Field } from 'react-final-form';
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import {inArray, isEmpty} from '@/shared/helpers';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import axios from 'axios';

import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import CheckboxGroup from "@/shared/components/form/CheckboxGroup"
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"

const AddRoleForm = ({organization}) => {

    const fetchPermissions = async ( id ) => {
        try {
            const response = await axios.get(`/organization/${organization.id}/permission?minimal=1`);
            return response.data;
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    }

    // alert(JSON.stringify(organization))

    const dispatch = useDispatch()

    const [loading, setLoading] = useState(true)
    let [permissions, setPermissions] = useState(null);

    useEffect( ()=>{
        // alert( JSON.stringify(organization))
        setLoading(true)
        if( !isEmpty(organization) ) {
            fetchPermissions()
            .then( response => {
                setPermissions(response)
                setLoading(false)
            })
        }
    }, [organization])

    const onSubmit = values => {

        // alert(JSON.stringify(values))

        // return;

        setLoading(true)
        axios.post(`/organization/${organization.id}/role`, values)
        .then( (res) => {
            if(res.status == 200)  {
                // dispatch(sendFlashMessage('Role created successfully', 'alert-success'))
                window.location = '/roles?message=Role created successfully'
            }
        })
        .catch( error => {
            console.log(error.response.data);
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
            permissions: []
        }}
        mutators={{
            ...arrayMutators
        }}
    >
    {({ handleSubmit, form, submitting, pristine, values }) => (
    <form className="form" onSubmit={handleSubmit}>
        <Row className='w100'>
            <Col md="6" lg="6" xl="6">
                <h3 className="mb-4">Add Role</h3>
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
                        <span className="form__form-group-label">Role Name</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Role Name" />
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
                <h4 className="mb-4">Permissions</h4>
                <FieldArray
                    name="permissions"
                    component={CheckboxGroup}
                    options={permissions}
                />
                {values?.permissions.length <= 0 && <span className="form__form-group-error">Please select permissions</span>}
                {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
            </Col>
        </Row>
    </form>
    )}
  </Form>
)}

const validate = values => {
    let errors = []
    if( values.name === "" || typeof values.name === 'undefined')
        errors.name = "Role name is required"
    if( !values.permissions || values.permissions.length <= 0 )
        errors.permissions = "Permissions are required" 
    return errors
}

export default AddRoleForm;
