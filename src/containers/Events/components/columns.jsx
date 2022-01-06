import { Link } from 'react-router-dom';
export const EVENTS_COLUMNS = [
    {
        Header: "Event ID",
        accessor: "id",
    },
    {
        Header: "Event Name",
        accessor: "name",
        Cell: ({ row, value }) => { return <Link to={`/events/view/${row.original.id}`} >{value}</Link>},
    },
    {
        Header: "Type",
        accessor: "type",
    },
    {
        Header: "Status",
        accessor: "status",
        Cell: ({ row, value }) => { return 'Enabled'},
    }
    
]