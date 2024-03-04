import React, {useEffect, useMemo, useState} from "react";
import {useExpanded, usePagination, useResizeColumns, useSortBy, useTable} from "react-table";
import {QueryClient, QueryClientProvider, useQuery} from 'react-query'
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import {Col, Row} from 'reactstrap';
import MigrationResultModal from './MigrationResultModal'
import getV2DeprecatedMigrate from '@/service/getV2DeprecatedMigrate';
import {connect} from "react-redux";
import {Link, withRouter} from 'react-router-dom';
import axios from 'axios';
import {
    reducer,
    useEffectToDispatch,
    fetchApiData,
    fetchApiDataExport,
    initialState,
    Sorting
} from "@/shared/apiTableHelper"

import {clone} from 'lodash';
import MigrationFilter from "./MigrationFilter";
import ProgramFormModal from "../../Users/View/ProgramFormModal";

const queryClient = new QueryClient()


const DataTable = ({organization, programs}) => {
    const [filter, setFilter] = useState({});

    const [isOpen, setOpen] = useState(false)
    const toggle = () => {
        setOpen(prevState => !prevState)
    }
    const [migrationResultAccount, setMigrationResultAccount] = useState(0);
    const [migrationResult, setMigrationResult] = useState('');
    const [useFilter, setUseFilter] = useState(false);
    const [trigger, setTrigger] = useState(0);
    const [exportData, setExportData] = useState([]);
    const [exportHeaders, setExportHeaders] = useState([]);
    const [exportToCsv, setExportToCsv] = useState(false);
    const exportLink = React.createRef();

    const [{queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy, queryTrigger}, dispatch] =
        React.useReducer(reducer, initialState);

    const apiUrl = `/v2-deprecated/program`;
    const {isLoading, error, data, isSuccess} = useQuery(
        ['/V2DeprecatedProgram', apiUrl, queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy, queryTrigger],
        () => fetchApiData(
            {
                url: apiUrl,
                page: queryPageIndex,
                size: queryPageSize,
                filter,
                sortby: queryPageSortBy,
                trigger: queryTrigger
            }
        ),
        {
            keepPreviousData: true,
            staleTime: Infinity,
        }
    );

    useEffect(() => {
        if (exportToCsv) {
            if (exportLink.current) {
                setExportToCsv(false);
                exportLink.current.link.click();
            }
        }
    }, [exportLink])

    const download = async (filterValues) => {
        let tmpFilter = clone(filterValues);
        tmpFilter.exportToCsv = 1;

        const response = await fetchApiDataExport(
            {
                url: apiUrl,
                filter: tmpFilter,
                sortby: queryPageSortBy,
                trigger: queryTrigger
            }
        );
        setExportData(response.results);
        setExportHeaders(response.headers);
        setExportToCsv(true);
    }

    const RenderActions = ({row}) => {
        return (
            <>
                <a className='link' onClick={() => {
                    getV2DeprecatedMigrate(row.original.account_holder_id).then( response => {
                        setMigrationResultAccount(row.original.account_holder_id);
                        setMigrationResult(response);
                        toggle();
                    })
                }}>Migrate</a>
            </>
        )
    }

    const runGlobalMigrations = async () => {
      const response = await axios.get('/v2-deprecated/migrate-global');
      setMigrationResultAccount(false);
      setMigrationResult(response.data);
      toggle();
    }

  const runArtisanMigrations = async () => {
    const response = await axios.get('/v2-deprecated/migrate-artisan');
    setMigrationResultAccount(false);
    setMigrationResult(response.data);
    toggle();
  }

    const TABLE_COLUMNS = [
        {
            Header: "V2 Program Name",
            accessor: "name",
        },
        {
            Header: "V3 Program Name",
            accessor: "v3name",
        },
        {
            Header: "",
            accessor: "count",
            Cell: ({row}) => <RenderActions row={row}/>,
        },
    ];

    let columns = useMemo(() => TABLE_COLUMNS, [])
    const totalPageCount = Math.ceil(totalCount / queryPageSize)

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        rows,
        prepareRow,
        rowSpanHeaders,
        page,
        pageCount,
        pageOptions,
        gotoPage,
        previousPage,
        canPreviousPage,
        nextPage,
        canNextPage,
        setPageSize,
        state: {pageIndex, pageSize, sortBy}
    } = useTable({
            columns: columns,
            data: data ? Object.values(data.results) : [],
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
            disableResizing: true,
            autoResetHiddenColumns: false,
            striped: true
        },
        useSortBy,
        useExpanded,
        usePagination,
        useResizeColumns,
        // useFlexLayout,
    );

    const manualPageSize = []
    useEffectToDispatch(dispatch, {pageIndex, pageSize, gotoPage, sortBy, filter, data, useFilter, trigger});

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {JSON.stringify(error)}</p>;
    }

    if (isSuccess)
        return (
            <>
                <div className='table react-table report-table'>
                    <div className="action-panel">
                        <Row className="mx-0">
                            <Col>
                                <MigrationFilter
                                    filter={filter} setFilter={setFilter} useFilter={useFilter}
                                    setUseFilter={setUseFilter}
                                    exportData={exportData} exportLink={exportLink} exportHeaders={exportHeaders}
                                    download={download}/>
                            </Col>
                        </Row>
                    </div>
                    <div className="mb-2" style={{'padding': '4px'}}>
                        <Link to={'#'} onClick={runGlobalMigrations}>Run global migrations</Link>
                        <span style={{'margin-left': '10px'}}><Link to={'#'} onClick={runArtisanMigrations}>Run artisan migrations</Link></span>
                    </div>
                    {
                        isLoading && <p>Loading...</p>
                    }
                    {
                        <MigrationResultModal data={migrationResult} isOpen={isOpen} toggle={toggle} migrationResultAccount={migrationResultAccount} />
                    }
                    {
                        isSuccess &&
                        <table {...getTableProps()} className="table table-striped report-table">
                            <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                            {column.render('Header')}
                                            {column.isSorted ? <Sorting column={column}/> : ''}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            </thead>
                            <tbody className="table table--bordered" {...getTableBodyProps()} >
                            {page.map(row => {
                                prepareRow(row);
                                const subCount = (row.id.match(/\./g) || []).length
                                const subRows = row.subRows;

                                const countSubRows = subRows ? subRows.length : 0;
                                const rowSpan = countSubRows ? countSubRows + 1 : 1;
                                return (
                                    <>
                                        <tr {...row.getRowProps()} key={row.id}>
                                            {
                                                row.cells.map(cell => {
                                                    // console.log(cell)
                                                    const skip = cell.value === 'skip_td';
                                                    if (skip) return null;
                                                    const paddingLeft = subCount * 20
                                                    return <td {...cell.getCellProps()} rowSpan={rowSpan}
                                                               key={cell.column.id + row.id}>
                                            <span
                                                style={cell.column.Header === '#' ? {paddingLeft: `${paddingLeft}px`} : null}>{cell.render('Cell')}</span>
                                                    </td>
                                                })
                                            }
                                        </tr>
                                        {countSubRows > 0 && subRows.map(subRow => {
                                            // console.log(subRow)
                                            prepareRow(subRow);
                                            return (
                                                <tr {...subRow.getRowProps()} key={subRow.id}>
                                                    {
                                                        subRow.cells.map(subCell => {
                                                            // console.log(subCell)
                                                            const skip = subCell.value === 'skip_td';
                                                            if (skip) return null;
                                                            return <td {...subCell.getCellProps()}
                                                                       key={subCell.column.id + subRow.id}>
                                                                <span>{subCell.render('Cell')}</span>
                                                            </td>
                                                        })
                                                    }
                                                </tr>
                                            )
                                        })}
                                    </>
                                )
                            })}
                            </tbody>
                            <tfoot>
                            {footerGroups.map((footerGroup) => (
                                <tr {...footerGroup.getFooterGroupProps()}>
                                    {footerGroup.headers.map(column => (
                                        <th {...column.getFooterProps()}>{column.render('Footer')}</th>
                                    ))}
                                </tr>
                            ))}
                            </tfoot>
                        </table>
                    }

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
                                        style={{width: '100px'}}
                                    />
                                </span>{" "}
                                <select
                                    className="ml-2"
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
                </div>
            </>
        )
}

const TableWrapper = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <DataTable />
        </QueryClientProvider>
    )
}

const mapStateToProps = (state) => {
    return {
        organization: state.organization,
    };
};
export default connect(mapStateToProps)(TableWrapper);