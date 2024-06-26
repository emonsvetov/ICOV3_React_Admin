import React, {useState, useEffect} from 'react';
import { Form } from 'react-final-form';
import { useParams } from 'react-router-dom'
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import formValidation from "@/shared/validation/adduser";
import axios from 'axios';
import {patch4Select, unpatchSelect, labelizeNamedData} from '@/shared/helpers'
import { fetchUser, fetchRoles } from "@/shared/apiHelper"
import FormFields from '../../components/FormFields'
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"

const patchRole4Select = (user) => {
    if (user.roles.length > 0) {
        let tmp = Object.values(user.roles).filter(key => key.name === 'Admin' || key.name === 'Super Admin');

        if (tmp.length > 0) {
            user.role_id = {
                value: tmp[0].id,
                label: tmp[0].name
            };
        } else {
            user.role_id = {
                value: '',
                label: 'No Role Assigned'
            };
        }
    } else {
        user.role_id = {
            value: '',
            label: 'No Roles Available'
        };
    }
    return user;
}


const EditUserForm = ({organization}) => {
    const dispatch = useDispatch()
    let config = {
        roleInput: 'select',
        roleField: 'role_id',
        roleDisable: false
    }
    let { id } = useParams();

    const [loading, setLoading] = useState(true)
    const [roles, setRoles] = useState(null)
    let [user, setUser] = useState(null)

    useEffect( () => {
        if(organization)    {
            fetchUser(organization.id, id)
            .then( data => {
                data.avatar = null;
                setUser(data);
                setLoading(false)
            })
        }
    }, [organization])

    useEffect( () => {
        if(organization)    {
            getRoles(organization)
        }
    }, [organization])

    const getRoles = ( organization ) => {
        setLoading(true)
        fetchRoles( organization.id, false )
        .then( data => {
            let newData = labelizeNamedData(data);
            // console.log(newData)
            setRoles(newData);
            setLoading(false)
        })
    }
    
    const onSubmit = values => {
        console.log(values.role_id)
        if(!config.roleDisable && values.role_id) {
            if (values.role_id?.value) {
                values.roles = [values.role_id.value]
            } else {
              delete(values["roles"]);
            }
        }   else    {
            delete(values["roles"]);
        }
        delete(values["role_id"]);
        axios.put(`/organization/${organization.id}/user/${user.id}`, values)
        .then( (res) => {
            if(res.status == 200)  {
                window.location = `/users/view/${user.id}?message=User saved successfully`
            }
        })
        .catch( error => {
            dispatch(sendFlashMessage(<ApiErrorMessage errors={error.response.data} />, 'alert-danger'))
            setLoading(false)
        })
    }
    
    const onClickCancel = () => {
        window.location = `/users/view/${user.id}`
    }

    if( !roles || !user || !organization?.id) return 'Loading...'

    user = patchRole4Select(user)
    user.user_status_id = String(user.user_status_id ? user.user_status_id : "")
    config = {...config, ...{roles}}
    return (
    <Form
        onSubmit={onSubmit}
        validate={(values) => formValidation.validateForm(unpatchSelect(values, ["role_id"]))}
        initialValues={user}
    >
    {({ handleSubmit, form, submitting, pristine, values }) => (
    <form className="form" onSubmit={handleSubmit}>
        <Row className='w100'>
            <Col md="6" lg="6" xl="6">
                <h3 className="mb-4">User Profile</h3>
            </Col>
            <Col md="6" lg="6" xl="6" className='text-right'>
                <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button outline color="primary" className="mr-3" onClick={onClickCancel}>Cancel</Button>{' '}
                    <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Save</Button>
                </ButtonToolbar>
            </Col>
        </Row>
        <FormFields config={config} form={form} submitting={submitting} pristine={pristine} values={values}/>
    </form>
    )}
  </Form>
)}
export default EditUserForm;