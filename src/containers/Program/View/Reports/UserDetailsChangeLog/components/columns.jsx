import { Link } from 'react-router-dom';

export const USER_DETAIL_CHANGE_LOGS_COLUMNS = [
    {
        Header: "Name",
        accessor: "name",
        Cell: ({ row, value }) => { return <Link to={`/users/view/${row.original.id}`}>{value}</Link>},
    },
    {
        Header: "Email",
        accessor: "email"
    },
    {
        Header: "Type",
        accessor: "type"
    },
    {
        Header: "Old Value",
        accessor: "old_user_state_label"
    },
    {
        Header: "New Value",
        accessor: "new_user_state_label"
    },
    {
        Header: "Technical Reason",
        accessor: "technical_reason"
    },
    {
        Header: "Updated By",
        accessor: "updated_by"
    },
    {
        Header: "Updated At",
        accessor: "updated_at"
    },
   
]

