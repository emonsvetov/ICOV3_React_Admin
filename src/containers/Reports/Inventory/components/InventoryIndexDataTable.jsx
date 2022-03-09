import React, {useState, useEffect, useMemo} from "react";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { Col, Row} from 'reactstrap';
import InventoryFilter  from "./InventoryFilter";
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
        // console.log('fetching reports...')
        let params = {}
        if( pageFilter ) {
            if( pageFilter?.action )    {
                params.action = pageFilter.action
                if( pageFilter.merchant_id && pageFilter.merchant_id.length > 0)    {
                    params.merchant_id = pageFilter.merchant_id
                }
                if( pageFilter.end_date )    {
                    // console.log(pageFilter.end_date)
                    let end_date = jsdate2ymd(pageFilter.end_date)
                    params.end_date = end_date
                }
            }
        }
        // console.log(params)
        try {
            const response = await axios.post(
                `/organization/${organization.id}/reports/inventory`,
                params
            );
            // console.log(response)
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

    // console.log(data)

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