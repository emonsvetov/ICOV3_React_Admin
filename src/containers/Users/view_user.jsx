import React from 'react';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import ProgramsCard from './View/ProgramsCard'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { isEmpty } from '@/shared/helpers'

const queryClient = new QueryClient()

const ViewUser = ({ organization }) => {

    // console.log(organization)

    const fetchUser = async (id) => {
        try {
            const response = await axios.get(`/organization/${organization.id}/user/${id}`);
            return response.data;
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    };

    let { id } = useParams();

    // console.log(organization)

    const { isLoading, error, data, isSuccess } = useQuery(
        ['user', id],
        () => fetchUser(id),
        {
            keepPreviousData: false,
            staleTime: Infinity,
        }
    )

    // const refresh = () => {
    //     remove()
    // }

    // React.useEffect(() => {
    //     fetchUser( id );
    // }, [fetchUser, id]);

    if (error) {
        return <p>Error loading user</p>;
    }
    if (isLoading) {
        return <p>Loading...</p>;
    }
    if (isSuccess) {
        // console.log(data)
        const fullName = `${data.first_name} ${data.last_name}`
        return (
            <Container className="dashboard">
                <Row>
                    <Col md={12}>
                        <h3 className="page-title">{fullName}</h3>
                        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/users">Users</Link> / {fullName}</h3>
                        {/* <span onClick={refresh}>Refresh</span> */}
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardBody className='infoview'>
                                <Row>
                                    <Col md="6" lg="6" xl="6">
                                        <h3 className="mb-4">User Profile</h3>
                                    </Col>
                                    <Col md="6" lg="6" xl="6" className="text-right">
                                        <Link className="" to={`/users/edit/${data.id}`}>Edit</Link>
                                    </Col>

                                </Row>
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
                                        <RenderUserRoles user={data} />
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

                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <ProgramsCard user={data} />
                    </Col>
                </Row>
            </Container>
        )
    }
}

const RenderUserRoles = ({ user }) => {
    // console.log(user)
    let rolesHtml = []
    if (user.roles?.length > 0) {
        user.roles.map(role => {
            if (!role.is_program_role) {
                console.log(role)
                rolesHtml.push(<li>{role.name}</li>);
            }
        })
        if (user.programRoles?.length > 0) {
            user.programRoles.map(programRoles => {
                programRoles.roles.map(programRole => {
                    rolesHtml.push(<li>{programRole.name} in <a href={`/program/view/${programRoles.id}`}>{programRoles.name}</a></li>);
                })
            })
        }
    }
    return rolesHtml;
}

const Wrapper = ({ organization }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {!isEmpty(organization) && <ViewUser organization={organization} />}
        </QueryClientProvider>
    )
}

export default withRouter(connect((state) => ({
    organization: state.organization
}))(Wrapper));

// export default Wrapper;


