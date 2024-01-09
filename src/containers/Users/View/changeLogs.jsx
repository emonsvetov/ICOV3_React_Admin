import React, {useEffect, useMemo, useState} from 'react';
import {Col, Container, Row, Card, CardBody, NavItem, NavLink, Nav, TabPane, Button, TabContent} from 'reactstrap';
import {Link, useParams} from 'react-router-dom'
import axios from 'axios'
import {QueryClient, QueryClientProvider, useQuery} from 'react-query'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {isEmpty} from '@/shared/helpers'
import {useExpanded, useFlexLayout, usePagination, useResizeColumns, useSortBy, useTable} from "react-table";
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import {reducer, useEffectToDispatch, fetchApiData, initialState, TableFilter} from "@/shared/apiTableHelper"
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"
import SortIcon from "mdi-react/SortIcon";
import SortAscendingIcon from "mdi-react/SortAscendingIcon";
import SortDescendingIcon from "mdi-react/SortDescendingIcon";
import {toCurrency, toPoints} from '@/shared/helpers'

const queryClient = new QueryClient()

const ViewUserChangeLogs = ({organization, program, user, programs}) => {

    const [trigger, setTrigger] = useState(Math.floor(Date.now() / 1000));
    const [useFilter, setUseFilter] = useState({programs: programs});
    const [filter, setFilter] = useState({programs: programs});

    let {programId, userId} = useParams();

    let columns = useMemo(() => CHANGE_LOGS_COLUMNS, [])

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

    const apiUrl = `/organization/${organization.id}/user/${user.id}/change-logs`
    const {isLoading, error, data, isSuccess} = useQuery(
        ['changeLogs', queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy, queryTrigger],
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
    // console.log(data)

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
    const manualPageSize = []

    useEffectToDispatch(dispatch, {pageIndex, pageSize, gotoPage, sortBy, filter, data, useFilter, trigger});

    if (!organization?.id) {
        return <p>Loading...</p>;
    }

    // console.log(data)
    return (
        <>
            <Row>
                <Col md={12}>
                    <div className="action-panel">
                        <Row className="mx-0">
                            <Col>
                                <TableFilter filter={filter} setFilter={setFilter} setUseFilter={setUseFilter}
                                             config={{
                                                 keyword: false,
                                                 programs: true,
                                             }}/>

                            </Col>
                        </Row>
                    </div>
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
                            const subCount = (row.id.match(/\./g) || []).length
                            return (
                                <tr {...row.getRowProps()}>
                                    {
                                        row.cells.map(cell => {
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
            <Row>
                <Col md={12}>
                    <p>&nbsp;</p>
                    {(rows.length > 0) && (
                        <>
                            <ReactTablePagination
                                page={page}
                                gotoPage={gotoPage}
                                previousPage={previousPage}
                                nextPage={nextPage}
                                canPreviousPage={canPreviousPage}
                                canNextPage={canNextPage}
                                pageOptions={pageOptions}
                                pageSize={pageSize}
                                pageIndex={pageIndex}
                                pageCount={pageCount}
                                setPageSize={setPageSize}
                                manualPageSize={manualPageSize}
                                dataLength={totalCount}
                            />
                            <div className="pagination justify-content-end mt-2">
                          <span>
                          Go to page:{' '}
                              <input
                                  type="number"
                                  value={pageIndex + 1}
                                  onChange={(e) => {
                                      const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                      gotoPage(page);
                                  }}
                                  style={{ width: '100px' }}
                              />
                          </span>{' '}
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                    }}
                                >
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <option key={pageSize} value={pageSize}>
                                            Show {pageSize}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
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

export default ViewUserChangeLogs;


export const CHANGE_LOGS_COLUMNS = [
    {
        Header: "Name",
        accessor: "name"
    },
    {
        Header: "Email",
        accessor: "email"
    },
    {
        Header: "Type",
        accessor: "type"
    },
    {
        Header: "Old Value",
        accessor: "old_user_status_label"
    },
    {
        Header: "New Value",
        accessor: "new_user_status_label"
    },
    {
        Header: "Technical Reason",
        accessor: "technical_reason"
    },
    {
        Header: "Updated By",
        accessor: "updated_by"
    },
    {
        Header: "Updated At",
        accessor: "updated_at"
    },
]