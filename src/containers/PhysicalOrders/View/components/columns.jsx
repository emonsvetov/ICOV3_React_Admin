import { Link } from 'react-router-dom';

export const ORDERS_COLUMNS = [
    {
        Header: "ID",
        accessor: "id",
        width: 165,
        
    },
    {
        Header: "Created At",
        accessor: "created_at",
    },
    {
        Header: "Ship To",
        accessor: "ship_to",
        Cell: ({ row }) => { return <Link to={{}}>{row.original.ship_to}</Link>}
    },
    {
        Header: "Email",
        accessor: "email",
    },
    {
        Header: "Tango Order",
        accessor: "tange_order",
        Cell: ({ row }) => { return <Link to={{}}>{row.original.tango_order}</Link>}
    }
]

