import React from 'react';
import { Link } from 'react-router-dom';

export const HMI_CONFIGURATION_COLUMNS = (handleEditClick, handleDeleteClick) => [
    {
        Header: "HMI Name",
        accessor: "hmi_name",
    },
    {
        Header: "HMI Username",
        accessor: "hmi_username",
    },
    {
        Header: "HMI URL",
        accessor: "hmi_url",
    },
    {
        Header: "Test Configuration",
        accessor: "hmi_is_test",
        Cell: ({ value }) => value === 1 ? 'Yes' : 'No',
    },
    {
        Header: "Created At",
        accessor: "created_at",
        Cell: ({ value }) => new Date(value).toLocaleString(),
    },
    {
        id: 'actions',
        Header: "Actions",
        Cell: ({ row }) => (
            <div style={{ textAlign: 'left', display: 'flex', justifyContent: 'flex-start', gap: '5px' }}>
                <Link to={`/hmi/edit/${row.original.id}`} className="btn btn-sm btn-primary action-link" aria-label={`Edit configuration ${row.original.hmi_name}`}>
                    Edit
                </Link>
                <button
                    onClick={() => handleDeleteClick(row.original.id)}
                    className="btn btn-sm btn-danger action-button"
                    aria-label={`Delete configuration ${row.original.hmi_name}`}
                >
                    Delete
                </button>
            </div>
        ),
        disableSortBy: true,
        width: 300,
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
        .btn.btn-danger {
            background-color: #dc3545;
            border-color: #dc3545;
        }
        .btn.btn-sm {
            padding: 5px 18px;
            font-size: 12px;
        }
        .action-link, .action-button {
            text-decoration: none;
            color: white;
            display: inline-block;
            margin: 5px;
        }
    `}
</style>
