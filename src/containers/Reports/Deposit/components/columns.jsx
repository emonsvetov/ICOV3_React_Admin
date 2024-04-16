import { Link } from 'react-router-dom';
import React, { useMemo } from 'react';
import { formatDate } from '../../../../shared/helpers';
export const PROGRAM_DEPOSIT_COLUMNS = [
   
    {
        Header: "Program Name",
        accessor: "name",
        Footer:"Total",
        
        // sticky:'left'
    },
    {
        Header: "Program ID",
        accessor: "id",
        Footer:"",
        maxWidth: 100,
    },
    {
        Header: "Root Program Name",
        accessor: "root_name",
    },
    {
        Header: "Invoice Number",
        accessor: "invoice_number",
        Cell: ({ row, value }) => { return <Link to={`/program/view/${row.original.id}`}>{value}</Link>},
    },
    {
        Header: "Monies Deposited",
        accessor: "amount",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.amount) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Deposit Fee",
        accessor: "deposit_fee",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(4)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.deposit_fee) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Posting Date",
        accessor: "date_paid",
        Cell: ({ row, value }) => { return formatDate(value); },
    },
    {
        Header: "Posted By",
        accessor: "admin",
    },
]

