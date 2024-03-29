import { Link } from 'react-router-dom';
import React, { useMemo } from 'react';
import { formatDate } from '../../../../shared/helpers';
export const PROGRAM_COLUMNS = [
   
    {
        Header: "Program Name",
        accessor: "name",
        Footer:"Total",
        
        // sticky:'left'
    },
    {
        Header: "Program ID",
        accessor: "account_holder_id",
        Footer:"",
        maxWidth: 100,
    },
    {
        Header: "Root Program Name",
        accessor: "root_name",
    },
    {
        Header: "Invoice Number",
        accessor: "invoice_num",
        Cell: ({ row, value }) => { return <Link to={`/program/view/${row.original.id}`}>{value}</Link>},
    },
    {
        Header: "Monies Deposited",
        accessor: "monies_deposited",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.monies_deposited) + sum, 0),
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
        accessor: "posting_date",
        Cell: ({ row, value }) => { return formatDate(value); },
    },
    {
        Header: "Posted By",
        accessor: "posted_by",
    },
]

