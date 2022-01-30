import { Link } from 'react-router-dom';
export const USERS_COLUMNS = [
    {
        Header: "Name",
        accessor: "name",
    },
    {
        Header: "Email",
        accessor: "email",
    },
    {
        Header: "Role",
        accessor: "role",
        Cell: ({ row, value }) => { return 'Program manager'},
    },
    {
        Header: "Status",
        accessor: "status",
        Cell: ({ row, value }) => { return 'Active'},
    },
    {
        Header: "Default Contract",
        accessor: "default_contract",
        Cell: ({ row, value }) => { return 'No'},
    },
    {
        Header: "Action",
        Cell: ({ row, value }) => { return <Link to={`/users/view/${row.original.id}`} >view</Link>},
    },
]