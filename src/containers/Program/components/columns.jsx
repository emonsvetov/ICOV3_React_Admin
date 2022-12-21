import { Link } from 'react-router-dom';
// import {format} from 'date-fns'

import ChevronUpIcon from 'mdi-react/ChevronUpIcon';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';

// import { ColumnFilter } from "./ColumnFilter"

export const PROGRAM_COLUMNS = [
    {
        // Build our expander column
        id: 'expander', // Make sure it has an ID
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
          <span {...getToggleAllRowsExpandedProps()}>
            {isAllRowsExpanded ? 'Collpase All' : 'Expand All'}
          </span>
        ),
        Cell: ({ row }) =>
          // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
          // to build the toggle for expanding a row
          row.canExpand ? (
            <span
              {...row.getToggleRowExpandedProps({
                style: {
                  // We can even use the row.depth property
                  // and paddingLeft to indicate the depth
                  // of the row
                  paddingLeft: `${row.depth * 2}rem`,
                },
              })}
            >
              {row.isExpanded ? <ChevronUpIcon className="chevron-expand" /> : <ChevronRightIcon className="chevron-expand" />}
            </span>
        ) : null,
    },
    {
        Header: "ID",
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
        Header: "Status",
        accessor: "status_id",
    },
]

export const GROUPED_COLUMNS = [
    {
        Header: "#",
        accessor: "id",
        Footer:"#"
    },
    {
        Header: "Name",
        Footer: "Name",
        columns: [
            {
                Header: "First Name",
                accessor: "first_name",
                Footer:"First Name"
            },
            {
                Header: "Last Name",
                accessor: "last_name",
                Footer:"Last Name"
            }
        ]
    },
    {
        Header: "Info",
        Footer: "Info",
        columns: [
            { 
                Header: "Date of Birth",
                accessor: "date_of_borth",
                Footer:"Date of Birth"
            },
            {
                Header: "Country",
                accessor: "country",
                Footer:"Country"
            },
            {
                Header: "Phone",
                accessor: "phone",
                Footer: "Phone",
            }
        ]
    }
]