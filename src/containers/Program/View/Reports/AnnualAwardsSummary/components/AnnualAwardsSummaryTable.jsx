import React, {useState, useEffect, useMemo} from "react";
import {useTable, usePagination, useSortBy, useResizeColumns, useFlexLayout, useExpanded} from "react-table";
import {QueryClient, QueryClientProvider, useQuery} from 'react-query'
import {COLUMNS} from "./columns";
import {Col, Row} from 'reactstrap';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {clone} from 'lodash';
import {toCurrency, toPoints} from '@/shared/helpers'
import AnnualAwardsSummaryFilter from "./AnnualAwardsSummaryFilter";
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
  const [filter, setFilter] = useState({
    programs: programs,
    awardLevels: [],
    year: new Date().getFullYear(),
    month: new Date().getMonth()
  });
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

  useEffect(() => {
    setFilter({programs: programs, awardLevels: [], from: defaultFrom, to: new Date()})
  }, [programs])

  const download = async (filterValues) => {
    let tmpFilter = clone(filterValues);
    tmpFilter.exportToCsv = 1;
    tmpFilter.server = 'program';

    const response = await fetchApiDataExport(
      {
        url: apiUrl,
        filter: tmpFilter,
        sortby: queryPageSortBy,
        trigger: queryTrigger
      }
    );
    let csvData = [];
    let keys1 = ["event_summary_points_awarded", "event_summary_program_budget","event_summary_program_reclaimed","event_summary_transaction_fees"];
    let keys2 = ["annual", "month", "previous_year_annual","previous_year_month"]
    let csvHeader = ["category",...keys2]
    keys1.map((key1, id)=>{
      let tempObject = {
        category: key1
      }
      keys2.map((key2, id)=>{
        tempObject[key2] =  response.results[key1][key2]
      })
      csvData.push(tempObject)

    })
    response.results.event_summary_program_reward.map((program, id)=>{
      let tempProgramObject = {
        category: program.event_name
      }
      keys2.map((key2, id)=>{
        tempProgramObject[key2] =  program[key2]
      })
      csvData.push(tempProgramObject)
    })
    setExportData(csvData);
    setExportHeaders(csvHeader);
    setExportToCsv(true);
  }

  let program_columns = [
    ...COLUMNS,
  ]
  let columns = useMemo(() => program_columns, [])

  const defaultColumn = React.useMemo(
    () => ({
      // minWidth: 150,
    }),
    []
  )

  const [{queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger}, dispatch] =
    React.useReducer(reducer, initialState);

  const apiUrl = `/organization/${organization.id}/report/annual-awards-summary`;

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

  const totalPageCount = Math.ceil(totalCount / queryPageSize)

  // console.log(data)
  let events_total_annual = 0;
  let events_total_month = 0;
  let events_total_previous_year_annual = 0;
  let events_total_previous_year_month = 0;

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
      data: data ? Object.values(data.full.event_summary_program_reward) : [],
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
        <div className='table react-table report-table'>
          <div className="action-panel">
            <Row className="mx-0">
              <Col>
                <AnnualAwardsSummaryFilter
                  filter={filter} setFilter={setFilter} useFilter={useFilter} setUseFilter={setUseFilter}
                  exportData={exportData} exportLink={exportLink} exportHeaders={exportHeaders}
                  download={download}/>
              </Col>
            </Row>
          </div>
          {
            isLoading && <p>Loading...</p>
          }
          {
            isSuccess &&
            <>
              <h4>Program Budget VS
                Awards {new Date(0, data.full.filter.month - 1).toLocaleString('default', {month: 'long'})} {data.full.filter.year}</h4>

              <table className="table table-striped report-table">
                <thead>
                <tr>
                  <th width="20%"></th>
                  <th width="20%">
                    {new Date(0, data.full.filter.month - 1).toLocaleString('default', {month: 'long'})}
                    {' '}
                    {data.full.filter.year - 1}
                  </th>
                  <th width="20%">
                    {new Date(0, data.full.filter.month - 1).toLocaleString('default', {month: 'long'})}
                    {' '}
                    {data.full.filter.year}
                  </th>
                  <th>
                    {data.full.filter.year - 1}
                  </th>
                  <th>
                    {data.full.filter.year}
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr className="odd">
                  <td width="20%">Program Budget</td>
                  <td width="20%">  {toCurrency(data.full.event_summary_program_budget.previous_year_month)}</td>
                  <td width="20%">  {toCurrency(data.full.event_summary_program_budget.month)}</td>
                  <td width="20%">  {toCurrency(data.full.event_summary_program_budget.previous_year_annual)}</td>
                  <td width="20%">  {toCurrency(data.full.event_summary_program_budget.annual)}</td>
                </tr>
                <tr className="odd">
                  <td width="20%">Amount Awarded</td>
                  <td width="20%">{toCurrency(data.full.event_summary_points_awarded.previous_year_month)}</td>
                  <td width="20%">{toCurrency(data.full.event_summary_points_awarded.month)}</td>
                  <td width="20%">{toCurrency(data.full.event_summary_points_awarded.previous_year_annual)}</td>
                  <td width="20%">{toCurrency(data.full.event_summary_points_awarded.annual)}</td>
                </tr>
                <tr className="odd">
                  <td width="20%">Transaction Fees</td>
                  <td width="20%">{toCurrency(data.full.event_summary_transaction_fees.previous_year_month)}</td>
                  <td width="20%">{toCurrency(data.full.event_summary_transaction_fees.month)}</td>
                  <td width="20%">{toCurrency(data.full.event_summary_transaction_fees.previous_year_annual)}</td>
                  <td width="20%">{toCurrency(data.full.event_summary_transaction_fees.annual)}</td>
                </tr>
                <tr className="odd">
                  <td width="20%">Amount Reclaimed</td>
                  <td width="20%">{toCurrency(data.full.event_summary_program_reclaimed.previous_year_month)}</td>
                  <td width="20%">{toCurrency(data.full.event_summary_program_reclaimed.month)}</td>
                  <td width="20%">{toCurrency(data.full.event_summary_program_reclaimed.previous_year_annual)}</td>
                  <td width="20%">{toCurrency(data.full.event_summary_program_reclaimed.annual)}</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                  <td><h6>Remaining Budget</h6></td>
                  <td>
                    <h6>
                      {toCurrency(
                        (parseFloat(data.full.event_summary_program_budget.previous_year_month) - (parseFloat(data.full.event_summary_points_awarded.previous_year_month) + parseFloat(data.full.event_summary_transaction_fees.previous_year_month) - parseFloat(data.full.event_summary_program_reclaimed.previous_year_month))) < 0 ?
                          Math.abs(parseFloat(data.full.event_summary_program_budget.previous_year_month) - (parseFloat(data.full.event_summary_points_awarded.previous_year_month) + parseFloat(data.full.event_summary_transaction_fees.previous_year_month) - parseFloat(data.full.event_summary_program_reclaimed.previous_year_month))) :
                          (parseFloat(data.full.event_summary_program_budget.previous_year_month) - (parseFloat(data.full.event_summary_points_awarded.previous_year_month) + parseFloat(data.full.event_summary_transaction_fees.previous_year_month) - parseFloat(data.full.event_summary_program_reclaimed.previous_year_month))))}
                    </h6>
                  </td>
                  <td>
                    <h6>
                      {toCurrency(
                        (parseFloat(data.full.event_summary_program_budget.month) - (parseFloat(data.full.event_summary_points_awarded.month) + parseFloat(data.full.event_summary_transaction_fees.month) - parseFloat(data.full.event_summary_program_reclaimed.month))) < 0 ?
                          Math.abs(parseFloat(data.full.event_summary_program_budget.month) - (parseFloat(data.full.event_summary_points_awarded.month) + parseFloat(data.full.event_summary_transaction_fees.month) - parseFloat(data.full.event_summary_program_reclaimed.month))) :
                          (parseFloat(data.full.event_summary_program_budget.month) - (parseFloat(data.full.event_summary_points_awarded.month) + parseFloat(data.full.event_summary_transaction_fees.month) - parseFloat(data.full.event_summary_program_reclaimed.month))
                          ))}
                    </h6>
                  </td>
                  <td>
                    <h6>

                      {toCurrency(
                        (parseFloat(data.full.event_summary_program_budget.previous_year_annual) - (parseFloat(data.full.event_summary_points_awarded.previous_year_annual) + parseFloat(data.full.event_summary_transaction_fees.previous_year_annual) - parseFloat(data.full.event_summary_program_reclaimed.previous_year_annual))) < 0 ?
                          Math.abs((parseFloat(data.full.event_summary_program_budget.previous_year_annual) - (parseFloat(data.full.event_summary_points_awarded.previous_year_annual) + parseFloat(data.full.event_summary_transaction_fees.previous_year_annual) - parseFloat(data.full.event_summary_program_reclaimed.previous_year_annual)))) :
                          parseFloat(data.full.event_summary_program_budget.previous_year_annual) - (parseFloat(data.full.event_summary_points_awarded.previous_year_annual) + parseFloat(data.full.event_summary_transaction_fees.previous_year_annual) - parseFloat(data.full.event_summary_program_reclaimed.previous_year_annual)))}
                    </h6>
                  </td>
                  <td>
                    <h6>
                      {toCurrency(
                        (parseFloat(data.full.event_summary_program_budget.annual) - (parseFloat(data.full.event_summary_points_awarded.annual) + parseFloat(data.full.event_summary_transaction_fees.annual) - parseFloat(data.full.event_summary_program_reclaimed.annual))) < 0 ?
                          Math.abs(parseFloat(data.full.event_summary_program_budget.annual) - (parseFloat(data.full.event_summary_points_awarded.annual) + parseFloat(data.full.event_summary_transaction_fees.annual) - parseFloat(data.full.event_summary_program_reclaimed.annual))) :
                          parseFloat(data.full.event_summary_program_budget.annual) - (parseFloat(data.full.event_summary_points_awarded.annual) + parseFloat(data.full.event_summary_transaction_fees.annual) - parseFloat(data.full.event_summary_program_reclaimed.annual)))}
                    </h6>
                  </td>
                </tr>
                </tfoot>
              </table>

              <h4 className="mt-5">Reward Events
                Summary {new Date(0, data.full.filter.month - 1).toLocaleString('default', {month: 'long'})} {data.full.filter.year}</h4>
              <table className="table table-striped report-table">
                <thead>
                <tr>
                  <th width="20%"></th>
                  <th width="20%">
                    {new Date(0, data.full.filter.month - 1).toLocaleString('default', {month: 'long'})}
                    {' '}
                    {data.full.filter.year - 1}
                  </th>
                  <th width="20%">
                    {new Date(0, data.full.filter.month - 1).toLocaleString('default', {month: 'long'})}
                    {' '}
                    {data.full.filter.year}
                  </th>
                  <th>
                    {data.full.filter.year - 1}
                  </th>
                  <th>
                    {data.full.filter.year}
                  </th>
                </tr>
                </thead>
                <tbody  {...getTableBodyProps()} >
                {page.map(row => {
                  prepareRow(row);
                  const subCount = (row.id.match(/\./g) || []).length
                  const subRows = row.subRows;
                  events_total_annual += parseFloat(row.original.annual);
                  events_total_month += parseFloat(row.original.month);
                  events_total_previous_year_annual += parseFloat(row.original.previous_year_annual);
                  events_total_previous_year_month += parseFloat(row.original.previous_year_month);
                  const countSubRows = subRows ? subRows.length : 0;
                  const rowSpan = countSubRows ? countSubRows + 1 : 1;
                  return (
                    <>
                      <tr {...row.getRowProps()} key={row.id}>
                        {
                          row.cells.map(cell => {

                            const skip = cell.value === 'skip_td';
                            if (skip) return null;
                            const paddingLeft = subCount * 20
                            return <td {...cell.getCellProps()} rowSpan={rowSpan} key={cell.column.id + row.id}>
                                                  <span
                                                    style={cell.column.Header === '#' ? {paddingLeft: `${paddingLeft}px`} : null}>{cell.render('Cell')}</span>
                            </td>
                          })
                        }
                      </tr>
                      {countSubRows > 0 && subRows.map(subRow => {

                        prepareRow(subRow);
                        return (
                          <tr {...subRow.getRowProps()} key={subRow.id}>
                            {
                              subRow.cells.map(subCell => {

                                const skip = subCell.value === 'skip_td';
                                if (skip) return null;
                                return <td {...subCell.getCellProps()} key={subCell.column.id + subRow.id}>
                                  <span>{subCell.render('Cell')}</span>
                                </td>
                              })
                            }
                          </tr>
                        )
                      })}
                    </>
                  )
                })}
                </tbody>
                <tfoot>
                <tr>
                  <td><h6>Total</h6></td>
                  <td style={{padding: "4px 4px"}}>
                    <b>
                      {toCurrency(events_total_previous_year_month ? Math.abs(events_total_previous_year_month) : events_total_previous_year_month)}
                    </b>
                  </td>
                  <td style={{padding: "4px 4px"}}>
                    <b>
                      {toCurrency(events_total_month ? Math.abs(events_total_month) : events_total_month)}
                    </b>
                  </td>
                  <td style={{padding: "4px 4px"}}>
                    <b>
                      {toCurrency(events_total_previous_year_annual ? Math.abs(events_total_previous_year_annual) : events_total_previous_year_annual)}
                    </b>
                  </td>
                  <td style={{padding: "4px 4px"}}>
                    <b>
                      {toCurrency(events_total_annual ? Math.abs(events_total_annual) : events_total_annual)}
                    </b>
                  </td>
                </tr>
                </tfoot>
              </table>
            </>
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