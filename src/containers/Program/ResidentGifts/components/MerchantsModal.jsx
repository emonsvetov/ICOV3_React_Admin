import React, {useMemo, useState, useEffect} from 'react';
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';
// import { Form, Field } from 'react-final-form';
// import Select from 'react-select';
import MERCHANTS from "@/shared/json/merchants.json";
import { useTable, useSortBy, usePagination } from "react-table";
import DeleteOutlineIcon from 'mdi-react/DeleteOutlineIcon';
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import SortIcon from 'mdi-react/SortIcon';
import SortAscendingIcon from 'mdi-react/SortAscendingIcon';
import SortDescendingIcon from 'mdi-react/SortDescendingIcon';

const MerchantsModal = ({isOpen, setOpen, toggle, programId, theme, rtl}) => {
    const LOGO_PUBLIC_URL = `${process.env.PUBLIC_URL}/img/logo`;
    // console.log(LOGO_PUBLIC_URL)
    const MERCHANT_COLUMNS = [
        {
            Header: "Logo",
            accessor: "logo",
            Cell: ({ row, value }) => { return <img className='merchant_icon' src={`${LOGO_PUBLIC_URL}/${value}`} />},
        },
        {
            Header: "Merchant Name",
            accessor: "name"
        },
        {
            Header: "Featured",
            accessor: "featured"
        },
        {
            Header: "Cost to Program",
            accessor: "cost_to_program"
        },
        {
            Header: "Action",
            accessor: "action",
            // Footer: "Action",
            Cell: ({ row }) => <RenderActions row={row} />
        }
    ]
    const onClickDeleteMerchant = (merchantId) => {
        alert(`Deleting merchant ${merchantId}`)
    }
    const RenderActions = ({row}) => {
        return (
            <>
                <span>
                    <DeleteOutlineIcon onClick={() => onClickDeleteMerchant(row.original.id)} />
                </span>
            </>
        )
    }
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
            // setData(MERCHANTS);
            setLoadingData(false);
        }
        if (loadingData) {
          getData();
        }
    }, []);
    let columns = useMemo( () => MERCHANT_COLUMNS, [])
    const [loadingData, setLoadingData] = useState(true);
    const [data, setData] = useState( useMemo( () => MERCHANTS, []) );
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
    const { pageIndex, pageSize } = state

    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={() => setOpen(true)}>
        <ModalHeader className='w100'>
            <Row className='w100'>
                <Col md="6" lg="6" xl="6">
                    <h3>Merchants</h3>
                    <h5 className='colorgrey'>Resident Gifts</h5>
                </Col>
                <Col md="6" lg="6" xl="6" className='text-right'>
                    <ButtonToolbar className="modal__footer flex justify-content-right w100">
                        <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                        <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Add Merchant</Button>
                    </ButtonToolbar>
                </Col>
            </Row>
        </ModalHeader>
        <ModalBody className='modal-lg'>
        <>
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
