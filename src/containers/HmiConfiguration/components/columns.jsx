import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '@/shared/helpers';

export const HMI_CONFIGURATION_COLUMNS = (handleEditClick) => [
    {
        Header: "Name",
        accessor: "hmi_name",
    },
    {
        Header: "Username",
        accessor: "hmi_username",
    },
    {
        Header: "URL",
        accessor: "hmi_url",
    },
    {
        Header: "Test Configuration",
        accessor: "hmi_is_test",
        Cell: ({ value }) => parseInt(value) === 1 ? 'Yes' : 'No',
    },
    {
        Header: "Created At",
        accessor: "created_at",
        Cell: ({ value }) => formatDate(value),
    },
    {
        id: 'actions',
        Header: "Actions",
        Cell: ({ row }) => (
            <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                <Link to={`/hmi/edit/${row.original.id}`} className="btn btn-sm btn-primary action-link" aria-label={`Edit configuration ${row.original.hmi_name}`}>
                    Edit
                </Link>
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
        .btn.btn-sm {
            padding: 5px 18px;
            font-size: 12px;
        }
        .action-link {
            text-decoration: none;
            color: white;
            display: inline-block;
            margin: 5px;
        }
    `}
</style>
