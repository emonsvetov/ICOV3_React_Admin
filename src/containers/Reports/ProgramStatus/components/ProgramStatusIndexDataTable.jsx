import React, {useEffect, useMemo, useState} from "react";
import {useExpanded, useFlexLayout, usePagination, useResizeColumns, useSortBy, useTable} from "react-table";
import {QueryClient, QueryClientProvider, useQuery} from 'react-query'
import {TABLE_COLUMNS} from "./columns";
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import {Col, Row} from 'reactstrap';
import {getFirstDay} from '@/shared/helpers'
import {Loader} from '@/shared/apiHelper.jsx';

import {withRouter} from "react-router-dom";
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
import { StickyContainer, Sticky } from "react-sticky";
import ProgramStatusFilter from './ProgramStatusFilter'

const queryClient = new QueryClient()

const DataTable = ({organization, programs}) => {
  const defaultFrom = getFirstDay();
  const [filter, setFilter] = useState({programs: programs, awardLevels: [], from: defaultFrom, to: new Date()});
  const [useFilter, setUseFilter] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const [exportData, setExportData] = useState([]);
  const [exportHeaders, setExportHeaders] = useState([]);
  const [exportToCsv, setExportToCsv] = useState(false);
  const [filterValues, setFilterValues] = useState([]);
  const exportLink = React.createRef();

  let columns = useMemo(() => TABLE_COLUMNS, [])

  initialState.queryPageSize = 999999999;
  const [{queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger}, dispatch] =
    React.useReducer(reducer, initialState);

  const apiUrl = `/organization/${organization.id}/report/portfolio-status-report-new`;
  const {isLoading, error, data, isSuccess, isFetching} = useQuery(
    ['', apiUrl,  queryPageFilter, queryPageSortBy, queryTrigger],
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

  useEffect(() => {
    if (exportToCsv) {
      if (exportLink.current) {
        setExportToCsv(false);
        exportLink.current.link.click();
      }
    }
  }, [exportLink])

  const download = async (filterValues) => {
    let tmpFilter = clone(filterValues);
    tmpFilter.exportToCsv = 1;

    const response = await fetchApiDataExport(
      {
        url: apiUrl,
        filter: tmpFilter,
        sortby: queryPageSortBy,
        trigger: queryTrigger
      }
    );
    setExportData(response.results);
    setExportHeaders(response.headers);
    setExportToCsv(true);
  }


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
      disableResizing: true
    },
    useSortBy,
    useExpanded,
    usePagination,
    useResizeColumns,
    useFlexLayout,
  );

  const manualPageSize = []
  useEffectToDispatch(dispatch, {pageIndex, pageSize, gotoPage, sortBy, filter, data, useFilter, trigger});

  const availableAwardLevels = [
    {value: 'default', label: 'Default'},
    {value: 'ntc', label: 'NTC'}
  ];

  if (error) {
    return <p>Error: {JSON.stringify(error)}</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isSuccess)
    return (
      <StickyContainer>
        <div className='table react-table report-table'>
          <div className="action-panel">
            <Row className="form__form-group mx-0">
              <Col>
                <ProgramStatusFilter filter={filter} 
                                setFilter={setFilter} 
                                setUseFilter={setUseFilter}
                                exportData={exportData} 
                                exportLink={exportLink} 
                                exportHeaders={exportHeaders}
                                download={download}
                                config={{
                                    keyword: false,
                                    dateRange: true,
                                    // awardLevels: availableAwardLevels,
                                    programs: true,
                                    exportToCsv: true
                                }}
                  loading={isLoading || isFetching} />
              </Col>
            </Row>
            <div className='cleafix'>&nbsp;</div>
          </div>
          {
            isLoading || isFetching && <Loader></Loader>
          }
          {
            isSuccess &&
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

        </div>
      </StickyContainer>
    )
}

const TableWrapper = ({organization, programs}) => {
  if (!organization) return 'Loading...'
  return (
    <QueryClientProvider client={queryClient}>
      <DataTable organization={organization} programs ={programs}/>
    </QueryClientProvider>
  )
}

export default withRouter(connect((state) => ({
  organization: state.organization
}))(TableWrapper));