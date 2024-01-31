import React, {useState, useEffect, useMemo} from "react";
import {useExpanded, useFlexLayout, usePagination, useResizeColumns, useSortBy, useTable} from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import {JOURNAL_DETAILED_COLUMNS} from "./columns";
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import { Col, Row} from 'reactstrap';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {clone} from 'lodash';
import JournalDetailedFilter  from "./JournalDetailedFilter";
import {
  reducer,
  useEffectToDispatch,
  fetchApiData,
  fetchApiDataExport,
  initialState,
  Sorting
} from "@/shared/apiTableHelper"
import {getFirstDay} from '@/shared/helpers'
import { StickyContainer, Sticky } from "react-sticky";

const queryClient = new QueryClient()

const DataTable = ({organization, programs}) => {

  // console.log(organization)

  const defaultFrom = getFirstDay();
  const [filter, setFilter] = useState({programs: programs, awardLevels: [], from: defaultFrom, to: new Date()});
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
    }, [exportLink])
  
    const download = async (filterValues) => {
      let tmpFilter = clone(filterValues);
      tmpFilter.exportToCsv = 1;
      tmpFilter.limit = pageSize;
      tmpFilter.page = pageIndex+1;
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
   
    let program_columns = [
        ...JOURNAL_DETAILED_COLUMNS,
    ]
    let columns = useMemo( () => program_columns, [])

    const defaultColumn = React.useMemo(
        () => ({
          maxWidth: 100,
        }),
        []
    )

    const [{queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger}, dispatch] =
    React.useReducer(reducer, initialState);

    const apiUrl = `/organization/${organization.id}/report/journal-detailed`;
    const {isLoading, error, data, isSuccess, isFetched, isFetching} = useQuery(
      ['journal-detailed', apiUrl, queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy, queryTrigger],
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

    const totalPageCount = Math.ceil(totalCount / queryPageSize)

    console.log(data)

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

    if (error) {
        return <p>Error: {JSON.stringify(error)}</p>;
    }

    if (isLoading || !organization?.id) {
      return <p>Loading...</p>;
    }
 
    if (isSuccess)
    return (
      <StickyContainer>
        <div className='table react-table report-table'>
          <div className="action-panel">
            <Row className="mx-0">
              <Col>
                <JournalDetailedFilter 
                  filter={filter} 
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
                  loading={isLoading || isFetching}
                />
              </Col>
            </Row>
            <div style={{clear: 'both'}}>&nbsp;</div>
          </div>
          {
            (isLoading || isFetching) && <p className="text-center">Loading...</p>
          }
          <div style={{width:"100%", overflow:'scroll'}}>
            {
              // ref={r => { csvLinkTable = r; }}
              isSuccess &&
              <table {...getTableProps()} className="table table--bordered table--grouped">
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
      
                  return (
                    <tr {...row.getRowProps()}>
                      {
                        row.cells.map(cell => {
                          return <td {...cell.getCellProps()}>
                            {cell.render('Cell')}
                           
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
      </StickyContainer>
    )
}

const TableWrapper = ({organization, programs}) => {
  if (!organization || !programs) return 'Loading...'
  return (
    <QueryClientProvider client={queryClient}>
      <DataTable organization={organization} programs={programs}/>
    </QueryClientProvider>
  )
}

export default withRouter(connect((state) => ({
  organization: state.organization
}))(TableWrapper));