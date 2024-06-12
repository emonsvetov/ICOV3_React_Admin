import {toCurrency, toPoints} from '@/shared/helpers'

export const COLUMNS = [
  {
    accessor: 'event_name',
    enableRowSpan: 1
  },
  {
    accessor: 'previous_year_month',
    enableRowSpan: 1,
    Cell: ({ row, value }) => { return toCurrency(value); },
  },
  {
    accessor: 'month',
    enableRowSpan: 1,
    Cell: ({ row, value }) => { return toCurrency(value); },
  },
  {
    accessor: 'previous_year_annual',
    enableRowSpan: 1,
    Cell: ({ row, value }) => { return toCurrency(value); },
  },
  {
    accessor: 'annual',
    enableRowSpan: 1,
    Cell: ({ row, value }) => { return toCurrency(value); },
  },
]