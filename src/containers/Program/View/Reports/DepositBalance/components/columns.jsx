import { toPoints} from '@/shared/helpers'
import { toPointsRevert} from '@/shared/helpers'
import {formatCurrency} from '@/shared/helpers'

export const TABLE_COLUMNS = [
  {
    Header: "Program Name",
    accessor: "name",
  },
  {
    Header: "Program ID",
    accessor: "account_holder_id",
    Cell: ({ row, value }) => {
      return !!row.original?.v2_account_holder_id ? row.original?.v2_account_holder_id : value;
    },
  },
  {
    Header: "Beginning Balance",
    accessor: "startBalanceTotal",
    Cell: ({ row, value }) => { return value ? formatCurrency(value) : 0 },
  },
  {
    Header: "Total Deposits",
    accessor: "deposit",
    Cell: ({ row, value }) => { return value ? formatCurrency(value) : '-' },
  },
  {
    Header: "Total Reversal",
    accessor: "reversal",
    Cell: ({ row, value }) => { return value ? formatCurrency(value) : '-' },
  },
  {
    Header: "Transfer",
    accessor: "transfer",
    Cell: ({ row, value }) => { return value ? formatCurrency(value) : '0' },
  },
  {
    Header: "Total Awarded",
    accessor: "award",
    Cell: ({ row, value }) => { return value ? formatCurrency(value) : '-' },
  },
  {
    Header: "Total Reclaims",
    accessor: "reclaim",
    Cell: ({ row, value }) => { return value ? formatCurrency(value) : '-' },
  },
  {
    Header: "Program Refunds",
    accessor: "refunds",
    Cell: ({ row, value }) => { return value ? formatCurrency(value) : '-' },
  },
  {
    Header: "Ending Balance",
    accessor: "endBalanceTotal",
    Cell: ({ row, value }) => { return value ? formatCurrency(value) : 0 },
  },
];
