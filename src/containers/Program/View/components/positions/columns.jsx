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
    Header: "Program Permissions",
    accessor: "position_permission_assignments",
    Cell: PositionPermissionAssigments,
  },
];
