import React, {useState} from 'react';
import { Card, CardBody, Col, Row, ButtonToolbar} from 'reactstrap';
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import axios from 'axios'
import { Link } from 'react-router-dom'
// 
const RoleDetails = ( {role, organization} ) => {
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)
    // let [role, setRole] = useState(data)

    const onClickDelete = (e) => {
        e.preventDefault()
        setLoading( true )
        axios.delete(`/organization/${organization.id}/role/${role.id}`)
        .then( (res) => {
            // console.log(res)
            if(res.status == 200)  {
                window.location = `/roles?message=Role deleted successfully!`
            }
        })
        .catch( error => {
            console.log(error)
            setLoading( false )
            dispatch(sendFlashMessage(JSON.stringify(error.response.data), 'alert-danger'))
            // throw new Error(`API error:${e?.message}`);
        })
    }    
    
    return(
        <>
        <Row>
            <Col md={12}>
                <Card>
                    <CardBody className='roleview'>
                        <Row>
                            <Col md="6" lg="6" xl="6">
                                <h3 className="mb-4">Role Details</h3>
                            </Col>
                            <Col md="6" lg="6" xl="6" className="text-right">
                                <ButtonToolbar className="flex justify-content-right w100">
                                    <Link className='text-blue' to={`/roles/edit/${role.id}`}>Edit</Link>
                                    <Link disabled={loading} className="text-danger" onClick={(e) => {if(window.confirm('Are you sure to delete this role?')){onClickDelete(e)}}}>Delete</Link>
                                    
                                </ButtonToolbar>
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                Role Name:
                            </Col>
                            <Col md="8" lg="8" xl="8" sm="8">
                                {role.name}
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12" lg="12" xl="12" sm="12" >
                                <h4  className='label'>Permissions:</h4>
                                {role.permissions && 
                                <div className='mt-3'>
                                    {role.permissions.map( permission => <Link to={`/permissions/view/${permission.id}`} className="badge badge-light mr-2">{permission.name}</Link>)}
                                </div>
                                }
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        </>
    )
}

export default RoleDetails