import { PositionPermissionAssigments } from "@/service/program/position";

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
    Header: "Position Permissions",
    accessor: "position_permissions",
    Cell: PositionPermissionAssigments,
  },
];
