import React, {useEffect, useState} from 'react';
import {Col, Container, Row, CardBody, Card} from 'reactstrap';
import {Link, useParams, withRouter} from 'react-router-dom'
import axios from 'axios'
import {QueryClient, QueryClientProvider} from 'react-query'
import {connect} from 'react-redux'
import {isEmpty} from '@/shared/helpers'

const queryClient = new QueryClient();

const ViewOrder = ({ organization }) => {
    let [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    let {id} = useParams();

    const transformBool = (order, value) => {
        if (!order[value] && order[value] !== 0) return null;
        switch (value) {
            case 'purchased_by_v2':
            case 'virtual_inventory':
            case 'medium_info_is_test':
                return order[value] === 1 ? 'yes' : 'no';
            case 'redemption_value':
            case 'sku_value':
            case 'cost_basis':
                return `$${parseFloat(order[value]).toFixed(2)}`;
            case 'discount':
                return `${parseFloat(order[value]).toFixed(2)}%`;
            case 'redemption_url':
                return order[value].length ? <Link to={{pathname: order[value]}}>{order[value]}</Link> : '';
            default:
                return order[value];
        }
    };

    const table1Fields = [
        {'label': 'Code', 'value': 'code'},
        {'label': 'Pin', 'value': 'pin'},
        {'label': 'SKU Value', 'value': 'sku_value'},
        {'label': 'Cost Basis', 'value': 'cost_basis'},
        {'label': 'Discount', 'value': 'discount'},
        {'label': 'Merchant ID', 'value': 'merchant_id'},
        {'label': 'Merchant Name', 'value': 'merchant_name'},
        {'label': 'Purchase Date', 'value': 'purchase_date'},
        {'label': 'Updated', 'value': 'updated_at'},
        {'label': 'Factor Valuation', 'value': 'factor_valuation'},
        {'label': 'Deleted', 'value': 'deleted_at'},
        {'label': 'Expiration Date', 'value': 'expiration_date'},
        {'label': 'Encryption', 'value': 'encryption'}
    ].filter(({value}) => order?.[value]);

    const table2Fields = [
        {'label': 'Redeemed Program ID', 'value': 'redeemed_program_name'},
        {'label': 'Redeemed User ID', 'value': 'redeemed_user_id'},
        {'label': 'Redemption Date', 'value': 'redemption_datetime'},
        {'label': 'Redemption Url', 'value': 'redemption_url'},
        {'label': 'Redemption Value', 'value': 'redemption_value'},
    ];

    const table3Fields = [
        {'label': 'Tango Reference Order ID', 'value': 'tango_reference_order_id'},
        {'label': 'Tango Request ID', 'value': 'tango_request_id'},
        {'label': 'v2 Medium Info ID', 'value': 'v2_medium_info_id'},
        {'label': 'v2 Sync Status', 'value': 'v2_sync_status'},
        {'label': 'Purchased by v2', 'value': 'purchased_by_v2'},
        {'label': 'Virtual Inventory', 'value': 'virtual_inventory'},
        {'label': 'Medium info is test', 'value': 'medium_info_is_test'},
    ];

    const tables = [
        {'label': '', 'fields': table1Fields},
        {'label': 'Redemption Details', 'fields': table2Fields},
        {'label': 'Technical Details', 'fields': table3Fields},
    ];


    const fetchOrder = async (id) => {
        try {
            const response = await axios.get(`/organization/${organization.id}/report/order/${id}`);
            return response.data.order;
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    };

    useEffect(() => {
        fetchOrder(id)
            .then(response => {
                setOrder(response)
                setIsLoading(false)
            })
    }, [id])


    if (isLoading) {
        return <p>Loading...</p>;
    }
    if (order) {
        return (
            <Container className="dashboard">
                <Row>
                    <Col md={6}>
                        <h3 className="page-title">Order ID - {order.id}</h3>
                        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className=""
                                                                                                           to="/reports/orders">Orders</Link> / {id}
                        </h3>
                    </Col>
                </Row>
                <Row>
                    {tables.map((table, index) => (
                        <Col key={index} md="4"> {/* This md="4" ensures each table takes up 1/3rd of the row */}
                            <Card>
                                <CardBody>
                                    <table className="table table--bordered">
                                        <tbody>
                                        {table.fields.map((row, rowIndex) => {
                                            const cellContent = transformBool(order, row.value);
                                            return (
                                                cellContent && (
                                                    <tr key={rowIndex}>
                                                        <td>{row.label}</td>
                                                        <td style={{wordBreak: 'break-all'}}>{cellContent}</td>
                                                    </tr>
                                                )
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        );
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


