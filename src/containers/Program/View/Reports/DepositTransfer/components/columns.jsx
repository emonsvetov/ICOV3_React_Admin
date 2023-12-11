import { toPoints} from '@/shared/helpers'
export const TABLE_COLUMNS = [
  {
    Header: "Date",
    accessor: "posting_timestamp",
  },
  {
    Header: "From Program",
    accessor: "from_program_name",
  },
  {
    Header: "To Program",
    accessor: "to_program_name",
  },
  {
    Header: "Transferred By",
    accessor: "name",
  },
  {
    Header: "Amount",
    accessor: "posting_amount",
    Cell: ({ row, value }) => { return toPoints(value) },
  },
];
