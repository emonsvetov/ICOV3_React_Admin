import React, {useState, useEffect, useMemo} from "react";
import { useTable, usePagination, useSortBy, useExpanded } from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
// import MOCK_DATA from "./MOCK_DATA.json";
import { PROGRAM_COLUMNS } from "./columns";
import SortIcon from 'mdi-react/SortIcon';
import SortAscendingIcon from 'mdi-react/SortAscendingIcon';
import SortDescendingIcon from 'mdi-react/SortDescendingIcon';
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
// import { GlobalFilter } from "./GlobalFilter";
// import { StatusFilter } from "./StatusFilter";
import ProgramFilter  from "./ProgramsFilter";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar } from 'reactstrap';
import FolderMoveOutlineIcon from 'mdi-react/FolderMoveOutlineIcon';
import ContentCopyIcon from 'mdi-react/ContentCopyIcon';
import ProgramTreeView from "./ProgramTreeView";
import CopyProgramModal from "./CopyProgramModal";

const queryClient = new QueryClient()

const initialState = {
    queryPageIndex: 0,
    queryPageSize: 10,
    totalCount: null,
    queryPageFilter:{}
};

const PAGE_CHANGED = 'PAGE_CHANGED';
const PAGE_SIZE_CHANGED = 'PAGE_SIZE_CHANGED';
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

const fetchProgramData = async (page, pageSize, pageFilterO = null) => {
    // const offset = page * pageSize;
    const params = []
    let paramStr = ''
    if( pageFilterO ) {
        if(pageFilterO.status !== 'undefined' && pageFilterO.status) params.push(`status=${pageFilterO.status}`)
        if(pageFilterO.programPhase !== 'undefined' && pageFilterO.programPhase) params.push(`programPhase=${pageFilterO.programPhase}`)
        // console.log(params)
        paramStr = params.join('&')
    }
    try {
        const response = await axios.get(
        `/organization/1/program?page=${page}&limit=${pageSize}&${paramStr}`
        );
        const data = {
            results: response.data.data,
            count: response.data.total
        };
        // console.log(data)
        return data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

const DataTable = () => {

    const [movingProgramId, setMovingProgramId] = useState(null)
    const [copyingProgramId, setCopyingProgramId] = useState(null)

    const [isMoveOpen, setMoveOpen] = useState(false)
    const [isCopyOpen, setCopyOpen] = useState(false)
    const [filter, setFilter] = useState({status:'', programPhase:''});
    // var [data, setData] = useState([]);
    const [selected, setSelected] = React.useState([]);
    const [originalSelected, setOriginalSelected] = React.useState([]);

    const [formError, setFormError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const onClickFilterCallback = (status, programPhase) => {
        // alert(JSON.stringify({status, programPhase}))
        // alert(JSON.stringify(filter))
        if(filter.status === status && filter.programPhase === programPhase)    {
            alert('No change in filters')
            return
        }
        setFilter({status, programPhase})
        // alert(status, programPhase)
    }

    const onClickStartMoveProgram = ( programId ) => {
        setMovingProgramId(programId)
        setSelected(programId)
        setMoveOpen(true)
        setOriginalSelected(programId)
    }
    const onClickStartCopyProgram = ( programId ) => {
        setCopyingProgramId(programId)
        setCopyOpen(true)
        // setOriginalSelected(programId)
    }
    const handleSelect = (event, nodeIds) => {
        // alert(nodeIds)
        setSelected(nodeIds);
    };
    const onClickMoveConfrim = () => {
        setFormError('')
        setLoading(true)
        // alert(JSON.stringify({selected, movingProgramId}))
        console.log(movingProgramId)
        console.log(selected)
        if( selected.length <=0 ) setFormError('Select a program to move to');
        else if( selected === movingProgramId )  setFormError('Select a different program to move to');
        else   {
            alert('Allset')
        }
        setLoading(false)
    };
    const toggle = () => {
        setMoveOpen(prevState => !prevState);
    };
    const copyToggle = () => {
        setCopyOpen(prevState => !prevState);
    };
    const RenderActions = ({row}) => {
        return (
            <>
                <span>
                    <FolderMoveOutlineIcon onClick={() => onClickStartMoveProgram(row.original.id)} />
                    <span style={{width:'15px', display: 'inline-block'}}></span>
                    <ContentCopyIcon onClick={() => onClickStartCopyProgram(row.original.id)} />
                </span>
            </>
        )
    }

    let program_columns = [
        ...PROGRAM_COLUMNS, 
        ...[{
            Header: "Action",
            accessor: "action",
            Footer: "Action",
            Cell: ({ row }) => <RenderActions row={row} />,
        }]
    ]
    let columns = useMemo( () => program_columns, [])

    const [{ queryPageIndex, queryPageSize, totalCount, queryPageFilter }, dispatch] =
    React.useReducer(reducer, initialState);

    const { isLoading, error, data, isSuccess } = useQuery(
        ['programs', queryPageIndex, queryPageSize, queryPageFilter],
        () => fetchProgramData(queryPageIndex, queryPageSize, queryPageFilter),
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
        state: { pageIndex, pageSize }
    } = useTable({
        columns,
        data: data ? data.results : [],
        initialState: {
            pageIndex: queryPageIndex,
            pageSize: queryPageSize,
        },
        manualPagination: true, // Tell the usePagination
        pageCount: data ? totalPageCount : null,
        autoResetSortBy: false,
        autoResetExpanded: false,
        autoResetPage: false
    },
    useSortBy,
    useExpanded,
    usePagination,
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
        return <p>Error</p>;
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
                                            row.cells.map( cell => {
                                                // console.log(cell)
                                                return <td {...cell.getCellProps()}><span className={cell.column.Header==='#' ? `pl-${paddingCount}` : ''}>{cell.render('Cell')}</span></td>
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
                    <Modal className="modal-program" isOpen={isMoveOpen} toggle={() => setMoveOpen(true)}>
                        <ModalHeader>
                            <h3 style={{"font-weight": 500}}>Move Program to</h3>
                        </ModalHeader>
                        <ModalBody>
                            <ProgramTreeView data={data} handleSelect={handleSelect} selected={selected} />
                            {formError && <span className="form__form-group-error">{formError}</span>}
                        </ModalBody>
                        <ButtonToolbar className="modal__footer flex justify-content-right">
                            <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                            <Button type="submit" disabled={selected===originalSelected || loading} className="btn btn-primary" color="#ffffff" onClick={onClickMoveConfrim}>Confirm</Button>
                        </ButtonToolbar>
                    </Modal>
                    <CopyProgramModal isOpen={isCopyOpen} setOpen={setCopyOpen} toggle={copyToggle} programId={copyingProgramId}/>
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
            ? <SortDescendingIcon />
            : <SortAscendingIcon />}
        </span>
      )}
    </span>
  );

const TableWrapper = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <DataTable />
        </QueryClientProvider>
    )
}

export default TableWrapper;