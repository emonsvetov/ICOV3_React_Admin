const strUserProgramRoles = (user) => {
    let pRoles = []
    if( user?.roles )    {
        for( var i in user.roles) {
            pRoles.push(user.roles[i].name)
        }
    }
    if( user.isAdmin ) pRoles.push("Admin")
    // console.log(pRoles)
    return pRoles.join(", ") || 'NA'
}
export const USERS_COLUMNS = [
    {
        Header: "ID",
        accessor: "id",
    },
    {
        Header: "Name",
        accessor: "name",
    },
    {
        Header: "Email",
        accessor: "email",
    },
    {
        Header: "Program Roles",
        accessor: "role_id",
        Cell: ({ row, value }) => { return strUserProgramRoles(row.original)},
    },
    {
        Header: "Status",
        accessor: "user_status_id",
    },
    {
        Header: "Default Contract",
        accessor: "default_contract",
        Cell: ({ row, value }) => { return 'No'},
    }
]