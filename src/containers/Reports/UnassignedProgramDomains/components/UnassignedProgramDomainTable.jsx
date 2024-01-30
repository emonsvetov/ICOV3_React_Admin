import React, { useEffect, useMemo, useState } from 'react';
import { useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout } from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import { Col, Row } from 'reactstrap';
import { PROGRAM_COLUMNS } from './columns';
import { connect } from 'react-redux';
import { clone } from 'lodash';
import { reducer, useEffectToDispatch, fetchApiData, fetchApiDataExport, initialState, Sorting } from "@/shared/apiTableHelper";
import UnassignedProgramDomainFilter from './UnassignedProgramDomainFilter';
import { StickyContainer, Sticky } from "react-sticky";

const queryClient = new QueryClient();

const DataTable = ({ organization, programs }) => {
    const [filter, setFilter] = useState({ keyword: '', rootProgramName: '' });
    const [exportData, setExportData] = useState([]);
    const [exportHeaders, setExportHeaders] = useState([]);
    const [exportToCsv, setExportToCsv] = useState(false);
    const exportLink = React.createRef();
    const [{queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger}, dispatch] =
        React.useReducer(reducer, initialState);

    const onClickFilterCallback = (newFilter) => {
        setFilter(newFilter);
    };


    const apiUrl = `/organization/${organization.id}/report/unassigned-program-domains`;
    const { isLoading, error, data, isSuccess } = useQuery(
        ['', apiUrl, queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy, queryTrigger],
        () => fetchApiData({
            url: apiUrl,
            page: queryPageIndex,
            size: queryPageSize,
            filter,
            sortby: queryPageSortBy,
            trigger: queryTrigger
        }),
        {
            keepPreviousData: true,
            staleTime: Infinity,
        }
    );

    // const filteredData = useMemo(() => {
    //     if (!data || !data.results) return [];
    //     return data.results.filter(item => {
    //         const itemName = item.name ? item.name.toLowerCase() : '';
    //         const itemRootName = item.root_name ? item.root_name.toLowerCase() : '';
    //         const filterKeyword = filter.keyword.toLowerCase();
    //         const filterRootProgramName = filter.rootProgramName.toLowerCase();
    //         return itemName.includes(filterKeyword) && itemRootName.includes(filterRootProgramName);
    //     });
    // }, [data, filter]);

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

    // useEffect(() => {
    //     if (data && data.total) {
    //         dispatch({ type: 'TOTAL_COUNT_CHANGED', payload: data.total });
    //     }
    // }, [data]);

    useEffect(() => {
        if (exportToCsv) {
            if (exportLink.current) {
                setExportToCsv(false);
                exportLink.current.link.click();
            }
        }
    }, [exportLink])

    let columns = useMemo(() => PROGRAM_COLUMNS, []);
    const totalPageCount = Math.ceil(totalCount / queryPageSize);

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

    useEffectToDispatch(dispatch, { pageIndex, pageSize, gotoPage, sortBy, filter, data, queryTrigger });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {JSON.stringify(error)}</p>;

    return (
        <StickyContainer>
            <div className='table react-table report-table'>
                <div className="action-panel">
                    <Row className="mx-0">
                        <Col>
                            <UnassignedProgramDomainFilter onClickFilterCallback={onClickFilterCallback}
                                                           exportData={exportData} exportLink={exportLink} exportHeaders={exportHeaders}
                                                           download={download} />
                        </Col>
                    </Row>
                </div>
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
                        dataLength={totalCount}
                    />
                )}
            </div>
        </StickyContainer>
    );
};

const TableWrapper = ({ organization, programs }) => {
    if (!organization || !programs) return 'Loading...';
    return (
        <QueryClientProvider client={queryClient}>
            <DataTable organization={organization} programs={programs} />
        </QueryClientProvider>
    );
};

const mapStateToProps = (state) => {
    return {
        organization: state.organization,
    };
};

export default connect(mapStateToProps)(TableWrapper);
