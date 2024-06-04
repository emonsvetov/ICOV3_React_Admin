import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTable, useFlexLayout } from 'react-table';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { HMI_CONFIGURATION_COLUMNS } from './columns';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const HmiConfigurationTable = () => {
    const [data, setData] = useState([]);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const history = useHistory();

    const fetchData = async () => {
        try {
            const result = await axios.get(`/hmi`);
            setData(result.data.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteClick = useCallback((id) => {
        setSelectedId(id);
        setDeleteModalOpen(true);
    }, []);

    const handleEditClick = useCallback((id) => {
        history.push(`/hmi/edit/${id}`);
    }, [history]);

    const handleAddClick = () => {
        history.push(`/hmi/create`);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/hmi/delete/${selectedId}`);
            await fetchData();
            setDeleteModalOpen(false);
            alert(`HMI configuration with ID ${selectedId} has been successfully deleted.`);
        } catch (error) {
            alert(`Failed to delete configuration: ${error.message}`);
        }
    };

    const columns = useMemo(() => HMI_CONFIGURATION_COLUMNS(handleEditClick, handleDeleteClick), [handleEditClick, handleDeleteClick]);

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
            <button onClick={handleAddClick} className="btn btn-primary" style={{ marginBottom: '10px' }}>Add HMI Configuration</button>
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
            />
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

export default HmiConfigurationTable;
