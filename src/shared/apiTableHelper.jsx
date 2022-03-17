import React from "react"
import axios from 'axios'
import SortIcon from 'mdi-react/SortIcon';
import { Row, Col } from 'reactstrap';

import SortAscendingIcon from 'mdi-react/SortAscendingIcon';
import SortDescendingIcon from 'mdi-react/SortDescendingIcon';
import DatePicker from 'react-datepicker';
import {dateStrToYmd} from '@/shared/helpers';


const QUERY_TRIGGER = 'QUERY_TRIGGER';
const PAGE_CHANGED = 'PAGE_CHANGED';
const PAGE_SIZE_CHANGED = 'PAGE_SIZE_CHANGED';
const PAGE_SORT_CHANGED = 'PAGE_SORT_CHANGED'
const PAGE_FILTER_CHANGED = 'PAGE_FILTER_CHANGED';
const TOTAL_COUNT_CHANGED = 'TOTAL_COUNT_CHANGED';

export const reducer = (state, { type, payload }) => {
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
    case QUERY_TRIGGER:
        return {
            ...state,
            queryTrigger: payload,
        };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

export const useEffectToDispatch = (dispatch, {
    pageIndex = 0, 
    pageSize, 
    gotoPage, 
    sortBy, 
    filter, 
    data, 
    useFilter,
    trigger = 0
}) => {
    React.useEffect(() => {
        dispatch({ type: PAGE_CHANGED, payload: pageIndex });
    }, [pageIndex]);

    React.useEffect(() => {
        // alert(PAGE_SIZE_CHANGED)
        dispatch({ type: PAGE_SIZE_CHANGED, payload: pageSize });
        gotoPage(0);
    }, [pageSize, gotoPage]);

    React.useEffect(() => {
        dispatch({ type: PAGE_SORT_CHANGED, payload: sortBy });
        gotoPage(0);
    }, [sortBy, gotoPage]);

    React.useEffect(() => {
        // alert(useFilter)
        if( useFilter ) {
            dispatch({ type: PAGE_FILTER_CHANGED, payload: filter });
            gotoPage(0);
        }
    }, [filter, gotoPage, useFilter]);

    React.useEffect(() => {
        if (data?.count) {
            dispatch({
            type: TOTAL_COUNT_CHANGED,
            payload: data.count,
            });
        }
    }, [data?.count]);

    React.useEffect(() => {
        dispatch({ type: QUERY_TRIGGER, payload: trigger });
        gotoPage(0);
    }, [trigger, gotoPage]);
}

export const initialState = {
    queryPageIndex: 0,
    queryPageSize: 10,
    totalCount: 0,
    queryPageFilter:{},
    queryPageSortBy: [],
    queryTrigger:0,
};

// export const fetchApiData = async (apiUrl, page, pageSize, pageFilterO = null, pageSortBy) => {
export const fetchApiData = async( queryParams )  => {

    // console.log(queryParams)

    const queryDefaults = {
        url: '/',
        page: initialState.queryPageIndex,
        size: initialState.queryPageSize,
        filter: initialState.queryPageFilter,
        sortby: initialState.queryPageSortBy,
        trigger: initialState.queryTrigger
    }

    const options = { ...queryDefaults, ...queryParams }

    // console.log(options)

    const params = []
    let paramStr = ''
    if( options.trigger > 0) {
        params.push(`t=${options.trigger}`)
    }
    if( options.filter ) {
        // console.log(options.filter)
        const fields = Object.keys(options.filter);
        if( fields.length > 0)  {
            for(var i in fields)    {
                params.push(`${fields[i]}=${options.filter[fields[i]]}`)
            }
        }
        // if(options.filter.keyword !== 'undefined' && options.filter.keyword) params.push(`keyword=${options.filter.keyword}`)
        // if(options.filter.from !== 'undefined' && options.filter.from) params.push(`from=${options.filter.from}`)
        // if(options.filter.to !== 'undefined' && options.filter.to) params.push(`to=${options.filter.to}`)
    }
    if( params.length > 0 ) {
        paramStr = params.join('&')
    }
    console.log(paramStr)
    if( options.sortby.length > 0 ) {
        const sortParams = options.sortby[0];
        const sortyByDir = sortParams.desc ? 'desc' : 'asc'
        paramStr = `${paramStr}&sortby=${sortParams.id}&direction=${sortyByDir}`
    }
    try {
        const response = await axios.get(
        `${options.url}?page=${options.page+1}&limit=${options.size}&${paramStr}`
        );
        console.log(response)
        if( response.data.length === 0) return {results:[],count:0}
        const data = {
            results: response.data.data,
            count: response.data.total
        };
        // console.log(data)
        return data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

const getFirstDayOfMonth = () =>{
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1)
}

const defaultFrom = getFirstDayOfMonth()
const defaultTo = new Date()

export const TableFilter = ({ config, filter, setFilter, setUseFilter}) => {

    const defaultConfig = {
        label:'term',
        keyword:true,
        dateRange: false
    }

    const options = {...defaultConfig, ...config}

    // console.log(options)

    const [keyword, setKeyword] = React.useState('')
    const [from, setFrom] = React.useState( filter.from ? filter.from : defaultFrom )
    const [to, setTo] = React.useState( filter.to ? filter.to : defaultTo )

    const onKeywordChange = (e) => {
        setKeyword( e.target.value )
    }
    const onStartChange = ( value ) => {
        setFrom( value)
    }
    const onEndChange = ( value ) => {
        setTo(  value )
    }
    const onClickFilter = (reset = false) => {
        let dataSet = {}
        if( options.keyword ) {
            dataSet.keyword = reset ? '' : keyword
        }
        if( options.dateRange ) {
            dataSet.from = dateStrToYmd(reset ? defaultFrom : from)
            dataSet.to = dateStrToYmd(reset ? defaultTo : to)
        }
        onClickFilterCallback( dataSet )
        if( reset ) {
            setKeyword('')
            setFrom( defaultFrom )
            setTo( defaultTo )
        }
    }
    const onClickFilterCallback = (values) => {

        // alert(JSON.stringify(filter))
        // alert(JSON.stringify(values))
        var change = false;

        if(options.keyword) {
            if(filter.keyword !== values.keyword)   {
                change = true
            }
        }

        if(options.dateRange) {
            if(filter.from !== values.from || filter.to !== values.to )   {
                change = true
            }
        }

        if( !change )    {
            alert('No change in filters')
            setUseFilter(false)
            return
        }
        // alert(JSON.stringify(values))
        let filters = {}
        if( options.keyword ) filters.keyword = values.keyword
        if( options.dateRange ) {
            filters.from = values.from
            filters.to = values.to
        }
        // alert(JSON.stringify(filters))
        setFilter( filters )
        setUseFilter(true)
    }
    return (
        <Row className="table-filter-form form">
        {options.keyword && 
            <Col md={3} lg={3} sm={3}>
                <div className="form__form-group">
                    <div className="form__form-group-field">
                        <div className="form__form-group-row">
                            <input 
                                value={keyword}
                                onChange={onKeywordChange}
                                type="text"
                                placeholder={`Search ${options.label} here`}
                            />
                        </div>
                    </div>
                </div>
            </Col>
        }
        {options.dateRange && 
            <Col md={7} lg={7} sm={7}>
                <Row>
                    <Col md={6} lg={6} sm={6}>
                        <div className="form__form-group">
                            <span className="form__form-group-label">From</span>
                            <div className="form__form-group-field">
                                <div className="form__form-group-row">
                                    <DatePicker
                                        dateFormat="MM/dd/yyyy"
                                        selected={from}
                                        onChange={onStartChange}
                                        popperPlacement="center"
                                        dropDownMode="select"
                                        className="form__form-group-datepicker"
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={6} lg={6} sm={6}>
                        <div className="form__form-group">
                            <span className="form__form-group-label">To</span>
                            <div className="form__form-group-field">
                                <div className="form__form-group-row">
                                    <DatePicker
                                        dateFormat="MM/dd/yyyy"
                                        selected={to}
                                        onChange={onEndChange}
                                        popperPlacement="center"
                                        dropDownMode="select"
                                        className="form__form-group-datepicker"
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Col>
        }
            <Col md={2} lg={2} sm={6} className="align-items-center max-height-32px pl-1">
                <span className="text-blue pointer mr-2" onClick={()=>onClickFilter()}>Filter</span> | 
                <span className="text-blue pointer ml-2" onClick={()=>onClickFilter(true)}>Reset</span>
            </Col>
        </Row>
    )
}

// The CSV Table Error Building

export const makeCsvErrors = (csv_errors) => {
    const csv_errors_json = JSON.parse(csv_errors);
    if( csv_errors_json.errors && csv_errors_json.rows && csv_errors_json.errors.length === csv_errors_json.rows.length && csv_errors_json.rows.length > 0) {
        const csvErrors = csv_errors_json.errors;
        const csvHeaderRow = Object.keys(csv_errors_json.rows[0])
        // console.log(csvErrors)
        const CSV_COLUMNS = makeCsvColumns(csvHeaderRow)
        let csvRows = csv_errors_json.rows
        csvRows.map( (row, i) => {
            // console.log(csvErrors[i])
            for (var key in row){
                // console.log( key + ": " + row[key]);
                // console.log(csvErrors[i][key])
                if( csvErrors[i] && typeof csvErrors[i][key] !== 'undefined' )  {
                    csvRows[i][key] += `<span class="csv-row-error">${csvErrors[i][key]}</span>`;
                }
            }
        })
        return {
            columns: CSV_COLUMNS,
            rows: csvRows
        }
    }
}

const makeCsvColumns = (row) => {
    const CSV_COLUMNS = []
    row.map( item => {
        CSV_COLUMNS.push(
            {
                Header: item,
                accessor: item,
                Cell: row => (<div dangerouslySetInnerHTML={{__html: row.value}} />)
            }
        )
    })
    // console.log(CSV_COLUMNS)
    return CSV_COLUMNS
}

export const Sorting = ({ column }) => (
    <span className="react-table__column-header sortable">
      {column.isSortedDesc === undefined ? (
        <SortIcon />
      ) : (
        <span>
          {column.isSortedDesc
            ? <SortAscendingIcon />
            : <SortDescendingIcon />}
        </span>
      )}
    </span>
);