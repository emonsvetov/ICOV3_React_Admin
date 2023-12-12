import React, {useState, useEffect, useMemo} from "react";
import { useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout } from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import MOCK_DATA from "./MOCK_DATA.json";
import {PROGRAM_COLUMNS} from "./columns";
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import {getFirstDay, dateStrToYmd} from '@/shared/helpers'
import { Col, Row} from 'reactstrap';
import PointsReserveFilter  from "./PointsReserveFilter";
import {connect} from "react-redux";
import {
    reducer,
    fetchApiData,
    initialState,
   
    Sorting
  } from "@/shared/apiTableHelper"
import {renameChildrenToSubrows} from '@/shared/helpers'

const queryClient = new QueryClient()

const PAGE_CHANGED = 'PAGE_CHANGED';
const PAGE_SIZE_CHANGED = 'PAGE_SIZE_CHANGED';
const PAGE_SORT_CHANGED = 'PAGE_SORT_CHANGED'
const PAGE_FILTER_CHANGED = 'PAGE_FILTER_CHANGED';
const TOTAL_COUNT_CHANGED = 'TOTAL_COUNT_CHANGED';

// const reducer = (state, { type, payload }) => {
//   switch (type) {
//     case PAGE_CHANGED:
//         return {
//             ...state,
//             queryPageIndex: payload,
//         };
//     case PAGE_SIZE_CHANGED:
//         return {
//             ...state,
//             queryPageSize: payload,
//         };
//     case PAGE_SORT_CHANGED:
//         return {
//             ...state,
//             queryPageSortBy: payload,
//         };
//     case PAGE_FILTER_CHANGED:
//         return {
//             ...state,
//             queryPageFilter: payload,
//         };
//     case TOTAL_COUNT_CHANGED:
//         return {
//             ...state,
//             totalCount: payload,
//         };
//     default:
//       throw new Error(`Unhandled action type: ${type}`);
//   }
// };

const fetchMockData = () => {
    
    const data = {
        results: renameChildrenToSubrows(MOCK_DATA),
        count: 15
    };
    return data;
};


const DataTable = ({organization, programs}) => {


const onClickFilterCallback = (from, to) => {
            
    if(filter.from === from && filter.to === to)    {
        alert('No change in filters')
        return
    }
    setFilter({...filter, from, to})
}


const [filter, setFilter] = useState({
    programs: programs,
    createdOnly: false,
    reportKey: 'sku_value',
    programId: 1,
    from: dateStrToYmd(getFirstDay()),
    to: dateStrToYmd(new Date())
    });

const handleDownload = ( ) => {
    alert('downloading...')
}

const [{queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger}, dispatch] =
React.useReducer(reducer, initialState);

const apiUrl = `/organization/${organization.id}/report/points-reserve`;
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
    // const [statusFilterValue, setStatusFilterValue] = useState("");
    const manualPageSize = []
    
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
                            <Col lg={9} md={9} sm={8}>
                                <PointsReserveFilter onClickFilterCallback={onClickFilterCallback} />
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
            </>
    )
}

// const Sorting = ({ column }) => (
//     <span className="react-table__column-header sortable">
//       {column.isSortedDesc === undefined ? (
//         <SortIcon />
//       ) : (
//         <span>
//           {column.isSortedDesc
//             ? <SortAscendingIcon />
//             : <SortDescendingIcon />}
//         </span>
//       )}
//     </span>
//   );

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