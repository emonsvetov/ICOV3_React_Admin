import React, {FC, useEffect, useState} from 'react';
import {Table, Input, Button, Col, Row,Tooltip} from 'antd';
import {InfoCircleOutlined} from "@ant-design/icons";
import type { TableColumnsType } from 'antd';
import axios from "axios";

interface ReclaimPointsProps {
    user: any;
    organization: any;
    program: any;
}

const columns: TableColumnsType<DataType> = [
    { title: 'Points Value', dataIndex: 'points_value', key: 'points_value' },
    { title: 'Date Awarded', dataIndex: 'date_awarded', key: 'date_awarded' },
    { title: 'Event', dataIndex: 'event', key: 'event' },
    { title: 'Award Credit', dataIndex: 'award_credit', key: 'award_credit' },
    { title: ' Expiration Date', dataIndex: 'expiration_date', key: 'expiration_date', render: (text, record) => (
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

    const handleReclaimPoints = () => {
        reclaimItems.map(value => {
            if (reasonNotesValues[value]){
                reclaim(value, reasonNotesValues[value]);
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
        } catch (e) {
        }
    }

    const reclaim = async (postingId, notes) => {
        try {
            const response = await axios.post(`/organization/` + organization.id + `/user/reclaim`, {
                userId: user.id,
                programId: program.id,
                postingId: postingId,
                notes: notes,
            });
            getDataReport();
        } catch (e) {
        }
    }

    useEffect(() => {
        getDataReport();
    }, [])

    return (
        <>
            <Row style={{marginBottom: 10}}>
                <Col span={8}>
                    <Button type="primary" onClick={handleReclaimPoints}>
                        Reclaim Points
                    </Button>
                </Col>
                <Col span={8} offset={8}>
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
