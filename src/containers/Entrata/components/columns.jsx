import React from 'react';
import { Button } from 'reactstrap';

export const ENTRATA_CONFIGURATION_COLUMNS = () => [
    {
        Header: "ID",
        accessor: "id",
    },
    {
        Header: "URL",
        accessor: "url",
    },
    {
        Header: "Program ID",
        accessor: "program_id",
    },
    {
        Header: "Entrata Property ID",
        accessor: "entrata_property_id",
    },
    {
        Header: "Username",
        accessor: "username",
    },
    {
        Header: "User Type",
        accessor: "user_type",
    },
    {
        Header: "Created At",
        accessor: "created_at",
        Cell: ({ value }) => new Date(value).toLocaleString(),
    },
    {
        Header: "Actions",
        Cell: ({ row, verifyConnection }) => (
            <div>
                <Button
                    color="primary"
                    onClick={() => verifyConnection(row.original)}
                >
                    Verify Connection
                </Button>
            </div>
        ),
    },
];

const styles = `
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
    .action-link, .action-button {
        text-decoration: none;
        color: white;
        display: inline-block;
        margin: 5px;
    }
`;

export default styles;
