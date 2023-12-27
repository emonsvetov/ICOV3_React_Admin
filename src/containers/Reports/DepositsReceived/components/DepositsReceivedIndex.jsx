import React from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import DepositsReceivedIndexDataTable from "./DepositsReceivedIndexDataTable";


const DepositsReceivedIndex = ({organization}) => {

    const defaultPrograms = []

    return (
        <Col md={12}>
            <Card>
                <CardBody>
                    <DepositsReceivedIndexDataTable programs={defaultPrograms} />
                </CardBody>
            </Card>
        </Col>
    )
}
export default DepositsReceivedIndex

