import React, {useState, useEffect, useMemo} from "react";
import { useTable, usePagination, useSortBy, useExpanded, useResizeColumns, useFlexLayout } from "react-table";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import MOCK_DATA from "./MOCK_DATA.json";
import {PROGRAM_COLUMNS} from "./columns";
import SortIcon from 'mdi-react/SortIcon';
import SortAscendingIcon from 'mdi-react/SortAscendingIcon';
import SortDescendingIcon from 'mdi-react/SortDescendingIcon';
import { Col, Row} from 'reactstrap';
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
// import { GlobalFilter } from "./GlobalFilter";
// import { StatusFilter } from "./StatusFilter";
import InventoryFilter  from "./InventoryFilter";
import { Link } from 'react-router-dom';
import axios from 'axios'

import { jsdate2ymd } from '@/shared/helpers'

const queryClient = new QueryClient()

const initialState = {
    queryPageFilter:{},
};

const PAGE_FILTER_CHANGED = 'PAGE_FILTER_CHANGED';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case PAGE_FILTER_CHANGED:
        return {
            ...state,
            queryPageFilter: payload,
        };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

const DataTable = ({organization}) => {

    const fetchReport = async (pageFilter = null) => {
        const params = []
        let paramStr = ''
        if( pageFilter ) {
            if( pageFilter?.action )    {
                if( pageFilter.action === 'submit')    {
                    if( pageFilter.merchant_id && pageFilter.merchant_id.length > 0)    {
                        params.push(`merchant_id=${pageFilter.merchant_id}`)
                    }
                    if( pageFilter.end_date )    {
                        // console.log(pageFilter.end_date)
                        let end_date = jsdate2ymd(pageFilter.end_date)
                        params.push(`end_date=${end_date}`)
                    }
                }
            }
            if(params.length>0) paramStr = params.join('&')
        }
        try {
            const response = await axios.get(
            `/organization/${organization.id}/reports/inventory?${paramStr}`
            );
            console.log(response)
            return response.data
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    }

    const [filter, setFilter] = useState({});

    const onSubmitFilterCb = ( values ) => {
        // alert(JSON.stringify(values))
        setFilter( values );
    }

    const [{ queryPageFilter }, dispatch] =
    React.useReducer(reducer, initialState);

    const { isLoading, error, data, isSuccess } = useQuery(
        ['inventory', queryPageFilter],
        () => fetchReport(queryPageFilter),
        {
            keepPreviousData: true,
            staleTime: Infinity,
        }
    );

    // console.log(data)

    React.useEffect(() => {
        dispatch({ type: PAGE_FILTER_CHANGED, payload: filter });
    }, [filter]);

    if( isLoading ){
        return <p>Loading...</p>
    }

    if (error) {
        return <p>Error: {JSON.stringify(error)}</p>;
    }

    return (
            <>
                <div className='table react-table'>
                    <div className="action-panel">
                        <Row className="mx-0">
                            <Col lg={9} md={9} sm={8}>
                                <InventoryFilter onSubmitFilterCb={onSubmitFilterCb} />
                            </Col>
                        </Row>
                    </div>
                    {
                    isSuccess && 
                        <table className="table">
                            <thead>
                                    <tr>
                                        <th>
                                            Promotional Codes On Hand
                                        </th>
                                    </tr>
                            </thead>
                            <tbody className="table table--bordered">
                                <tr>
                                    <td>$1</td>
                                </tr>
                            </tbody>
                        </table>
                    }
                </div>
            </>
    )
}

const TableWrapper = ({organization}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <DataTable organization={organization} />
        </QueryClientProvider>
    )
}

export default TableWrapper;