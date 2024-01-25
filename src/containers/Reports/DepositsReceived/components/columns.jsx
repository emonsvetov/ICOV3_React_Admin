import { Link } from 'react-router-dom';
import React, { useMemo } from 'react';

export const TABLE_COLUMNS = [
    {
        Header: "Program Name",
        accessor: "name",
        Footer: "Total",
    },
    {
        Header: "Date of deposit",
        accessor: "date_paid",
    },
    {
        Header: "Amount of deposit",
        accessor: "amount",
    },
    {
        Header: "Notes",
        accessor: "notes",
    },
    {
        Header: "Invoice",
        accessor: "invoice_number",
    },
];


