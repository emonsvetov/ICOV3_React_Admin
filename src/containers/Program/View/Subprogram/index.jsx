import React, { useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout } from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import FolderMoveOutlineIcon from 'mdi-react/FolderMoveOutlineIcon';
import VectorPolylineRemoveIcon from 'mdi-react/VectorPolylineRemoveIcon';
import LinkVariantRemoveIcon from 'mdi-react/LinkVariantRemoveIcon';
import InfoOutlineIcon from 'mdi-react/InfoOutlineIcon';
import {reducer, useEffectToDispatch, fetchApiData, initialState, TableFilter, Sorting} from "@/shared/apiTableHelper"
import {getProgramById} from "@/shared/apiHelper"
import axios from "axios";
import {
    Button,
    Container,
    Card,
    CardBody,
    ButtonToolbar,
    Row,
    Col,
  } from "reactstrap";
import ProgramFilter from "../../components/ProgramsFilter";

// import AddSubProgramForm from './AddSubProgramModal';
import { PROGRAM_COLUMNS } from "./columns";

import {renameChildrenToSubrows} from '@/shared/helpers'
import AddSubProgramModal from './AddSubProgramModal'
import MoveSubProgramModal from "./MoveSubProgramModal"
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"

const queryClient = new QueryClient()

const DataTable = ( {organization, program} ) => {
    const flashDispatch = useDispatch()

    const [filter, setFilter] = useState({status:'', keyword:''});
    const [useFilter, setUseFilter] = useState(false);
    const [movingSubProgram, setMovingSubProgram] = useState(null)
    const [isMoveOpen, setMoveOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [trigger, setTrigger] = useState( 0 );

    const onClickStartMoveSubProgram = ( program ) => {
        setMovingSubProgram(program)
        setMoveOpen(true)
    }   
    
    const onClickUnlink = ( program, removeTree = false ) => {
        if( !window.confirm(`Are you sure to remove sub program${removeTree ? ' and sub tree' : ''}?`))   {
            return;
        }
        setLoading(true)
        let url = `/organization/${organization.id}/subprogram/${program.id}/unlink`;
        if( removeTree )   {
            url += '?subtree=1'
        }
        axios.patch(url)
        .then( (res) => {
            // console.log(res)
            // console.log(res.status == 200)
            if(res.status == 200)  {
                // var t = setTimeout(window.location = '/', 500)
                // window.location = '/program?message=Sub program removed successfully!'
                flashDispatch(sendFlashMessage('Program has been deleted', 'alert-success', 'top'))
                setTrigger( Math.floor(Date.now() / 1000) )
            }
        })
        .catch( error => {
            console.log(error.response.data);
            setLoading(false)
        })
    }

    // var [data, setData] = useState([]);
    const [isOpen, setOpen] = useState(false)

    const toggle = () => {
        setOpen(prevState => !prevState)
    }
    const moveToggle = () => {
        setMoveOpen(prevState => !prevState);
    };
  const onClickFilterCallback = (status, keyword) => {
      // alert(JSON.stringify({status, keyword}))
      // alert(JSON.stringify(filter))
      if(filter.status === status && filter.keyword === keyword)    {
          alert('No change in filters')
          setUseFilter(false);
          return
      }
      setUseFilter(true);
      setFilter({status, keyword})
      // alert(status, keyword)
  }

  const RenderActions = ({row}) => {
    return (
        <>
            <span title="View"><InfoOutlineIcon style={{cursor:'pointer'}} onClick={() => {window.location.href = `/program/view/${row.original.id}`}} disabled={loading} /></span>
            <span style={{width:'15px', display: 'inline-block'}}></span>
            <span title="Move node"><FolderMoveOutlineIcon onClick={() => onClickStartMoveSubProgram(row.original)}  style={{cursor:'pointer'}}  disabled={loading} /></span>
            <span style={{width:'15px', display: 'inline-block'}}></span>
            <span title="Delete with subtree"><VectorPolylineRemoveIcon  disabled={loading}  style={{cursor:'pointer'}} onClick={() => onClickUnlink(row.original, true)} title="Delete sub program and sub tree" /></span>
            <span style={{width:'15px', display: 'inline-block'}}></span>
            <span title="Delete only this node"><LinkVariantRemoveIcon disabled={loading}  style={{cursor:'pointer'}} onClick={() => onClickUnlink(row.original)} /></span>
        </>
    )
  }
  let columnns = [
      ...PROGRAM_COLUMNS, 
      ...[{
          Header: "Action",
          accessor: "action",
          Cell: ({ row }) => <RenderActions row={row} />,
      }]
  ]
  let columns = useMemo( () => columnns, [])


  const defaultColumn = React.useMemo(
      () => ({
        minWidth: 30,
        width: 150,
        maxWidth: 400,
      }),
      []
  )

  const [{ queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger }, dispatch] =
  React.useReducer(reducer, initialState);

  const apiUrl = `/organization/${organization.id}/program/${program.id}/subprogram`

    const { isLoading, error, data, isSuccess } = useQuery(
        ['roles', apiUrl, queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy, queryTrigger],
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

//   console.log(data)

  if( data?.results?.length > 0)    {
    data.results = renameChildrenToSubrows(data.results);
  }

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
                            <ProgramFilter onClickFilterCallback={onClickFilterCallback} />
                            {/* <TableFilter filter={filter} setFilter={setFilter} setUseFilter={setUseFilter} label={'programs'} /> */}
                        </div>
                        <div className="col-md-3 col-lg-3 text-right pr-0">
                            <Link style={{maxWidth:'200px'}}
                            className="btn btn-primary account__btn account__btn--small"
                            onClick={()=>toggle()} to="#"
                            >Add Sub program
                            </Link>
                            
                        </div>
                    </div>
                </form>
                <AddSubProgramModal program={program} organization={organization} isOpen={isOpen} setOpen={setOpen} toggle={toggle} setTrigger={setTrigger} />
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
                  </table>
                  {movingSubProgram && <MoveSubProgramModal organization={organization} isOpen={isMoveOpen} setOpen={setMoveOpen} toggle={moveToggle} subprogram={movingSubProgram} setTrigger={setTrigger} />}
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

const SubProgram = ( {organization, program} ) => {

    return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Sub Programs</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/program">Programs</Link> / <Link className="" to = {`/program/view/${program.id}`}>{program?.name}</Link>/ Sub Programs </h3>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
            <Card>
                <CardBody>
                    <DataTable organization={organization} program={program} />
                </CardBody>
            </Card>
        </Col>
      </Row>
    </Container>
)}

const TableWrapper = ({organization, theme, rtl}) => {
    const { programId } = useParams();
    const [programData, setProgramData] = useState(null);
    useEffect(() => {
        if( organization && programId ) {
            getProgramById( organization.id, programId )
            .then( p => {
                setProgramData(p)
            })
        }
    },[organization, programId])

    if( !organization || !programData ) return 'Loading...'

    return (
        <QueryClientProvider client={queryClient}>
            <SubProgram organization={organization} program={programData} theme = {theme} rtl={rtl} />
        </QueryClientProvider>
    )
}

export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
    organization: state.organization
}))(TableWrapper));

// export default SubProgram;
