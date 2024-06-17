import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTable, useSortBy, usePagination, useFlexLayout } from 'react-table';
import axios from 'axios';
import { ENTRATA_CONFIGURATION_COLUMNS } from './columns';
import { Form, Field } from 'react-final-form';
import styles from './columns';
import { Button, Row, Col } from 'reactstrap';
import { CSVLink } from "react-csv";
import getUserStatusList from '@/service/getUserStatuses';
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import {
    TableFilter
} from "@/shared/apiTableHelper"
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const EntrataViewTable = ({ organization, programs }) => {
    const [data, setData] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [filters, setFilters] = useState({ type: '', search_text: '', keyword: '' });
    const [csvData, setCsvData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const exportLink = useRef();

    const fetchData = async (pageIndex = 0, pageSize = 10) => {
        setLoading(true);
        try {
            const result = await axios.get('/entrata', {
                params: {
                    ...filters,
                    limit: pageSize,
                    offset: pageIndex * pageSize
                }
            });
            setData(result.data.data);
            setTotalCount(result.data.totalCount || 0);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const verifyConnection = async (entrataObject) => {
        try {
            const response = await axios.post('/entrata/verify', entrataObject);
            alert(response.data.msg);
        } catch (error) {
            console.error('Failed to verify connection:', error);
        }
    };

    useEffect(() => {
        fetchData(0, 10);
        if (organization) {
            getUserStatusList(organization.id)
                .then(list => {
                    setStatusOptions([
                        { value: '', label: 'All' },
                        ...list.map(status => ({ value: status.id, label: status.status }))
                    ]);
                })
                .catch(error => console.error('Failed to fetch user statuses:', error));
        }
    }, [organization, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    const handleSubmitFilter = (values) => {
        values.merchant_id = values.merchant_id?.filter(n => n);
        setFilters(values);
        fetchData(0, 10);
    };

    const columns = useMemo(() => ENTRATA_CONFIGURATION_COLUMNS(), []);

    const tableInstance = useTable(
        { columns, data, manualPagination: true, pageCount: Math.ceil(totalCount / 10) },
        useSortBy,
        usePagination,
        useFlexLayout
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        page,
        gotoPage,
        setPageSize,
        state: { pageIndex, pageSize }
    } = tableInstance;

    useEffect(() => {
        setCsvData(rows.map(row => row.original));
    }, [rows]);

    const downloadCsv = () => {
        setCsvData(rows.map(row => row.original));
    };

    return (
        <div>
            <style>{styles}</style>
            <TableFilter
                filter={filters}
                setFilter={setFilters}
                setUseFilter={() => {}}
                exportData={csvData}
                exportLink={exportLink}
                download={downloadCsv}
                config={{
                    keyword: true,
                    dateRange: false,
                    programs: true,
                    exportToCsv: true
                }}
            >
                {options => (
                    <Form onSubmit={handleSubmitFilter}>
                        {({ handleSubmit, form, submitting }) => (
                            <form className="form" onSubmit={handleSubmit}>
                                <Row>
                                    <Col md="3">
                                        <span className="form__form-group-label">User Type</span>
                                        <Field name="type" component="select" value={filters.type} onChange={handleFilterChange}>
                                            {statusOptions.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </Field>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="d-flex align-items-end pl-1">
                                        <Button
                                            type="submit"
                                            disabled={submitting}
                                            className="btn btn-sm btn-primary"
                                            color="#ffffff"
                                        >Filter</Button>
                                        <CSVLink data={csvData} filename={"entrata-configurations.csv"} ref={exportLink}>
                                            <Button className="btn btn-sm btn-primary ml-2" onClick={downloadCsv}>Export CSV</Button>
                                        </CSVLink>
                                    </Col>
                                </Row>
                            </form>
                        )}
                    </Form>
                )}
            </TableFilter>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <table {...getTableProps()} className="table">
                        <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? ' 🔽'
                                                    : ' 🔼'
                                                : ''}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                        {page.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    <ReactTablePagination
                        page={page}
                        gotoPage={gotoPage}
                        previousPage={() => gotoPage(pageIndex - 1)}
                        nextPage={() => gotoPage(pageIndex + 1)}
                        canPreviousPage={pageIndex > 0}
                        canNextPage={pageIndex < Math.ceil(totalCount / pageSize) - 1}
                        pageOptions={[...Array(Math.ceil(totalCount / pageSize)).keys()]}
                        pageSize={pageSize}
                        pageIndex={pageIndex}
                        pageCount={Math.ceil(totalCount / pageSize)}
                        setPageSize={setPageSize}
                    />
                </>
            )}
        </div>
    );
};

const TableWrapper = ({ organization, programs }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <EntrataViewTable organization={organization} programs={programs} />
        </QueryClientProvider>
    )
}

export default TableWrapper;

