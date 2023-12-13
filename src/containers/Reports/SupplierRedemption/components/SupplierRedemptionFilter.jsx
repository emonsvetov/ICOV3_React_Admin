import React, {FC, useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {
    Button,
    DatePicker,
    Col,
    ColorPicker, Flex,
    Form,
    InputNumber,
    Radio,
    Rate,
    Row,
    Select,
    Slider,
    Space,
    Switch,
    Upload,
} from 'antd';
import {any} from "prop-types";
import {CSVLink} from "react-csv";

const { Option } = Select;

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 20 },
};


interface SupplierRedemptionFilterProps {
    filters: any,
        merchants: any,
        exportCSV: any,
}

export const defFilter = {
    merchants: null,
    from: '2022-12-31',
    to: '2023-12-06',
    active: true,
    reportKey: 'sku_value',
    codes: null,
    programId: 0,
}

export const SupplierRedemptionFilter: FC<SupplierRedemptionFilterProps> = ({filters, merchants,exportCSV}) => {
    const [filter, setFilter] = useState(defFilter);

    const onFinish = (values: any) => {
        const updatedFilter = {...filter};

        if (values.from){
            updatedFilter.from = values.from.format('YYYY-MM-DD');
        }

        if (values.to) {
            updatedFilter.to = values.to.format('YYYY-MM-DD');
        }

        if (values.merchants) {
            updatedFilter.merchants = values.merchants.join(', ');
        }

        if (values.active) {
            updatedFilter.active = values.active;
        } else {
            updatedFilter.active = values.active;
        }

        if (values.reportKey) {
            updatedFilter.reportKey = values.reportKey;
        }
        if (values.codes) {
            updatedFilter.codes = values.codes;
        }

        filters(updatedFilter);
    };

    const dateFormat = 'YYYY/MM/DD';

    return (<Row className="table-filter-form form action-panel">
        <Form
            name="validate_other"
            {...formItemLayout}
            onFinish={onFinish}
            initialValues={{}}
        >
            <Row>
                <Col span={6} order={4}>
                    <Form.Item
                        name="reportKey"
                        label=""
                        initialValue={defFilter.reportKey}
                        style={{width: 300}}
                    >
                        <Radio.Group>
                            <Radio.Button value="sku_value">Sku Value</Radio.Button>
                            <Radio.Button value="redemption_value">Redemption Value</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={6} order={3}>
                    <Form.Item
                        name="from"
                        label="From"
                        initialValue={dayjs(defFilter.from, dateFormat)}
                    >
                        <DatePicker format="DD/MM/YYYY"/>
                    </Form.Item>
                </Col>
                <Col span={6} order={2}>
                    <Form.Item
                        name="to"
                        label="To"
                        initialValue={dayjs(defFilter.to, dateFormat)}
                    >
                        <DatePicker format="DD/MM/YYYY"/>
                    </Form.Item>
                </Col>
                <Col span={6} order={1}>
                    <Form.Item name="codes"
                               label="Show"
                               valuePropName="checked"
                               initialValue={defFilter.codes}>
                        <Select allowClear placeholder="Please select a value">
                            <Option value="0">Real Codes</Option>
                            <Option value="1">Virtual Codes</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <Col span={8} order={1}>
                    <Form.Item
                        name="merchants"
                        label="Merchants"
                        //initialValue={defFilter.merchants}
                    >
                        <Select mode="multiple" placeholder="Please select merchants">
                            {merchants.map(item => (
                                <Option key={item.id} value={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={10} order={2}>
                    <Form.Item name="active"
                               label="Active Merchants"
                               valuePropName="checked"
                               initialValue={defFilter.active}
                    >
                        <Switch/>
                    </Form.Item>
                </Col>

                <Col span={6} order={3}>
                    <Space size="small">
                        <Button type="primary" htmlType="submit">Search</Button>
                        <Button htmlType="reset" >Clear</Button>
                        <a style={{fontSize: 12}} onClick={() => {exportCSV();}}>Export to CSV</a>
                    </Space>
                </Col>

            </Row>
        </Form>
    </Row>)
};
export default SupplierRedemptionFilter;