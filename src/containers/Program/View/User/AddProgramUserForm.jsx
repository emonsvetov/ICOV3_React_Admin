import React, {useState} from 'react';
import { Form } from 'react-final-form';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import formValidation from "@/shared/validation/addprogramuser";
import axios from 'axios';
import { fetchRoles } from "@/shared/apiHelper"
import {unpatchSelect, labelizeNamedData} from '@/shared/helpers'
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"
import ProgramUserFormFields from './ProgramUserFormFields'
import arrayMutators from "final-form-arrays"

let config = {
    roleInput:'checkbox',
    roleField: 'roles'
}

const AddProgramUserForm = ({organization, program, toggle, setTrigger}) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [roles, setRoles] = useState(null)

    React.useEffect( () => {
        getRoles(organization)
    }, [organization])

    const getRoles = ( organization ) => {
        setLoading(true)
        fetchRoles( organization.id )
        .then( data => {
            if( config.roleInput === 'select')    {
                data = labelizeNamedData(data);
            }
            setRoles(data);
            setLoading(false)
        })
    }
  
    const onSubmit = values => {
        if( config.roleInput === 'select')    {
            values = unpatchSelect(values, [config.roleField])
        }
        // console.log(values)
        // return
        // setLoading(true)
        axios.post(`/organization/${organization.id}/program/${program.id}/user`, values)
        .then( (res) => {
            // console.log(res)
            if(res.status == 200)  {
                toggle()
                setTrigger( Math.floor(Date.now() / 1000) )
                dispatch(sendFlashMessage("User added successfully!", 'alert-success'))
            }
        })
        .catch( error => {
            //console.log(error.response.data);
            dispatch(sendFlashMessage(<ApiErrorMessage errors={error.response.data} />, 'alert-danger'))
            setLoading(false)
        })
    }

    const validate = async(values) => {
        // console.log(values)
        let v1 = await formValidation.validateForm(values)

        v1 = v1 ? v1 : {}

        // if( !values.password )  {
        //     v1.password = 'Password is required'
        // }
        // if( !values.password_confirmation )  {
        //     v1.password_confirmation = 'Confrim Password is required'
        // } else 
        
        if( values.password && values.password !== values.password_confirmation )  {
            v1.password_confirmation = 'Passwords do not match'
        }
        // console.log(v1)
        return v1
    }

    if( !roles ) return 'Loading...'

    config = {...config, ...{roles}}

    return (
    <Form
        onSubmit={onSubmit}
        validate={validate}
        initialValues={{
            password:''
        }}
        mutators={{
            ...arrayMutators
        }}
    >
    {({ handleSubmit, form, submitting, pristine, values }) => {
    // console.log(pristine)
    // console.log(values)
    // console.log(form)
    return (
        <form className="form" onSubmit={handleSubmit}>
            <Row className='w100'>
                <Col md="6" lg="6" xl="6">
                    <h3 className="mb-4">Add User</h3>
                </Col>
                <Col md="6" lg="6" xl="6" className='text-right'>
                    <ButtonToolbar className="modal__footer flex justify-content-right w100">
                        <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                        <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Save</Button>
                    </ButtonToolbar>
                </Col>
            </Row>
            <ProgramUserFormFields config={config} form={form} submitting={submitting} pristine={pristine} values={values}/>
        </form>
    )}}
    </Form>
)}

export default AddProgramUserForm;