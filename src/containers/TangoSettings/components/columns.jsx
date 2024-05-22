import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '@/shared/helpers';

export const CONFIGURATION_COLUMNS = (handleDeleteClick, handleEditClick) => [
    {
        Header: "Name",
        accessor: "platform_name",
        width: 150,
    },
    {
        Header: "Account Number",
        accessor: "account_number",
        width: 130,
    },
    {
        Header: "Email Template",
        accessor: "etid",
        width: 90,
    },
    {
        Header: "UTID",
        accessor: "udid",
        width: 80,
    },
    {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => value === 1 ? 'Active' : 'Inactive',
        width: 100,
    },
    {
        Header: "Test Configuration",
        accessor: "is_test",
        Cell: ({ value }) => value === 1 ? 'Yes' : 'No',
        width: 150,
    },
    {
        Header: "Created At",
        accessor: "created_at",
        Cell: ({ value }) => formatDate(value),
        width: 140,
    },
    {
        id: 'actions',
        Header: "Actions",
        Cell: ({ row }) => (
            <div style={{ textAlign: 'center' }}>
                <Link
                    to={`/tango-settings/edit/${row.original.id}`}
                    className="edit-link"
                    aria-label={`Edit configuration ${row.original.platform_name}`}
                >
                    Edit
                </Link>
                &nbsp;|&nbsp;
                <button
                    onClick={() => handleDeleteClick(row.original.id)}
                    className="delete-link"
                    aria-label={`Delete configuration ${row.original.platform_name}`}
                >
                    Delete
                </button>
            </div>
        ),
        disableSortBy: true,
        width: 160,
    },
];
