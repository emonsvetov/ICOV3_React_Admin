import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTable, useFlexLayout } from 'react-table';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { SERVER_IP_COLUMNS } from './columns';

const ServerIpsTable = () => {
    const [data, setData] = useState([]);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const history = useHistory();

    const fetchData = async () => {
        try {
            const result = await axios.get(`/server-ips`);
            setData(result.data.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleViewClick = useCallback((id) => {
        history.push(`/server-ips/view/${id}`);
    }, [history]);

    const columns = useMemo(() => SERVER_IP_COLUMNS(handleViewClick), [handleViewClick]);

    const tableInstance = useTable(
        { columns, data },
        useFlexLayout
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = tableInstance;

    return (
        <div>
            <button onClick={() => history.push("/server-ips/create")} className="btn btn-primary">Add Server IP</button>
            <table {...getTableProps()} className="table">
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            ))}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default ServerIpsTable;
