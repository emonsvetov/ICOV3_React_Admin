import {formatCurrency} from '@/shared/helpers'
export const TABLE_COLUMNS = [
  {
    Header: "Program Name",
    accessor: "name",
    width: 200,
  },
  {
    Header: "Program ID",
    accessor: "account_holder_id",
    Cell: ({ row, value }) => {
      return !!row.original?.v2_account_holder_id ? row.original?.v2_account_holder_id : value;
    },
    width: 125,
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
    Cell: ({ row, value }) => { return value ? formatCurrency(value) : '-' },
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
