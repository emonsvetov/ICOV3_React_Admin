import React, {useState, useEffect, useMemo} from "react";
import { useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout } from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
// import MOCK_DATA from "./MOCK_DATA.json"
import { PROGRAM_COLUMNS } from "./columns"
import SortIcon from 'mdi-react/SortIcon'
import SortAscendingIcon from 'mdi-react/SortAscendingIcon'
import SortDescendingIcon from 'mdi-react/SortDescendingIcon'
import DeleteIcon from 'mdi-react/DeleteOutlineIcon'
import RestoreIcon from 'mdi-react/RestoreIcon'
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination'
// import { GlobalFilter } from "./GlobalFilter"
// import { StatusFilter } from "./StatusFilter"
import ProgramFilter  from "./ProgramsFilter"
import { Link } from 'react-router-dom'
import axios from 'axios'
import FolderMoveOutlineIcon from 'mdi-react/FolderMoveOutlineIcon'
import ContentCopyIcon from 'mdi-react/ContentCopyIcon'
import CopyProgramModal from "./CopyProgramModal"
import MoveProgramModal from "./MoveProgramModal"
import {renameChildrenToSubrows} from '@/shared/helpers'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const queryClient = new QueryClient()

const initialState = {
    queryPageIndex: 0,
    queryPageSize: 20,
    totalCount: null,
    queryPageFilter:{},
    queryPageSortBy: [],
};

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
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

const DataTable = ({organization}) => {

    // console.log(organization)

    const fetchProgramData = async (page, pageSize, pageFilterO = null, pageSortBy) => {
        // const offset = page * pageSize;
        const params = []
        let paramStr = ''
        if( pageFilterO ) {
            if(pageFilterO.status !== 'undefined' && pageFilterO.status) params.push(`status=${pageFilterO.status}`)
            if(pageFilterO.keyword !== 'undefined' && pageFilterO.keyword) params.push(`keyword=${pageFilterO.keyword}`)
            // console.log(params)
            paramStr = params.join('&')
        }
        if( pageSortBy.length > 0 ) {
            const sortParams = pageSortBy[0];
            const sortyByDir = sortParams.desc ? 'desc' : 'asc'
            paramStr = `${paramStr}&sortby=${sortParams.id}&direction=${sortyByDir}`
        }
        try {
            const response = await axios.get(
            `/organization/${organization.id}/program?page=${page+1}&limit=${pageSize}&${paramStr}`
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

    const [movingProgram, setMovingProgram] = useState(null)
    const [copyingProgram, setCopyingProgram] = useState(null)

    const [isMoveOpen, setMoveOpen] = useState(false)
    const [isCopyOpen, setCopyOpen] = useState(false)
    const [filter, setFilter] = useState({status:'', keyword:''});
    // var [data, setData] = useState([]);

    const onClickFilterCallback = (status, keyword) => {
        // alert(JSON.stringify({status, keyword}))
        // alert(JSON.stringify(filter))
        if(filter.status === status && filter.keyword === keyword)    {
            alert('No change in filters')
            return
        }
        setFilter({status, keyword})
        // alert(status, keyword)
    }
    const onClickDeleteProgram = ( e, program ) => {
        e.preventDefault();
        axios.delete(`/organization/${program.organization_id}/program/${program.id}`)
        .then( (res) => {
            // console.log(res)
            if(res.status == 200)  {
                window.location = `/program?message=Program deleted successfully!`
            }
        })
        .catch( error => {
            console.log(error)
            throw new Error(`API error:${error?.message}`);
        })
    }    
    const onClickRestoreProgram = ( program ) => {
        axios.patch(`/organization/${program.organization_id}/program/${program.id}/restore`)
        .then( (res) => {
            // console.log(res)
            if(res.status == 200)  {
                window.location = `/program?message=Program restored successfully!`
            }
        })
        .catch( error => {
            console.log(error)
            throw new Error(`API error:${error?.message}`);
        })
    }
    const onClickStartMoveProgram = ( program ) => {
        setMovingProgram(program)
        setMoveOpen(true)
    }
    const onClickStartCopyProgram = ( program ) => {
        setCopyingProgram(program)
        setCopyOpen(true)
    }
    const moveToggle = () => {
        setMoveOpen(prevState => !prevState);
    };
    const copyToggle = () => {
        setCopyOpen(prevState => !prevState);
    };
    const RenderActions = ({row}) => {
        return (
            <>
                <span>
                    <FolderMoveOutlineIcon onClick={() => onClickStartMoveProgram(row.original)} />
                    <span style={{width:'15px', display: 'inline-block'}}></span>
                    <ContentCopyIcon onClick={() => onClickStartCopyProgram(row.original)} />
                    <span style={{width:'15px', display: 'inline-block'}}></span>
                    {row.original.status !== 'deleted' ? <DeleteIcon onClick={(e) => {if(window.confirm('Are you sure to delete this program?')){onClickDeleteProgram(e, row.original)}}} /> : <RestoreIcon onClick={() => onClickRestoreProgram(row.original)} />}
                </span>
            </>
        )
    }

    let program_columns = [
        ...PROGRAM_COLUMNS, 
        ...[{
            Header: "",
            accessor: "action",
            Cell: ({ row }) => <RenderActions row={row} />,
        }]
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

    const [{ queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy }, dispatch] =
    React.useReducer(reducer, initialState);

    const { isLoading, error, data, isSuccess } = useQuery(
        ['programs', queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy],
        () => fetchProgramData(queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy),
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

    if (isLoading) {
        return <p>Loading...</p>;
    }
    if(isSuccess)
    return (
            <>
                <div className='table react-table'>
                    <form className="form form--horizontal">
                        <div className="form__form-group pb-4">
                            <div className="col-md-9 col-lg-9">
                                <ProgramFilter onClickFilterCallback={onClickFilterCallback} />
                            </div>
                            <div className="col-md-3 col-lg-3 text-right pr-0">
                                <Link style={{maxWidth:'200px'}}
                                className="btn btn-primary account__btn account__btn--small"
                                to="/program/add"
                                >Add new program
                                </Link>
                            </div>
                        </div>
                    </form>
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
                    {copyingProgram && <CopyProgramModal isOpen={isCopyOpen} setOpen={setCopyOpen} toggle={copyToggle} program={copyingProgram}/>}
                    {movingProgram && <MoveProgramModal organization={organization} isOpen={isMoveOpen} setOpen={setMoveOpen} toggle={moveToggle} program={movingProgram} />}
                </div>
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

const TableWrapper = ({organization}) => {
    // console.log(organization)
    if( !organization ) return 'Loading...'
    return (
        <QueryClientProvider client={queryClient}>
            <DataTable organization={organization} />
        </QueryClientProvider>
    )
}
export default withRouter(connect((state) => ({
    organization: state.organization
}))(TableWrapper));