import React, {useState, useEffect} from 'react';
import { Form, Field } from 'react-final-form';
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import {inArray, isEmpty, buildIdArray} from '@/shared/helpers';
import arrayCheckbox from '@/shared/components/form/ArrayCheckbox';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import axios from 'axios';

import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"
import { useParams } from "react-router-dom";

const EditPermissionForm = ({organization}) => {

    const fetchPermission = async ( id ) => {
        try {
            const response = await axios.get(`/organization/${organization.id}/permission/${id}`);
            return response.data;
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    }

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
    let { id } = useParams();

    const [loading, setLoading] = useState(false)
    let [permission, setPermission] = useState(null);
    let [roles, setRoles] = useState(null);

    useEffect( ()=>{
        if( !isEmpty(organization) ) {
            setLoading(true)
            fetchPermission( id )
            .then( response => {
                fetchRoles()
                .then( response2 => {
                    setPermission(response)
                    setRoles(response2)
                    setLoading(false)
                })
            })
        }
    }, [id, organization])

    const onSubmit = values => {

        setLoading(true)
        axios.put(`/organization/${organization.id}/permission/${id}`, values)
        .then( (res) => {
            if(res.status == 200)  {
                // dispatch(sendFlashMessage('Permission udpated successfully', 'alert-success'))
                window.location = '/permissions?message=Permission udpated successfully'
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

    if( loading || !permission || !roles ) return <p>Loading...</p>

    // console.log(permission)
    console.log(buildIdArray(permission.roles))

    return (
    <Form
        onSubmit={onSubmit}
        validate={validate}
        initialValues={{
            name: permission.name,
            roles: buildIdArray(permission.roles)
        }}
        mutators={{
            ...arrayMutators
        }}
    >
    {({ handleSubmit, form, submitting, pristine, values }) => (
    <form className="form" onSubmit={handleSubmit}>
        <Row className='w100'>
            <Col md="6" lg="6" xl="6">
                <h3 className="mb-4">Edit Permission</h3>
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
                <h4 className="mb-4">Attached to Roles</h4>
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
              <div className="form__form-group-input-wrap"><label className="checkbox-btn "><input className="checkbox-btn__checkbox" type="checkbox" onChange={event => toggle(event, option.id)} checked={inArray(option.id, fields.value)} /><span className="checkbox-btn__checkbox-custom"><svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path></svg></span><span className="checkbox-btn__label">{option.name}</span></label></div>
            </div>
        ))}
        </>
        
    )
}

export default EditPermissionForm;
