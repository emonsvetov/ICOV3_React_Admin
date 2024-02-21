import { Link } from 'react-router-dom';

import React, { useMemo } from 'react';
import AddIcon from 'mdi-react/AddIcon';
import MinusIcon from 'mdi-react/MinusIcon';

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
        width: 70
    },
    {
        Header: "Program",
        accessor: "name",
        Cell: ({row, value}) => {
          const space = row.original.dinamicDepth === 1 ? '' : ' • ';
          const boldRow = row.original.dinamicDepth === 1;
          return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{space.repeat(row.original.dinamicDepth)}<Link
              to={`/program/view/${row.original.id}`}>{value}</Link></div>
        },
        Footer:"Page Total",
    },
    {
        Header: "Awarded",
        accessor: "value_awarded",
        Cell: ({ row, value }) => { return `$${parseFloat(value)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.value_awarded) + sum, 0),
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
      Header: "Unredeemed points from current year",
      accessor: "this_unredeemed",
      Cell: ({ row, value }) => { return `$${parseFloat(value)}`},
      Footer: (info) => {
          const { rows, flatRows } = info;
          const totalValue = useMemo(
            () => rows.reduce((sum, row) => Number(row.values.this_unredeemed) + sum, 0),
            [rows],
          );
          return <span>{`$${parseFloat(totalValue)}`}</span>;
        },
  },
  {
    Header: "Unredeemed points from previous year’s award",
    accessor: "last_unredeemed",
    Cell: ({ row, value }) => { return `$${parseFloat(value)}`},
    Footer: (info) => {
        const { rows, flatRows } = info;
        const totalValue = useMemo(
          () => rows.reduce((sum, row) => Number(row.values.last_unredeemed) + sum, 0),
          [rows],
        );
        return <span>{`$${parseFloat(totalValue)}`}</span>;
      },
  },
    {
        Header: "Reserve %",
        accessor: "reserve_percentage",
        Cell: ({ row, value }) => { return `${parseFloat(value)}%`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.reserve_percentage) + sum, 0),
              [rows],
            );
            const avg = Math.round(totalValue / rows.length);
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

