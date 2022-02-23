import React, {useState, useEffect} from 'react';
import { Form, Field } from 'react-final-form';
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import {inArray, isEmpty} from '@/shared/helpers';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import axios from 'axios';

import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
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
                    component={RenderPermissionCheckbox}
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

const RenderPermissionCheckbox = ({fields, options}) => {
    const toggle = (event, option) => {
        if (event.target.checked) {
            fields.push(option);
        } else {
            const index = fields.value.indexOf(option)
            fields.remove( index );
        }
    };
    return (
        <>
        {options.map(option => (
            <div key={`permission-${option.id}`}>
              <div class="form__form-group-input-wrap"><label class="checkbox-btn "><input class="checkbox-btn__checkbox" type="checkbox" onChange={event => toggle(event, option.id)} checked={inArray(option.id, fields.value)} /><span class="checkbox-btn__checkbox-custom"><svg class="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path></svg></span><span class="checkbox-btn__label">{option.name}</span></label></div>
            </div>
        ))}
        </>
        
    )
}

export default AddRoleForm;
