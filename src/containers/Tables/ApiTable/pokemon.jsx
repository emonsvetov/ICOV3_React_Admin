import React from 'react';
import { useTable, usePagination } from 'react-table';
// import { useQuery } from 'react-query';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
const queryClient = new QueryClient()
const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Url',
        accessor: 'url',
    },
];

const trimData = (data = []) =>
  data.map(({ name, url }) => ({
    name,
    url,
}));

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 10,
  totalCount: null,
};

const PAGE_CHANGED = 'PAGE_CHANGED';
const PAGE_SIZE_CHANGED = 'PAGE_SIZE_CHANGED';
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
    case TOTAL_COUNT_CHANGED:
      return {
        ...state,
        totalCount: payload,
      };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

const fetchPokemonData = async (page, pageSize) => {
    const offset = page * pageSize;
    try {
        const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pageSize}`
        );
        const data = await response.json();

        return data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

const Pokemon = () => {

    const [{ queryPageIndex, queryPageSize, totalCount }, dispatch] =
    React.useReducer(reducer, initialState);

    const { isLoading, error, data, isSuccess } = useQuery(
        ['pokemons', queryPageIndex, queryPageSize],
        () => fetchPokemonData(queryPageIndex, queryPageSize),
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
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        // Get the state from the instance
        state: { pageIndex, pageSize },
      } = useTable(
        {
          columns,
          data: isSuccess ? trimData(data.results) : [],
          initialState: {
            pageIndex: queryPageIndex,
            pageSize: queryPageSize,
          },
          manualPagination: true, // Tell the usePagination
          // hook that we'll handle our own data fetching
          // This means we'll also have to provide our own
          // pageCount.
          pageCount: isSuccess ? totalPageCount : null,
        },
        usePagination
    );

    // console.log(totalCount)

    React.useEffect(() => {
    dispatch({ type: PAGE_CHANGED, payload: pageIndex });
    }, [pageIndex]);

    React.useEffect(() => {
    dispatch({ type: PAGE_SIZE_CHANGED, payload: pageSize });
    gotoPage(0);
    }, [pageSize, gotoPage]);

    React.useEffect(() => {
    if (data?.count) {
        dispatch({
        type: TOTAL_COUNT_CHANGED,
        payload: data.count,
        });
    }
    }, [data?.count]);

    if (error) {
        return <p>Error</p>;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    const manualPageSize = []

    return (
        <>
          <div className='table react-table'>
          {isSuccess ? (
            <>
              <table {...getTableProps()}>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps()}>
                          {column.render('Header')}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="pagination">
                <span>
                  | Go to page:{' '}
                  <input
                    type="number"
                    value={pageIndex + 1}
                    onChange={(e) => {
                      const page = e.target.value ? Number(e.target.value) - 1 : 0;
                      gotoPage(page);
                    }}
                    style={{ width: '100px' }}
                  />
                </span>{' '}
                <select
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
                    dataLength={totalCount}
                    />
                )}
            </>
          ) : null}
        </div>
        </>
      );
}

const PokemonTable = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Pokemon />
        </QueryClientProvider>
    )
}

export default PokemonTable