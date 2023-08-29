
import {toCurrency} from '@/shared/helpers'

export const TABLE_COLUMNS = [

  {
    Header: "Program Name",
    accessor: "name",
    width: 170,
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

