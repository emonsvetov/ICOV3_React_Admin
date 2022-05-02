const strUserProgramRoles = (user) => {
    let pRoles = []
    if( user?.programRoles )    {
        for( var i in user.programRoles) {
            if( user.programRoles[i]?.roles)    {
                const upRoles = user.programRoles[i]?.roles
                for( var j in upRoles) {
                    pRoles.push(upRoles[j].name)
                }
            }
        }
    }
    // console.log(pRoles)
    return pRoles.join(', ') || 'NA'
}
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
        accessor: "role_id",
        Cell: ({ row, value }) => { return strUserProgramRoles(row.original)},
    },
    {
        Header: "Status",
        accessor: "user_status_id",
        Cell: ({ row, value }) => { return 'Active'},
    },
    {
        Header: "Default Contract",
        accessor: "default_contract",
        Cell: ({ row, value }) => { return 'No'},
    }
]