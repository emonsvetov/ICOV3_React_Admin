import { Link } from 'react-router-dom';
// import {format} from 'date-fns'
import React, { useMemo } from 'react';

import ChevronUpIcon from 'mdi-react/ChevronUpIcon';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';

// import { ColumnFilter } from "./ColumnFilter"

export const PROGRAM_COLUMNS = [
    {
        // Build our expander column
        id: 'expander', // Make sure it has an ID
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
          <span {...getToggleAllRowsExpandedProps()}>
            {isAllRowsExpanded ? 'Collpase All' : 'Expand All'}
          </span>
        ),
        Cell: ({ row }) =>
          // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
          // to build the toggle for expanding a row
          row.canExpand ? (
            <span
              {...row.getToggleRowExpandedProps({
                style: {
                  // We can even use the row.depth property
                  // and paddingLeft to indicate the depth
                  // of the row
                  paddingLeft: `${row.depth * 2}rem`,
                },
              })}
            >
              {row.isExpanded ? <ChevronUpIcon className="chevron-expand" /> : <ChevronRightIcon className="chevron-expand" />}
            </span>
        ) : null,
    },
    {
        Header: "Program",
        accessor: "name",
        Footer:"Total",
        Cell: ({ row, value }) => { return <Link to={`/program/view/${row.original.id}`}>{value}</Link>},
    },
    {
        Header: "Eligible Participants",
        accessor: "eligible_participants",
        Footer: (info) => {
            const { rows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.eligible_participants) + sum, 0),
              [rows],
            );
            return <span>{totalValue}</span>;
        },
    },
    {
        Header: "Jan",
        accessor: "jan",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.jan) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Feb",
        accessor: "feb",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.feb) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Mar",
        accessor: "mar",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.mar) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Apr",
        accessor: "apr",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.apr) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "May",
        accessor: "may",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.may) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Jun",
        accessor: "jun",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.jun) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Jul",
        accessor: "jul",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.jul) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Aug",
        accessor: "aug",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.aug) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Sep",
        accessor: "sep",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.sep) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "oct",
        accessor: "oct",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.oct) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Nov",
        accessor: "nov",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.nov) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Dec",
        accessor: "dec",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.dec) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "YTD",
        accessor: "ytd",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.ytd) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Per Participant",
        accessor: "per_participant",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.per_participant) + sum, 0),
              [rows],
            );
            const avg = Math.round(totalValue / flatRows.length);
            return <span>{`$${parseFloat(avg).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Avg Per Month",
        accessor: "avg_per_month",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.avg_per_month) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Monthly Target",
        accessor: "monthly_target",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.monthly_target) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Annual Target",
        accessor: "annual_target",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        Footer: (info) => {
            const { rows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.annual_target) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    
]

