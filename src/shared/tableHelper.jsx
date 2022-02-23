import React from "react"
import axios from 'axios'

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
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

export const useEffectToDispatch = (dispatch, pageIndex, pageSize, gotoPage, sortBy, filter, data) => {
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
}

export const initialState = {
    queryPageIndex: 0,
    queryPageSize: 10,
    totalCount: 0,
    queryPageFilter:{},
    queryPageSortBy: [],
};

// export const fetchApiData = async (apiUrl, page, pageSize, pageFilterO = null, pageSortBy) => {
export const fetchApiData = async( queryParams )  => {

    const queryDefaults = {
        url: '/',
        page: initialState.queryPageIndex,
        size: initialState.queryPageSize,
        filter: initialState.queryPageFilter,
        sortby: initialState.queryPageSortBy
    }

    const options = { ...queryDefaults, ...queryParams }

    // console.log(options)

    const params = []
    let paramStr = ''
    if( options.filter ) {
        if(options.filter.keyword !== 'undefined' && options.filter.keyword) params.push(`keyword=${options.filter.keyword}`)
        paramStr = params.join('&')
    }
    if( options.sortby.length > 0 ) {
        const sortParams = options.sortby[0];
        const sortyByDir = sortParams.desc ? 'desc' : 'asc'
        paramStr = `${paramStr}&sortby=${sortParams.id}&direction=${sortyByDir}`
    }
    try {
        const response = await axios.get(
        `${options.url}?page=${options.page+1}&limit=${options.size}&${paramStr}`
        );
        // console.log(response)
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

export const TableFilter = ({onClickFilterCallback, label=''}) => {
    const [keyword, setKeyword] = React.useState('')
    const onKeywordChange = (e) => {
        setKeyword( e.target.value)
    }
    const onClickFilter = () => {
        onClickFilterCallback(keyword)
    }
    return (
        <div className="form__form-group">
            <div className="col-md-4">
                <div className="">
                    <input 
                        value={keyword}
                        onChange={onKeywordChange}
                        type="text"
                        placeholder={`Search ${label} here`}
                    />
                </div>
            </div>
            <div className="col-md-4 d-flex align-items-center max-height-32px pl-1">
                <span className="text-blue pointer" onClick={onClickFilter}>Filter</span>
            </div>
        </div>
    )
}