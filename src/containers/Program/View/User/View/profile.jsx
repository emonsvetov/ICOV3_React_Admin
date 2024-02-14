import React, {useEffect, useState} from 'react';
import {Col, Container, Row, Card, CardBody, NavItem, NavLink, Nav, TabPane, Button, TabContent} from 'reactstrap';
import {Link, useParams} from 'react-router-dom'
import axios from 'axios'
import {QueryClient, QueryClientProvider, useQuery} from 'react-query'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {isEmpty} from '@/shared/helpers'
import {dobDisplay} from '@/shared/helpers'
import ProgramViewUserHistory from "./history";
import getUserPointBalance from '../../../../../service/getUserBalances';
const queryClient = new QueryClient()

const ProgramViewUserProfile = ({organization, program, data}) => {

    let {programId, userId} = useParams();
    const [ pointsBalance, setPointsBalance] = useState();

    useEffect(() => {
        if (organization?.id && programId && userId) {
            getUserPointBalance(organization.id,programId, userId)
                .then(point=> {
                    setPointsBalance(point)
                })
        }
    },[organization])

    if (!program?.id || !organization?.id || !data) {
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
                    <p>{dobDisplay(data.dob)}</p>
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
            <Row>
                <Col md="2" lg="2" xl="2" sm="2" className='label'>
                    <p>Points Earned:</p>
                </Col>
                <Col md="10" lg="10" xl="10" sm="10">
                    <p>{pointsBalance?.points}</p>
                </Col>
            </Row>
            <Row>
                <Col md="2" lg="2" xl="2" sm="2" className='label'>
                    <p>Points Redeemed:</p>
                </Col>
                <Col md="10" lg="10" xl="10" sm="10">
                    <p>{pointsBalance?.redeemedBalance}</p>
                </Col>
            </Row>
            <Row>
                <Col md="2" lg="2" xl="2" sm="2" className='label'>
                    <p>Points Balance:</p>
                </Col>
                <Col md="10" lg="10" xl="10" sm="10">
                    <p>{pointsBalance?.amount}</p>
                </Col>
            </Row>
            <Row>
                <Col md="2" lg="2" xl="2" sm="2" className='label'>
                    <p>Peer Allocation Balance:</p>
                </Col>
                <Col md="10" lg="10" xl="10" sm="10">
                    <p>{pointsBalance?.peerBalance}</p>
                </Col>
            </Row>
            <Row>
                <Col md="2" lg="2" xl="2" sm="2" className='label'>
                    <p>Points Expired :</p>
                </Col>
                <Col md="10" lg="10" xl="10" sm="10">
                    <p>{pointsBalance?.expiredBalance}</p>
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




