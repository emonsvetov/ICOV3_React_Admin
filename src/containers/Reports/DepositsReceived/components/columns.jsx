import { Link } from 'react-router-dom';
import React, { useMemo } from 'react';
import { formatMMYYDD } from '../../../../shared/helpers';
export const TABLE_COLUMNS = [
    {
        Header: "Program Name",
        accessor: "name",
        Footer: "Total",
    },
    {
        Header: "Date of deposit",
        accessor: "date_paid",
        Cell: ({ row, value }) => { return formatMMYYDD(value); },
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


