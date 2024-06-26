import React, { useMemo, useState, useEffect } from "react";
import { useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout } from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import SortIcon from 'mdi-react/SortIcon';
import SortAscendingIcon from 'mdi-react/SortAscendingIcon';
import SortDescendingIcon from 'mdi-react/SortDescendingIcon';
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import {reducer, useEffectToDispatch, fetchApiData, initialState, TableFilter} from "@/shared/apiTableHelper"
import { fetchRoles } from "@/shared/apiHelper"
import AssignRoleModal from "./AssignRoleModal"

import axios from "axios";
import {
    Container,
    Card,
    CardBody,
    Row,
    Col,
  } from "reactstrap";

import { USERS_COLUMNS } from "./columns";

const queryClient = new QueryClient()

const ADMIN_ROLE_ID = 2;

const DataTable = ({program, setParentTrigger}) => {
    const [filter, setFilter] = useState({ keyword:'' });
    const [useFilter, setUseFilter] = useState(false);
    const [trigger, setTrigger] = useState(0);
    const [isAssignModalOpen, setAssignModalOpen] = useState(false)
    const [user, setUser] = useState(null)

    const [roles, setRoles] = useState(null) //to be passed to assign model

    useEffect(() => {
        if(program?.id && roles === null)
        {
            fetchRoles(program.organization_id, 1)
            .then(data => {
                console.log(data)
                data.push({
                  id: ADMIN_ROLE_ID, 
                  name:`Admin in org "${program.organization.name}"`
                })
                setRoles(data);
            })
        }
    })

    const toggleAssignModal = () => {
        setAssignModalOpen(prevState => !prevState)
    }
    const onClickStatus = user => {
        setUser(user);
        toggleAssignModal();
    }

    const RenderActions = ({row}) => {
        return (
            <>
                <span onClick={()=>onClickStatus(row.original)} className="link a" >Manage Role</span>
            </>
        )
    }

    const strShowUserStatus = user => {
        return <span>{user?.status?.status ? user.status.status : '--'}</span>
    }
    
    let user_columns = [
        ...USERS_COLUMNS, 
        ...[
            {
                Header: "Status",
                accessor: "user_status_id",
                Cell: ({ row }) => strShowUserStatus(row.original),
            },
            {
                Header: "Action",
                accessor: "action",
                Cell: ({ row }) => <RenderActions row={row} />,
            }
        ],
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

  const [{ queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger }, dispatch] = React.useReducer(reducer, initialState);

  const apiUrl = `/organization/${program.organization_id}/program/${program.id}/userToAssign`
      
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

//   console.log(user)

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
                        <div className="col-md-12 col-lg-12">
                            <TableFilter filter={filter} setFilter={setFilter} setUseFilter={setUseFilter} config={{label:'user'}} />
                        </div>
                    </div>
                </form>
                {user && roles && <AssignRoleModal setParentTrigger={setParentTrigger} isOpen={isAssignModalOpen} toggle={toggleAssignModal} setTrigger={setTrigger} user={user} program={program} roles={roles} />}

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

const TableWrapper = ({program, organization, setParentTrigger}) => {
  return (
      <QueryClientProvider client={queryClient}>
          <DataTable program={program} organization={organization} setParentTrigger={setParentTrigger} />
      </QueryClientProvider>
  )
}

const AssignUserIndex = ({organization, program, setTrigger}) => {
    if( !program?.id || !organization?.id )  {
        return 'Loading...'
    }
    return (
        <Container className="dashboard">
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            {program && organization && <TableWrapper program={program} organization={organization} setParentTrigger={setTrigger} />}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
export default AssignUserIndex;
// export default withRouter(connect((state) => ({
//     organization: state.organization
// }))(AssignUserIndex));
