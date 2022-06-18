import { Link } from 'react-router-dom';

export const USERS_COLUMNS = [
    {
        Header: "ID",
        accessor: "id",
    },
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
        Cell: ({ row, value }) => { return row.original.roles.map( (role, i) => {
            return role.name
        }).join(", ") },
    },
    {
        Header: "Employee Number",
        accessor: "employee_number"
    },
]