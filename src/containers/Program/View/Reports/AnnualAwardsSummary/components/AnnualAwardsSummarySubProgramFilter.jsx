import React, {FC, useEffect, useState} from 'react';
import {any} from "prop-types";
import {Button, Col, Form, Radio, Row, Select, Space, Switch, Table, TreeSelect} from "antd";

const { SHOW_PARENT } = TreeSelect;

interface AnnualAwardsSummarySubProgramFilterProps
{
    filters: any,
    programs: any
}

export const defFilter = {
    programs: '',
    viewAllPrograms: true,
    month: '1',
    year: new Date().getFullYear(),
    programId: 0,
    exportToCsv: 0,
}

export const AnnualAwardsSummarySubProgramFilter: FC<AnnualAwardsSummarySubProgramFilterProps> = ({programs, filters}) => {
    const [filter, setFilter] = useState(defFilter);
    const [selectYearOptions, setSelectYearOptions] = useState([]);
    const [value, setValue] = useState([]);
    const [treeData, setTreeData] = useState(programs);
    const [eCsv, setECsv] = useState(0);
    const onFinish = (values) => {
        const updatedFilter = {...filter};

        if (values.month) {
            updatedFilter.month = values.month
        }

        if (values.year) {
            updatedFilter.year = values.year
        }

        if (values.programs) {
            updatedFilter.programs = values.programs.map(item => item.value).join(',');
        }

        if (values.active) {
            updatedFilter.active = values.active
        }

        if (eCsv){
            updatedFilter.exportToCsv = 1;
        }else {
            updatedFilter.exportToCsv = 0;
        }
        filters(updatedFilter);
        setECsv(0);
    };

    useEffect(() => {
        setTreeData(programs);
    }, [programs])

    useEffect(() => {
        const currentYear = defFilter.year;
        const yearOptions = [];
        setTreeData(programs);
        for (let i = 0; i < 15; i++) {
            const year = currentYear - i;
            yearOptions.push({ value: String(year), label: String(year) });
        }

        setSelectYearOptions(yearOptions);
    }, []);

    const tProps = {
        treeData,
        value,
        treeCheckable: true,
        showCheckedStrategy: SHOW_PARENT,
        placeholder: 'Please select',
        style: {
            width: '100%',
        },
        treeCheckStrictly: true,
    };


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
                        <TreeSelect {...tProps} />
                    </Form.Item>
                </Col>
                <Col span={1} order={2}></Col>
                <Col span={3} order={3}>
                    <Form.Item name="active"
                               label="Active Programs"
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
                                { value: '1', label: 'January' },
                                { value: '2', label: 'February' },
                                { value: '3', label: 'March'},
                                { value: '4', label: 'April'},
                                { value: '5', label: 'May'},
                                { value: '6', label: 'June'},
                                { value: '7', label: 'July'},
                                { value: '8', label: 'August'},
                                { value: '9', label: 'September'},
                                { value: '10', label: 'October'},
                                { value: '11', label: 'November'},
                                { value: '12', label: 'December'},
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
                        <Button type="link" htmlType="submit" onClick={()=>{
                            setECsv(1);
                        }}>Export to CSV</Button>
                    </Space>
                </Col>
            </Row>
        </Form>
    </Row>)
};
export default AnnualAwardsSummarySubProgramFilter;