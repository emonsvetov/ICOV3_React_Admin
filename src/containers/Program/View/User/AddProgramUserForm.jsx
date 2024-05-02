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
import getUnitNumbers from '@/service/program/getUnitNumbers'
import getPositionLevels from '@/service/program/getPositionLevels'

let config = {
    roleInput:'checkbox',
    roleField: 'roles',
    isProgram: true,
    unitNumberField: 'unit_number',
    unitNumberOptions: [],
    positionLevelField: 'position_level',
    positionLevelOptions: []
}

const AddProgramUserForm = ({organization, program, toggle, setTrigger}) => {
    const dispatch = useDispatch()
    const [saving, setSaving] = useState(false)
    const [roles, setRoles] = useState(null)
    const [unitNumberOptions, setUnitNumberOptions] = useState(config.unitNumberOptions);
    const [positionLevelOptions, setPositionLevelOptions] = useState(config.positionLevelOptions);

    React.useEffect( () => {
        // console.log(program)
        getRoles(program.organization_id)
    }, [program])

    const getRoles = ( organizationId ) => {
        setSaving(true)
        fetchRoles( organizationId, true )
        .then( data => {
            if( config.roleInput === 'select')    {
                data = labelizeNamedData(data);
            }
            setRoles(data);
            setSaving(false)
        })
    }

    React.useEffect(() => {
      if (organization?.id && program?.id && program?.uses_units) {
        getUnitNumbers(organization.id, program.id, "assignable=1").then( res => {
          setUnitNumberOptions(labelizeNamedData(res));
        })
      }
    }, [organization, program]);

    React.useEffect(() => {
      if (
        organization?.id &&
        program?.id &&
        (program?.use_budget_cascading > 0 ||
          program?.use_cascading_approvals > 0)
      ) {
        getPositionLevels(organization.id, program.id, "assignable=1").then(
          (res) => {
            setPositionLevelOptions(
              labelizeNamedData(res.data, ["id", "title"])
            );
          }
        );
      }
    }, [organization, program]);
  
    const onSubmit = values => {
        if( config.roleInput === 'select')    {
            values = unpatchSelect(values, [config.roleField])
        }
        console.log(values.unit_number)
        if( typeof values.unit_number === 'object') {
          console.log(config.unitNumberField)
          values = unpatchSelect(values, [config.unitNumberField])
        }
        if(values?.send_invite) {
          delete values["password"]
          delete values["password_confirmation"]
        }
        if( typeof values.position_level === 'object') {
            values = unpatchSelect(values, [config.positionLevelField])
          }
        // console.log(values)
        // return
        setSaving(true)
        axios.post(`/organization/${program.organization_id}/program/${program.id}/user`, values)
        .then( (res) => {
            // console.log(res)
            if(res.status == 200)  {
                toggle()
                setTrigger( Math.floor(Date.now() / 1000) )
                dispatch(sendFlashMessage("User added successfully!", 'alert-success'))
                setSaving(false)
            }
        })
        .catch( error => {
            //console.log(error.response.data);
            dispatch(sendFlashMessage(<ApiErrorMessage errors={error.response.data} />, 'alert-danger', 'top'))
            setSaving(false)
        })
    }

    const validate = async(values) => {
        let exclude_fields = []
        if( values?.send_invite )
        {
          exclude_fields.push('password', 'password_confirmation')
        }
        let v1 = await formValidation(exclude_fields).validateForm(values)
        v1 = v1 ? v1 : {}
        if( values?.send_invite )
        {
          delete v1["password"]
          delete v1["password_confirmation"]
        }
        else 
        {
          if( values.password && values.password !== values.password_confirmation )  {
              v1.password_confirmation = 'Passwords do not match'
          }
        }
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
                    <h3 className="mb-4">Add New User to "{program.name}"</h3>
                </Col>
                <Col md="6" lg="6" xl="6" className='text-right'>
                    <ButtonToolbar className="modal__footer flex justify-content-right w100">
                        <Button outline color="primary" className="mr-3" onClick={toggle}>Close</Button>{' '}
                        <Button type="submit" disabled={saving} className="btn btn-primary" color="#ffffff">Save</Button>
                    </ButtonToolbar>
                </Col>
            </Row>
            <ProgramUserFormFields config={{...config, ...{
              unitNumberOptions
            }, ...{
             positionLevelOptions
            }}} form={form} submitting={submitting} pristine={pristine} values={values} program={program}/>
        </form>
    )}}
    </Form>
)}

export default AddProgramUserForm;