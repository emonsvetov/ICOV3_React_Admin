import React, {useEffect, useMemo, useState} from "react";
import {useExpanded, usePagination, useResizeColumns, useSortBy, useTable} from "react-table";
import {QueryClient, QueryClientProvider, useQuery} from 'react-query'
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import {Col, Row} from 'reactstrap';

import {TABLE_COLUMNS} from "./columns";

import {connect} from "react-redux";
import {
    reducer,
    useEffectToDispatch,
    fetchApiData,
    fetchApiDataExport,
    initialState,

    Sorting
} from "@/shared/apiTableHelper"

import {clone} from 'lodash';
import TrialBalanceFilter from "./TrialBalanceFilter";
import {getFirstDay} from '@/shared/helpers'
import { StickyContainer, Sticky } from "react-sticky";
const queryClient = new QueryClient()

const DataTable = ({organization, programs}) => {

    const defaultFrom = getFirstDay();
    const [filter, setFilter] = useState({
        programs: programs,
        from: defaultFrom,
        to: new Date(),
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

    const apiUrl = `/organization/${organization.id}/report/trial-balance`;
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
        // console.log(response)
        setExportData(response.results);
        setExportHeaders(response.headers);
        setExportToCsv(true);
    }

    let columns = useMemo(() => TABLE_COLUMNS, [])

    const totalPageCount = Math.ceil(totalCount / queryPageSize)

    // console.log(data)

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
                                <TrialBalanceFilter
                                    filter={filter} setFilter={setFilter} useFilter={useFilter}
                                    setUseFilter={setUseFilter}
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
                        <table {...getTableProps()} className="table table-striped report-table">
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
                            <tbody className="table table--bordered" {...getTableBodyProps()} >
                            {page.map((row, rowIndex) => {

                                if (rowIndex > 0) return
                                return Object.entries(row.original).map(([indexAccountHolder, rowAccountHolder], i) => {
    
                                    let rowSpan = Object.keys(rowAccountHolder).length;

                                    return (
                                        <>
                                            <tr key={i}>
                                                <td rowSpan={rowSpan}>
                                                    {indexAccountHolder}
                                                </td>
                                                {Object.entries(rowAccountHolder).map(([indexAccount, rowAccount], i2) => {
                                                    if (i2 > 0) return;
                                                    let el1 =
                                                        <>
                                                            <td>
                                                                {indexAccount}
                                                            </td>
                                                        </>
                                                    let el = Object.entries(rowAccount).map(([indexValue, value], i3) => {
                                                        return (
                                                            <>
                                                                <td>
                                                                    {value === 0 ? '' : value}
                                                                </td>
                                                            </>
                                                        )
                                                    })
                                                    el.unshift(el1)
                                                    return el;
                                                })
                                                }
                                            </tr>
                                            {rowSpan > 1 && Object.entries(rowAccountHolder).map(([indexAccount, rowAccount], i0) => {
                                                if (i0 > 0) return;

                                                let finalRow = Object.entries(rowAccountHolder).map(([indexAccount, rowAccount], i2) => {
                                                    if (i2 === 0) return;
                                                    let el1 =
                                                        <>
                                                            <td>
                                                                {indexAccount}
                                                            </td>
                                                        </>
                                                    let el = Object.entries(rowAccount).map(([indexValue, value], i3) => {
                                                        return (
                                                            <>
                                                                <td>
                                                                    {value === 0 ? '' : value}
                                                                </td>
                                                            </>
                                                        )
                                                    })
                                                    el.unshift(el1)
                                                    el = <>
                                                        <tr>{el}</tr>
                                                    </>
                                                    return el;
                                                })
                                                return finalRow;

                                                {/*</tr>*/
                                                }
                                            })}
                                        </>
                                    )
                                })

                            })}
                            </tbody>
                            <tfoot>
                                {page.map((row, rowIndex) => {
                                    if (rowIndex === 0) return;

                                    let finalRow = Object.entries(row.original).map(([indexAccountHolder, rowAccountHolder], i) => {
                                        return (
                                            <>
                                                <td key={i}>
                                                    {rowAccountHolder}
                                                </td>
                                            </>
                                        )
                                    });
                                    let el1 =
                                        <>
                                            <td>Total</td>
                                            <td></td>
                                        </>
                                    finalRow.unshift(el1)

                                    finalRow = <>
                                        <tr>{finalRow}</tr>
                                    </>
                                    return finalRow;
                                })}
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

const mapStateToProps = (state) => {
    return {
        organization: state.organization,
    };
};
export default connect(mapStateToProps)(TableWrapper);