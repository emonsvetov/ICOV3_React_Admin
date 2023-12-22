import React, {FC, useEffect, useState} from 'react';
import {any} from "prop-types";
import {Table} from "antd";
import { Typography } from 'antd';
const { Title } = Typography;

interface AnnualAwardsSummarySubProgramTableProps
{
    dataReport: any
}

export const AnnualAwardsSummarySubProgramTable: FC<AnnualAwardsSummarySubProgramTableProps> = ({dataReport}) => {
    const [columns,setColumns] = useState([]);
    const [data,setData] = useState([]);
    const [total,setTotal] = useState([]);
    const [title,setTitle] = useState('');


    useEffect(() => {
        setColumns(dataReport.columans);
        setData(dataReport.data);
        setTotal(dataReport.total);
        setTitle(dataReport.title);
    }, [dataReport])

    return (<>
        <Title level={5}>{title}</Title>
        <Table
            style={{fontFamily: "Roboto", fontSize: '13px', lineHeight: '1.6'}}
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            className='table'
            summary={() => {
                if (data.length) {
                    return <Table.Summary fixed>
                        <Table.Summary.Row>
                            {columns.map(item => (
                                <Table.Summary.Cell index={item.key}>{total[item.key]}</Table.Summary.Cell>
                            ))}
                        </Table.Summary.Row>
                    </Table.Summary>
                } else {
                    return false;
                }
            }}
        />
    </>);
};
export default AnnualAwardsSummarySubProgramTable;