import React, {useState} from 'react';
import { Form } from 'react-final-form';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import formValidation from "@/shared/validation/editprogramuser";
import axios from 'axios';
import { fetchUser, fetchRoles, fetchUserProgramRoles } from "@/shared/apiHelper"
import {unpatchSelect, labelizeNamedData, buildIdArray} from '@/shared/helpers'
import {useDispatch, flashSuccess, flashError} from "@/shared/components/flash"
import ProgramUserFormFields from './ProgramUserFormFields'
import arrayMutators from "final-form-arrays"
import getUnitNumbers from '@/service/program/getUnitNumbers'

let config = {
  roles:[],
  roleInput: 'checkbox',
  roleField: 'role_id',
  rolePlaceholder: 'Select Role',
  roleDisable: false,
  isProgram: false,
  unitNumberField: 'unit_number',
  unitNumberOptions: []
}

const EditProgramUserForm = ({organization, program, userid, toggle, setTrigger}) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [roles, setRoles] = useState(null)
    const [programRoles, setProgramRoles] = useState(null)
    const [unitNumberOptions, setUnitNumberOptions] = useState(config.unitNumberOptions);
    let [user, setUser] = useState(null)

    React.useEffect( () => {
        getRoles(program.organization_id);
        fetchUser(program.organization_id, userid)
        .then( data => {
            data.avatar = null;
            setUser(data);
            setLoading(false)
        })

        fetchUserProgramRoles(program.organization_id, userid, program.id)
        .then( _roles => {
            // console.log(_roles)
            // const _roles = extractRolesFromProgramPermissions(_permissions, program.id);
            setProgramRoles(buildIdArray(_roles))
        })
    }, [program])

    React.useEffect( () => {
        
    }, [user])

    React.useEffect(() => {
      if (organization?.id && program?.id && program?.uses_units) {
        getUnitNumbers(organization.id, program.id).then( res => {
          setUnitNumberOptions(labelizeNamedData(res));
        })
      }
    }, [organization, program]);


    const getRoles = ( organizationId ) => {
        setLoading(true)
        fetchRoles( organizationId, 1 )
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
        if( typeof values.unit_number === 'object') {
          values = unpatchSelect(values, [config.unitNumberField])
        }
        // setLoading(true)
        axios.put(`/organization/${program.organization_id}/program/${program.id}/user/${userid}`, values)
        .then( (res) => {
            // console.log(res)
            if(res.status == 200)  {
                toggle()
                setTrigger( Math.floor(Date.now() / 1000) )
                // dispatch(sendFlashMessage(, 'alert-success'))
                flashSuccess(dispatch, "User Updated successfully!")
            }
        })
        .catch( error => {
            //console.log(error.response.data);
            // dispatch(sendFlashMessage(<ApiErrorMessage errors={error.response.data} />, 'alert-danger'))
            flashError(dispatch, error.response.data)
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
        
        if( ( values.password || values.password_confirmation ) && values.password !== values.password_confirmation )  {
            v1.password_confirmation = 'Passwords do not match'
        }
        // console.log(v1)
        return v1
    }

    if( !roles ) return 'Loading...'

    config = {...config, ...{roles}}
    if(user && !user.role_id){
        delete(user.role_id);
    }
    
    user = {...user, ...{roles: programRoles}}
    console.log(user.roles)
    user.user_status_id = String(user.user_status_id ? user.user_status_id : "")
    user.unit_number = String(user?.unitNumber?.id ? user.unitNumber.id : "")
    // user.unit_number = "2"
    // // console.log(user.user_status_id)
    // console.log("user.unit_number")
    // console.log(typeof user.unit_number)
    return (
    <Form
        onSubmit={onSubmit}
        validate={validate}
        initialValues={user}
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
                    <h3 className="mb-4">Edit User</h3>
                </Col>
                <Col md="6" lg="6" xl="6" className='text-right'>
                    <ButtonToolbar className="modal__footer flex justify-content-right w100">
                        <Button outline color="primary" className="mr-3" onClick={toggle}>Close</Button>{' '}
                        <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Save</Button>
                    </ButtonToolbar>
                </Col>
            </Row>
            <ProgramUserFormFields config={{...config, ...{
              unitNumberOptions
            }}} form={form} submitting={submitting} pristine={pristine} values={values} program={program}/>
        </form>
    )}}
    </Form>
)}

export default EditProgramUserForm;