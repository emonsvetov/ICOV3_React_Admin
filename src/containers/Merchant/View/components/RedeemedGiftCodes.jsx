import React, {useState, useMemo} from "react";
import { useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout } from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

import {REDEEMED_GIFT_CODES_COULMNS}  from "./columns";

import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import UploadGiftCodesModal  from "./UploadGiftCodesModal";
import { Row, Col } from 'reactstrap';
import { format, subHours } from 'date-fns';
import { CSVLink } from 'react-csv';

import {reducer, useEffectToDispatch, fetchApiData, initialState, TableFilter, Sorting} from "@/shared/apiTableHelper"

const queryClient = new QueryClient()

const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    const adjustedDate = subHours(date, 4);
    return format(adjustedDate, 'yyyy-MM-dd HH:mm:ss');
};

const DataTable = ({merchant}) => {
    
    const [filter, setFilter] = useState({ from:'', to: '', type:'redeemed'});
    const [useFilter, setUseFilter] = useState(false);
    const [isOpen, setOpen] = useState(false)
    const [trigger, setTrigger] = useState( 0 );
    const [allDataCSV, setAllDataCSV] = useState([]);

    const toggle = () => {
        setOpen(prevState => !prevState)
    }

    let columns = useMemo( () => REDEEMED_GIFT_CODES_COULMNS, [])
    
    const [{ queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger }, dispatch] =
    React.useReducer(reducer, initialState);

    const apiUrl = `/merchant/${merchant.id}/giftcode`

    const fetchAllDataForCSV = async () => {
        try {
            const params = {
                allmerch: true, 
                ...filter, 
            };
            const response = await axios.get(apiUrl, { params });
               
            const formattedData = response.data.map(item => {
                return {
                    ...item,
                    adjusted_redemption_datetime: formatDateTime(item.redemption_datetime)
                };
            });
            setAllDataCSV(formattedData);
        } catch (error) {
            console.error("Error fetching all data for CSV: ", error);
        }
    };
    
    useEffect(() => {
        fetchAllDataForCSV();
    }, [filter]);

    const { isLoading, error, data, isSuccess } = useQuery(
        ['giftcodes', apiUrl, queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy, queryTrigger],
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

    const transformedData = data ? data.results.map(item => ({
        ...item,
        adjusted_redemption_datetime: formatDateTime(item.redemption_datetime)
    })) : [];
    

    const totalPageCount = Math.ceil(totalCount / queryPageSize)

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
        data: data ? transformedData : [],
        initialState: {
            pageIndex: queryPageIndex,
            pageSize: queryPageSize,
            sortBy: queryPageSortBy
        },
        manualPagination: true, // Tell the usePagination
        pageCount: data ? totalPageCount : null,
        autoResetSortBy: false,
        autoResetExpanded: false,
        autoResetPage: false,
    },
    useSortBy,
    useExpanded,
    usePagination,
    useResizeColumns,
    useFlexLayout
    );
    // const [statusFilterValue, setStatusFilterValue] = useState("");
    const manualPageSize = []

    
    useEffectToDispatch( dispatch, {pageIndex, pageSize, gotoPage, sortBy, filter, data, useFilter, trigger} );

    if (error) {
        return <p>Error: {JSON.stringify(error)}</p>;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if(isSuccess)
    return (
            <>
                <div className='table react-table available-table'>
                    <Row>
                        <Col md={10}>
                            <TableFilter filter={filter} setFilter={setFilter} setUseFilter={setUseFilter} config={{label:'codes', keyword:false, dateRange: true, type: 'redeemed'}} />
                        </Col>
                        <Col md={2} className="text-right pr-0">
                            <CSVLink 
                                data={allDataCSV}
                                filename={"exported_data.csv"}
                                className="btn btn-primary account__btn account__btn--small"
                                style={{maxWidth:'200px'}}
                            >
                                Export to CSV
                            </CSVLink>
                        </Col>
                    </Row>
                    <table {...getTableProps()} className="table">
                        <thead>
                            {headerGroups.map( (headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map( (column, i) => (
                                        <th className={`cell-column-${i}`} {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                                const paddingCount = subCount > 0 ? Number(subCount) + 2 : 0;
                                // console.log(subCount)
                                return (
                                    <tr {...row.getRowProps()}>
                                        {
                                            row.cells.map( (cell, i) => {
                                                // console.log(cell)
                                                return <td className={`cell-column-${i}`} {...cell.getCellProps()}><span className={cell.column.Header==='#' ? `pl-${paddingCount}` : ''}>{cell.render('Cell')}</span></td>
                                            })
                                        }
                                    </tr>
                                )
                            })}
                        </tbody>
                        {/* <tfoot>
                            {footerGroups.map( (footerGroup) => (
                                <tr {...footerGroup.getFooterGroupProps()}>
                                    {footerGroup.headers.map( column => (
                                        <th {...column.getFooterProps()}>{column.render('Footer')}</th>
                                    ))}
                                </tr>
                            ))}
                        </tfoot> */}
                    </table>
                </div>
                {/* <UploadGiftCodesModal isOpen={isOpen} setOpen={setOpen} toggle={toggle} data={data}  /> */}
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
                <UploadGiftCodesModal isOpen={isOpen} toggle={toggle} data={data} setTrigger={setTrigger} />
            </>
    )
}

const TableWrapper = ({merchant}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <DataTable merchant={merchant} />
        </QueryClientProvider>
    )
}

export default TableWrapper;
