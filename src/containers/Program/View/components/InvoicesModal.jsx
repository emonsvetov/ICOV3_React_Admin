import React, {useMemo, useState, useEffect} from 'react';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';
// import { Form, Field } from 'react-final-form';
// import Select from 'react-select';
import INVOICES from "@/shared/json/invoices.json";
import { useTable, useSortBy, usePagination } from "react-table";
import DeleteOutlineIcon from 'mdi-react/DeleteOutlineIcon';
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import SortIcon from 'mdi-react/SortIcon';
import SortAscendingIcon from 'mdi-react/SortAscendingIcon';
import SortDescendingIcon from 'mdi-react/SortDescendingIcon';
import CreateInvoiceForm from './CreateInvoiceForm';

const MerchantsModal = ({isOpen, setOpen, toggle, programId, theme, rtl}) => {
    const LOGO_PUBLIC_URL = `${process.env.PUBLIC_URL}/img/logo`;
    // console.log(LOGO_PUBLIC_URL)
    const InvoiceData = (props) =>{
        const INVOICES_COLUMNS = [
            {
                Header: "Reference No.",
                accessor: "ref",
                // Cell: ({ row, value }) => { return <img className='merchant_icon' src={`${LOGO_PUBLIC_URL}/${value}`} />},
            },
            {
                Header: "Merchant Name",
                accessor: "merchant"
            },
            {
                Header: "Date",
                accessor: "date"
            },
            {
                Header: "Total",
                accessor: "total"
            }
        ]

        useEffect(() => {
            // axiosConfig();
            const getData = () => {
                // alert("Loading merchants data")
                //   axios
                //     .get('/organization/1/program')
                //     .then((response) => {
                //         // check if the data is populated
                //     //   console.log(response.data);
                //         setData(response.data);
                //         // you tell it that you had the result
                //         setLoadingData(false);
                //     });
                // setData(INVOICES);
                setLoadingData(false);
            }
            if (loadingData) {
              getData();
            }
        }, []);
        let columns = useMemo( () => INVOICES_COLUMNS, [])
        const [loadingData, setLoadingData] = useState(true);
        const [data, setData] = useState(useMemo( () => INVOICES, []));
        const [loading, setLoading] = useState(false)

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
            state
        } = useTable({
            columns,
            data,
            initialState: { pageSize: 30 }
        },
        useSortBy,
        usePagination
        );
        const manualPageSize = []
        const { pageIndex, pageSize } = state;

        return(
            <>
                <Row className='w100'>
                    <Col md="6" lg="6" xl="6">
                        <div className="react-table__wrapper">
                            <div className="card__title">
                                <h3>Invoice and Statement</h3>
                                <h5 className="colorgrey">Resident Gifts</h5>
                            </div>
                        </div>
                    </Col>
                    <Col md="6" lg="6" xl="6" className='text-right'>
                        <ButtonToolbar className="modal__footer flex justify-content-right w100">
                            <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                            <Button type="submit" 
                                disabled={loading} 
                                className="btn btn-primary" 
                                color="#ffffff"
                                onClick = {() => props.onStep(1)}
                                >Create Invoice
                            </Button>
                        </ButtonToolbar>
                    </Col>
                </Row>

                {loadingData ? (
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
    
    const [step, setStep] = useState(0);
    
    const handleStep = (step) =>{
        setStep(step);
      }
    
    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={() => setOpen(true)}>
        
        <ModalBody className='modal-lg'>
            { step === 0 && <InvoiceData  onStep = { handleStep} />}
            { step === 1 && <CreateInvoiceForm onStep = { handleStep} />}
        </ModalBody>
    </Modal>
)}
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
export default MerchantsModal;
// ProgramInfo.propTypes = {
//     theme: ThemeProps.isRequired,
//     rtl: RTLProps.isRequired
// };
  
// export default withRouter(connect((state) => ({
//     theme: state.theme,
//     rtl: state.rtl
// }))(ProgramInfo));
