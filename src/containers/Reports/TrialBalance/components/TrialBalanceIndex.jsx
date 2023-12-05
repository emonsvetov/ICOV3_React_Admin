import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import TrialBalanceTable from './TrialBalanceTable';
import axios from "axios";

const TrialBalanceIndex = ({ organizationId }) => {
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        if (organizationId) {
            const fetchData = async () => {
                const apiUrl = `/v1/organization/${organizationId}/report/trial-balance`;
                try {
                    const response = await axios.get(apiUrl);
                    setDataLoaded(true);
                } catch (error) {
                    console.error("Error fetching trial balance data:", error);
                }
            };

            fetchData();
        }
    }, [organizationId]);

    if (!dataLoaded || !organizationId) {
        return <p>Loading...</p>;
    }

    return (
        <Col md={12}>
            <Card>
                <CardBody>
                    <TrialBalanceTable />
                </CardBody>
            </Card>
        </Col>
    );
};

export default TrialBalanceIndex;
