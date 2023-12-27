import { Link } from 'react-router-dom';
// import {format} from 'date-fns'


// import { ColumnFilter } from "./ColumnFilter"

export const PROGRAM_COLUMNS = [
    {
        Header: "Program ID",
        accessor: "id",
        width: 130,
        Footer:"#",
        disableFilters:true,
        disableGlobalFilters:true
    },
    {
        Header: "Program Name",
        accessor: "name",
        Footer:"Program Name",
        Cell: ({ row, value }) => { return <Link to={`/program/view/${row.original.id}`}>{value}</Link>},
    },
    {
        Header: "Root Program ID",
        accessor: "root_id",
        Footer: "Status",
        filter: 'equals'
    },
    {
        Header: "Root Program Name",
        accessor: "root_name",
        Footer: "Status",
        filter: 'equals'
    },
];