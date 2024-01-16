import React from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import MigrationTable from './MigrationTable';

const MigrationIndex = () => {

    return (
        <Col md={12}>
            <Card>
                <CardBody>
                    <MigrationTable/>
                </CardBody>
            </Card>
        </Col>
    )
}

export default MigrationIndex;