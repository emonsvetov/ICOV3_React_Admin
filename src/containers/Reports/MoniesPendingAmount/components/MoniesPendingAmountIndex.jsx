import React from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import MoniesPendingAmountIndexDataTable from "./MoniesPendingAmountIndexDataTable";


const MoniesPendingAmountIndex = ({organization}) => {

    const defaultPrograms = []

    return (
        <Col md={12}>
            <Card>
                <CardBody>
                    <MoniesPendingAmountIndexDataTable programs={defaultPrograms} />
                </CardBody>
            </Card>
        </Col>
    )
}
export default MoniesPendingAmountIndex

