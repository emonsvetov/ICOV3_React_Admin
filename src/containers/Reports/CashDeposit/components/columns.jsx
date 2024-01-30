import {formatCurrency, formatMMYYDD} from '@/shared/helpers'

export const TABLE_COLUMNS = [

  {
    Header: "Root Program",
    accessor: "root_name",
    width: 95
  },
  {
    Header: "Program ID",
    accessor: "program_id",
    width: 95
  },
  {
    Header: "Program Name",
    accessor: "program_name",
    width: 200,
  },
  {
    Header: "Invoice Number",
    accessor: "invoice_number",
    width: 100
  },
  {
    Header: "Date of Deposit",
    accessor: "date_of_deposit",
    width: 150,
    Cell: ({ row, value }) => { return formatMMYYDD(value); },
  },
  {
    Header: "Total Amount received",
    accessor: "total_amount_received",
    Cell: ({ row, value }) => { return formatCurrency(value); },
    width: 140
  },
  {
    Header: "Funding Deposit",
    accessor: "funding_deposit",
    Cell: ({ row, value }) => { return formatCurrency(value); },
    width: 130
  },
  {
    Header: "Deposit fee",
    accessor: "deposit_fee",
    Cell: ({ row, value }) => { return formatCurrency(value); },
    width: 120
  },
  {
    Header: "Credit Card Convenience Fee",
    accessor: "credit_card_convenience_fee",
    Cell: ({ row, value }) => { return formatCurrency(value); },
    width: 120
  },
  {
    Header: "Notes",
    accessor: "notes",
    width: 120
  },

]

