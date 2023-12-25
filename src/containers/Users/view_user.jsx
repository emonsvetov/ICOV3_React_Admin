import React, { useEffect, useState } from 'react';
import {Col, Container, Row, Card, CardBody, NavItem, NavLink, Nav, TabPane, Button, TabContent} from 'reactstrap';
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import classnames from "classnames";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import ProgramsCard from './View/ProgramsCard'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { isEmpty } from '@/shared/helpers'
import ViewUserProfile from "./View/profile";
import ViewUserHistory from "./View/history";
import ViewUserGiftCodesRedeemed from "./View/giftCodesRedeemed";
import ViewUserChangeLogs from "./View/changeLogs";
import { fetchRoles, fetchUserPrograms, fetchUserProgramRoles } from "@/shared/apiHelper"
import {login} from "../App/auth";

const queryClient = new QueryClient()

const ViewUser = ({ organization }) => {

    const [userPrograms, setUserPrograms] = useState(null)
    const [userProgramIds, setUserProgramIds] = useState(null)
    let { id } = useParams();

    // Tabs Panel
    const [currentActiveTab, setCurrentActiveTab] = useState('1');
    const togglePan = tab => {
        if (currentActiveTab !== tab) setCurrentActiveTab(tab);
    }

    const fetchUser = async (id) => {
        try {
            const response = await axios.get(`/organization/${organization.id}/user/${id}`);
            return response.data;
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    };

    const getUserPrograms = () => {
        fetchUserPrograms( organization.id, id )
            .then( data => {
                setUserPrograms(data);
                setUserProgramIds(data.map(a => a.account_holder_id));
            })
    }

    useEffect( () => {
        if (id) {
            getUserPrograms()
        }
    }, [id])



    // console.log(organization)

    const { isLoading, error, data, isSuccess, remove } = useQuery(
        ['user', id],
        () => fetchUser(id),
        {
            keepPreviousData: false,
            staleTime: Infinity,
        }
    )

    if (error) {
        return <p>Error loading user</p>;
    }
    if (isLoading) {
        return <p>Loading...</p>;
    }
    if (isSuccess) {
        const fullName = `${data.first_name} ${data.last_name}`
        return (
            <Container className="dashboard">
                <Row>
                    <Col md={12}>
                        <h3 className="page-title">{fullName}</h3>
                        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/users">Users</Link> / {fullName}</h3>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardBody className='infoview'>
                                <Row>
                                    <Col md="7" >
                                        <Nav tabs>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({
                                                        active:
                                                            currentActiveTab === '1'
                                                    })}
                                                    onClick={() => {
                                                        togglePan('1');
                                                    }}
                                                >
                                                    User Profile
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({
                                                        active:
                                                            currentActiveTab === '2'
                                                    })}
                                                    onClick={() => {
                                                        togglePan('2');
                                                    }}
                                                >
                                                    History
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({
                                                        active:
                                                            currentActiveTab === '3'
                                                    })}
                                                    onClick={() => {
                                                        togglePan('3');
                                                    }}
                                                >
                                                    Gift Codes Redeemed
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({
                                                        active:
                                                            currentActiveTab === '4'
                                                    })}
                                                    onClick={() => {
                                                        togglePan('4');
                                                    }}
                                                >
                                                    Change Logs
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </Col>
                                </Row>
                                <TabContent activeTab={currentActiveTab} className="tabContent">
                                    <TabPane tabId="1" className="tabPane">
                                        <ViewUserProfile data={data} organization={organization} />
                                    </TabPane>
                                    <TabPane tabId="2" className="tabPane">
                                        <ViewUserHistory programs={userProgramIds} user={data} organization={organization} />
                                    </TabPane>
                                    <TabPane tabId="3" className="tabPane">
                                        <ViewUserGiftCodesRedeemed programs={userProgramIds} user={data} organization={organization} />
                                    </TabPane>
                                    <TabPane tabId="4" className="tabPane">
                                        <ViewUserChangeLogs programs={userProgramIds} user={data} organization={organization} />
                                    </TabPane>
                                </TabContent>

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


