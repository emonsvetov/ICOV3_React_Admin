import React, {useState} from 'react';
import { Form } from 'react-final-form';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import formValidation from "@/shared/validation/adduser";
import axios from 'axios';
import { fetchRoles } from "@/shared/apiHelper"
import FormFields from '../../components/FormFields'
import {unpatchSelect, labelizeNamedData} from '@/shared/helpers'
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"

let config = {
    roleInput: 'select',
    roleField: 'role_id'
}
const AddUserForm = ({organization}) => {
    const dispatch = useDispatch()
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [roles, setRoles] = useState(null)

    React.useEffect( () => {
        if( organization )  {
            getRoles(organization)
        }
    }, [organization])

    const getRoles = ( organization ) => {
        setLoading(true)
        fetchRoles( organization.id, null, true)
        .then( data => {
            let newData = labelizeNamedData(data);
            // console.log(newData)
            setRoles(newData);
            setLoading(false)
        })
    }
  
    const onSubmit = values => {
        if(!config.roleDisable && values.role_id?.value) {
            values.roles = [values.role_id.value]
        }   else    {
            delete(values["roles"]);
        }
        delete(values["role_id"]);
        // console.log(values)
        // return
        setLoading(true)
        axios.put(`/organization/${organization.id}/users/create`, values)
        .then( (res) => {
            // console.log(res)
            if(res.status == 200)  {
                window.location = `/users/?message=User saved successfully`
            }
        })
        .catch( error => {
          //console.log(error.response.data);
          dispatch(sendFlashMessage(<ApiErrorMessage errors={error.response.data} />, 'alert-danger'))
          setLoading(false)
        })
    }
    
    const onClickCancel = () => {
        window.location = '/users'
    }
    config = {...config, ...{roles}}

    return (
    <Form
        onSubmit={onSubmit}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={{
        }}
    >
    {({ handleSubmit, form, submitting, pristine, values }) => (
    <form className="form" onSubmit={handleSubmit}>
        <Row className='w100'>
            <Col md="6" lg="6" xl="6">
                <h3 className="mb-4">Add User</h3>
            </Col>
            <Col md="6" lg="6" xl="6" className='text-right'>
                <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button outline color="primary" className="mr-3" onClick={onClickCancel}>Cancel</Button>{' '}
                    <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Save</Button>
                </ButtonToolbar>
            </Col>
        </Row>
        <FormFields config={config} form={form} submitting={submitting} pristine={pristine} values={values} />
    </form>
    )}
  </Form>
)}

export default AddUserForm;
