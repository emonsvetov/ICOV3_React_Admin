import { Link } from 'react-router-dom';

import React, { useMemo } from 'react';

export const PROGRAM_COLUMNS = [
    {
        Header: "Program",
        accessor: "name",
        Footer:"Page Total",
    },
    {
        Header: "Awarded",
        accessor: "awarded",
        Cell: ({ row, value }) => { return `$${parseFloat(value)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.awarded) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue)}`}</span>;
          },
    },
    {
        Header: "Expired",
        accessor: "expired",
        Cell: ({ row, value }) => { return `$${parseFloat(value)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.expired) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue)}`}</span>;
          },
    },
    {
        Header: "Reclaimed",
        accessor: "reclaimed",
        Cell: ({ row, value }) => { return `$${parseFloat(value)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.reclaimed) + sum, 0),
              [rows],
            );
            
            return <span>{`$${parseFloat(totalValue)}`}</span>;
          },
    },
    {
        Header: "Redeemed",
        accessor: "redeemed",
        Cell: ({ row, value }) => { return `$${parseFloat(value)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.redeemed) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue)}`}</span>;
          },
    },
    {
        Header: "Unredeemed",
        accessor: "unredeemed",
        Cell: ({ row, value }) => { return `$${parseFloat(value)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.unredeemed) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue)}`}</span>;
          },
    },
    {
        Header: "Paid",
        accessor: "paid",
        Cell: ({ row, value }) => { return `$${parseFloat(value)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.paid) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue)}`}</span>;
          },
    },
    {
        Header: "Balance",
        accessor: "balance",
        Cell: ({ row, value }) => { return `$${parseFloat(value)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.balance) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue)}`}</span>;
          },
    },
    {
        Header: "Reserve %",
        accessor: "reserve_percent",
        Cell: ({ row, value }) => { return `${parseFloat(value)}%`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.reserve_percent) + sum, 0),
              [rows],
            );
            const avg = Math.round(totalValue / flatRows.length);
            return <span>{`${parseFloat(avg)}%`}</span>;
          },
    },
    {
        Header: "Calculated Reserve",
        accessor: "calculated_reserve",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.calculated_reserve) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
          },
    },
    
]

