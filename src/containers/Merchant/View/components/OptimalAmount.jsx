import React, {useState, useMemo} from "react";
import { useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout } from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

import {OPTIMAL_AMOUNT_COLUMNS}  from "./columns";

import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import OptimalAmountModal from './OptimalAmountModal'
import { Row, Col } from 'reactstrap';
import axios from 'axios'

import {reducer, useEffectToDispatch, fetchApiData, initialState, Sorting} from "@/shared/apiTableHelper"
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"


const queryClient = new QueryClient()

const DataTable = ({merchant}) => {

    const flashDispatch = useDispatch()

    const [editable, setEditable] = useState(null)

    const onClickAddValue = ( value ) => {
        setEditable( null )
        toggle()
        // console.log(value)
    }

    const onClickEditValue = ( value ) => {
        setEditable( value )
        toggle()
        // console.log(value)
    }
    const onClickDeleteValue = ( id ) => {
        console.log(id)
        if( !window.confirm( 'Are you sure to delete?') )    {
            return
        }
        const apiUrl = `/merchant/${merchant.id}/optimalvalue/${id}`
        axios.delete(apiUrl)
        .then( (res) => {
            // console.log(res)
            if(res.status == 200)  {
                flashDispatch(sendFlashMessage('Optimal Value deleted', 'alert-success', 'top'))
                setTrigger( Math.floor(Date.now() / 1000) )
            }
        })
        .catch( error => {
            console.log(error);
            flashDispatch(sendFlashMessage(<ApiErrorMessage errors={error.response.data} />, 'alert-danger', 'top'))
        })
    }

    const RenderActions = ({row}) => {
        return (
            <>
                <span onClick={() => onClickEditValue( row.original )} className="link">Edit</span>{ " | "} 
                <span onClick={() => onClickDeleteValue(row.original.id)} className="link">Delete</span>
            </>
        )
    }
    
    const [isOpen, setOpen] = useState(false)
    const [trigger, setTrigger] = useState( 0 );

    const toggle = () => {
        setOpen(prevState => !prevState)
    }

    let optimal_values_columns = [
        ...OPTIMAL_AMOUNT_COLUMNS, 
        ...[{
            Header: "Action",
            accessor: "id",
            Cell: ({ row }) => <RenderActions row={row} />,
        }]
    ]
    let columns = useMemo( () => optimal_values_columns, [])
    
    const [{ queryPageIndex, queryPageSize, totalCount, queryPageSortBy, queryTrigger }, dispatch] =
    React.useReducer(reducer, initialState);

    const apiUrl = `/merchant/${merchant.id}/optimalvalue`

    const { isLoading, error, data, isSuccess } = useQuery(
        ['giftcodes', apiUrl, queryPageIndex, queryPageSize, queryPageSortBy, queryTrigger],
        () => fetchApiData(
            {
                url: apiUrl,
                page: queryPageIndex,
                size: queryPageSize,
                sortby: queryPageSortBy,
                trigger: queryTrigger
            }
        ),
        // () => fetchMockData(),
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
            sortBy: queryPageSortBy
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
    const manualPageSize = []
    
    useEffectToDispatch( dispatch, {pageIndex, pageSize, gotoPage, sortBy, data, trigger} );

    if (error) {
        return <p>Error: {JSON.stringify(error)}</p>;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if(isSuccess)
    return (
            <>
                <div className='table react-table available-table'>
                    <Row>
                        <Col md={12} className="text-right pr-4">
                            <div 
                            style={{maxWidth:'220px'}}
                            className="btn btn-primary account__btn account__btn--small"
                            onClick={onClickAddValue}
                            >Add Optimal Amount
                            </div>
                        </Col>
                    </Row>
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
                {/* <UploadGiftCodesModal isOpen={isOpen} toggle={toggle} data={data} setTrigger={setTrigger} /> */}
                <OptimalAmountModal isOpen={isOpen} setOpen={setOpen} toggle={toggle} merchant={merchant} setTrigger={setTrigger} data={editable}   />
            </>
    )
}

const TableWrapper = ({merchant}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <DataTable merchant={merchant} />
        </QueryClientProvider>
    )
}

export default TableWrapper;


