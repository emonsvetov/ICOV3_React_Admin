import {Link} from 'react-router-dom';
import React, {useMemo} from 'react';
import {toCurrency, toPoints, formatDate} from '@/shared/helpers'

export const TABLE_COLUMNS = [

  {
    Header: "Program Name",
    accessor: "program_name",
    width: 130,
  },
  {
    Header: "Program Id",
    accessor: "program_id",
    width: 95
  },
  {
    Header: "External Id",
    accessor: "external_id",
    width: 95
  },
  {
    Header: "Event",
    accessor: "event_name",
    width: 100
  },
  {
    Header: "GL Code",
    accessor: "ledger_code",
    width: 80
  },
  {
    Header: "Award Level",
    accessor: "award_level_name",
    width: 80
  },
  {
    Header: "Date",
    accessor: "posting_timestamp",
  },
  {
    id: 'to',
    Header: () => (<div style={{textAlign: 'center', borderTop: '1px solid #eff1f5', paddingTop: 6}}>To</div>),
    className: 'align-center',
    Footer: "",
    columns: [
      {
        Header: "First Name",
        accessor: "recipient_first_name",
        width: 100
      },
      {
        Header: "Last Name",
        accessor: "recipient_last_name",
        width: 100
      },
      {
        Header: "Email",
        accessor: "recipient_email",
      }
    ]
  },
  {
    Header: "From",
    accessor: data => (
      data.awarder_first_name + " " + data.awarder_last_name
    ),
    width: 120
  },
  {
    Header: "Referrer",
    accessor: "referrer",
    width: 80
  },
  {
    Header: "Notes",
    accessor: "notes",
    width: 100
  },
  {
    Header: "Value",
    accessor: "points",
    // Cell: ({ row, value }) => { return `${toCurrency(value)}` },
    // Cell: props => toCurrency(props)
    Cell: ({ row, value }) => { return toPoints(value); },
    width: 70
  },
  {
    Header: "Dollar Value",
    accessor: "dollar_value",
    Cell: ({ row, value }) => { return toCurrency(value); },
    width: 110
  },
]

