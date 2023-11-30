import React, {useState, useEffect, useMemo} from "react";
import { useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout } from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import {SUB_MERCHANTS_COLUMNS}  from "./columns";
import SortIcon from 'mdi-react/SortIcon';
import SortAscendingIcon from 'mdi-react/SortAscendingIcon';
import SortDescendingIcon from 'mdi-react/SortDescendingIcon';
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';

import { Link } from 'react-router-dom';
import axios from 'axios'
import {renameChildrenToSubrows} from '@/shared/helpers'

import AddSubmerchantModal from "./AddSubmerchantModal";

const queryClient = new QueryClient()

const initialState = {
    queryPageIndex: 0,
    queryPageSize: 100,
    totalCount: null,
    queryPageFilter:{},
    queryPageSortBy: [],
    queryTrigger:0,
};
const QUERY_TRIGGER = 'QUERY_TRIGGER';
const PAGE_CHANGED = 'PAGE_CHANGED';
const PAGE_SIZE_CHANGED = 'PAGE_SIZE_CHANGED';
const PAGE_SORT_CHANGED = 'PAGE_SORT_CHANGED'
const PAGE_FILTER_CHANGED = 'PAGE_FILTER_CHANGED';
const TOTAL_COUNT_CHANGED = 'TOTAL_COUNT_CHANGED';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case PAGE_CHANGED:
        return {
            ...state,
            queryPageIndex: payload,
        };
    case PAGE_SIZE_CHANGED:
        return {
            ...state,
            queryPageSize: payload,
        };
    case PAGE_SORT_CHANGED:
        return {
            ...state,
            queryPageSortBy: payload,
        };
    case PAGE_FILTER_CHANGED:
        return {
            ...state,
            queryPageFilter: payload,
        };
    case TOTAL_COUNT_CHANGED:
        return {
            ...state,
            totalCount: payload,
        };
    case QUERY_TRIGGER:
        return {
            ...state,
            queryTrigger: payload,
        };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

const DataTable = ({merchant}) => {
    
    const [filter, setFilter] = useState({ keyword:''});
    const [trigger, setTrigger] = useState(0);

    const [loading, setLoading] = useState(false);
    
    const [isOpen, setOpen] = useState(false)

    const toggle = () => {
        setOpen(prevState => !prevState)
    }

    const onDeleteSubMerchant = (e, submerchant_id, dt = false) => {
        setLoading(true)
        e.preventDefault();
        axios.delete(`/merchant/${merchant.id}/submerchant/${submerchant_id}/?dt=${dt}`)
        .then( (res) => {
            // console.log(res)
            if(res.status == 200)  {
                setTrigger( Math.floor(Date.now() / 1000) )
                // window.location = '/program?message=New program added successfully!'
            }
        })
        .catch( error => {
            console.log(error.response.data);
            // setErrors(error.response.data);
            setLoading(false)
        })
    }

    let submerchant_columns = [
        ...SUB_MERCHANTS_COLUMNS, 
        ...[{
            Header: "Action",
            accessor: "action",
            Footer: "Action",
            Cell: ({ row }) => <RenderActions row={row} />,
        }]
    ]

    const RenderActions = ({row}) => {
        return (
            <>
               <Link to={{}} disabled={loading} onClick={(e) => {if(window.confirm('Are you sure to delete this sub merchant with all its sub merchants?')){onDeleteSubMerchant(e, row.original.id, true)}}}>Delete sub merchant and sub tree</Link> | 
                <Link to={{}} disabled={loading} onClick={(e) => {if(window.confirm('Are you sure to delete this sub merchant?')){onDeleteSubMerchant(e, row.original.id)}}}>Delete node</Link>
            </>
        )
    }

    const fetchMerchantData = async (apiUrl, page, pageSize, pageFilterO = null, pageSortBy, queryTrigger) => {
        // const offset = page * pageSize;
        console.log('first')
        const params = [`trigger=${queryTrigger}`]
        let paramStr = ``
        if( pageFilterO ) {
            if(pageFilterO.keyword !== 'undefined' && pageFilterO.keyword) params.push(`keyword=${pageFilterO.keyword}`)
            paramStr = params.join('&')
        }
        if( pageSortBy.length > 0 ) {
            const sortParams = pageSortBy[0];
            const sortyByDir = sortParams.desc ? 'desc' : 'asc'
            paramStr = `${paramStr}&sortby=${sortParams.id}&direction=${sortyByDir}`
        }
        try {
            const response = await axios.get(
            apiUrl + `?page=${page}&limit=${pageSize}&${paramStr}`
            );
            // console.log(response)
            if( response.data.length === 0) return {results:[],count:0}
            const data = {
                results: renameChildrenToSubrows(response.data.data),
                count: response.data.total
            };
            // console.log(data)
            return data;
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    };

    let columns = useMemo( () => submerchant_columns, [])

    const [{ queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger }, dispatch] = 
    React.useReducer(reducer, initialState);

    const apiUrl = `/merchant/${merchant.id}/submerchant`;
    const { isLoading, error, data, isSuccess } = useQuery(
        ['submerchants', apiUrl, queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy, queryTrigger],
        () => fetchMerchantData(apiUrl, queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy, queryTrigger),
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
    },
    useSortBy,
    useExpanded,
    usePagination,
    useResizeColumns,
    useFlexLayout
    );
    // const [statusFilterValue, setStatusFilterValue] = useState("");
    const manualPageSize = []
    
    React.useEffect(() => {
        dispatch({ type: PAGE_CHANGED, payload: pageIndex });
    }, [pageIndex]);

    React.useEffect(() => {
        dispatch({ type: PAGE_SIZE_CHANGED, payload: pageSize });
        gotoPage(0);
    }, [pageSize, gotoPage]);

    useEffect(() => {
        dispatch({ type: PAGE_SORT_CHANGED, payload: sortBy });
        gotoPage(0);
    }, [sortBy, gotoPage]);

    React.useEffect(() => {
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

    React.useEffect(() => {
        dispatch({ type: QUERY_TRIGGER, payload: trigger });
        gotoPage(0);
    }, [trigger, gotoPage]);

    if (error) {
        return <p>Error: {JSON.stringify(error)}</p>;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }
    if(isSuccess)
    return (
            <>
                <div className='table react-table table-submerchants'>
                    <form className="form form--horizontal">
                        <div className="form__form-group pb-4">
                            <div className="col-md-9 col-lg-9">
                                
                            </div>
                            <div className="col-md-3 col-lg-3 text-right pr-0">
                                <Link style={{maxWidth:'200px'}}
                                className="btn btn-primary account__btn account__btn--small"
                                onClick={()=>toggle()}
                                >Add Sub Merchant
                                </Link>
                            </div>
                        </div>
                    </form>
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
                <AddSubmerchantModal isOpen={isOpen} setOpen={setOpen} toggle={toggle} merchant={merchant} setTrigger={setTrigger}  />
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
            </>
    )
}

const Sorting = ({ column }) => (
    <span className="react-table__column-header sortable">
      {column.isSortedDesc === undefined ? (
        <SortIcon />
      ) : (
        <span>
          {column.isSortedDesc
            ? <SortAscendingIcon />
            : <SortDescendingIcon />}
        </span>
      )}
    </span>
  );

const TableWrapper = ({merchant}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <DataTable merchant={merchant} />
        </QueryClientProvider>
    )
}

export default TableWrapper;