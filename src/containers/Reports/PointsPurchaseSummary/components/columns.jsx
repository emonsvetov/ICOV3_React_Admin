import {Link} from 'react-router-dom';
// import {format} from 'date-fns'
import React, {useMemo} from 'react';

import ChevronUpIcon from 'mdi-react/ChevronUpIcon';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';
import AddIcon from 'mdi-react/AddIcon';
import MinusIcon from 'mdi-react/MinusIcon';

// import { ColumnFilter } from "./ColumnFilter"

export const PROGRAM_COLUMNS = [
    {
        // Build our expander column
        id: 'expander', // Make sure it has an ID
        Header: ({getToggleAllRowsExpandedProps, isAllRowsExpanded}) => (
          <span {...getToggleAllRowsExpandedProps()}>
            {isAllRowsExpanded ? '' : ''}
          </span>
        ),
        Cell: ({row}) =>
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
              {row.isExpanded ? <MinusIcon className="chevron-expand"/> : <AddIcon className="chevron-expand"/>}
            </span>
          ) : null,
        width: 100
    },
    {
        Header: "Program",
        accessor: "name",
        Footer: "Total",
        Cell: ({row, value}) => {
            const space = row.original.dinamicDepth === 1 ? '' : ' • ';
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{space.repeat(row.original.dinamicDepth)}<Link
              to={`/program/view/${row.original.id}`}>{value}</Link></div>
        },
        width: 200,
        className: 'frozenColumn',
    },
    {
        Header: "Program Account Holder ID",
        accessor: "account_holder_id",
        Footer:"",
        width: 125,
    },
    {
        Header: "Eligible Participants",
        accessor: "participants_count",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{value}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.participants_count) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{totalValue}</span>;
        },
    },
    {
        Header: "Jan",
        accessor: "month_1",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.month_1) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },

    },
    {
        Header: "Feb",
        accessor: "month_2",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.month_2) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Mar",
        accessor: "month_3",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.month_3) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Apr",
        accessor: "month_4",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.month_4) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "May",
        accessor: "month_5",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.month_5) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Jun",
        accessor: "month_6",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.month_6) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Jul",
        accessor: "month_7",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.month_7) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Aug",
        accessor: "month_8",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.month_8) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Sep",
        accessor: "month_9",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.month_9) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Oct",
        accessor: "month_10",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.month_10) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Nov",
        accessor: "month_11",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.month_11) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Dec",
        accessor: "month_12",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.month_12) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "YTD",
        accessor: "YTD",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.YTD) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Q1",
        accessor: "Q1",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.Q1) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Q2",
        accessor: "Q2",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.Q2) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Q3",
        accessor: "Q3",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.Q3) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Q4",
        accessor: "Q4",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.Q4) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Per Participant",
        accessor: "per_participant",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.per_participant) + sum : 0 + sum, 0),
              [rows],
            );
            const avg = Math.round(totalValue / flatRows.length);
            return <span>{`$${parseFloat(avg).toFixed(2)}`}</span>;
        },
        width: 125,
    },
    {
        Header: "Avg Per Quarter",
        accessor: "avg_per_quarter",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.avg_per_quarter) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
        width: 125,
    },
    {
        Header: "Avg Per Month",
        accessor: "avg_per_month",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.avg_per_month) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
        width: 125,
    },
    {
        Header: "Quarter Target",
        accessor: "quarterly_target",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.quarterly_target) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
        width: 125,
    },
    {
        Header: "Monthly Target",
        accessor: "monthly_target",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.monthly_target) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
        width: 125,
    },
    {
        Header: "Annual Target",
        accessor: "annual_target",
        Cell: ({row, value}) => {
            const boldRow = row.original.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{`$${parseFloat(value).toFixed(2)}`}</div>
        },
        Footer: (info) => {
            const {rows, flatRows} = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => !row.original?.disableTotalCalculation && row.original.dinamicDepth === 1 ? Number(row.values.annual_target) + sum : 0 + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
        width: 125,
    },



]

