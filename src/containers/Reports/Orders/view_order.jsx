import React, {useEffect, useState} from 'react';
import {Col, Container, Row, CardBody, Card} from 'reactstrap';
import {Link, useParams, withRouter} from 'react-router-dom'
import axios from 'axios'
import {QueryClient, QueryClientProvider} from 'react-query'
import {connect} from 'react-redux'
import {isEmpty} from '@/shared/helpers'

const queryClient = new QueryClient()

const ViewOrder = ({organization}) => {

    let [order, setOrder] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    let { id } = useParams();
    const fields = [
        { 'label': 'Code', 'value': 'code' },
        { 'label': 'Cost Basis', 'value': 'cost_basis' },
        { 'label': 'Created', 'value': 'created_at' },
        { 'label': 'Deleted', 'value': 'deleted_at' },
        { 'label': 'Discount', 'value': 'discount' },
        { 'label': 'Encryption', 'value': 'encryption' },
        { 'label': 'Expiration Date', 'value': 'expiration_date' },
        { 'label': 'Factor Valuation', 'value': 'factor_valuation' },
        { 'label': 'Medium info is test', 'value': 'medium_info_is_test' },
        { 'label': 'Merchant ID', 'value': 'merchant_id' },
        { 'label': 'Pin', 'value': 'pin' },
        { 'label': 'Purchase Date', 'value': 'purchase_date' },
        { 'label': 'Purchased by v2', 'value': 'purchased_by_v2' },
        { 'label': 'Redeemed Merchant ID', 'value': 'redeemed_merchant_id' },
        { 'label': 'Redeemed Program ID', 'value': 'redeemed_program_id' },
        { 'label': 'Redeemed User ID', 'value': 'redeemed_user_id' },
        { 'label': 'Redemption Date', 'value': 'redemption_date' },
        { 'label': 'Redemption DateTime', 'value': 'redemption_datetime' },
        { 'label': 'Redemption Url', 'value': 'redemption_url' },
        { 'label': 'Redemption Value', 'value': 'redemption_value' },
        { 'label': 'Sku Value', 'value': 'sku_value' },
        { 'label': 'Tango Reference Order ID', 'value': 'tango_reference_order_id' },
        { 'label': 'Tango Request ID', 'value': 'tango_request_id' },
        { 'label': 'Updated', 'value': 'updated_at' },
        { 'label': 'v2 Medium Info ID', 'value': 'v2_medium_info_id' },
        { 'label': 'v2 Sync Status', 'value': 'v2_sync_status' },
        { 'label': 'Virtual Inventory', 'value': 'virtual_inventory' },
    ];


    const fetchOrder = async (id) => {
        try {
            const response = await axios.get(`/organization/${organization.id}/report/order/${id}`);
            return response.data.order;
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    };

    useEffect( ()=>{
        fetchOrder( id )
            .then( response => {
                setOrder(response)
                setIsLoading(false)
            })
    }, [id])


    if (isLoading) {
        return <p>Loading...</p>;
    }
    if (order) {

        const listItems = fields.map((field) =>
            <li>{field.label} - { order[field.value] }</li>
        );

        { console.log(order) }
        return (
            <Container className="dashboard">
                <Row>
                    <Col md={6}>
                        <h3 className="page-title">{order.code}</h3>
                        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/reports/orders">Orders</Link> / { id }</h3>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardBody className='view-tabbed-menu'>
                                <ul>{listItems}</ul>
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
            {!isEmpty(organization) && <ViewOrder organization={organization}/>}
        </QueryClientProvider>
    )
}

export default withRouter(connect((state) => ({
    organization: state.organization
}))(Wrapper));


