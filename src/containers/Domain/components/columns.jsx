import { Link } from 'react-router-dom';

export const COLUMNS = [
    {
        Header: "ID",
        accessor: "id",
        width: 50,
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

