import React, {useMemo, useState} from "react";
import { useTable, useSortBy, usePagination, useGlobalFilter, useFilters, useExpanded } from "react-table";
import MOCK_DATA from "./MOCK_DATA.json";
import { COLUMNS } from "./columns";
import SortIcon from 'mdi-react/SortIcon';
import SortAscendingIcon from 'mdi-react/SortAscendingIcon';
import SortDescendingIcon from 'mdi-react/SortDescendingIcon';
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import { GlobalFilter } from "./GlobalFilter";
import { StatusFilter } from "./StatusFilter";

const DataTable = () => {
    const data = useMemo( () => MOCK_DATA, [])
    const columns = useMemo( () => COLUMNS, [])
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

    const [filterInput, setFilterInput] = useState("");
    // const [statusFilterValue, setStatusFilterValue] = useState("");
    const manualPageSize = []
    const { globalFilter, pageIndex, pageSize, expanded } = state

    return (
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
                                        console.log(cell)
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