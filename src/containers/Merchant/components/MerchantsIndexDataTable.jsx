import React, {useState, useEffect, useMemo} from "react";
import { useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout } from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { COLUMNS } from "./columns";
import SortIcon from 'mdi-react/SortIcon';
import SortAscendingIcon from 'mdi-react/SortAscendingIcon';
import SortDescendingIcon from 'mdi-react/SortDescendingIcon';
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import MerchantsFilter  from "./MerchantsFilter";
import { Link } from 'react-router-dom';
import axios from 'axios'
import {renameChildrenToSubrows} from '@/shared/helpers'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    reducer,
    useEffectToDispatch,
    fetchApiData,
    initialState,
    TableFilter,
    Sorting
} from "@/shared/apiTableHelper"

const queryClient = new QueryClient()

const DataTable = ({organization}) => {

    const [filter, setFilter] = useState({ keyword:''});
    const [trigger, setTrigger] = useState(0);
    const [useFilter, setUseFilter] = useState(false);

    let columns = useMemo( () => COLUMNS, [])

    const [{queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger}, dispatch] =
      React.useReducer(reducer, initialState);

    const apiUrl = `/organization/${organization.id}/merchant`;
    const {isLoading, error, data, isSuccess} = useQuery(
      ['', apiUrl, queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy, queryTrigger],
      () => fetchApiData(
        {
            url: apiUrl,
            page: queryPageIndex,
            size: queryPageSize,
            filter,
            sortby: queryPageSortBy.length ? queryPageSortBy : [{'id': 'name'}, {'desc': 'true'}],
            trigger: queryTrigger
        }
      ),
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
        footerGroups,
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
          pageCount: data ? totalPageCount : null,
          autoResetSortBy: false,
          autoResetExpanded: false,
          autoResetPage: false,
      },
      useSortBy,
      useExpanded,
      usePagination,
      useResizeColumns,
      useFlexLayout,
    );

    const manualPageSize = []
    useEffectToDispatch(dispatch, {pageIndex, pageSize, gotoPage, sortBy, filter, data, useFilter, trigger});

    if (error) {
        return <p>Error: {JSON.stringify(error)}</p>;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }
    if(isSuccess)
    return (
            <>
                <div className='table react-table merchant-table'>
                    <form className="form form--horizontal action-panel">
                        <div className="form__form-group pb-4">
                            <div className="col-md-9 col-lg-9">
                              <TableFilter filter={filter} setFilter={setFilter} setUseFilter={setUseFilter}
                                           config={{
                                             keyword: true,
                                             label: 'by ID or Name',
                                             dateRange: false,
                                             programs: false,
                                             exportToCsv: false
                                           }}/>
                            </div>
                            <div className="col-md-3 col-lg-3 text-right pr-0">
                                <Link style={{maxWidth:'200px'}}
                                className="btn btn-success account__btn account__btn--small"
                                to="/merchants/add"
                                >Add new merchant
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

const TableWrapper = ( {organization} ) => {
    if( !organization ) return 'Loading...'
    return (
        <QueryClientProvider client={queryClient}>
            <DataTable organization={organization} />
        </QueryClientProvider>
    )
}

export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
    organization: state.organization
}))(TableWrapper));