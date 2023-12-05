import React, { useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import axios from "axios";
import { TABLE_COLUMNS } from "./columns";
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

const fetchApiData = async (url, page, size) => {
    const params = { page, size };
    const response = await axios.get(url, { params });
    return response.data;
};

const queryClient = new QueryClient();

function reducer(state, action) {
    switch (action.type) {
        case 'SET_PAGE_INDEX':
            return { ...state, pageIndex: action.pageIndex };
        case 'SET_PAGE_SIZE':
            return { ...state, pageSize: action.pageSize };
        default:
            return state;
    }
}

const DataTable = ({ organizationId }) => {
    const [state, dispatch] = React.useReducer(reducer, { pageIndex: 0, pageSize: 10 });

    const apiUrl = `/organization/${organizationId}/report/trial-balance`;
    const { isLoading, error, data } = useQuery(
        ['trialBalanceData', apiUrl, state.pageIndex, state.pageSize],
        () => fetchApiData(apiUrl, state.pageIndex, state.pageSize),
        { keepPreviousData: true }
    );

    const columns = useMemo(() => TABLE_COLUMNS, []);
    const tableInstance = useTable(
        {
            columns,
            data: data ? data.results : [],
            initialState: { pageIndex: state.pageIndex },
            manualPagination: true,
            pageCount: data ? Math.ceil(data.totalCount / state.pageSize) : 0,
        },
        useSortBy,
        usePagination
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state: { pageIndex, pageSize }
    } = tableInstance;

    useEffect(() => {
        dispatch({ type: 'SET_PAGE_INDEX', pageIndex });
        dispatch({ type: 'SET_PAGE_SIZE', pageSize });
    }, [pageIndex, pageSize]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div className='table react-table report-table'>
            <table {...getTableProps()} className="table">
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {page.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            ))}
                        </tr>
                    );
                })}
                </tbody>
            </table>
            <ReactTablePagination
                page={page}
                gotoPage={(pageIndex) => dispatch({ type: 'SET_PAGE_INDEX', pageIndex })}
                pageIndex={pageIndex}
                pageSize={pageSize}
                setPageSize={(pageSize) => dispatch({ type: 'SET_PAGE_SIZE', pageSize })}
                pageCount={data ? Math.ceil(data.totalCount / pageSize) : 0}
            />
        </div>
    );
};

const TableWrapper = ({ organizationId }) => {
    if (!organizationId) return 'Loading...';
    return (
        <QueryClientProvider client={queryClient}>
            <DataTable organizationId={organizationId} />
        </QueryClientProvider>
    );
};

export default withRouter(connect((state) => ({
    organization: state.organization
}))(TableWrapper));
