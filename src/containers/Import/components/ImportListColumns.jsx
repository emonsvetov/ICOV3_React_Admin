import { Link } from 'react-router-dom';

export const IMPORT_LIST_COLUMNS = [
    {
        Header: "#",
        accessor: "id",
        Footer:"#",
        disableFilters:true,
        disableGlobalFilters:true,
        width: 30
        // sticky:'left'
    },
    {
        Header: "File Name",
        accessor: "name",
        Footer:"File Name",
        Cell: ({ row, value }) => { return <Link to={`/program/view/${row.original.id}`}>{value}</Link>},
    },
    {
        Header: "Date",
        accessor: "date",
        Footer: "Date",
    },
]