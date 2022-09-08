import React, {useState, useEffect, useMemo} from "react";
import {useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout} from "react-table";
import {QueryClient, QueryClientProvider, useQuery} from 'react-query'
import {IMPORT_LIST_COLUMNS} from "./ImportListColumns"
import SortIcon from 'mdi-react/SortIcon'
import SortAscendingIcon from 'mdi-react/SortAscendingIcon'
import SortDescendingIcon from 'mdi-react/SortDescendingIcon'
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

const queryClient = new QueryClient()

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 2,
  totalCount: 0,
  queryPageFilter: {},
  queryPageSortBy: [],
};

const PAGE_CHANGED = 'PAGE_CHANGED';
const PAGE_SIZE_CHANGED = 'PAGE_SIZE_CHANGED';
const PAGE_SORT_CHANGED = 'PAGE_SORT_CHANGED'
const PAGE_FILTER_CHANGED = 'PAGE_FILTER_CHANGED';
const TOTAL_COUNT_CHANGED = 'TOTAL_COUNT_CHANGED';

const reducer = (state, {type, payload}) => {
  switch (type) {
    case PAGE_CHANGED:
      return {
        ...state,
        queryPageIndex: payload,
      };
    case PAGE_SIZE_CHANGED:
      return {
        ...state,
        queryPageSize: payload,
      };
    case PAGE_SORT_CHANGED:
      return {
        ...state,
        queryPageSortBy: payload,
      };
    case PAGE_FILTER_CHANGED:
      return {
        ...state,
        queryPageFilter: payload,
      };
    case TOTAL_COUNT_CHANGED:
      return {
        ...state,
        totalCount: payload,
      };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

const ImportData = [
  {
    id: 1,
    name: 'test_file_01.csv',
    date: '09/28/2021 17:24:47'
  },
  {
    id: 2,
    name: 'test_file_02.csv',
    date: '07/18/2021 16:24:47'
  },
  {
    id: 3,
    name: 'test_file_03.csv',
    date: '05/21/2021 15:24:47'
  },
  {
    id: 4,
    name: 'test_file_04.csv',
    date: '01/26/2021 15:24:47'
  },
];

const DataTable = ({organization}) => {

  const fetchData = async (page, pageSize, pageFilterO = null, pageSortBy) => {
    console.log(page);
    console.log(pageSize);
    let tmp = page*pageSize;
    const data = {
      results: ImportData.slice(tmp, pageSize+tmp),
      count: ImportData.length
    };
    return data;
  };

  let import_list_columns = [
    ...IMPORT_LIST_COLUMNS,
  ]
  let columns = useMemo(() => import_list_columns, [])

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  )

  const [{queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy}, dispatch] =
    React.useReducer(reducer, initialState);

  const {isLoading, error, data, isSuccess} = useQuery(
    ['import', queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy],
    () => fetchData(queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy),
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
      defaultColumn,

    },
    useSortBy,
    useExpanded,
    usePagination,
    useResizeColumns,
    useFlexLayout,
  );

  const manualPageSize = []

  React.useEffect(() => {
    dispatch({type: PAGE_CHANGED, payload: pageIndex});
  }, [pageIndex]);

  React.useEffect(() => {
    dispatch({type: PAGE_SIZE_CHANGED, payload: pageSize});
    gotoPage(0);
  }, [pageSize, gotoPage]);

  useEffect(() => {
    dispatch({type: PAGE_SORT_CHANGED, payload: sortBy});
    gotoPage(0);
  }, [sortBy, gotoPage]);

  React.useEffect(() => {
    if (data?.count) {
      dispatch({
        type: TOTAL_COUNT_CHANGED,
        payload: data.count,
      });
    }
  }, [data?.count]);

  if (error) {
    return <p>Error: {JSON.stringify(error)}</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isSuccess)
    return (
      <>
        <div className='table react-table' style={{maxWidth: 800}}>
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