import React, {useEffect, useState} from 'react';
import {Col, Container, Row, Card, CardBody, NavItem, NavLink, Nav, TabPane, Button, TabContent} from 'reactstrap';
import {Link, useParams} from 'react-router-dom'
import axios from 'axios'
import {QueryClient, QueryClientProvider, useQuery} from 'react-query'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {isEmpty} from '@/shared/helpers'
import ProgramViewUserHistory from "./history";

const queryClient = new QueryClient()

const ProgramViewUserGiftCodesRedeemed = ({organization, program, data}) => {

    let {programId, userId} = useParams();

    if (!program?.id || !organization?.id || !data) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Row>
                <Col sm="9">
                    <div className="button-result">
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default ProgramViewUserGiftCodesRedeemed;




