import React, {useMemo, useState} from "react";
import {useExpanded, useFlexLayout, usePagination, useResizeColumns, useSortBy, useTable,} from "react-table";
import {QueryClient, QueryClientProvider, useQuery} from "react-query";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

import { TABLE_COLUMNS} from "./columns";
import { RenderRowSubComponent } from "./columns";

import ReactTablePagination from "@/shared/components/table/components/ReactTablePagination";
import {format, subHours} from "date-fns";
import {getFirstDay} from '@/shared/helpers'

import {fetchApiData, initialState, reducer, Sorting, useEffectToDispatch} from "@/shared/apiTableHelper";
import OrdersFilter from "./OrdersFilter";
import {Sticky, StickyContainer} from 'react-sticky';
import { startOfDay, subDays } from 'date-fns';

const queryClient = new QueryClient();

const formatDateTime = (datetime) => {
  const date = new Date(datetime);
  const adjustedDate = subHours(date, 4);
  return format(adjustedDate, "yyyy-MM-dd HH:mm:ss");
};

const DataTable = ({ organization }) => {

    const defaultFrom = subDays(startOfDay(new Date()), 30);
    const defaultTo = new Date();
  const [filter, setFilter] = useState({
      from: defaultFrom,
      to: defaultTo,
  });

  const [useFilter, setUseFilter] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const [exportData, setExportData] = useState([]);
  const [exportHeaders, setExportHeaders] = useState([]);
  const [exportToCsv, setExportToCsv] = useState(false);
  const exportLink = React.createRef();


    let columns = useMemo(() => TABLE_COLUMNS, []);

  const [
    {
      queryPageIndex,
      queryPageSize,
      totalCount,
      queryPageFilter,
      queryPageSortBy,
      queryTrigger,
    },
    dispatch,
  ] = React.useReducer(reducer, initialState);

  const apiUrl = `/organization/${organization.id}/report/orders`;

  const { isLoading, error, data, isSuccess } = useQuery(
    [
      "giftcodes",
      apiUrl,
      queryPageIndex,
      queryPageSize,
      queryPageFilter,
      queryPageSortBy,
      queryTrigger,
    ],
    () =>
      fetchApiData({
        url: apiUrl,
        page: queryPageIndex,
        size: queryPageSize,
        filter,
        sortby: queryPageSortBy,
        trigger: queryTrigger,
      }),
    {
      keepPreviousData: true,
      staleTime: Infinity,
    },
  );

  const transformedData = data
    ? data.results.map((item) => ({
        ...item,
        adjusted_redemption_datetime: formatDateTime(item.redemption_datetime),
      }))
    : [];

  const totalPageCount = Math.ceil(totalCount / queryPageSize);

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
    state: { pageIndex, pageSize, sortBy },
      visibleColumns,
  } = useTable(
    {
      columns,
      data: data ? transformedData : [],
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
        disableResizing: true
    },
    useSortBy,
    useExpanded,
    usePagination,
    useResizeColumns,
    useFlexLayout,
  );

  // const [statusFilterValue, setStatusFilterValue] = useState("");
  const manualPageSize = [];

  useEffectToDispatch(dispatch, {
    pageIndex,
    pageSize,
    gotoPage,
    sortBy,
    filter,
    data,
    useFilter,
    trigger,
  });

  if (error) {
    return <p>Error: {JSON.stringify(error)}</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isSuccess)
    return (
      <StickyContainer>
        <div className="table react-table available-table">
            <OrdersFilter
                filter={filter}
                setFilter={setFilter}
                useFilter={useFilter}
                setUseFilter={setUseFilter}
                exportData={exportData}
                exportLink={exportLink}
                exportHeaders={exportHeaders}
            />
          <table {...getTableProps()} className="table">
              <Sticky  topOffset={80}>
                {({ style }) => (
                    <thead style={{...style, top: '60px'}}>
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
                )}
              </Sticky>
              <tbody {...getTableBodyProps()}>
              {page.map(row => {
                  prepareRow(row);
                  return (
                      <React.Fragment key={row.id}>
                          <tr {...row.getRowProps()}>
                              {row.cells.map(cell => (
                                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                              ))}
                          </tr>
                          {row.isExpanded ? (
                              <tr>
                                  <td colSpan={visibleColumns.length}>
                                      <RenderRowSubComponent row={row} />
                                  </td>
                              </tr>
                          ) : null}
                      </React.Fragment>
                  );
              })}
              </tbody>
          </table>
        </div>
        {rows.length > 0 && (
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
                Go to page:{" "}
                <input
                  type="number"
                  value={pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    gotoPage(page);
                  }}
                  style={{ width: "100px" }}
                />
              </span>{" "}
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
      </StickyContainer>
    );
};

const TableWrapper = ({ organization }) => {
  if (!organization) return "Loading...";
  return (
    <QueryClientProvider client={queryClient}>
      <DataTable organization={organization} />
    </QueryClientProvider>
  );
};

export default withRouter(
  connect((state) => ({
    organization: state.organization,
  }))(TableWrapper),
);
