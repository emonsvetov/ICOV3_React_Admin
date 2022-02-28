import React, { useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout } from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import SortIcon from 'mdi-react/SortIcon';
import SortAscendingIcon from 'mdi-react/SortAscendingIcon';
import SortDescendingIcon from 'mdi-react/SortDescendingIcon';
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import FolderMoveOutlineIcon from 'mdi-react/FolderMoveOutlineIcon';
import {reducer, useEffectToDispatch, fetchApiData, initialState, TableFilter} from "@/shared/tableHelper"

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
import UsersFilter from './UsersFilter'

import { USERS_COLUMNS } from "./columns";
import AddProgramUserModal from './AddProgramUserModal'

const queryClient = new QueryClient()

const DataTable = ({program}) => {
  
    const [keyword, setKeyword] = useState('');
    const [filter, setFilter] = useState({ keyword:''});

  // var [data, setData] = useState([]);
  const [isOpen, setOpen] = useState(false)

    const toggle = () => {
        setOpen(prevState => !prevState)
    }

    const onClickFilterCallback = (keyword) => {
        if(filter.keyword === keyword)    {
            alert('No change in filters')
            return
        }
        setFilter({keyword})
    }

    const RenderActions = ({row}) => {
        return (
            <>
                <Link to={`/program/5/user/${row.original.id}`} >View</Link>{' | '}
                <Link to={`/program/5/user/${row.original.id}`} >Delete</Link>
            </>
        )
    }
    
    let user_columns = [
        ...USERS_COLUMNS, 
        ...[{
            Header: "",
            accessor: "action",
            Cell: ({ row }) => <RenderActions row={row} />,
        }]
    ]
    let columns = useMemo( () => user_columns, [])


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

  const apiUrl = `/organization/1/program/${program.id}/user`
      
  const { isLoading, error, data, isSuccess } = useQuery(
      ['users', queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy],
      () => fetchApiData(
        {
            url: apiUrl,
            page: queryPageIndex,
            size: queryPageSize,
            filter: queryPageFilter,
            sortby: queryPageSortBy
        }),
      {
          keepPreviousData: true,
          staleTime: Infinity,
      }
  );

  const totalPageCount = Math.ceil(totalCount / queryPageSize)

  console.log(data)

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
  
  useEffectToDispatch( dispatch, pageIndex, pageSize, gotoPage, sortBy, filter, data );

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
                            <TableFilter onClickFilterCallback={onClickFilterCallback} label={'users'} />
                        </div>
                        <div className="col-md-3 col-lg-3 text-right pr-0">
                            <Link style={{maxWidth:'200px'}}
                            className="btn btn-primary account__btn account__btn--small"
                            onClick={()=>toggle()}
                            >Add Program User
                            </Link>
                            
                        </div>
                    </div>
                </form>
                <AddProgramUserModal isOpen={isOpen} setOpen={setOpen} toggle={toggle} />
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

const TableWrapper = ({program}) => {
  return (
      <QueryClientProvider client={queryClient}>
          <DataTable program={program} />
      </QueryClientProvider>
  )
}

const ProgramUsers = () => {
const { programId } = useParams();
const [program, setProgram] = useState(null);
const fetchProgramData = async() => {
    try {
        const response = await axios.get(`/organization/1/program/${programId}`);
        // console.log(response)
        setProgram(response.data)
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};
useEffect(() => {
    fetchProgramData()
},[])

    if( !program )  {
        return 'Loading...'
    }

    return (
        <Container className="dashboard">
            <Row>
                <Col md={12}>
                <h3 className="page-title">Program Users</h3>
                <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/program">Programs</Link> / <Link className="" to = {`/program/view/${program.id}`}>{program?.name}</Link>/ Users </h3>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            
                            {program && <TableWrapper program={program} />}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default ProgramUsers;
