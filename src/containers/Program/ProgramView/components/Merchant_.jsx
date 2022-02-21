import React, {useMemo, useState, useEffect} from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Container, Button, ButtonToolbar, Row, Col, Card, CardBody} from 'reactstrap';
import MERCHANTS from "@/shared/json/merchants.json";
import { useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout } from "react-table";
import DeleteOutlineIcon from 'mdi-react/DeleteOutlineIcon';
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import SortIcon from 'mdi-react/SortIcon';
import SortAscendingIcon from 'mdi-react/SortAscendingIcon';
import SortDescendingIcon from 'mdi-react/SortDescendingIcon';
import renderToggleButtonField from "@/shared/components/form/ToggleButton";
import axios from 'axios'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import {renameChildrenToSubrows} from '@/shared/helpers'
import { Form, Field } from "react-final-form";
import ToggleButtonField from '@/shared/components/form/ToggleButton__old'
import { CheckBoxField } from './../../../../shared/components/form/CheckBox';

const queryClient = new QueryClient();
const initialState = {
    queryPageIndex: 0,
    queryPageSize: 10,
    totalCount: null,
    queryPageFilter:{},
    queryPageSortBy: [],
};

const PAGE_CHANGED = 'PAGE_CHANGED';
const PAGE_SIZE_CHANGED = 'PAGE_SIZE_CHANGED';
const PAGE_SORT_CHANGED = 'PAGE_SORT_CHANGED'
const PAGE_FILTER_CHANGED = 'PAGE_FILTER_CHANGED';
const TOTAL_COUNT_CHANGED = 'TOTAL_COUNT_CHANGED';

const reducer = (state, { type, payload }) => {
    switch (type) {
      case PAGE_CHANGED:
          return {
              ...state,
              queryPageIndex: payload,
          };
      case PAGE_SIZE_CHANGED:
          return {
              ...state,
              queryPageSize: payload,
          };
      case PAGE_SORT_CHANGED:
          return {
              ...state,
              queryPageSortBy: payload,
          };
      case PAGE_FILTER_CHANGED:
          return {
              ...state,
              queryPageFilter: payload,
          };
      case TOTAL_COUNT_CHANGED:
          return {
              ...state,
              totalCount: payload,
          };
      default:
        throw new Error(`Unhandled action type: ${type}`);
    }
  };

const fetchMerchant = async ( id ) => {
    try {
        console.log('fetching merchant')
        const response = await axios.get(`/merchant/${id}`);
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};
const fetchMerchantData = async (page, pageSize, pageFilterO = null, pageSortBy) => {
    // const offset = page * pageSize;
    const params = []
    let paramStr = ''
    if( pageFilterO ) {
        if(pageFilterO.keyword !== 'undefined' && pageFilterO.keyword) params.push(`keyword=${pageFilterO.keyword}`)
        paramStr = params.join('&')
    }
    if( pageSortBy.length > 0 ) {
        const sortParams = pageSortBy[0];
        const sortyByDir = sortParams.desc ? 'desc' : 'asc'
        paramStr = `${paramStr}&sortby=${sortParams.id}&direction=${sortyByDir}`
    }
    try {
        const response = await axios.get(
        `/merchant?page=${page}&limit=${pageSize}&${paramStr}`
        );
        // console.log(response)
        if( response.data.length === 0) return {results:[],count:0}
        const data = {
            results: renameChildrenToSubrows(response.data.data),
            count: response.data.total
        };
        // console.log(data)
        return data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

const Merchant = (props) => {
    const LOGO_PUBLIC_URL = `${process.env.PUBLIC_URL}/img/logo`;
    // console.log(LOGO_PUBLIC_URL)
    let history = useHistory();
    const { programId } = useParams();
    const [programData, setProgramData] = useState(null);
    const [merchantsData, setMerchantsData] = useState(null);

    const [featured, setFeatured] = useState(false);
    const [cost, setCost] = useState(false);
    const [active, setActive] = useState(true);

    // const [isLoading, setIsLoading] = useState(true) //first page load!
    const fetchProgramData = async() => {
        try {
            const response = await axios.get(`/organization/1/program/${programId}`);
            // console.log(response)
            setProgramData(response.data)
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    };
    useEffect(() => {
        fetchProgramData()
    },[])

    useEffect( ()=>{
        fetchMerchant( programId )
        .then( response => {
            setMerchantsData(response)
            // setIsLoading(false)
        })
    }, [programId]);

    
    const onClickDeleteMerchant = (merchantId) => {
        alert(`Deleting merchant ${merchantId}`)
    }
    
    const handleToggle= (type, id) => {
        debugger;
        switch(type){
            case "featured":
                setFeatured(!featured);
            break;
            case "cost":
                setCost(!cost);
            break;
            default:
                setActive(!active);

        }
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
    const RenderToggle = ({type, row}) => {
        return (
            <>
            <div className="toggle-btn-row">
                <input
                    className="toggle-btn__input"
                    type="checkbox"
                    name='xxx'
                    onChange={onChange}
                    checked={active}
                />
                <button
                    type="button"
                    className="toggle-btn__input-label"
                    onClick={() => onChange(!active)}
                >Toggle
                </button>
            </div>
            </>
        )
    }
                   
    
    
    const [filter, setFilter] = useState({ keyword:''});
    const onClickFilterCallback = (keyword) => {
        if(filter.keyword === keyword)    {
            alert('No change in filters')
            return
        }
        setFilter({keyword})
    
    }

    const onChange = (value) =>{
        setActive(value);
        console.log(value, 'value')
        console.log(active, 'active')
    }

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
            accessor: "featured",
            Cell: ({ row }) => <RenderToggle type="featured" row={row} />
        },
        {
            Header: "Cost to Program",
            accessor: "cost_to_program",
            Cell: ({ row }) => <RenderToggle type = "cost" row={row} />
        },
        {
            Header: "Active",
            accessor: "active",
            // Footer: "Action",
            Cell: ({ row }) => <RenderToggle type = "cost" row={row} />
        }
        // onChange, defaultChecked, name, disabled, value,
    ]
    let columns = useMemo( () => MERCHANT_COLUMNS, [])
    const [{ queryPageIndex, queryPageSize, totalCount, queryPageFilter, queryPageSortBy }, dispatch] =
    React.useReducer(reducer, initialState);

    const { isLoading, error, data, isSuccess } = useQuery(
        ['merchants', queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy],
        () => fetchMerchantData(queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy),
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
            sortBy: queryPageSortBy,
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
    
    React.useEffect(() => {
        dispatch({ type: PAGE_CHANGED, payload: pageIndex });
    }, [pageIndex]);

    React.useEffect(() => {
        // alert(PAGE_SIZE_CHANGED)
        dispatch({ type: PAGE_SIZE_CHANGED, payload: pageSize });
        gotoPage(0);
    }, [pageSize, gotoPage]);

    useEffect(() => {
        dispatch({ type: PAGE_SORT_CHANGED, payload: sortBy });
        gotoPage(0);
    }, [sortBy, gotoPage]);

    React.useEffect(() => {
        // alert(PAGE_FILTER_CHANGED)
        dispatch({ type: PAGE_FILTER_CHANGED, payload: filter });
        gotoPage(0);
    }, [filter, gotoPage]);

    React.useEffect(() => {
        if (data?.count) {
            dispatch({
            type: TOTAL_COUNT_CHANGED,
            payload: data.count,
            });
        }
    }, [data?.count]);

    if (error) {
        return <p>Error: {JSON.stringify(error)}</p>;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }
   

    // let columns = useMemo( () => MERCHANT_COLUMNS, [])
    // const [loadingData, setLoadingData] = useState(true);
    // const [data, setData] = useState( useMemo( () => MERCHANTS, []) );
    // const [loading, setLoading] = useState(false)

    // const {
    //     getTableProps,
    //     getTableBodyProps,
    //     headerGroups,
    //     rows,
    //     prepareRow,
    //     page,
    //     pageCount,
    //     pageOptions,
    //     gotoPage,
    //     previousPage,
    //     canPreviousPage,
    //     nextPage,
    //     canNextPage,
    //     setPageSize,
    //     state
    // } = useTable({
    //     columns,
    //     data,
    //     initialState: { pageSize: 30 }
    // },
    // useSortBy,
    // usePagination
    // );
    // const manualPageSize = []
    // const { pageIndex, pageSize } = state
    if(isSuccess)
    return (
        <Container className="merchant-view">
            <Row >
                <Col md="6" lg="6" xl="6">
                    <h3 className="page-title">Merchants</h3>
                    <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/program">Programs</Link> / <Link className="" to = {`/program/view/${programId}`}>{programData?.name}</Link>/ Merchant </h3>
                </Col>
                <Col md="6" lg="6" xl="6" className='text-right'>
                    <ButtonToolbar className="modal__footer flex justify-content-right w100">
                        <Button outline color="primary" className="mr-3" onClick={()=>{history.goBack()}}>Cancel</Button>{' '}
                        <Button type="submit" disabled={isLoading} className="btn btn-primary" color="#ffffff">Add Default Merchant</Button>
                    </ButtonToolbar>
                </Col>
            </Row>
        
            <Card>
            <CardBody>
            
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
                
            
            </CardBody>
            </Card>
        </Container>
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
// export default Merchant;
const TableWrapper = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Merchant />
        </QueryClientProvider>
    )
}

export default TableWrapper;