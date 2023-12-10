import React, {useEffect, useMemo, useState, useCallback} from "react";
import {useExpanded, useFlexLayout, usePagination, useResizeColumns, useSortBy, useTable} from "react-table";
import {QueryClient, QueryClientProvider, useQuery} from 'react-query'
import {toCurrency, toPoints} from '@/shared/helpers'
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import {Col, Row} from 'reactstrap';
import {dateStrToYmd} from '@/shared/helpers';
import {TABLE_COLUMNS} from "./columns";

import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {
  reducer,
  useEffectToDispatch,
  fetchApiData,
  fetchApiDataExport,
  initialState,
  TableFilter,
  Sorting
} from "@/shared/apiTableHelper"
import axios from "axios";
import {isEqual, clone} from 'lodash';
import moment from "moment";

const queryClient = new QueryClient()

const DataTable = ({organization, merchants}) => {
    const [filter, setFilter] = useState({
        merchants: merchants,
        createdOnly: false,
        reportKey: 'sku_value',
        programId: 1
    });
    const [useFilter, setUseFilter] = useState(false);
    const [trigger, setTrigger] = useState(0);
    const [exportData, setExportData] = useState([]);
    const [exportHeaders, setExportHeaders] = useState([]);
    const [exportToCsv, setExportToCsv] = useState(false);
    const exportLink = React.createRef();

    const [{queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger}, dispatch] =
        React.useReducer(reducer, initialState);

  const apiUrl = `/organization/${organization.id}/report/inventory-order`;
  const {isLoading, error, data, isSuccess} = useQuery(
    ['', apiUrl, queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy, queryTrigger],
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
    function objectToCSV(data) {
        const csvRows = data.map(row =>
            Object.values(row).map(value => JSON.stringify(value, replacer)).join(',')
        );

        return csvRows.join('\r\n');

        function replacer(key, value) {
            return value === null || value === undefined ? '' : value;
        }
    }

    const download = async (filterValues) => {
        let tmpFilter = {...filterValues, exportToCsv: 1};

        const response = await fetchApiDataExport({
            url: apiUrl,
            filter: tmpFilter,
            sortby: queryPageSortBy,
            trigger: queryTrigger
        });

        if (response.results && Array.isArray(response.results.data)) {
            const csvData = objectToCSV(response.results.data);
            if (csvData) {
                setExportData(csvData);
                setExportHeaders(Object.keys(response.results.data[0]));
                setExportToCsv(true);
            } else {
                console.error('Failed to serialize data for CSV export');
            }
        } else {
            console.error('Data is not an array:', response.results);
        }
    };
  useEffect(() => {
    if (exportToCsv) {
      if (exportLink.current) {
        setExportToCsv(false);
        exportLink.current.link.click();
      }
    }
  }, [exportLink])



  let columns = useMemo(() => TABLE_COLUMNS, [])

  const totalPageCount = Math.ceil(totalCount / queryPageSize)

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        rows,
        prepareRow,
        rowSpanHeaders,
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
            columns: columns,
            data: data ? Object.values(data.results) : [],
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
            disableResizing: true,
            autoResetHiddenColumns: false,
            striped: true
        },
        useSortBy,
        useExpanded,
        usePagination,
        useResizeColumns,
        // useFlexLayout,
    );

    const manualPageSize = []
    useEffectToDispatch(dispatch, {pageIndex, pageSize, gotoPage, sortBy, filter, data, useFilter, trigger});


    if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {JSON.stringify(error)}</p>;
  }

  if (isSuccess)
  return (
    <>
      <div className='table react-table report-table'>
        <div className="action-panel">
          <Row className="mx-0">
            <Col>
              <TableFilter filter={filter} setFilter={setFilter} setUseFilter={setUseFilter}
                           exportData={exportData} exportLink={exportLink} exportHeaders={exportHeaders}
                           download={download}

                           config={{
                               keyword: false,
                               dateRange: false,
                               date: true,
                               merchants: true,
                               exportToCsv: true
                           }}/>
            </Col>
          </Row>
          <div style={{clear: 'both'}}>&nbsp;</div>
          <div style={{clear: 'both'}}>&nbsp;</div>
        </div>
        {
          isLoading && <p>Loading...</p>
        }
        {
          isSuccess &&
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
            <tfoot>
            {footerGroups.map((footerGroup) => (
              <tr {...footerGroup.getFooterGroupProps()}>
                {footerGroup.headers.map(column => (
                  <th {...column.getFooterProps()}>{column.render('Footer')}</th>
                ))}
              </tr>
            ))}
            </tfoot>
          </table>
        }

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
      </div>
    </>
  )
}

const TableWrapper = ({organization, merchants}) => {
  if (!organization) return 'Loading...'
  return (
    <QueryClientProvider client={queryClient}>
      <DataTable organization={organization} merchants={merchants}/>
    </QueryClientProvider>
  )
}

export default withRouter(connect((state) => ({
  organization: state.organization
}))(TableWrapper));