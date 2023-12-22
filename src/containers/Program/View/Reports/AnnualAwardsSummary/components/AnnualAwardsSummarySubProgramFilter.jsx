import React, {FC, useEffect, useState} from 'react';
import {any} from "prop-types";
import {Button, Col, Form, Radio, Row, Select, Space, Switch, Table} from "antd";
import {Option} from "antd/lib/mentions";
import ProgramsHierarchyReport from "../../../../../../shared/components/ProgramsHierarchyReport";

interface AnnualAwardsSummarySubProgramFilterProps
{
    filters: any,
    exportCSV: any,
    programs: any
}

export const defFilter = {
    programs: '',
    viewAllPrograms: false,
    month: '1',
    year: new Date().getFullYear(),
    programId: 0
}

export const AnnualAwardsSummarySubProgramFilter: FC<AnnualAwardsSummarySubProgramFilterProps> = ({programs, filters, exportCSV}) => {
    const [filter, setFilter] = useState(defFilter);
    const [selectYearOptions, setSelectYearOptions] = useState([]);
    const onFinish = (values) => {
        const updatedFilter = {...filter};

        if (values.month) {
            updatedFilter.month = values.month
        }

        if (values.year) {
            updatedFilter.year = values.year
        }

        //console.log(values.programs.join(','))

        if (values.programs) {
            updatedFilter.programs = values.programs.join(',')
        }

        if (values.active) {
            updatedFilter.active = values.active
        }

        filters(updatedFilter);
    };

    useEffect(() => {
        const currentYear = defFilter.year;
        const yearOptions = [];

        for (let i = 0; i < 15; i++) {
            const year = currentYear - i;
            yearOptions.push({ value: String(year), label: String(year) });
        }

        setSelectYearOptions(yearOptions);
    }, []);

    return (<Row className="table-filter-form form action-panel">
        <Form
            name="validate_other"
            onFinish={onFinish}
            initialValues={{}}
        >
            <Row>
                <Col span={8} order={1}>
                    <Form.Item
                        name="programs"
                        label="View for Program">
                        <Select mode="multiple" placeholder="Please select programs">
                            {programs.map(item => (
                                <Option value={item.account_holder_id}>{item.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={1} order={2}></Col>
                <Col span={3} order={3}>
                    <Form.Item name="active"
                               label="Active Merchants"
                               valuePropName="checked"
                               initialValue={defFilter.viewAllPrograms}>
                        <Switch/>
                    </Form.Item>
                </Col>
                <Col span={1} order={4}></Col>
                <Col span={2} order={5}>
                    <Form.Item
                        name="month"
                        initialValue={defFilter.month}
                        label="">
                        <Select
                            options={[
                                { value: '0', label: 'January' },
                                { value: '1', label: 'February' },
                                { value: '2', label: 'March'},
                                { value: '3', label: 'April'},
                                { value: '4', label: 'May'},
                                { value: '5', label: 'June'},
                                { value: '6', label: 'July'},
                                { value: '7', label: 'August'},
                                { value: '8', label: 'September'},
                                { value: '9', label: 'October'},
                                { value: '10', label: 'November'},
                                { value: '11', label: 'December'},
                            ]}
                        />
                    </Form.Item>
                </Col>
                <Col span={1} order={6}></Col>
                <Col span={2} order={7}>
                    <Form.Item
                        name="year"
                        initialValue={defFilter.year}
                        label="">
                        <Select
                            options={selectYearOptions}
                        />
                    </Form.Item>
                </Col>
                <Col span={1} order={8}></Col>
                <Col span={4} order={9}>
                    <Space size="small">
                        <Button type="primary" htmlType="submit">Search</Button>
                        <Button htmlType="reset">Clear</Button>
                        <a style={{fontSize: 12}} onClick={() => {
                            exportCSV();
                        }}>Export to CSV</a>
                    </Space>
                </Col>

            </Row>
        </Form>
    </Row>)
};
export default AnnualAwardsSummarySubProgramFilter;