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
    Header: "Number of Participant	",
    accessor: "number_of_participant",
  },
  {
    Header: "Description",
    accessor: "description",
  },
];
