import {Link} from 'react-router-dom';
import React, {useMemo} from 'react';
import {toCurrency, toPoints} from '@/shared/helpers'
import AddIcon from 'mdi-react/AddIcon';
import MinusIcon from 'mdi-react/MinusIcon';
export const TABLE_COLUMNS = [

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
    Header: "Program Name",
    accessor: "name",
     Cell: ({row, value}) => {
            const space = row.original.program.dinamicDepth === 1 ? '' : ' • ';
            const boldRow = row.original.program.dinamicDepth === 1;
            return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{space.repeat(row.original.program.dinamicDepth)}{value}</div>
        },
        width: 200
  },
  {
    Header: "# of Participants",
    accessor: "count_users",
    width: 120
  },
  {
    Header: "# of Units with Participants",
    accessor: "count_email",
    width: 170
  },
  {
    Header: "% of Units with Participants",
    accessor: "percent_participant",
    Cell: ({ row, value }) => { return value + '%'; },
    width: 170
  },
  {
    Header: "# Activated",
    accessor: "count_active_user",
    width: 120
  },
  {
    Header: "% Activated",
    accessor: "percent_active_participant",
    Cell: ({ row, value }) => { return value + '%'; },
    width: 120
  },
  {
    Header: "# Awards",
    accessor: "count_award",
    width: 120
  },
  {
    Header: "$ Value of Awards",
    accessor: "sum_posting_amount",
    Cell: ({ row, value }) => { return toCurrency(value); },
    width: 120
  },
  {
    Header: "Avg $ Value of Awards",
    accessor: "avg_posting_amount",
    Cell: ({ row, value }) => { return toCurrency(value); },
    width: 170
  },
  {
    Header: "Deposit Balance",
    accessor: "deposit_balance",
    Cell: ({ row, value }) => { return toCurrency(value); },
    width: 120
  },
]

