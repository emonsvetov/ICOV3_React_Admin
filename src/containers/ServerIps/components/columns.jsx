import React from 'react';
import { Link } from 'react-router-dom';

const formatDate = (dateString) => {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-');
    const [hour, minute, second] = timePart.split(':');

    const padToTwoDigits = (number) => number.toString().padStart(2, '0');
    const formattedDate = `${padToTwoDigits(day)}-${padToTwoDigits(month)}-${year}`;
    const formattedTime = `${padToTwoDigits(hour)}:${padToTwoDigits(minute)}:${padToTwoDigits(second)}`;

    return `${formattedDate} ${formattedTime}`;
};

export const SERVER_IP_COLUMNS = (handleViewClick) => [
    {
        Header: "IP",
        accessor: "ip",
    },
    {
        Header: "Comment",
        accessor: "comment",
    },
    {
        Header: "Target",
        accessor: "target_name",
    },
    {
        Header: "Updated By",
        accessor: "updated_by",
        Cell: ({ row }) => `${row.original.first_name} ${row.original.last_name} (${row.original.email})`,
    },
    {
        Header: "Created At",
        accessor: "created_at",
        Cell: ({ value }) => formatDate(value),
    },
    {
        Header: "Updated At",
        accessor: "updated_at",
        Cell: ({ value }) => formatDate(value),
    },
    {
        id: 'actions',
        Header: "Actions",
        Cell: ({ row }) => (
            <div style={{ textAlign: 'left', display: 'flex', justifyContent: 'flex-start', gap: '5px' }}>
                <Link
                    to={`/server-ips/view/${row.original.id}`}
                    className="btn btn-sm btn-primary action-link"
                    aria-label={`View server IP ${row.original.ip}`}
                >
                    View
                </Link>
            </div>
        ),
        disableSortBy: true,
        width: 150,
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
