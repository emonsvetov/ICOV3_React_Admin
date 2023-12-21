import React, {useState} from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import UnassignedProgramDomainTable from './UnassignedProgramDomainTable';
import axios from "axios";
import {isEmpty} from '@/shared/helpers'
import {connect} from "react-redux";
import { getAllPrograms } from '@/shared/apiHelper.jsx';


const UnassignedProgramDomainIndex = ({ organization }) => {
    const [defaultPrograms, setDefaultPrograms] = useState([]);

    return (
        <Col md={12}>
            <Card>
                <CardBody>
                    <UnassignedProgramDomainTable programs={defaultPrograms} />
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
export default connect(mapStateToProps)(UnassignedProgramDomainIndex);