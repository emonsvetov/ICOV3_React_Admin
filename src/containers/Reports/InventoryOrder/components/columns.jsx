import { Link } from 'react-router-dom';
// import {format} from 'date-fns'

import ChevronUpIcon from 'mdi-react/ChevronUpIcon';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';

// import { ColumnFilter } from "./ColumnFilter"

export const PROGRAM_COLUMNS = [
    {
        Header: "Merchant",
        accessor: "merchant",
        enableRowSpan: true
    },
    {
        Header: "Denomination",
        accessor: "denomination",
    },
    {
        Header: "# in Inventory",
        accessor: "num_in_inventory",
    },
    {
        Header: "2-Week Target",
        accessor: "two_week_target",
    },
]
