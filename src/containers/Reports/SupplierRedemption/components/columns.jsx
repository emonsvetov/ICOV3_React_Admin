import { Link } from 'react-router-dom';

import React, { useMemo } from 'react';

export const TABLE_COLUMNS = [
    {
        Header: "Merchant",
        accessor: "name",
        Footer:"Total",
    },
    {
        Header: "Total Redemption Value",
        accessor: "total_redemption_value",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.total_redemption_value) + sum, 0),
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
            
            const avg = flatRows.length > 0 ? Math.round(totalValue / flatRows.length) : 0;
            return <span>{`${parseFloat(avg).toFixed(2)}%`}</span>;
          },
    },
    {
        Header: "Total Cost",
        accessor: "total_cost_basis",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.total_cost_basis) + sum, 0),
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
            const avg = flatRows.length > 0 ? Math.round(totalValue / flatRows.length) : 0;
            return <span>{`${parseFloat(avg).toFixed(2)}%`}</span>;
          },
    },
    {
        Header: "Average Discount",
        accessor: "avg_discount_percent",
        Cell: ({ row, value }) => { return `${parseFloat(value).toFixed(2)}%`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.avg_discount_percent) + sum, 0),
              [rows],
            );
            const avg = flatRows.length > 0 ? totalValue / flatRows.length : 0;
            return <span>{`${parseFloat(avg).toFixed(2)}%`}</span>;
          },
    },

    
]

