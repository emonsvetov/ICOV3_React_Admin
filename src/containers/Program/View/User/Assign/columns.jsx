import { Link } from 'react-router-dom';
const strUserProgramRoles = (user) => {
    let pRoles = []
    if( user?.roles )    {
        for( var i in user.roles) {
            pRoles.push(user.roles[i].name)
        }
    }
    if( user.isAdmin ) pRoles.push('Admin')
    // console.log(pRoles)
    return pRoles.join(', ') || '--'
}
export const USERS_COLUMNS = [
    {
        Header: "ID",
        accessor: "id",
    },
    {
        Header: "Name",
        accessor: "name",
        Cell: ({ row, value }) => { return <Link target={'_blank'} to={`/users/view/${row.original.id}`}>{value}</Link>},
    },
    {
        Header: "Email",
        accessor: "email",
    },
    {
        Header: "Role in Program",
        accessor: "role_id",
        Cell: ({ row, value }) => { return strUserProgramRoles(row.original)},
    },
    // {
    //     Header: "Status",
    //     accessor: "user_status_id",
    // }
]