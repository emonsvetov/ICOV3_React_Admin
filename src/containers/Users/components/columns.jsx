import { Link } from 'react-router-dom';
export const USERS_COLUMNS = [
    {
        Header: "Email",
        accessor: "email",
    },
    {
        Header: "Name",
        accessor: "name",
        Cell: ({ row, value }) => { return <Link to={`/users/view/${row.original.id}`} >{value}</Link>},
    },
    {
        Header: "Phone",
        accessor: "phone",
    },
    {
        Header: "Role",
        accessor: "role",
        Cell: ({ row, value }) => { return row.original.role ? row.original.role.name : '' },
    },
    {
        Header: "Employee Number",
        accessor: "employee_number"
    },
]