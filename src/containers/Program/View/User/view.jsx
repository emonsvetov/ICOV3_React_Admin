import React, {useEffect, useState} from 'react';
import {Col, Container, Row, Card, CardBody, NavItem, NavLink, Nav, TabPane, Button, TabContent} from 'reactstrap';
import {Link, useParams} from 'react-router-dom'
import axios from 'axios'
import {QueryClient, QueryClientProvider, useQuery} from 'react-query'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {isEmpty} from '@/shared/helpers'
import EditProgramUserModal from "./EditProgramUserModal";
import classnames from "classnames";
import ProgramViewUserProfile from "./View/profile";
import ProgramViewUserHistory from "./View/history";
import ProgramViewUserGiftCodesRedeemed from "./View/giftCodesRedeemed";
import ProgramViewUserChangeLogs from "./View/changeLogs";

const queryClient = new QueryClient()

const ProgramViewUser = ({organization}) => {

    const [program, setProgram] = useState(null)
    const [isOpenEdit, setOpenEdit] = useState(false)
    const [trigger, setTrigger] = useState(Math.floor(Date.now() / 1000))
    // Tabs Panel
    const [currentActiveTab, setCurrentActiveTab] = useState('1');
    const togglePan = tab => {
        if (currentActiveTab !== tab) setCurrentActiveTab(tab);
    }
    let {programId, userId} = useParams();
    // console.log(organization)

    const fetchProgramData = async (organization) => {
        try {
            const response = await axios.get(`/organization/${organization.id}/program/${programId}`);
            // console.log(response)
            setProgram(response.data)
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    };
    useEffect(() => {
        if (organization) {
            fetchProgramData(organization)
        }
    }, [organization])

    const fetchUser = async (userId) => {
        try {
            const response = await axios.get(`/organization/${organization.id}/user/${userId}`);
            return response.data;
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    };


    const {isLoading, error, data, refetch, isSuccess, remove} = useQuery(
        ['user', userId],
        () => fetchUser(userId),
        {
            keepPreviousData: false,
            staleTime: Infinity,
        }
    )

    const toggleEdit = () => {
        refetch()
        setOpenEdit(prevState => !prevState)
    }

    if (error) {
        return <p>Error loading user</p>;
    }
    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!program?.id || !organization?.id) {
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
                        <h3 className="page-subhead subhead">
                            <Link className="" to="/">Home</Link> /&nbsp;
                            <Link className="" to="/program">Programs</Link> /&nbsp;
                            <Link className="" to={`/program/view/${program.id}`}>{program?.name}</Link> /&nbsp;
                            <Link className="" to={`/program/${program.id}/users`}>Users</Link> /&nbsp;
                            {fullName}
                        </h3>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <EditProgramUserModal organization={organization} program={program} userid={userId}
                                              isOpen={isOpenEdit} setOpen={setOpenEdit} toggle={toggleEdit}
                                              setTrigger={setTrigger}/>
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
                                    <Col md="5"  className="text-right">
                                        <Link className="" onClick={toggleEdit} to="#">Edit</Link>
                                    </Col>
                                </Row>
                                <TabContent activeTab={currentActiveTab} className="tabContent">
                                    <TabPane tabId="1" className="tabPane">
                                        <ProgramViewUserProfile data={data} organization={organization}
                                                                program={program}/>
                                    </TabPane>
                                    <TabPane tabId="2">
                                        {
                                            currentActiveTab != 2 ? 'Loading...' :
                                                <ProgramViewUserHistory user={data} organization={organization}
                                                                        program={program}/>
                                        }
                                    </TabPane>
                                    <TabPane tabId="3">
                                        {
                                            currentActiveTab != 3 ? 'Loading...' :
                                                <ProgramViewUserGiftCodesRedeemed user={data} organization={organization}
                                                                        program={program}/>
                                        }
                                    </TabPane>
                                    <TabPane tabId="4">
                                        {
                                            currentActiveTab != 4 ? 'Loading...' :
                                                <ProgramViewUserChangeLogs user={data} organization={organization}
                                                                        program={program}/>
                                        }
                                    </TabPane>
                                </TabContent>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

const Wrapper = ({organization}) => {
    return (
        <QueryClientProvider client={queryClient}>
            {!isEmpty(organization) && <ProgramViewUser organization={organization}/>}
        </QueryClientProvider>
    )
}

export default withRouter(connect((state) => ({
    organization: state.organization
}))(Wrapper));



