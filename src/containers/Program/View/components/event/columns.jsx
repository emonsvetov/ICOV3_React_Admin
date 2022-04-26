import { Link } from 'react-router-dom';
const getEventType = (event) => {
    if( event?.event_type)  {
        return event?.event_type.name
    }
    return '---'
}
export const COLUMNS = [
    {
        Header: "Event ID",
        accessor: "id",
        width: 65,
    },
    {
        Header: "Event Name",
        accessor: "name",
        Cell: ({ row, value }) => { return <Link to={`/program/${row.original.program_id}/event/${row.original.id}/edit`} >{value}</Link>},
    },
    {
        Header: "Type",
        accessor: "type",
        Cell: ({ row, value }) => { return getEventType(row.original) },
    },
    {
        Header: "Status",
        accessor: "status",
        Cell: ({ row, value }) => { return row.original.enable ? 'Enabled' : 'Disabled'},
    }
]