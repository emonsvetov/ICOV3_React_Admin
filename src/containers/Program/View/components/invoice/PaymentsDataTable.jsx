import React, {useMemo, useState, useEffect} from 'react';
import { useTable, useSortBy, usePagination } from "react-table";
import { Button, ButtonToolbar, Row, Col  } from 'reactstrap';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import {reducer, useEffectToDispatch, fetchApiData, initialState, Sorting} from "@/shared/apiTableHelper"
import PaymentReversalModal from './PaymentReversalModal'
const queryClient = new QueryClient()
const PaymentsDataTable = (props) =>{

    const [isOpen, setOpen] = useState(false);
    const [payment, setPayment] = useState(null);
    const toggle = () => {
        setOpen(prevState => !prevState)
    }

    const onClickReversePayment = (row) => {
        // console.log(row)
        setPayment(row)
        setOpen(true)
    }

    // console.log(props)
    const INVOICES_COLUMNS = [
        {
            Header: "Date",
            accessor: "date_paid",
        },
        {
            Header: "Payment Kind",
            accessor: "event_type"
        },
        {
            Header: "Invoice",
            accessor: "invoice_number",
        },
        {
            Header: "Amount",
            accessor: row => '$' + parseFloat(row.amount).toFixed(2)
        },
        {
            Header: "Notes",
            accessor: "notes"
        }
    ]

    const RenderActions = ({row}) => {
        return (
            <>
                {props.auth?.isSuperAdmin &&
                <button className='btn btn-primary btn-xs mb-0' onClick={() => onClickReversePayment(row.original)}>Reverse Payment</button>}
            </>
        )
    }

    let invoices_columns = [
        ...INVOICES_COLUMNS, 
        ...[{
            Header: "Actions",
            accessor: "action",
            Cell: ({ row }) => <RenderActions row={row} />,
        }]
    ]

    let columns = useMemo( () => invoices_columns, [])

    const [{ queryPageIndex, queryPageSize, totalCount, queryPageSortBy, queryTrigger }, dispatch] =
    React.useReducer(reducer, initialState);

    const apiUrl = `/organization/${props.program.organization_id}/program/${props.program.id}/payments?pays_for_points=1`

    const { isLoading, error, data, isSuccess } = useQuery(
        ['invoices', apiUrl, queryPageIndex, queryPageSize, queryPageSortBy, queryTrigger],
        () => fetchApiData(
            {
                url: apiUrl,
                page: queryPageIndex,
                size: queryPageSize,
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
        state: { pageIndex, pageSize, sortBy, pageFilter }
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
    usePagination
    );
    
    const manualPageSize = []
    // const { pageIndex, pageSize } = state;

    useEffectToDispatch( dispatch, {pageIndex, pageSize, gotoPage, sortBy, data, trigger: props.trigger} );

    useEffect(() => {
        // console.log(props)
        // props.setTrigger( Math.floor(Date.now() / 1000) )
    }, [props])

    if (error) {
        return <p>Error: {JSON.stringify(error)}</p>;
    }

    return(
        <>
            {isLoading ? (
                <p>Loading Please wait...</p>
            ) : (
                <>
                    <div className='table react-table'>
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
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {
                                                row.cells.map( cell => {
                                                    // console.log(cell)
                                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                })
                                            }
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <PaymentReversalModal isOpen={isOpen} setOpen={setOpen} toggle={toggle} action={props.reversePayment} payment={payment} />
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
    );
}

const TableWrapper = (props) => {
    return (
        <QueryClientProvider client={queryClient}>
            <PaymentsDataTable {...props} />
        </QueryClientProvider>
    )
}

export default TableWrapper;