import {formatCurrency} from '@/shared/helpers'
import AddIcon from 'mdi-react/AddIcon';
import MinusIcon from 'mdi-react/MinusIcon';
import {Link} from 'react-router-dom';

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
    width: 125
  },
  {
    Header: "Program Name",
    accessor: "name",
    width: 200,
    Cell: ({row, value}) => {
      const space = row.original.dinamicDepth === 1 ? '' : ' • ';
      const boldRow = row.original.dinamicDepth === 1;
      return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{space.repeat(row.original.dinamicDepth)}<Link
        to={`/program/view/${row.original.id}`}>{value}</Link></div>
    },
  },
  {
    Header: "Program ID",
    accessor: "account_holder_id",
    Cell: ({ row, value }) => {
      return !!row.original?.v2_account_holder_id ? row.original?.v2_account_holder_id : value;
    },
    width: 100,
  },
  {
    Header: "Beginning Balance",
    accessor: "startBalanceTotal",
    Cell: ({ row, value }) => { return value ? formatCurrency(value) : 0 },
    width: 125,
  },
  {
    Header: "Total Deposits",
    accessor: "deposit",
    Cell: ({ row, value }) => { return value ? formatCurrency(value) : '-' },
    width: 125,
  },
  {
    Header: "Total Reversal",
    accessor: "reversal",
    Cell: ({ row, value }) => { return value ? formatCurrency(value) : '-' },
    width: 125,
  },
  {
    Header: "Transfer",
    accessor: "transfer",
    Cell: ({ row, value }) => { return value ? formatCurrency(value) : '0' },
    width: 125,
  },
  {
    Header: "Total Awarded",
    accessor: "award",
    Cell: ({ row, value }) => { return value ? formatCurrency(value) : '-' },
    width: 125,
  },
  {
    Header: "Total Reclaims",
    accessor: "reclaim",
    Cell: ({ row, value }) => { return value ? formatCurrency(value) : '-' },
    width: 125,
  },
  {
    Header: "Program Refunds",
    accessor: "refunds",
    Cell: ({ row, value }) => { return value ? formatCurrency(value) : '-' },
    width: 125,
  },
  {
    Header: "Ending Balance",
    accessor: "endBalanceTotal",
    Cell: ({ row, value }) => { return value ? formatCurrency(value) : 0 },
    width: 125,
  },
];
