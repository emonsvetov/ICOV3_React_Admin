import React, {useEffect} from 'react';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const queryClient = new QueryClient()

const fetchUser = async ( id ) => {
    try {
        const response = await axios.get(`/organization/1/user/${id}`);
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

const ViewUser = () => {

    let { id } = useParams();

    const { isLoading, error, data, isSuccess, remove } = useQuery(
        ['user', id],
        () => fetchUser( id ),
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
    if( isSuccess )   {
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
                                        First Name:
                                    </Col>
                                    <Col md="10" lg="10" xl="10" sm="10">
                                        {data.first_name}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="2" lg="2" xl="2" sm="2" className='label'>
                                        Last Name:
                                    </Col>
                                    <Col md="10" lg="10" xl="10" sm="10">
                                        {data.last_name}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="2" lg="2" xl="2" sm="2" className='label'>
                                        Role:
                                    </Col>
                                    <Col md="10" lg="10" xl="10" sm="10">
                                        {data.role}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="2" lg="2" xl="2" sm="2" className='label'>
                                        Email:
                                    </Col>
                                    <Col md="10" lg="10" xl="10" sm="10">
                                        {data.email}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="2" lg="2" xl="2" sm="2" className='label'>
                                        Phone:
                                    </Col>
                                    <Col md="10" lg="10" xl="10" sm="10">
                                        {data.phone}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="2" lg="2" xl="2" sm="2" className='label'>
                                        Award Level:
                                    </Col>
                                    <Col md="10" lg="10" xl="10" sm="10">
                                        {data.award_level}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="2" lg="2" xl="2" sm="2" className='label'>
                                        Work Anniversary:
                                    </Col>
                                    <Col md="10" lg="10" xl="10" sm="10">
                                        {data.work_anniversary}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="2" lg="2" xl="2" sm="2" className='label'>
                                        Department / Team:
                                    </Col>
                                    <Col md="10" lg="10" xl="10" sm="10">
                                        {data.division}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="2" lg="2" xl="2" sm="2" className='label'>
                                        Birthday:
                                    </Col>
                                    <Col md="10" lg="10" xl="10" sm="10">
                                        {data.dob}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="2" lg="2" xl="2" sm="2" className='label'>
                                        Employee Number:
                                    </Col>
                                    <Col md="10" lg="10" xl="10" sm="10">
                                        {data.employee_number}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="2" lg="2" xl="2" sm="2" className='label'>
                                        Supervisor ID:
                                    </Col>
                                    <Col md="10" lg="10" xl="10" sm="10">
                                        {data.supervisor_employee_number}
                                    </Col>
                                </Row>
                                
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

const Wrapper = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ViewUser />
        </QueryClientProvider>
    )
}

export default Wrapper;


