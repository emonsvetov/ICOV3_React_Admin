import React from 'react';
import {Col, Row} from 'reactstrap';



const ProgramViewUserProfile = ({organization, data}) => {

    

    if (!organization?.id || !data) {
        return <p>Loading...</p>;
    }

    const fullName = `${data.first_name} ${data.last_name}`
    return (
        <>
            <Row>
                <Col md="2" lg="2" xl="2" sm="2" className='label'>
                    <p>First Name:</p>
                </Col>
                <Col md="10" lg="10" xl="10" sm="10">
                    <p>{data.first_name}</p>
                </Col>
            </Row>
            <Row>
                <Col md="2" lg="2" xl="2" sm="2" className='label'>
                    <p>Last Name:</p>
                </Col>
                <Col md="10" lg="10" xl="10" sm="10">
                    <p>{data.last_name}</p>
                </Col>
            </Row>
            <Row>
                <Col md="2" lg="2" xl="2" sm="2" className='label'>
                    <p>Roles:</p>
                </Col>
                <Col md="10" lg="10" xl="10" sm="10">
                    <RenderUserRoles user={data}/>
                </Col>
            </Row>
            <Row>
                <Col md="2" lg="2" xl="2" sm="2" className='label'>
                    <p>Email:</p>
                </Col>
                <Col md="10" lg="10" xl="10" sm="10">
                    <p>{data.email}</p>
                </Col>
            </Row>
            <Row>
                <Col md="2" lg="2" xl="2" sm="2" className='label'>
                    <p>Phone:</p>
                </Col>
                <Col md="10" lg="10" xl="10" sm="10">
                    <p>{data.phone}</p>
                </Col>
            </Row>
            <Row>
                <Col md="2" lg="2" xl="2" sm="2" className='label'>
                    <p>Award Level:</p>
                </Col>
                <Col md="10" lg="10" xl="10" sm="10">
                    <p>{data.award_level}</p>
                </Col>
            </Row>
            <Row>
                <Col md="2" lg="2" xl="2" sm="2" className='label'>
                    <p>Work Anniversary:</p>
                </Col>
                <Col md="10" lg="10" xl="10" sm="10">
                    <p>{data.work_anniversary}</p>
                </Col>
            </Row>
            <Row>
                <Col md="2" lg="2" xl="2" sm="2" className='label'>
                    <p>Department / Team:</p>
                </Col>
                <Col md="10" lg="10" xl="10" sm="10">
                    <p>{data.division}</p>
                </Col>
            </Row>
            <Row>
                <Col md="2" lg="2" xl="2" sm="2" className='label'>
                    <p>Birthday:</p>
                </Col>
                <Col md="10" lg="10" xl="10" sm="10">
                    <p>{data.dob}</p>
                </Col>
            </Row>
            <Row>
                <Col md="2" lg="2" xl="2" sm="2" className='label'>
                    <p>Employee Number:</p>
                </Col>
                <Col md="10" lg="10" xl="10" sm="10">
                    <p>{data.employee_number}</p>
                </Col>
            </Row>
            <Row>
                <Col md="2" lg="2" xl="2" sm="2" className='label'>
                    <p>Supervisor ID:</p>
                </Col>
                <Col md="10" lg="10" xl="10" sm="10">
                    <p>{data.supervisor_employee_number}</p>
                </Col>
            </Row>
        </>
    )
}

const RenderUserRoles = ({user}) => {
    // console.log(user)
    let rolesHtml = []
    if (user.roles?.length > 0) {
        user.roles.map(role => {
            if (!role.is_program_role) {
                console.log(role)
                rolesHtml.push(<li key={role.id}>{role.name}</li>);
            }
        })
        if (user.programRoles?.length > 0) {
            user.programRoles.map(programRoles => {
                programRoles.roles.map(programRole => {
                    rolesHtml.push(<li key={programRoles.id}>{programRole.name} in <a
                        href={`/program/view/${programRoles.id}`}>{programRoles.name}</a></li>);
                })
            })
        }
    }
    return rolesHtml;
}

export default ProgramViewUserProfile;




