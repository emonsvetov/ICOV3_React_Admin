import React, {useEffect, useMemo, useState} from 'react';
import {Col, Container, Row, Card, CardBody, NavItem, NavLink, Nav, TabPane, Button, TabContent} from 'reactstrap';
import {Link, useParams} from 'react-router-dom'
import axios from 'axios'
import {QueryClient, QueryClientProvider, useQuery} from 'react-query'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {isEmpty} from '@/shared/helpers'
import {useExpanded, useFlexLayout, usePagination, useResizeColumns, useSortBy, useTable} from "react-table";
import {USERS_COLUMNS} from "../columns";
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import {reducer, useEffectToDispatch, fetchApiData, initialState, TableFilter} from "@/shared/apiTableHelper"
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"
import SortIcon from "mdi-react/SortIcon";
import SortAscendingIcon from "mdi-react/SortAscendingIcon";
import SortDescendingIcon from "mdi-react/SortDescendingIcon";

const queryClient = new QueryClient()

const ProgramViewUserHistory = ({organization, program, user}) => {

    const [filter, setFilter] = useState({keyword: ''});
    const [useFilter, setUseFilter] = useState(false);
    const [trigger, setTrigger] = useState(Math.floor(Date.now() / 1000));

    let {programId, userId} = useParams();

    let columns = useMemo(() => HISTORY_COLUMNS, [])

    const defaultColumn = React.useMemo(
        () => ({
            maxWidth: 400,
        }),
        []
    )

    const [{
        queryPageIndex,
        queryPageSize,
        totalCount,
        queryPageFilter,
        queryPageSortBy,
        queryTrigger
    }, dispatch] = React.useReducer(reducer, initialState);

    const apiUrl = `/organization/${program.organization_id}/program/${program.id}/user/${user.id}/history`
    // console.log(apiUrl)

    const {isLoading, error, data, isSuccess} = useQuery(
        ['users', queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy, queryTrigger],
        () => fetchApiData(
            {
                url: apiUrl,
                page: queryPageIndex,
                size: queryPageSize,
                filter: queryPageFilter,
                sortby: queryPageSortBy,
                trigger: queryTrigger
            }),
        {
            keepPreviousData: true,
            staleTime: Infinity,
        }
    );

    const totalPageCount = Math.ceil(totalCount / queryPageSize)
    console.log(data)

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        page,
        pageCount,
        pageOptions,
        gotoPage,
        previousPage,
        canPreviousPage,
        nextPage,
        canNextPage,
        setPageSize,
        state: {pageIndex, pageSize, sortBy}
    } = useTable({
            columns,
            data: data ? data.results : [],
            initialState: {
                pageIndex: queryPageIndex,
                pageSize: queryPageSize,
                sortBy: queryPageSortBy,
            },
            manualPagination: true, // Tell the usePagination
            pageCount: data ? totalPageCount : 0,
            autoResetSortBy: false,
            autoResetExpanded: false,
            autoResetPage: false,
            defaultColumn,

        },
        useSortBy,
        useExpanded,
        usePagination,
        useResizeColumns,
        useFlexLayout,
    );
    // const [statusFilterValue, setStatusFilterValue] = useState("");
    const manualPageSize = []

    useEffectToDispatch(dispatch, {pageIndex, pageSize, gotoPage, sortBy, filter, data, useFilter, trigger});

    if (!program?.id || !organization?.id) {
        return <p>Loading...</p>;
    }

    // console.log(data)
    return (
        <>
            <Row>
                <Col md={12}>
                    <table {...getTableProps()} className="table">
                        <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                        {column.isSorted ? <Sorting column={column}/> : ''}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody className="table table--bordered" {...getTableBodyProps()}>
                        {page.map(row => {
                            prepareRow(row);
                            //   console.log(row)
                            const subCount = (row.id.match(/\./g) || []).length
                            // const paddingCount = subCount > 0 ? Number(subCount) + 3 : 0;
                            // console.log(subCount)
                            return (
                                <tr {...row.getRowProps()}>
                                    {
                                        row.cells.map(cell => {
                                            // console.log(cell)
                                            const paddingLeft = subCount * 20
                                            return <td {...cell.getCellProps()}><span
                                                style={cell.column.Header === '#' ? {paddingLeft: `${paddingLeft}px`} : null}>{cell.render('Cell')}</span>
                                            </td>
                                        })
                                    }
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </Col>
            </Row>
        </>
    )
}

const Sorting = ({column}) => (
    <span className="react-table__column-header sortable">
    {column.isSortedDesc === undefined ? (
        <SortIcon/>
    ) : (
        <span>
        {column.isSortedDesc
            ? <SortAscendingIcon/>
            : <SortDescendingIcon/>}
      </span>
    )}
  </span>
);

export default ProgramViewUserHistory;


export const HISTORY_COLUMNS = [
    {
        Header: "Name",
        accessor: "event_name",
    },
    {
        Header: "Notes",
        accessor: "event_notes",
    },
    {
        Header: "Debit",
        accessor: "is_credit",
        Cell: ({row, value}) => value ? 'yes' : '',
    },
    {
        Header: "Credit",
        accessor: "is_credit2",
        Cell: ({row, value}) => !value ? 'yes' : '',
    },
    {
        Header: "Transaction Date",
        accessor: "event_date"
    },
    {
        Header: "Amount",
        accessor: "amount"
    },
]