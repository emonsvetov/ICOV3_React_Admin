import React, { useState, useEffect, useMemo } from "react";
import {connect} from "react-redux";
import {
  useTable,
  usePagination,
  useSortBy,
  useExpanded,
  useResizeColumns,
  useFlexLayout,
} from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Link } from "react-router-dom";
import { USER_DETAIL_CHANGE_LOGS_COLUMNS } from "./columns";
import SortIcon from "mdi-react/SortIcon";
import SortAscendingIcon from "mdi-react/SortAscendingIcon";
import SortDescendingIcon from "mdi-react/SortDescendingIcon";
import ReactTablePagination from "@/shared/components/table/components/ReactTablePagination";
import UserDetailsChangeLogsFilter from "./UserDetailChangeLogsFilter";
import { Col, Row } from "reactstrap";
import axios from "axios";
import { clone } from "lodash";
import { renameChildrenToSubrows } from "@/shared/helpers";
import {
  reducer,
  fetchApiData,
  fetchApiDataExport,
  useEffectToDispatch,
} from "@/shared/apiTableHelper";
import {getFirstDay} from '@/shared/helpers'

const queryClient = new QueryClient();

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 10,
  totalCount: null,
  queryPageFilter: {},
  queryPageSortBy: [],
};

const DataTable = ({organization, programs}) => {

  const defaultFrom = getFirstDay();
  const [filter, setFilter] = useState(
    {
      programs: programs.account_holder_id,
      from: defaultFrom, 
      to: new Date(),
    }
  );

  const [useFilter, setUseFilter] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const [exportData, setExportData] = useState([]);
  const [exportHeaders, setExportHeaders] = useState([]);
  const [exportToCsv, setExportToCsv] = useState(false);
  const exportLink = React.createRef();

  useEffect(() => {
    if (exportToCsv) {
      if (exportLink.current) {
        setExportToCsv(false);
        exportLink.current.link.click();
      }
    }
  }, [exportLink]);

  const RenderActions = ({ row }) => {
    return (
      <>
        <Link className="link a" to={`/users/view/${row.original.id}`}>
          View
        </Link>
      </>
    );
  };

  let program_columns = [
    ...USER_DETAIL_CHANGE_LOGS_COLUMNS,
  ];

  let columns = useMemo(() => program_columns, []);

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  );

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
  const apiUrl = `/organization/${organization.id}/report/user-detail-change-log`;
  const { isLoading, error, data, isSuccess } = useQuery(
    [
      "programs",
      queryPageIndex,
      queryPageSize,
      queryPageFilter,
      queryPageSortBy,
      queryTrigger,
    ],
 
    () => fetchApiData(
      {
        url: apiUrl,
        page: queryPageIndex,
        size: queryPageSize,
        filter,
        sortby: queryPageSortBy,
        trigger: queryTrigger
      }
    ),
    {
      keepPreviousData: true,
      staleTime: Infinity,
    }
  );

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
  } = useTable(
    {
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
    useFlexLayout
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

  const download = async (filterValues) => {
    let tmpFilter = clone(filterValues);
    tmpFilter.exportToCsv = 1;

    //enable these comments after api integration

    const response = await fetchApiDataExport({
      url: apiUrl,
      filter: tmpFilter,
      sortby: queryPageSortBy,
      trigger: queryTrigger,
    });
    setExportData(response.results);
    setExportHeaders(response.headers);
    setExportToCsv(true);
  };

  if (error) {
    return <p>Error: {JSON.stringify(error)}</p>;
  }
  return (
    <>
      <div className="table react-table">
        <div className="action-panel">
          <Row className="mx-0">
            <Col lg={9} md={9} sm={8}>
              <UserDetailsChangeLogsFilter
                filter={filter}
                setFilter={setFilter}
                setUseFilter={setUseFilter}
                exportData={exportData}
                exportLink={exportLink}
                exportHeaders={exportHeaders}
                download={download}
              />
            </Col>
          </Row>
        </div>
        {isLoading && <p>Loading...</p>}
        {isSuccess && (
          <table {...getTableProps()} className="table">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      {column.isSorted ? <Sorting column={column} /> : ""}
                      <div
                        {...column.getResizerProps()}
                        className={`resizer ${
                          column.isResizing ? "isResizing" : ""
                        }`}
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="table table--bordered" {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                const subCount = (row.id.match(/\./g) || []).length;
                // const paddingCount = subCount > 0 ? Number(subCount) + 3 : 0;
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      // console.log(cell)
                      const paddingLeft = subCount * 20;
                      return (
                        <td {...cell.getCellProps()}>
                          <span
                            style={
                              cell.column.Header === "#"
                                ? { paddingLeft: `${paddingLeft}px` }
                                : null
                            }
                          >
                            {cell.render("Cell")}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
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
        )}

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
      </div>
    </>
  );
};

const Sorting = ({ column }) => (
  <span className="react-table__column-header sortable">
    {column.isSortedDesc === undefined ? (
      <SortIcon />
    ) : (
      <span>
        {column.isSortedDesc ? <SortAscendingIcon /> : <SortDescendingIcon />}
      </span>
    )}
  </span>
);

const TableWrapper = ({organization, programs}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <DataTable organization={organization}  programs={programs} />
    </QueryClientProvider>
  );
};

const mapStateToProps = (state) => {
  return {
      organization: state.organization,
  };
};
export default connect(mapStateToProps)(TableWrapper);