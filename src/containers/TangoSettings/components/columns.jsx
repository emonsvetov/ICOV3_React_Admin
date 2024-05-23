import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '@/shared/helpers';

export const CONFIGURATION_COLUMNS = (handleDeleteClick) => [
    // {
    //     Header: "Name",
    //     accessor: "name",
    //     width: 120,
    // },
    {
        Header: "Platform Name",
        accessor: "platform_name",
        width: 120,
    },
    {
        Header: "Account Number",
        accessor: "account_number",
        width: 140,
    },
    {
        Header: "Email Template",
        accessor: "etid",
        width: 120,
    },
    {
        Header: "UTID",
        accessor: "udid",
        width: 100,
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
        width: 100,
    },
    {
        Header: "Created At",
        accessor: "created_at",
        Cell: ({ value }) => formatDate(value),
        width: 100,
    },
    {
        id: 'actions',
        Header: "Actions",
        Cell: ({ row }) => (
            <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                <Link to={`/tango-settings/view/${row.original.id}`} className="btn btn-sm btn-primary action-link" aria-label={`View configuration ${row.original.platform_name}`}>
                    View
                </Link>
                &nbsp;|&nbsp;
                <Link
                    to={`/tango-settings/edit/${row.original.id}`}
                    className="btn btn-sm btn-primary action-link"
                    aria-label={`Edit configuration ${row.original.platform_name}`}
                >
                    Edit
                </Link>
                &nbsp;|&nbsp;
                <button
                    onClick={() => handleDeleteClick(row.original.id)}
                    className="btn btn-sm btn-primary action-button"
                    aria-label={`Delete configuration ${row.original.platform_name}`}
                >
                    Delete
                </button>
            </div>
        ),
        disableSortBy: true,
        width: 310,
    },
];

<style>
    {`
        .btn:not(:disabled):not(.disabled) {
            cursor: pointer;
        }
        .btn.btn-primary {
            background-color: #70bbfd;
            border-color: #70bbfd;
        }
        .btn.btn-sm {
            padding: 5px 25px;
            font-size: 14px;
        }
        .action-link, .action-button {
            text-decoration: none;
            color: white;
            display: inline-block;
            margin: 5px;
        }
    `}
</style>