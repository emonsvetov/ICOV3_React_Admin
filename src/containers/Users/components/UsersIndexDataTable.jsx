import React, { useState, useEffect, useMemo, useReducer } from "react"
import { useTable, usePagination, useSortBy } from "react-table"
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { USERS_COLUMNS } from "./columns"
import SortIcon from 'mdi-react/SortIcon'
import SortAscendingIcon from 'mdi-react/SortAscendingIcon'
import SortDescendingIcon from 'mdi-react/SortDescendingIcon'
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination'
import {reducer, useEffectToDispatch, fetchApiData, initialState, TableFilter} from "@/shared/apiTableHelper"
import UsersFilter from "./UsersFilter"
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ChangeStatusModal from "@/containers/Users/components/ChangeStatusModal"

const queryClient = new QueryClient()

const DataTable = ({ organization }) => {

    const [trigger, setTrigger] = useState(0);
    const [filter, setFilter] = useState({orgId: '', status: '', keyword:'' });

    const [isChangeStatusOpen, setChangeStatusOpen] = useState(false)
    const [user, setUser] = useState(null)
    const toggleChangeStatus = () => {
        setChangeStatusOpen(prevState => !prevState)
    }

    const onClickFilterCallback = (status, keyword, orgId) => {
        if(filter.status === status && filter.keyword === keyword && filter.orgId === orgId)    {
            alert('No change in filters')
            return
        }
        setFilter({status, keyword, orgId});
        setUseFilter(true);
    }

    const [useFilter, setUseFilter] = useState(false);

    const onClickStatus = user => {
        setUser(user);
        toggleChangeStatus()
    }

    const strShowUserStatus = user => {
        return user?.status?.status ? <span onClick={() => onClickStatus(user)} className={'link'}>{user.status.status}</span> : (user?.user_status_id ? user.user_status_id : 'unknown')
    }

    let user_columns = [
        ...USERS_COLUMNS,
        ...[{
            Header: "",
            accessor: "action",
            Cell: ({ row }) => <RenderActions row={row} />,
        }],
    ]

    user_columns.forEach( (column, i) => {
        if( column.Header === 'Status')
        {
            user_columns[i].Cell =  ({ row, value }) => { return strShowUserStatus(row.original)}
        }
    })

    let columns = useMemo(() => user_columns, [])

    const [{ queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger }, dispatch] = React.useReducer(reducer, initialState);

    const apiUrl = `/organization/${organization.id}/user`

    const { isLoading, error, data, isSuccess } = useQuery(
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
        state: { pageIndex, pageSize, sortBy }
    } = useTable({
        columns,
        data: data?.results || [],
        initialState: {
            pageIndex: queryPageIndex,
            pageSize: queryPageSize,
            sortBy: queryPageSortBy,
        },
        manualPagination: true,
        pageCount: data ? totalPageCount : null,
        autoResetSortBy: false,
        autoResetExpanded: false,
        autoResetPage: false
    },
        useSortBy,
        usePagination,
    );
    const manualPageSize = []

    useEffectToDispatch( dispatch, {pageIndex, pageSize, gotoPage, sortBy, filter, data, useFilter, trigger} );

    if (error) {
        return <p>Error</p>;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }
    if (isSuccess)
        return (
            <>
                <div className='table react-table'>
                    <form className="form form--horizontal">
                        <div className="form__form-group">
                            <div className="col-md-9 col-lg-9">
                                <UsersFilter onClickFilterCallback={onClickFilterCallback} organization={organization} />
                            </div>
                            <div className="col-md-3 col-md-3 text-right pr-0">
                                <Link style={{ maxWidth: '200px' }}
                                    className="btn btn-success account__btn account__btn--small"
                                    to="/users/add"
                                >Add new user
                                </Link>
                            </div>
                        </div>
                    </form>
                    {
                        (typeof data?.count === 'undefined' || data.count <= 0) && <p>No results found</p>
                    }
                    {data?.count > 0 &&
                        <>
                            <table {...getTableProps()} className="table">
                                <thead>
                                    {headerGroups.map((headerGroup) => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map(column => (
                                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                                    {column.render('Header')}
                                                    {column.isSorted ? <Sorting column={column} /> : ''}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody className="table table--bordered" {...getTableBodyProps()}>
                                    {page.map(row => {
                                        prepareRow(row);
                                        return (
                                            <tr {...row.getRowProps()}>
                                                {
                                                    row.cells.map(cell => {
                                                        return <td {...cell.getCellProps()}><span>{cell.render('Cell')}</span></td>
                                                    })
                                                }
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            {user && <ChangeStatusModal isOpen={isChangeStatusOpen} setOpen={setChangeStatusOpen} toggle={toggleChangeStatus} setTrigger={setTrigger} user={user} />}
                        </>
                    }
                </div>
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
            </>
        )
}

const RenderActions = ({ row }) => {
    return (
        <>
            <a href={`/users/view/${row.original.id}`} className="link a" >View</a>{' | '}
            <a href={`/users/edit/${row.original.id}`} className="link a" >Edit</a>
        </>
    )
}

const Sorting = ({ column }) => (
    <span className="react-table__column-header sortable">
        {column.isSortedDesc === undefined ? (
            <SortIcon />
        ) : (
            <span>
                {column.isSortedDesc
                    ? <SortAscendingIcon />
                    : <SortDescendingIcon />}
            </span>
        )}
    </span>
);

const TableWrapper = ({ organization }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {organization?.id && <DataTable organization={organization} />}
        </QueryClientProvider>
    )
}

export default withRouter(connect((state) => ({
    organization: state.organization
}))(TableWrapper));