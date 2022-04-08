import { Link } from 'react-router-dom';
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
        Cell: ({ row, value }) => { return 'Standard'},
    },
    {
        Header: "Status",
        accessor: "status",
        Cell: ({ row, value }) => { return 'Enabled'},
    }
]