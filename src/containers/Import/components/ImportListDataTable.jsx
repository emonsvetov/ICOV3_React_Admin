import React, { useMemo } from "react";
import {useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout} from "react-table";
import {QueryClient, QueryClientProvider, useQuery} from 'react-query'
import {IMPORT_LIST_COLUMNS} from "./ImportListColumns"
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

import {reducer, useEffectToDispatch, fetchApiData, initialState, Sorting} from "@/shared/apiTableHelper"

const queryClient = new QueryClient()

const DataTable = ({organization}) => {

  let import_list_columns = [
    ...IMPORT_LIST_COLUMNS,
  ]
  let columns = useMemo(() => import_list_columns, [])

  const [{queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy}, dispatch] = React.useReducer(reducer, initialState);

  const {isLoading, error, data, isSuccess} = useQuery(
    ['import', queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy],
    () => 
    fetchApiData(
      {
        url: `/organization/${organization.id}/import`,
        page: queryPageIndex,
        size: queryPageSize,
        sortby: queryPageSortBy
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

  useEffectToDispatch( dispatch, {pageIndex, pageSize, gotoPage, sortBy, data} );

  if (error) {
    return <p>Error: {JSON.stringify(error)}</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isSuccess)
    return (
      <>
        <div className='table react-table'>
          <table {...getTableProps()} className="table">
            <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    {column.isSorted ? <Sorting column={column}/> : ''}
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
            {page.map(row => {
              prepareRow(row);
              // console.log(row)
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
                                style={{width: '100px'}}
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
  if (!organization) return 'Loading...'
  return (
    <QueryClientProvider client={queryClient}>
      <DataTable organization={organization}/>
    </QueryClientProvider>
  )
}
export default withRouter(connect((state) => ({
  organization: state.organization
}))(TableWrapper));