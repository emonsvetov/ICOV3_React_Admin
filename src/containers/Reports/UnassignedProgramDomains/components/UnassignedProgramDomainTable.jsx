import React, { useEffect, useMemo, useState } from 'react';
import { useExpanded, usePagination, useResizeColumns, useSortBy, useTable } from 'react-table';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import { Col, Row } from 'reactstrap';
import { TABLE_COLUMNS } from './columns';
import { connect } from 'react-redux';
import { reducer, useEffectToDispatch, fetchApiData, initialState, Sorting } from '@/shared/apiTableHelper';
import { clone } from 'lodash';
import UnassignedProgramDomainFilter from './UnassignedProgramDomainFilter';

const queryClient = new QueryClient();

const DataTable = ({ organization, programs }) => {
    const [filter, setFilter] = useState({ keyword: '', rootProgramName: '' });
    const [{ queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger }, dispatch] = React.useReducer(reducer, initialState);

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

    const filteredData = useMemo(() => {
        if (!data || !data.results) return [];

        return data.results.filter(item => {
            const itemName = item.name ? item.name.toLowerCase() : '';
            const itemRootName = item.root_name ? item.root_name.toLowerCase() : '';
            const filterKeyword = filter.keyword.toLowerCase();
            const filterRootProgramName = filter.rootProgramName.toLowerCase();

            return itemName.includes(filterKeyword) && itemRootName.includes(filterRootProgramName);
        });
    }, [data, filter]);

    let columns = useMemo(() => TABLE_COLUMNS, []);
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
        state: { pageIndex, pageSize, sortBy }
    } = useTable({
            columns,
            data: filteredData,
            initialState: {
                pageIndex: queryPageIndex,
                pageSize: queryPageSize,
                sortBy: queryPageSortBy,
            },
            manualPagination: true,
            pageCount: totalPageCount,
        },
        useSortBy,
        useExpanded,
        usePagination,
        useResizeColumns
    );

    useEffectToDispatch(dispatch, { pageIndex, pageSize, gotoPage, sortBy, filter, data, queryTrigger });

    useEffect(() => {
        setPageSize(10);
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {JSON.stringify(error)}</p>;

    return (
        <>
            <div className='table react-table report-table'>
                <div className="action-panel">
                    <Row className="mx-0">
                        <Col>
                            <UnassignedProgramDomainFilter
                                onClickFilterCallback={onClickFilterCallback}
                            />
                        </Col>
                    </Row>
                </div>
                {isSuccess && (
                    <table {...getTableProps()} className="table table-striped report-table">
                        <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                        {column.isSorted ? <Sorting column={column} /> : ''}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                        {page.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                    })}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}
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
                    />
                )}
            </div>
        </>
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
