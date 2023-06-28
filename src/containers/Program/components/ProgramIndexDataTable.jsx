import React, {useState, useEffect, useMemo} from "react";
import { useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout } from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { PROGRAM_COLUMNS } from "./columns"
import SortIcon from 'mdi-react/SortIcon'
import SortAscendingIcon from 'mdi-react/SortAscendingIcon'
import SortDescendingIcon from 'mdi-react/SortDescendingIcon'
import DeleteIcon from 'mdi-react/DeleteOutlineIcon'
import RestoreIcon from 'mdi-react/RestoreIcon'
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination'
import {reducer, useEffectToDispatch, fetchApiData, initialState, TableFilter} from "@/shared/apiTableHelper"
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
import ChangeStatusModal from "@/containers/Program/components/ChangeStatusModal"

const queryClient = new QueryClient()

const DataTable = ({organization}) => {

    const [trigger, setTrigger] = useState(0);

    const [movingProgram, setMovingProgram] = useState(null)
    const [copyingProgram, setCopyingProgram] = useState(null)

    const [isMoveOpen, setMoveOpen] = useState(false)
    const [isCopyOpen, setCopyOpen] = useState(false)
    const [filter, setFilter] = useState({orgId: '', status:'', keyword:''});

    const [useFilter, setUseFilter] = useState(false);
    // var [data, setData] = useState([]);

    const [isChangeStatusOpen, setChangeStatusOpen] = useState(false)
    const [program, setProgram] = useState(null)

    const onClickFilterCallback = (status, keyword, orgId) => {
        if(filter.status === status && filter.keyword === keyword && filter.orgId === orgId)    {
            alert('No change in filters')
            return
        }
        setFilter({status, keyword, orgId});
        setUseFilter(true);
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
    const onClickRestoreProgram = ( p ) => {
        axios.patch(`/organization/${p.organization_id}/program/${p.id}/restore`)
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
    const onClickStartMoveProgram = ( p ) => {
        setMovingProgram(p)
        setMoveOpen(true)
    }
    const onClickStartCopyProgram = ( p ) => {
        setCopyingProgram(p)
        setCopyOpen(true)
    }
    const moveToggle = () => {
        setMoveOpen(prevState => !prevState);
    };
    const copyToggle = () => {
        setCopyOpen(prevState => !prevState);
    };
    const RenderActions = ({row}) => {
        console.log(row)
        return (
            <>
                <span>
                    <FolderMoveOutlineIcon onClick={() => onClickStartMoveProgram(row.original)} />
                    <span style={{width:'15px', display: 'inline-block'}}></span>
                    <ContentCopyIcon onClick={() => onClickStartCopyProgram(row.original)} />
                    <span style={{width:'15px', display: 'inline-block'}}></span>
                    {row.original.status.status !== 'Deleted' ? <DeleteIcon onClick={(e) => {if(window.confirm('Are you sure to delete this program?')){onClickDeleteProgram(e, row.original)}}} /> : <RestoreIcon onClick={() => onClickRestoreProgram(row.original)} />}
                </span>
            </>
        )
    }

    const toggleChangeStatus = () => {
        setChangeStatusOpen(prevState => !prevState)
    }

    const onClickStatus = p => {
      setProgram(p);
      toggleChangeStatus()
    }

    const strShowUserStatus = p => {
        return p?.status?.status ? <span onClick={() => onClickStatus(p)} className={'link'}>{p.status.status}</span> : (p?.status_id ? p.status_id : 'unknown')
    }

    let program_columns = [
        ...PROGRAM_COLUMNS, 
        ...[{
            Header: "",
            accessor: "action",
            Cell: ({ row }) => <RenderActions row={row} />,
        }]
    ]

    program_columns.forEach( (column, i) => {
        if( column.Header === 'Status')
        {
            program_columns[i].Cell =  ({ row, value }) => { return strShowUserStatus(row.original)}
        }
    })

    let columns = useMemo( () => program_columns, [])

    const defaultColumn = React.useMemo(
        () => ({
          minWidth: 30,
          width: 150,
          maxWidth: 400,
        }),
        []
    )

    const [{ queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger }, dispatch] = React.useReducer(reducer, initialState);

    const apiUrl = `/organization/${organization.id}/program`

    const { isLoading, error, data, isSuccess } = useQuery(
        ['programs', queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy, queryTrigger],
        () => fetchApiData(
          {
              url: apiUrl,
              page: queryPageIndex,
              size: queryPageSize,
              filter: queryPageFilter,
              sortby: queryPageSortBy,
              trigger: queryTrigger
          }),
        {
            keepPreviousData: true,
            staleTime: Infinity,
        }
    );

    // const data = {
    //     results: renameChildrenToSubrows(response.data.data),
    //     count: response.data.total
    // };

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
        data: data ? renameChildrenToSubrows(data.results) : [],
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
                <div className='table react-table'>
                    <form className="form form--horizontal">
                        <div className="form__form-group pb-4">
                            <div className="col-md-9 col-lg-9">
                                <ProgramFilter onClickFilterCallback={onClickFilterCallback} organization={organization} />
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
                    {program && <ChangeStatusModal isOpen={isChangeStatusOpen} setOpen={setChangeStatusOpen} toggle={toggleChangeStatus} setTrigger={setTrigger} program={program} />}
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