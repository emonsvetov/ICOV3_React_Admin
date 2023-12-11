import React, {useEffect, useState} from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import ProgramParticipantStatusSummaryTable from './ProgramParticipantStatusSummaryTable';
import axios from "axios";
import {isEmpty} from '@/shared/helpers'
import {connect} from "react-redux";
import { getAllPrograms } from '@/shared/apiHelper.jsx';
import { useParams } from "react-router-dom";

const ProgramParticipantStatusSummaryIndex = ({ organization }) => {
    const [defaultPrograms, setDefaultPrograms] = useState([]);

    let {programId} = useParams();

    useEffect(() => {
        if ( isEmpty(defaultPrograms) ){

            getAllPrograms( "minimal=true&limit=99999999&programId="+programId )
                .then( response => {
                    const data = response?.data ? response.data : [];
                    const result = data.map(x => x.account_holder_id)
                    setDefaultPrograms(result);
                })
        }
    })

    if (isEmpty(defaultPrograms)) {
        return <p>Loading...</p>;
    }

    return (
        <Col md={12}>
            <Card>
                <CardBody>
                    <ProgramParticipantStatusSummaryTable programs={defaultPrograms} />
                </CardBody>
            </Card>
        </Col>
    )
}

const mapStateToProps = (state) => {
    return {
        organization: state.organization,
    };
};
export default connect(mapStateToProps)(ProgramParticipantStatusSummaryIndex);