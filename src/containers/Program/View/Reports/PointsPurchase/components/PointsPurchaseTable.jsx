import React, {useState, useEffect, useMemo} from "react";
import { useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout } from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import {PROGRAM_COLUMNS} from "./columns";
import {useParams} from 'react-router-dom'
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import { Col, Row} from 'reactstrap';
import PointsPurchaseFilter  from "./PointsPurchaseFilter";
import { clone} from 'lodash';
import {connect} from "react-redux";
import {
    reducer,
    useEffectToDispatch,
    fetchApiData,
    fetchApiDataExport,
    initialState,
   
    Sorting
} from "@/shared/apiTableHelper"


const queryClient = new QueryClient()

const PAGE_CHANGED = 'PAGE_CHANGED';
const PAGE_SIZE_CHANGED = 'PAGE_SIZE_CHANGED';
const PAGE_SORT_CHANGED = 'PAGE_SORT_CHANGED'
const PAGE_FILTER_CHANGED = 'PAGE_FILTER_CHANGED';
const TOTAL_COUNT_CHANGED = 'TOTAL_COUNT_CHANGED';

const DataTable = ({organization, programs}) => {

    
    const [filter, setFilter] = useState({
        programs: programs,
        createdOnly: false,
        reportKey: 'sku_value',
        programId: 1,
        year:new Date().getFullYear()
    });
    // var [data, setData] = useState([]);
    let {programId} = useParams();
    const exportLink = React.createRef();
    const [useFilter, setUseFilter] = useState(false);
    const [trigger, setTrigger] = useState(0);
    const [exportData, setExportData] = useState([]);
    const [exportHeaders, setExportHeaders] = useState([]);
    const [exportToCsv, setExportToCsv] = useState(false);


    const download = async (filterValues) => {
        let tmpFilter = clone(filterValues);
        tmpFilter.exportToCsv = 1;
        tmpFilter.page = pageIndex+1;
        tmpFilter.limit = pageSize;
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

    const [{ queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger}, dispatch] =
    React.useReducer(reducer, initialState);

    const apiUrl = `/organization/${organization.id}/report/points-purchase`;

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
    
    useEffect(() => {
        if (exportToCsv) {
            if (exportLink.current) {
                setExportToCsv(false);
                exportLink.current.link.click();
            }
        }
    }, [exportLink])

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
        defaultColumn,
        
    },
    useSortBy,
    useExpanded,
    usePagination,
    useResizeColumns, 
    useFlexLayout,
    );
    // const [statusFilterValue, setStatusFilterValue] = useState("");
    const manualPageSize = []
    useEffectToDispatch(dispatch, {pageIndex, pageSize, gotoPage, sortBy, filter, data, useFilter, trigger});

    React.useEffect(() => {
        dispatch({ type: PAGE_CHANGED, payload: pageIndex });
    }, [pageIndex]);

    React.useEffect(() => {
        // alert(PAGE_SIZE_CHANGED)
        dispatch({ type: PAGE_SIZE_CHANGED, payload: pageSize });
        gotoPage(0);
    }, [pageSize, gotoPage]);

    useEffect(() => {
        dispatch({ type: PAGE_SORT_CHANGED, payload: sortBy });
        gotoPage(0);
    }, [sortBy, gotoPage]);

    React.useEffect(() => {
        // alert(PAGE_FILTER_CHANGED)
        dispatch({ type: PAGE_FILTER_CHANGED, payload: filter });
        gotoPage(0);
    }, [filter, gotoPage]);

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

    
    return (
            <>
                <div className='table react-table'>
                    <div className="action-panel">
                        <Row className="mx-0">
                            <Col lg={12} md={12} sm={12}>
                                <PointsPurchaseFilter  filter={filter} setFilter={setFilter} useFilter={useFilter} setUseFilter={setUseFilter}
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

                </div>
            </>
    )
}

const TableWrapper = ({organization, programs}) => {
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