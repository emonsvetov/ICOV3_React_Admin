import React, {useState, useMemo} from "react";
import { useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout } from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import { COLUMNS } from "./columns";

import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import { Link } from 'react-router-dom';
import axios from 'axios'
import {reducer, useEffectToDispatch, fetchApiData, initialState, TableFilter, Sorting} from "@/shared/apiTableHelper"

const queryClient = new QueryClient()

const DataTable = ( {organization} ) => {

    // alert(JSON.stringify(organization))

    const dispatcher = useDispatch()

    const [loading, setLoading] = useState(false)

    const [filter, setFilter] = useState({ keyword:''});
    const [useFilter, setUseFilter] = useState(false);
    
    const onClickDelete = (e, id) => {
        e.preventDefault()
        setLoading( true )
        axios.delete(`/organization/${organization.id}/role/${id}`)
        .then( (res) => {
            // console.log(res)
            if(res.status == 200)  {
                window.location = `/roless?message=role deleted successfully!`
            }
        })
        .catch( error => {
            console.log(error)
            setLoading( false )
            dispatcher(sendFlashMessage(JSON.stringify(error.response.data), 'alert-danger'))
            // throw new Error(`API error:${e?.message}`);
        })
    }
    // const RenderActions = ({row}) => {
    //     return (
    //         <>
    //             <span>
    //                 <Link to={`/roles/view/${row.original.id}`}>View </Link>
    //                 <span style={{width:'15px', display: 'inline-block'}}></span>
    //                 <Link disabled={loading} to={'#delete-role'} className="text-danger" onClick={(e) => {if(window.confirm('Are you sure to delete this role?')){onClickDelete(e, row.original.id)}}}>Delete</Link>
    //             </span>
    //         </>
    //     )
    // }
    let domain_columns = [
        ...COLUMNS, 
        // ...[{
        //     Header: "Actions",
        //     accessor: "action",
        //     Cell: ({ row }) => <RenderActions row={row} />,
        // }]
    ]
    let columns = useMemo( () => domain_columns, [])

    const [{ queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy }, dispatch] =
    React.useReducer(reducer, initialState);

    const apiUrl = `/organization/${organization.id}/role`

    const { isLoading, error, data, isSuccess } = useQuery(
        ['roles', apiUrl, queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy],
        () => fetchApiData(
            {
                url: apiUrl,
                page: queryPageIndex,
                size: queryPageSize,
                filter: queryPageFilter,
                sortby: queryPageSortBy
            }),
        {
            keepPreviousData: true,
            staleTime: Infinity,
        }
    );

    // console.log(totalCount);

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
        state: { pageIndex, pageSize, sortBy, pageFilter }
    } = useTable({
        columns,
        data: data ? data.results : [],
        initialState: {
            pageIndex: queryPageIndex,
            pageSize: queryPageSize,
            sortBy: queryPageSortBy
        },
        manualPagination: true, // Tell the usePagination
        pageCount: data ? totalPageCount : null,
        autoResetSortBy: false,
        autoResetExpanded: false,
        autoResetPage: false,
    },
    useSortBy,
    useExpanded,
    usePagination,
    useResizeColumns,
    useFlexLayout
    );
    // const [statusFilterValue, setStatusFilterValue] = useState("");
    const manualPageSize = []
    
    useEffectToDispatch( dispatch, {pageIndex, pageSize, gotoPage, sortBy, filter, data, useFilter} );

    if (error) {
        return <p>Error: {JSON.stringify(error)}</p>;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if(isSuccess)
    return (
            <>
                <div className='table react-table domains-table'>
                    <form className="form form--horizontal">
                        <div className="form__form-group pb-4">
                            <div className="col-md-9 col-lg-9">
                                <TableFilter filter={filter} setFilter={setFilter} setUseFilter={setUseFilter} label={'roles'} />
                            </div>
                            <div className="col-md-3 col-lg-3 text-right pr-0">
                                <Link style={{maxWidth:'200px'}}
                                className="btn btn-primary account__btn account__btn--small"
                                to="/roles/add"
                                >Add new Role
                                </Link>
                            </div>
                        </div>
                    </form>
                    <table {...getTableProps()} className="table">
                        <thead>
                            {headerGroups.map( (headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map( (column, i) => (
                                        <th className={`cell-column-${i}`} {...column.getHeaderProps(column.getSortByToggleProps())}>
                                            {column.render('Header')}
                                            {column.isSorted ? <Sorting column={column} /> : ''}
                                            <div
                                                {...column.getResizerProps()}
                                                className={`resizer ${
                                                    column.isResizing ? 'isResizing' : ''
                                                }`}
                                            />
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="table table--bordered" {...getTableBodyProps()}>
                            {page.map( row => {
                                prepareRow(row);
                                // console.log(row)
                                const subCount = (row.id.match(/\./g) || []).length
                                const paddingCount = subCount > 0 ? Number(subCount) + 2 : 0;
                                // console.log(subCount)
                                return (
                                    <tr {...row.getRowProps()}>
                                        {
                                            row.cells.map( (cell, i) => {
                                                // console.log(cell)
                                                return <td className={`cell-column-${i}`} {...cell.getCellProps()}><span className={cell.column.Header==='#' ? `pl-${paddingCount}` : ''}>{cell.render('Cell')}</span></td>
                                            })
                                        }
                                    </tr>
                                )
                            })}
                        </tbody>
                        {/* <tfoot>
                            {footerGroups.map( (footerGroup) => (
                                <tr {...footerGroup.getFooterGroupProps()}>
                                    {footerGroup.headers.map( column => (
                                        <th {...column.getFooterProps()}>{column.render('Footer')}</th>
                                    ))}
                                </tr>
                            ))}
                        </tfoot> */}
                    </table>
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

const TableWrapper = ({organization}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <DataTable organization={organization} />
        </QueryClientProvider>
    )
}

export default TableWrapper;