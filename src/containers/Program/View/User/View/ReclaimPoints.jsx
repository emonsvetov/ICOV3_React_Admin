import React, {FC, useEffect, useState} from 'react';
import {Table, Input, Button, Col, Row,Tooltip} from 'antd';
import {InfoCircleOutlined} from "@ant-design/icons";
import { TableColumnsType } from 'antd';
import axios from "axios";
import { toCurrency} from '@/shared/helpers'

interface ReclaimPointsProps {
    user: any;
    organization: any;
    program: any;
}

const columns: TableColumnsType<DataType> = [
    { title: 'Award Value', dataIndex: 'amount', key: 'amount',render: (text) => (
        <span>{toCurrency(text)}</span>
        ),},
    { title: 'Date Awarded', dataIndex: 'awarded', key: 'awarded' },
    { title: 'Event', dataIndex: 'event_name', key: 'event_name' },
    { title: 'Award Credit', dataIndex: 'award_credit', key: 'award_credit' },
    { title: ' Expiration Date', dataIndex: 'expiration', key: 'expiration', render: (text, record) => (
            <span>
                {text}
                <Tooltip title={record.expiration_description} color={'#646777'}>
                <Button type="circle" style={{color: '#4ce1b6'}} icon={<InfoCircleOutlined/>}/>
                </Tooltip>
            </span>
        ),
    },
    Table.SELECTION_COLUMN,
    {
        ...Table.SELECTION_COLUMN,
        title: 'Reclaim?',
        width: 70,
    }
];

export const ReclaimPoints: FC<ReclaimPointsProps> = ({user, organization, program}) => {
    const [reclaimItems, setReclaimItems] = useState([]);
    const [reasonNotesValues, setReasonNotesValues] = useState({});
    const [dataItems, setDataItems] = useState([]);
    const [userBalance, setUserBalance] = useState(0);
    const [reclaimPointsSum, setReclaimPointsSum] = useState(0);
    const [reclaimPointsTitle, setReclaimPointsTitle] = useState("");

    const handleReclaimPoints = () => {
        reclaimItems.map(value => {
            const item = dataItems.filter(obj => {
                return obj.key === value;
            });
            let itemProgramId = item[0]['program_id'];

            if (reasonNotesValues[value]){
                reclaim(value, reasonNotesValues[value], itemProgramId);
            }
        })
    };

    const handleInputChange = (key, value) => {
        setReasonNotesValues((prevValues) => ({
            ...prevValues,
            [key]: value,
        }));
    };

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setReclaimItems(selectedRowKeys);
        },
    };

    const getDataReport = async () => {
        const merchantsApiUrl = `/organization/`+organization.id+`/user/`+user.id+`/`+program.id+`/reclaim-items`
        try {
            const response = await axios.get(merchantsApiUrl, {});
            setDataItems(response.data.data);
            setUserBalance(response.data.balance);
        } catch (e) {
        }
    }

    const reclaim = async (postingId, notes, itemProgramId) => {
        try {
            const response = await axios.post(`/organization/` + organization.id + `/user/reclaim`, {
                userId: user.id,
                program_account_holder_id: itemProgramId,
                postingId: postingId,
                notes: notes,
            });
            getDataReport();
        } catch (e) {
        }
    }

    useEffect(() => {
        let sum = 0;
        dataItems.forEach(item => {
            if (reclaimItems.includes(item.key)) {
                sum += parseFloat(item.amount);
            }
        });
        sum = parseFloat(sum.toFixed(2));
        if(Number.isInteger(sum)) {
            sum += '.00';
        }
        setReclaimPointsSum(sum);
        if (userBalance < sum) {
            setReclaimPointsTitle("Reclaim is not possible as it exceeds the current balance")
        }
    }, [reclaimItems, dataItems]);

    useEffect(() => {
        getDataReport();
    }, [])

    return (
        <>
            <Row style={{marginBottom: 10}}>
                <Col span={8}>
                    <Button title={reclaimPointsTitle} type="primary" onClick={handleReclaimPoints} disabled={parseFloat(userBalance) < parseFloat(reclaimPointsSum) || parseFloat(reclaimPointsSum) <= 0}>
                        Reclaim Points
                    </Button>
                </Col>
                <Col span={11}></Col>
                <Col span={5}>
                    Balance <span style={{ color: userBalance > 0 ? 'green' : userBalance < 0 ? 'red' : 'grey' }}> ${userBalance} </span>
                    Reclaim Points Sum <span style={{ color: parseFloat(reclaimPointsSum) > parseFloat(userBalance) ? 'red' : 'inherit' }}> ${reclaimPointsSum} </span>
                </Col>
            </Row>
            <Table
                columns={[
                    ...columns,
                    {
                        title: 'Reason / Notes',
                        dataIndex: 'reason_notes',
                        key: 'reason_notes',
                        width: 370,
                        render: (_, record) => (
                            <>
                                <Input
                                    placeholder=""
                                    style={{height: '30px', padding: 4}}
                                    value={reasonNotesValues[record.key] || ''}
                                    onChange={(e) => handleInputChange(record.key, e.target.value)}
                                />
                                { !reasonNotesValues[record.key] && reclaimItems.includes(record.key) &&
                                    <div style={{color: 'red'}}>Please enter a value for the Reason/Notes field.</div>}
                            </>
                        ),
                    },
                ]}
                rowSelection={rowSelection}
                dataSource={dataItems}
            />
        </>
    );
};
