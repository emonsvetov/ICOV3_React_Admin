import React, {FC, useEffect, useState} from 'react';
import {Table} from 'antd';

interface SupplierRedemptionTableProps
{
    dataReport:any,

}

const SupplierRedemptionTable: FC<SupplierRedemptionTableProps> = ({dataReport}) => {

    const [columns, setColumns] = useState([]);
    const [thColumns, setThColumns] = useState([{key:1}]);
    const [data, setData] = useState([{key:1}]);

    useEffect(() => {
        setColumns(dataReport.config.columns);
        setThColumns(dataReport.config.columns);
        var dataArray = Object.values(dataReport.data);
        setData(dataArray)
    }, [dataReport])

    return (<>
        <Table
            style={{fontFamily: "Roboto", fontSize: '13px', lineHeight: '1.6'}}
            columns={thColumns}
            dataSource={data}
            pagination={false}
            scroll={{x: 2000, y: null}}
            bordered
            className='table'
            summary={() => {
                if (data.length) {
                    return <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                            {columns.map(item => (
                                item.footer !== 'Total' && (
                                    <Table.Summary.Cell index={item.key}>{item.footer}</Table.Summary.Cell>)
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

export default SupplierRedemptionTable;
