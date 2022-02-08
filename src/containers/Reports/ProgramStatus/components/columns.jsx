import { Link } from 'react-router-dom';

import React, { useMemo } from 'react';

export const PROGRAM_COLUMNS = [
    {
        Header: "Program",
        accessor: "name",
        Footer:"Page Total",
    },
    {
        Header: "# of Participants",
        accessor: "num_participants",
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.num_participants) + sum, 0),
              [rows],
            );
            // const age = Math.round(totalValue / flatRows.length);
            return <span>{totalValue}</span>;
          },
    },
    {
        Header: "# of Units with Participants",
        accessor: "num_units_participants",
        
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.num_units_participants) + sum, 0),
              [rows],
            );
            return <span>{totalValue}</span>;
          },
    },
    {
        Header: "% of Units with Participants",
        accessor: "percent_units_participants",
        Cell: ({ row, value }) => { return `${parseFloat(value)}%`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.percent_units_participants) + sum, 0),
              [rows],
            );
            const avg = Math.round(totalValue / flatRows.length);
            return <span>{`${parseFloat(avg).toFixed(2)}%`}</span>;
          },
    },
    {
        Header: "# Activated",
        accessor: "num_activated",
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.num_activated) + sum, 0),
              [rows],
            );
            return <span>{totalValue}</span>;
          },
    },
    {
        Header: "% Activated",
        accessor: "percent_activated",
        Cell: ({ row, value }) => { return `${parseFloat(value)}%`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.percent_activated) + sum, 0),
              [rows],
            );
            const avg = Math.round(totalValue / flatRows.length);
            return <span>{`${parseFloat(avg).toFixed(2)}%`}</span>;
          },
    },
    {
        Header: "# Awards",
        accessor: "num_awards",
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.num_awards) + sum, 0),
              [rows],
            );
            return <span>{totalValue}</span>;
          },
    },
    {
        Header: "$ Value of Awards",
        accessor: "value_awards",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.value_awards) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
          },
    },
    {
        Header: "Avg $ Value of Awards",
        accessor: "avg_value_awards",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.avg_value_awards) + sum, 0),
              [rows],
            );
            const avg = Math.round(totalValue / flatRows.length);
            return <span>{`$${parseFloat(avg).toFixed(2)}`}</span>;
          },
    },
    {
        Header: "Deposit Balance",
        accessor: "deposit_balance",
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.deposit_balance) + sum, 0),
              [rows],
            );
            return <span>{totalValue}</span>;
          },
    },


    
]

