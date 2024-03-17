import { Link } from "react-router-dom";

export const COLUMNS = [
  {
    Header: "Unit Number ID	",
    accessor: "id",
  },
  {
    Header: "Unit",
    accessor: "name",
    Cell: ({ row, value }) => {
      return (
        <Link
          to={`/program/${row.original.program_id}/unitnumber/${row.original.id}/edit`}
        >
          {value}
        </Link>
      );
    },
  },
  {
    Header: "No. of Participants",
    accessor: "users_count",
  },
  {
    Header: "Description",
    accessor: "description",
  },
];
