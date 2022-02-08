import { Link } from 'react-router-dom';

import React, { useMemo } from 'react';

export const PROGRAM_COLUMNS = [
    {
        Header: "Merchant",
        accessor: "name",
        Footer:"Total",
    },
    {
        Header: "Total Redemption Value",
        accessor: "total_redemption",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.total_redemption) + sum, 0),
              [rows],
            );
            // const age = Math.round(totalValue / flatRows.length);
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
          },
    },
    {
        Header: "Total Premium",
        accessor: "total_premium",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.total_premium) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
          },
    },
    {
        Header: "Percent Total Redemption Value",
        accessor: "percent_total_redemption_value",
        Cell: ({ row, value }) => { return `${parseFloat(value).toFixed(2)}%`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.percent_total_redemption_value) + sum, 0),
              [rows],
            );
            
            const avg = Math.round(totalValue / flatRows.length);
            return <span>{`${parseFloat(avg).toFixed(2)}%`}</span>;
          },
    },
    {
        Header: "Total Cost",
        accessor: "total_cost",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.total_cost) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
          },
    },
    {
        Header: "Percent Total Cost",
        accessor: "percent_total_cost",
        Cell: ({ row, value }) => { return `${parseFloat(value).toFixed(2)}%`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.percent_total_cost) + sum, 0),
              [rows],
            );
            const avg = Math.round(totalValue / flatRows.length);
            return <span>{`${parseFloat(avg).toFixed(2)}%`}</span>;
          },
    },
    {
        Header: "Average Discount",
        accessor: "average_discount",
        Cell: ({ row, value }) => { return `${parseFloat(value).toFixed(2)}%`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.average_discount) + sum, 0),
              [rows],
            );
            const avg = Math.round(totalValue / flatRows.length);
            return <span>{`${parseFloat(avg).toFixed(2)}%`}</span>;
          },
    },

    
]

