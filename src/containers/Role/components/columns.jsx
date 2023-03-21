import { Link } from 'react-router-dom';

export const COLUMNS = [
    {
        Header: "#",
        accessor: "id",
    },
    {
        Header: "Role Name",
        accessor: "name",
        Cell: ({ row, value }) => { return <Link to={`/roles/view/${row.original.id}`}>{value}</Link>},
    },
    {
        Header: "Guard",
        accessor: "guard_name",
    },
    // {
    //     Header: "No. of Permissions",
    //     accessor: "permissions",
    //     // Cell: ({ row, value }) => row.original.permissions,
    // }
]

