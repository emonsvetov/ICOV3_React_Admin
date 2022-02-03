import { Link } from 'react-router-dom';

export const COLUMNS = [
    {
        Header: "#",
        accessor: "id",
    },
    {
        Header: "Domain Name",
        accessor: "name",
        Cell: ({ row, value }) => { return <Link to={`/domains/view/${row.original.id}`}>{value}</Link>},
    },
    {
        Header: "Secret Key",
        accessor: "secret_key",
    }
]

