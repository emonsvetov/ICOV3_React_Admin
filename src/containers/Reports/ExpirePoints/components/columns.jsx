import {Link} from 'react-router-dom';
import React, {useMemo} from 'react';
import {toCurrency, toPoints, formatDate} from '@/shared/helpers'

const RenderActions = ({row}) => {
  return (
      <>
                <span>
                   <Link to={`/program/${row.original.program_id}/user/view/${row.original.user_id}`}>{row.original.participant_email}</Link>
                </span>
      </>
  )
}
export const TABLE_COLUMNS = [

  {
    Header: "Program ID",
    accessor: "program_id",
  },
  {
    Header: "Program Parent",
    accessor: "program_parent_id",
  },
  {
    Header: "Program Name",
    accessor: "program_name",
  },
  {
    Header: "Participant",
    accessor: "participant",
  },
  {
    Header: "Participant Email",
    accessor: "participant_email",
    Cell: ({ row }) => <RenderActions row={row} />
  },
  {
    Header: "Expiring Date",
    accessor: "expire_date",
    Cell: ({ row, value }) => { return formatDate(value); },
  },
  {
    Header: "Amount Expiring By Current Year",
    accessor: "amount_expiring_this_year",
    Cell: ({ row, value }) => { return <span>{`${parseFloat(value).toFixed(2)}`}</span>; },
  },
  {
    Header: "Amount Expiring By Following Year",
    accessor: "amount_expiring_next_year",
    Cell: ({ row, value }) => { return <span>{`${parseFloat(value).toFixed(2)}`}</span>; },
  },
  {
    Header: "Current Balance",
    accessor: "balance",
    Cell: ({ row, value }) => { return <span>{`${parseFloat(value).toFixed(2)}`}</span>; },
  },
  {
    Header: "Point Ratio",
    accessor: "factor_valuation",
    Cell: ({ row, value }) => { return <span>{value}</span>; },
  },
  {
    Header: "Amount in Dollars",
    accessor: "amount_in_dollars",
    Cell: ({ row, value }) => { return <span>{`$${parseFloat(value).toFixed(2)}`}</span>; },
  },


]

