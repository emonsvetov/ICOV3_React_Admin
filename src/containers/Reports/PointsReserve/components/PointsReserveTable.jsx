import React, {useState, useEffect, useMemo} from "react";
import { useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout } from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import MOCK_DATA from "./MOCK_DATA.json";
import {PROGRAM_COLUMNS} from "./columns";
import SortIcon from 'mdi-react/SortIcon';
import SortAscendingIcon from 'mdi-react/SortAscendingIcon';
import SortDescendingIcon from 'mdi-react/SortDescendingIcon';
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import {getFirstDay, dateStrToYmd} from '@/shared/helpers'
import { Col, Row} from 'reactstrap';
import {clone} from 'lodash';
import PointsReserveFilter  from "./PointsReserveFilter";
import {connect} from "react-redux";
import {
    reducer,
    useEffectToDispatch,
    fetchApiData,
    fetchApiDataExport,
    initialState,
   
    Sorting
  } from "@/shared/apiTableHelper"
import { StickyContainer, Sticky } from "react-sticky";
const queryClient = new QueryClient()

const DataTable = ({organization, programs}) => {

const [filter, setFilter] = useState({
    programs: programs,
    createdOnly: false,
    reportKey: 'sku_value',
    programId: 1,
    from: dateStrToYmd(getFirstDay()),
    to: dateStrToYmd(new Date())
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


const [{queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger}, dispatch] =
React.useReducer(reducer, initialState);

const apiUrl = `/organization/${organization.id}/report/points-reserve`;
const {isLoading, error, data, isSuccess,isFetched, isFetching} = useQuery(
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

let program_columns = [
    ...PROGRAM_COLUMNS, 

]
    let columns = useMemo( () => program_columns, [])

    const defaultColumn = React.useMemo(
        () => ({
          minWidth: 30,
          width: 150,
          maxWidth: 400,
        }),
        []
    )

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
        disableResizing: true
        
    },
    useSortBy,
    useExpanded,
    usePagination,
    useResizeColumns, 
    useFlexLayout,
    );
    console.log(data)
    // const [statusFilterValue, setStatusFilterValue] = useState("");
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
            <div className='table react-table'>
                <div className="action-panel">
                    <Row className="mx-0">
                        <Col lg={9} md={9} sm={8}>
                            <PointsReserveFilter filter={filter} 
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
                </div>
                {
                    isLoading && <p>Loading...</p>
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
                        {page.map( row => {
                            prepareRow(row);
                            const subCount = (row.id.match(/\./g) || []).length
                            return (
                                <tr {...row.getRowProps()}>
                                    {
                                        row.cells.map( cell => {
                                            // console.log(cell)
                                            const paddingLeft = subCount * 20
                                            return <td {...cell.getCellProps()}><span style={cell.column.Header==='#' ? {paddingLeft: `${paddingLeft}px`} : null}>{cell.render('Cell')}</span></td>
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
            </div>
        </StickyContainer>
    )
}

const TableWrapper = ({organization, programs}) => {
    if (!organization || !programs ) return 'Loading...'
    return (
        <QueryClientProvider client={queryClient}>
            <DataTable organization={organization}  programs={programs}/>
        </QueryClientProvider>
    )
}

const mapStateToProps = (state) => {
    return {
      organization: state.organization,
    };
  };
  export default connect(mapStateToProps)(TableWrapper);