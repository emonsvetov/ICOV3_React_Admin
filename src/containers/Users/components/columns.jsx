import { Link } from 'react-router-dom';

const strUserProgramRoles = (user) => {
  let pRoles = []
  // if( user?.roles )    {
  //     for( var i in user.roles) {
  //         pRoles.push(user.roles[i].name)
  //     }
  // }
  // if( user.isAdmin ) pRoles.push("Admin")
  // console.log(pRoles)
  return pRoles.join(", ") || 'NA'
}

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
        Cell: ({ row, value }) => { return strUserProgramRoles(row.original)},
    },
    {
        Header: "Status",
        accessor: "user_status_id",
    },
    {
        Header: "Employee Number",
        accessor: "employee_number"
    },
]