import React, { useState } from 'react';
import { Form } from 'react-final-form';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import axios from 'axios';
import { fetchRoles } from "@/shared/apiHelper"
import AssignIndex from './Assign/index'

const AssignUser = ({ organization, program, toggle, setTrigger }) => {
    // const [loading, setLoading] = useState(false)
    // const [roles, setRoles] = useState(null)

    // React.useEffect(() => {
    // }, [program])

    // const getRoles = (organizationId) => {
    //     setLoading(true)
    //     fetchRoles(organizationId, true)
    //         .then(data => {
    //             setRoles(data);
    //             setLoading(false)
    //         })
    // }
    return (
        <div>
            <Row className='w100'>
                <Col md="6" lg="6" xl="6">
                    <h3 className="mb-4">Assign User to "{program.name}"</h3>
                </Col>
                <Col md="6" lg="6" xl="6" className='text-right'>
                        <ButtonToolbar className="modal__footer flex justify-content-right w100">
                            <Button outline color="primary" className="mr-3" onClick={toggle}>Close</Button>
                        </ButtonToolbar>
                </Col>
            </Row>
            <Row className='w100'>
                <Col md="12" lg="12" xl="12">
                    <AssignIndex program={program} organization={organization} setTrigger={setTrigger} />
                </Col>
            </Row>
        </div>
    )
}

export default AssignUser;