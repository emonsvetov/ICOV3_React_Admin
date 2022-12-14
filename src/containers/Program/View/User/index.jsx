import React, { useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout } from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import SortIcon from 'mdi-react/SortIcon';
import SortAscendingIcon from 'mdi-react/SortAscendingIcon';
import SortDescendingIcon from 'mdi-react/SortDescendingIcon';
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import {reducer, useEffectToDispatch, fetchApiData, initialState, TableFilter} from "@/shared/apiTableHelper"
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"
import ChangeStatusModal from "@/containers/Users/components/ChangeStatusModal"

import axios from "axios";
import {
    Container,
    Card,
    CardBody,
    Row,
    Col,
  } from "reactstrap";

import { USERS_COLUMNS } from "./columns";
import AddProgramUserModal from './AddProgramUserModal'
import EditProgramUserModal from './EditProgramUserModal'

const queryClient = new QueryClient()

const DataTable = ({program, organization}) => {

    // alert(JSON.stringify(organization))

    const flashDispatcher = useDispatch()
  
    const [filter, setFilter] = useState({ keyword:'' });
    const [useFilter, setUseFilter] = useState(false);
    const [trigger, setTrigger] = useState(Math.floor(Date.now() / 1000));

    // var [data, setData] = useState([]);
    const [isOpenAdd, setOpenAdd] = useState(false)
    const [isOpenEdit, setOpenEdit] = useState(false)
    const [selectedUser, selectUser] = useState(false)
    const [user, setUser] = useState(null)

    const [isChangeStatusOpen, setChangeStatusOpen] = useState(false)

    const toggleAdd = () => {
        setOpenAdd(prevState => !prevState)
    }
    const toggleEdit = () => {
        setOpenEdit(prevState => !prevState)
    }
    const toggleChangeStatus = () => {
        setChangeStatusOpen(prevState => !prevState)
    }
    const onClickViewUser = ( user_id ) => {
        toggleEdit();
        selectUser(user_id);
    }
    const onClickRemoveUser = ( user_id ) => {
        if( !window.confirm( 'Are you sure to remove this user from this program?') )    {
            return;
        }
        axios.delete(`/organization/${program.organization_id}/user/${user_id}/program/${program.id}`)
        .then( (res) => {
            if(res.status == 200)  {
                flashDispatcher(sendFlashMessage('User removed successfully!', 'alert-success'))
                setTrigger( Math.floor(Date.now() / 1000) )
            }
        })
        .catch( error => {
            flashDispatcher(sendFlashMessage(<ApiErrorMessage errors={error.response.data} />, 'alert-danger'))
            console.log(error.response.data);
        })
    }

    const RenderActions = ({row}) => {
        return (
            <>
                <span onClick={()=>onClickViewUser(row.original.id)} className="link a" >View</span>{' | '}
                <span onClick={()=>onClickRemoveUser(row.original.id)} className="link a" >Delete</span>
            </>
        )
    }

    const onClickStatus = user => {
        setUser(user);
        toggleChangeStatus()
    }

    const strShowUserStatus = user => {
        return user?.status?.status ? <span onClick={() => onClickStatus(user)} className={'link'}>{user.status.status}</span> : 'unknown'
    }
    
    let user_columns = [
        ...USERS_COLUMNS, 
        ...[{
            Header: "",
            accessor: "action",
            Cell: ({ row }) => <RenderActions row={row} />,
        }],
    ]
    user_columns.forEach( (column, i) => {
        if( column.Header === 'Status')
        {
            user_columns[i].Cell =  ({ row, value }) => { return strShowUserStatus(row.original)}
        }
    })
    let columns = useMemo( () => user_columns, [])


  const defaultColumn = React.useMemo(
      () => ({
        minWidth: 30,
        width: 150,
        maxWidth: 400,
      }),
      []
  )

  const [{ queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger }, dispatch] = React.useReducer(reducer, initialState);

  const apiUrl = `/organization/${program.organization_id}/program/${program.id}/user`
      
  const { isLoading, error, data, isSuccess } = useQuery(
      ['users', queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy, queryTrigger],
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

//   console.log(data)

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
      pageCount: data ? totalPageCount : 0,
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
                            <TableFilter filter={filter} setFilter={setFilter} setUseFilter={setUseFilter} config={{label:'users'}} />
                        </div>
                        <div className="col-md-3 col-lg-3 text-right pr-0">
                            <span to={`/`} style={{maxWidth:'200px'}}
                            className="btn btn-primary account__btn account__btn--small"
                            onClick={()=>toggleAdd()}
                            >Add Program User
                            </span>
                        </div>
                    </div>
                </form>
                <AddProgramUserModal organization={organization} program={program} isOpen={isOpenAdd} setOpen={setOpenAdd} toggle={toggleAdd} setTrigger={setTrigger} />
                <EditProgramUserModal organization={organization} program={program} userid={selectedUser} isOpen={isOpenEdit} setOpen={setOpenEdit} toggle={toggleEdit} setTrigger={setTrigger} />
                {user && <ChangeStatusModal isOpen={isChangeStatusOpen} setOpen={setChangeStatusOpen} toggle={toggleChangeStatus} setTrigger={setTrigger} user={user} />}

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
                            //   console.log(row)
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

const TableWrapper = ({program, organization}) => {
  return (
      <QueryClientProvider client={queryClient}>
          <DataTable program={program} organization={organization} />
      </QueryClientProvider>
  )
}

const ProgramUsers = ({organization}) => {
    const { programId } = useParams();
    const [program, setProgram] = useState(null);
    const fetchProgramData = async(organization) => {
        try {
            const response = await axios.get(`/organization/${organization.id}/program/${programId}`);
            // console.log(response)
            setProgram(response.data)
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    };
    useEffect(() => {
        if( organization )  {
            fetchProgramData(organization)
        }
    },[organization])

    if( !program?.id || !organization?.id )  {
        return 'Loading...'
    }
    // console.log(organization)
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
                            {program && organization && <TableWrapper program={program} organization={organization} />}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
export default withRouter(connect((state) => ({
    organization: state.organization
}))(ProgramUsers));
