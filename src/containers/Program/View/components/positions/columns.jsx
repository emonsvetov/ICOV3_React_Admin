export const COLUMNS = [
  {
    Header: "Title",
    accessor: "title",
  },

  {
    Header: "Status",
    accessor: "status",
    Cell: ({ row, value }) => {
      return row.original.status ? "Active" : "Deleted";
    },
  },
  {
    Header: "Program Permissions",
    accessor: "program_permissions",
  },
];
