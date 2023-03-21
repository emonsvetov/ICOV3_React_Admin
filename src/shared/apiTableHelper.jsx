import React, {useState} from "react"
import axios from 'axios'
import SortIcon from 'mdi-react/SortIcon';
import {Row, Col, Button} from 'reactstrap';

import SortAscendingIcon from 'mdi-react/SortAscendingIcon';
import SortDescendingIcon from 'mdi-react/SortDescendingIcon';
import DatePicker from 'react-datepicker';
import {dateStrToYmd} from '@/shared/helpers';
import MultipleSelectField from '@/shared/components/form/MultipleSelectField'
import ProgramsHierarchy from '@/shared/components/ProgramsHierarchy'
import MerchantsHierarchy from '@/shared/components/MerchantsHierarchy'
import {isEqual, clone} from 'lodash';
import { CSVLink } from "react-csv";

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

const getFirstDayOfMonth = () =>{
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1)
}

const getFirstDay = () => {
    let date = new Date();
    return new Date(date.getFullYear(), 0, 1)
}

const defaultFrom = getFirstDay()
const defaultTo = new Date()

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
                let value = options.filter[fields[i]];
                if ( (fields[i] === 'from' || fields[i] === 'to') && value !== "" ){
                    value = dateStrToYmd(value);
                }
                params.push(`${fields[i]}=${value}`)
            }
        }
        // if(options.filter.keyword !== 'undefined' && options.filter.keyword) params.push(`keyword=${options.filter.keyword}`)
        // if(options.filter.from !== 'undefined' && options.filter.from) params.push(`from=${options.filter.from}`)
        // if(options.filter.to !== 'undefined' && options.filter.to) params.push(`to=${options.filter.to}`)
    }
    if( params.length > 0 ) {
        paramStr = params.join('&')
    }
    // console.log(paramStr)
    if( options.sortby.length > 0 ) {
        const sortParams = options.sortby[0];
        const sortyByDir = sortParams.desc ? 'desc' : 'asc'
        paramStr = `${paramStr}&sortby=${sortParams.id}&direction=${sortyByDir}`
    }
    let glue = '?'
    if(options.url.indexOf('?') > 0 ) {
        glue = '&'
    }
    let apiUrl = `${options.url}${glue}page=${options.page+1}&limit=${options.size}&${paramStr}`
    try {
        const response = await axios.get(
            apiUrl
        );
        // console.log(response)
        if( response.data.length === 0) return {results:[], count:0}
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

export const fetchApiDataExport = async( queryParams )  => {
    const queryDefaults = {
        url: '/',
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
                let value = options.filter[fields[i]];
                if (fields[i] === 'from' || fields[i] === 'to'){
                    value = dateStrToYmd(value);
                }
                params.push(`${fields[i]}=${value}`)
            }
        }
    }
    if( params.length > 0 ) {
        paramStr = params.join('&')
    }
    if( options.sortby.length > 0 ) {
        const sortParams = options.sortby[0];
        const sortyByDir = sortParams.desc ? 'desc' : 'asc'
        paramStr = `${paramStr}&sortby=${sortParams.id}&direction=${sortyByDir}`
    }
    try {
        const response = await axios.get(
          `${options.url}?${paramStr}`
        );
        if( response.data.length === 0) return {results:[], count:0}
        const data = {
            results: response.data.data,
            headers: response.data?.headers,
            count: response.data.total
        };
        return data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

export const TableFilter = ({ config, filter, setFilter, setUseFilter, download, exportData, exportLink, exportHeaders}) => {

    const defaultFilters = {
        keyword: '',
        from: defaultFrom,
        to: defaultTo
    }

    const finalFilter = {...defaultFilters, ...filter}

    const defaultConfig = {
        label:'term',
        keyword:true,
        dateRange: false
    }

    const options = {...defaultConfig, ...config}

    // console.log(options)

    const [keyword, setKeyword] = React.useState(finalFilter.keyword)
    const [from, setFrom] = React.useState( finalFilter.from )
    const [to, setTo] = React.useState( finalFilter.to )
    const [awardLevels, setAwardLevels] = React.useState(finalFilter.awardLevels);
    const [selectedPrograms, setSelectedPrograms] = useState(filter.programs ? filter.programs : []);
    const [selectedMerchants, setSelectedMerchants] = useState(filter.merchants ? filter.merchants : []);

    const onKeywordChange = (e) => {
        setKeyword( e.target.value )
    }
    const onStartChange = ( value ) => {
        setFrom( value)
    }
    const onEndChange = ( value ) => {
        setTo(  value )
    }
    const onClickFilter = (reset = false, exportToCsv = 0) => {
        let dataSet = {}
        if( options.keyword ) {
            dataSet.keyword = reset ? '' : keyword
        }
        if( options.dateRange ) {
            dataSet.from = dateStrToYmd(reset ? defaultFrom : from)
            dataSet.to = dateStrToYmd(reset ? defaultTo : to)
        }
        if( options.date ) {
            dataSet.from = dateStrToYmd(reset ? defaultFrom : from)
        }
        if( options.programs ) {
            dataSet.programs = reset ? [] : clone(selectedPrograms)
        }
        if( options.merchants ) {
            dataSet.merchants = reset ? [] : clone(selectedMerchants)
        }
        if( options.awardLevels ) {
            dataSet.awardLevels = reset ? [] : clone(awardLevels)
        }
        onClickFilterCallback( dataSet )
        if( reset ) {
            setKeyword('')
            setFrom( defaultFrom )
            setTo( defaultTo )
            setSelectedPrograms([]);
            setSelectedMerchants([]);
            setAwardLevels([]);
        }
    }

    const awardLevelAll = () => {
        let all = options.awardLevels.map(award => award.value);
        if (isEqual(awardLevels, all)){
            setAwardLevels([]);
        } else {
            setAwardLevels(all);
        }
    };

    const onClickFilterCallback = (values) => {
        let change = false;

        if(options.keyword) {
            if(finalFilter.keyword !== values.keyword)   {
                change = true
            }
        }

        if(options.programs) {
            if(!isEqual(finalFilter.programs, values.programs))   {
                change = true
            }
        }

        if(options.merchants) {
            if(!isEqual(finalFilter.merchants, values.merchants))   {
                change = true
            }
        }

        if(options.awardLevels) {
            if(!isEqual(finalFilter.awardLevels, values.awardLevels))   {
                change = true
            }
        }

        if(options.dateRange) {
            if(finalFilter.from !== values.from || finalFilter.to !== values.to )   {
                change = true
            }
        }

        if(options.date) {
            if(finalFilter.from !== values.from)   {
                change = true
            }
        }

        if( !change )    {
            alert('No change in filters')
            setUseFilter(false)
            return
        }

        let filters = {}
        if( options.keyword ) filters.keyword = values.keyword
        if( options.programs ) {
            filters.programs = values.programs
        }
        if( options.merchants ) {
            filters.merchants = values.merchants
        }
        if( options.awardLevels ) {
            filters.awardLevels = values.awardLevels
        }
        if( options.dateRange ) {
            filters.from = values.from
            filters.to = values.to
        }
        if( options.date ) {
            filters.from = values.from
        }

        setFilter( filters )
        setUseFilter(true)
    }
    return (
        <Row className="table-filter-form form">
            <Col md={8} lg={8} sm={8} className="table-filter-form-fields">
                <div>
                    {options.awardLevels &&
                      <div className="table-filter-form-col table-filter-form-col1 float-filter" style={{paddingTop: 4}}>
                          <div className="">
                              <span className="form__form-group-label" onClick={awardLevelAll}
                                    style={{cursor: 'pointer'}}
                              >View for Award Level</span>
                              <div className="form__form-group-field">
                                  <div className="form__form-group-row">
                                      <MultipleSelectField
                                        name="view_for_award_level"
                                        options={options.awardLevels}
                                        type="native"
                                        setValue={setAwardLevels}
                                        fieldValue={awardLevels}
                                      />
                                  </div>
                              </div>
                          </div>
                      </div>
                    }
                    {options.programs &&
                      <div className="table-filter-form-col table-filter-form-col1 float-filter" style={{paddingTop: 4}}>
                          <div className="form__form-group">
                              <div className="form__form-group-field">
                                  <div className="form__form-group-row">
                                      <ProgramsHierarchy
                                        defaultPrograms={options.programs}
                                        selectedPrograms={selectedPrograms}
                                        setSelectedPrograms={setSelectedPrograms}
                                      />
                                  </div>
                              </div>
                          </div>
                      </div>
                    }
                    {options.merchants &&
                      <div className="table-filter-form-col table-filter-form-col1 float-filter" style={{paddingTop: 4}}>
                          <div className="form__form-group">
                              <div className="form__form-group-field">
                                  <div className="form__form-group-row">
                                      <MerchantsHierarchy
                                        defaultMerchants={options.merchants}
                                        selectedMerchants={selectedMerchants}
                                        setSelectedMerchants={setSelectedMerchants}
                                      />
                                  </div>
                              </div>
                          </div>
                      </div>
                    }
                {options.keyword &&
                    <div className="table-filter-form-col table-filter-form-col1">
                        <div className="form__form-group">
                            <div className="form__form-group-field">
                                <div className="form__form-group-row">
                                    <input
                                        value={keyword}
                                        onChange={onKeywordChange}
                                        type="text"
                                        placeholder={`Search ${options.label}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {options.date &&
                      <>
                      <div className="table-filter-form-col table-filter-form-col2 float-filter">
                          <div className="form__form-group">
                              <span className="form__form-group-label">Through&nbsp;Date</span>
                              <div className="form__form-group-field">
                                  <div className="form__form-group-row">
                                      <DatePicker
                                        dateFormat="MM/dd/yyyy"
                                        selected={from}
                                        onChange={onStartChange}
                                      />
                                  </div>
                              </div>
                          </div>
                      </div>
                      </>
                }
                {options.dateRange &&
                  <>
                    <div className="table-filter-form-col table-filter-form-col2 float-filter">
                        <div className="form__form-group">
                            <span className="form__form-group-label">From</span>
                            <div className="form__form-group-field">
                                <div className="form__form-group-row">
                                    <DatePicker
                                        dateFormat="MM/dd/yyyy"
                                        selected={from}
                                        onChange={onStartChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="table-filter-form-col table-filter-form-col2 float-filter">
                        <div className="form__form-group">
                            <span className="form__form-group-label">To</span>
                            <div className="form__form-group-field">
                                <div className="form__form-group-row">
                                    <DatePicker
                                        dateFormat="MM/dd/yyyy"
                                        selected={to}
                                        onChange={onEndChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                  </>
                }
                </div>
            </Col>
            <Col className="align-items-center max-height-32px pl-1">
                <Button
                  onClick={()=>onClickFilter()}
                  className="btn btn-sm btn-primary"
                  color="#ffffff"
                >Filter</Button>
                <Button
                  onClick={()=>onClickFilter(true)}
                  className="btn btn-sm btn-primary"
                  color="#ffffff"
                >Reset</Button>
                {options.exportToCsv &&
                  <div>
                      <span className="text-blue pointer mr-2" onClick={() => {download(filter)}}>Export to CSV</span>
                      <CSVLink
                        data={exportData}
                        headers={exportHeaders}
                        filename="report.csv"
                        className="hidden"
                        ref={exportLink}
                        target="_blank"
                      />
                  </div>
                }
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