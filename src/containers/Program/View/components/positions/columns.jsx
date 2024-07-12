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

export const PROGRAM_COLUMNS = [
  {
    Header: "Program ID",
    accessor: "id",
    width: 70,
  },
  {
    Header: "Copy/Update?	",
    accessor: "add",
    width: 70,
  },
  {
    Header: "Errors	",
    accessor: "errors",
    width: 70,
  },
];
