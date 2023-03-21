import { Link } from 'react-router-dom';
// import {format} from 'date-fns'

import ChevronUpIcon from 'mdi-react/ChevronUpIcon';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';

// import { ColumnFilter } from "./ColumnFilter"

export const PROGRAM_COLUMNS = [
    {
        Header: "Program ID",
        accessor: "id",
        Footer:"#",
        disableFilters:true,
        disableGlobalFilters:true,
        // sticky:'left'
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
]

