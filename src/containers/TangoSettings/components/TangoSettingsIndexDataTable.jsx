import React, { useState, useEffect, useMemo, useCallback } from "react";
import {useTable, useFlexLayout, useSortBy, usePagination} from 'react-table';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { StickyContainer, Sticky } from 'react-sticky';
import { CONFIGURATION_COLUMNS } from './columns';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import {Sorting} from "@/shared/apiTableHelper"

const TangoSettingsTable = () => {
    const [data, setData] = useState([]);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const history = useHistory();

    const fetchData = async () => {
        try {
            const result = await axios.get(`/tango-settings`);
            setData(result.data);
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
        history.push(`/tango-settings/edit/${id}`);
    }, [history]);

    const handleViewClick = useCallback((id) => {
        history.push(`/tango-settings/view/${id}`);
    }, [history]);

    const handleAddClick = () => {
        history.push("/tango-settings/create");
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/tango-settings/delete/${selectedId}`);
            fetchData();
            setDeleteModalOpen(false);
            alert(`Configuration with ID ${selectedId} has been successfully deleted.`);
        } catch (error) {
            alert(`Failed to delete configuration: ${error.message}`);
        }
    };

    const columns = useMemo(() => CONFIGURATION_COLUMNS(handleDeleteClick, handleEditClick, handleViewClick), [handleDeleteClick, handleEditClick, handleViewClick]);

    const tableInstance = useTable(
        { columns: columns, data },
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
            <button onClick={() => history.push("/tango-settings/create")} className="btn btn-primary">Add Tango Configuration</button>
            <ConfirmDeleteModal
                    isOpen={isDeleteModalOpen}
                    onCancel={() => setDeleteModalOpen(false)}
                    onConfirm={() => confirmDelete()}
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

export default TangoSettingsTable;