import React, {useMemo, useState, useEffect} from "react";
import { useTable, useSortBy, usePagination, useGlobalFilter, useFilters, useExpanded } from "react-table";
import MOCK_DATA from "./MOCK_DATA.json";
import { PROGRAM_COLUMNS } from "./columns";
import SortIcon from 'mdi-react/SortIcon';
import SortAscendingIcon from 'mdi-react/SortAscendingIcon';
import SortDescendingIcon from 'mdi-react/SortDescendingIcon';
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import { GlobalFilter } from "./GlobalFilter";
import { StatusFilter } from "./StatusFilter";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar } from 'reactstrap';
import FolderMoveOutlineIcon from 'mdi-react/FolderMoveOutlineIcon';
import ContentCopyIcon from 'mdi-react/ContentCopyIcon';
import ProgramTreeView from "./ProgramTreeView";
import CopyProgramModal from "./CopyProgramModal";
// import axiosConfig from "../../App/AxiosConfig";

const DataTable = () => {
    useEffect(() => {
        // axiosConfig();
        const getData = () => {
        // alert("Loading program data")
          axios
            .get('/organization/1/program')
            .then((response) => {
              // check if the data is populated
            //   console.log(response.data);
              setData(response.data);
              // you tell it that you had the result
              setLoadingData(false);
            });
        }
        if (loadingData) {
          getData();
        }
    }, []);

    const [movingProgramId, setMovingProgramId] = useState(null)
    const [copyingProgramId, setCopyingProgramId] = useState(null)

    const [isMoveOpen, setMoveOpen] = useState(false)
    const [isCopyOpen, setCopyOpen] = useState(false)
    const [loadingData, setLoadingData] = useState(true);
    var [data, setData] = useState([]);
    const [selected, setSelected] = React.useState([]);
    const [originalSelected, setOriginalSelected] = React.useState([]);

    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

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
        setError('')
        setLoading(true)
        // alert(JSON.stringify({selected, movingProgramId}))
        console.log(movingProgramId)
        console.log(selected)
        if( selected.length <=0 ) setError('Select a program to move to');
        else if( selected === movingProgramId )  setError('Select a different program to move to');
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

    // data.map( (mrow, i) => {
    //     if (mrow.id==1 || mrow.id == 3 || mrow.id == 5) {
    //         data[i]['subRows'] = [
    //             {"id":201,"name":"Fliptune","corp_entity":"Sales","domain":"desdev.cn","status":"Active"},
    //             {"id":202,"name":"Oyoba","corp_entity":"Business Development","domain":"alibaba.com","status":"Active"},
    //             {"id":203,"name":"Ailane","corp_entity":"Marketing","domain":"ucsd.edu","status":"Rejected", "subRows":[
    //                 {"id":2031,"name":"Fliptune","corp_entity":"Sales","domain":"desdev.cn","status":"Active"}
    //             ]}
    //         ]
    //     }
    // })

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

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        rows,
        prepareRow,
        setFilter,
        page,
        pageCount,
        pageOptions,
        gotoPage,
        previousPage,
        canPreviousPage,
        nextPage,
        canNextPage,
        setPageSize,
        setGlobalFilter,
        withDragAndDrop,
        updateDraggableData,
        updateEditableData,
        dataLength,
        state,
        preFilteredRows
    } = useTable({
        columns,
        data,
        initialState: { pageSize: 30 }
    }, 
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination
    );
    // const [statusFilterValue, setStatusFilterValue] = useState("");
    const manualPageSize = []
    const { globalFilter, pageIndex, pageSize, expanded } = state

    return (
        <>
        {loadingData ? (
            <p>Loading Please wait...</p>
        ) : (
            <>
                <div className='table react-table'>
                    <form className="form form--horizontal">
                        <div className="form__form-group pb-4">
                            <div className="col-md-3 pl-0">
                                <StatusFilter preFilteredRows={preFilteredRows} setFilter={setFilter} id="status" />
                            </div>
                            <div className="col-md-3">
                                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                            </div>
                            <div className="col-md-6 text-right pr-0">
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
                                // console.log(row.id)
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
                            {error && <span className="form__form-group-error">{error}</span>}
                        </ModalBody>
                        <ButtonToolbar className="modal__footer flex justify-content-right">
                            <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                            <Button type="submit" disabled={selected===originalSelected || loading} className="btn btn-primary" color="#ffffff" onClick={onClickMoveConfrim}>Confirm</Button>
                        </ButtonToolbar>
                    </Modal>
                    <CopyProgramModal isOpen={isCopyOpen} setOpen={setCopyOpen} toggle={copyToggle} programId={copyingProgramId}/>
                </div>
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
                    manualPageSize={manualPageSize}
                    dataLength={rows.length}
                    />
                )}
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

export default DataTable;