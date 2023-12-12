import React, { useState } from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import TrialBalanceTable from './TrialBalanceTable';
import {connect} from "react-redux";



const TrialBalanceIndex = ({ organization }) => {
    const [defaultPrograms, setDefaultPrograms] = useState([]);

    return (
        <Col md={12}>
            <Card>
                <CardBody>
                    <TrialBalanceTable programs={defaultPrograms} />
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
export default connect(mapStateToProps)(TrialBalanceIndex);