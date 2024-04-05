import React, {useState, useEffect, useMemo} from "react";
import {useTable, usePagination, useSortBy, useResizeColumns, useFlexLayout, useExpanded} from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import {JOURNAL_DETAILED_COLUMNS} from "./columns";
import { Col, Row} from 'reactstrap';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {clone} from 'lodash';
import JournalDetailedFilter from "./JournalDetailedFilter";
import {
  reducer,
  useEffectToDispatch,
  fetchApiData,
  fetchApiDataExport,
  initialState,
  Sorting
} from "@/shared/apiTableHelper"
import {getFirstDay} from '@/shared/helpers'

const queryClient = new QueryClient()

const DataTable = ({organization, programs}) => {

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
  
    useEffect(()=>{
      setFilter({programs: programs, awardLevels: [], from: defaultFrom, to: new Date()})
    }, [programs])

    const download = async (filterValues) => {
      let tmpFilter = clone(filterValues);
      tmpFilter.limit = pageSize;
      tmpFilter.page = pageIndex+1;
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
   
    let program_columns = [
        ...JOURNAL_DETAILED_COLUMNS,
    ]
    let columns = useMemo( () => program_columns, [])

    const defaultColumn = React.useMemo(
        () => ({
          // minWidth: 150,
        }),
        []
    )

    const [{ queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger}, dispatch] =
      React.useReducer(reducer, initialState);

    const apiUrl = `/organization/${organization.id}/report/journal-detailed`;

    const { isLoading, error, data, isSuccess } = useQuery(
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

    const totalPageCount = Math.ceil(totalCount / queryPageSize)

    // console.log(data)

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
    state: { pageIndex, pageSize, sortBy }
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

    useEffectToDispatch(dispatch, {pageIndex, pageSize, gotoPage, sortBy, filter, data, useFilter, trigger});

    if (error) {
        return <p>Error: {JSON.stringify(error)}</p>;
    }

    if (isLoading || !organization?.id) {
      return <p>Loading...</p>;
    }

    if (isSuccess)
      return (
        <>
          <div className='table react-table'>
            <div className="action-panel">
              <Row className="mx-0">
                <Col lg={12} md={12} sm={12}>
                  <JournalDetailedFilter  filter={filter} setFilter={setFilter} useFilter={useFilter} setUseFilter={setUseFilter}
                                         exportData={exportData} exportLink={exportLink} exportHeaders={exportHeaders}
                                         download={download} />
                </Col>
              </Row>
            </div>
            {
              isLoading && <p>Loading...</p>
            }
            {
              isSuccess &&
              <table {...getTableProps()} className="table">
                <thead>
                {headerGroups.map( (headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map( column => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                  // const paddingCount = subCount > 0 ? Number(subCount) + 3 : 0;
                  // console.log(subCount)
                  return (
                    <tr {...row.getRowProps()}>
                      {
                        row.cells.map( cell => {
                          // console.log(cell)
                          const paddingLeft = subCount * 20
                          return <td {...cell.getCellProps({className: cell.column.className})}>
                            <span
                              style={cell.column.Header === '#' ? {paddingLeft: `${paddingLeft}px`} : null}>{cell.render('Cell')}</span>
                          </td>
                        })
                      }
                    </tr>
                  )
                })}
                </tbody>
                <tfoot>
                {footerGroups.map( (footerGroup) => (
                  <tr {...footerGroup.getFooterGroupProps()}>
                    {footerGroup.headers.map( column => (
                      <th {...column.getFooterProps()}>{column.render('Footer')}</th>
                    ))}
                  </tr>
                ))}
                </tfoot>
              </table>
            }

          </div>
        </>
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