import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
    Modal,
    Button,
    Card,
    CardHeader,
    CardBody,
} from 'reactstrap';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import { Form, Field } from 'react-final-form';
import { FieldArray } from "react-final-form-arrays"
import arrayMutators from "final-form-arrays"
import CheckboxGroup from "@/shared/components/form/CheckboxGroup"

import axios from "axios";
import {buildIdArray, inArray} from '@/shared/helpers';
import { fetchUserProgramRoles } from "@/shared/apiHelper"
import { useDispatch, flashSuccess, flashError } from "@/shared/components/flash"

const ADMIN_ROLE_ID = 2;

const AssignRoleModal = ({ program, user, roles, isOpen, toggle, theme, rtl, setTrigger, setParentTrigger }) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [programRoles, setProgramRoles] = useState(null)

    useEffect(() => {
        if (user?.id) {
            setLoading(true);
            fetchUserProgramRoles(program.organization_id, user.id, program.id)
            .then( _roles => {
                // console.log(_roles)
                // const _roles = extractRolesFromProgramPermissions(_permissions, program.id);
                let idArray = buildIdArray(_roles)
                if( user.isAdmin ) {
                  idArray.push(ADMIN_ROLE_ID) //Admin id
                }
                setProgramRoles(idArray)
                setLoading(false)
            })
        }
    }, [user])

    const onSubmit = values => {
        let data = {};
        // setLoading(true)
        if( inArray(ADMIN_ROLE_ID, values.roles) ) {
          data.is_organization_admin = true
          data.roles = values.roles.filter( (roleId,i) => roleId !== ADMIN_ROLE_ID)
        } else {
          data.is_organization_admin = false
          data.roles = values.roles
        }
        axios.patch(`/organization/${program.organization_id}/program/${program.id}/user/${user.id}/assignRole`, data)
        .then((res) => {
            if (res.status == 200) {
                setLoading(true)
                setTrigger(Math.floor(Date.now() / 1000))
                setParentTrigger(Math.floor(Date.now() / 1000))
                flashSuccess(dispatch, "Role(s) in Program udated!")
                toggle()
            }
        })
        .catch(error => {
            setLoading(false)
            console.log(error.response.data);
            flashError(dispatch, error.response.data)
        })
    }

    const validate = values => {
        return true;
    }

    if( loading ) return 'Loading...'

    // console.log(roles)

    return (
        <Modal className={`modal-action modal-md ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={toggle}>
            <Card className='w-100'>
                <CardHeader tag="h3">
                    Acts as
                    <Button className='btn float-end' close onClick={toggle} />
                </CardHeader>
                <CardBody>
                    <Form
                        onSubmit={onSubmit}
                        validate={validate}
                        initialValues={{roles: programRoles}}
                        mutators={{
                            ...arrayMutators
                        }}
                    >
                        {({ handleSubmit, form, submitting, pristine, values }) => (
                            <form className="form" onSubmit={handleSubmit}>
                                <Field name='roles'>
                                    {({ input, meta }) => (
                                        <div className="form__form-group">
                                            <div className="form__form-group-field">
                                                <div className="form__form-group-row">
                                                    <FieldArray
                                                        component={CheckboxGroup}
                                                        options={roles}
                                                        {...input}
                                                    />
                                                    {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Field>
                                <div className='d-flex justify-content-end'>
                                    <Button className='btn-sm mr-2' color='outline-primary' onClick={toggle}>Close</Button><Button className='btn-sm' color='primary' disabled={loading} type='submit'>Submit</Button>
                                </div>
                            </form>
                        )}
                    </Form>
                </CardBody>
            </Card>
        </Modal>
    )
}

AssignRoleModal.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired
};

export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl
}))(AssignRoleModal));