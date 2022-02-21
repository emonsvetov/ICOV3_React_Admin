import CreateTableData from "./event/CreateData";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import ReactTableBase from "@/shared/components/table/ReactTableBase";

import React, { useMemo, useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Card,
  CardBody,
  ButtonToolbar,
  Row,
  Col,
} from "reactstrap";

import axios from "axios";
import AddEventForm from './event/AddEventForm';
import AddIconForm from './event/AddIconForm'
import {renameChildrenToSubrows} from '@/shared/helpers'
import SortIcon from 'mdi-react/SortIcon';
import SortAscendingIcon from 'mdi-react/SortAscendingIcon';
import SortDescendingIcon from 'mdi-react/SortDescendingIcon';
import ReactTablePagination from '@/shared/components/table/components/ReactTablePagination';
import {
  useTable,
  usePagination,
  useSortBy,
  useExpanded,
  useResizeColumns,
  useFlexLayout,
} from "react-table";

const queryClient = new QueryClient();
const initialState = {
  queryPageIndex: 0,
  queryPageSize: 10,
  totalCount: null,
  queryPageFilter: {},
  queryPageSortBy: [],
};

const PAGE_CHANGED = "PAGE_CHANGED";
const PAGE_SIZE_CHANGED = "PAGE_SIZE_CHANGED";
const PAGE_SORT_CHANGED = "PAGE_SORT_CHANGED";
const PAGE_FILTER_CHANGED = "PAGE_FILTER_CHANGED";
const TOTAL_COUNT_CHANGED = "TOTAL_COUNT_CHANGED";

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

const Sorting = ({ column }) => (
  <span className="react-table__column-header sortable">
    {column.isSortedDesc === undefined ? (
      <SortIcon />
    ) : (
      <span>
        {column.isSortedDesc ? <SortDescendingIcon /> : <SortAscendingIcon />}
      </span>
    )}
  </span>
);

const fetchEventData = async (page, pageSize, pageFilterO = null, pageSortBy, programId) => {
  // const offset = page * pageSize;
  const params = []
  let paramStr = ''
  if( pageFilterO ) {
      if(pageFilterO.status !== 'undefined' && pageFilterO.status) params.push(`status=${pageFilterO.status}`)
      if(pageFilterO.keyword !== 'undefined' && pageFilterO.keyword) params.push(`keyword=${pageFilterO.keyword}`)
      // console.log(params)
      paramStr = params.join('&')
  }
  if( pageSortBy.length > 0 ) {
      const sortParams = pageSortBy[0];
      const sortyByDir = sortParams.desc ? 'desc' : 'asc'
      paramStr = `${paramStr}&sortby=${sortParams.id}&direction=${sortyByDir}`
  }
  try {
      const response = await axios.get(
      `/organization/1/program/${programId}/event/?page=${page}&limit=${pageSize}&${paramStr}`
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

const RenderEventsData = (props) =>{
  const {programId, toggle} = props;
  const reactTableData = CreateTableData();
  const [filter, setFilter] = useState({ keyword: "" });

  //pagination
  let columns = useMemo(() => reactTableData.tableHeaderData, []);
  const [
    {
      queryPageIndex,
      queryPageSize,
      totalCount,
      queryPageFilter,
      queryPageSortBy,
    },
    dispatch,
  ] = React.useReducer(reducer, initialState);

  const { isLoading, error, data, isSuccess } = useQuery(
    [
      "event",
      queryPageIndex,
      queryPageSize,
      queryPageFilter,
      queryPageSortBy,
    ],
    () =>
      fetchEventData(
        queryPageIndex,
        queryPageSize,
        queryPageFilter,
        queryPageSortBy,
        programId
      ),
    {
      keepPreviousData: true,
      staleTime: Infinity,
    }
  );

  const totalPageCount = Math.ceil(totalCount / queryPageSize);

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
    state: { pageIndex, pageSize, sortBy },
  } = useTable(
    {
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

  const manualPageSize = [];

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


  if(isSuccess)
  return (
    <>
      <Row className="w100">
          <Col md="6" lg="6" xl="6">
            <div className="react-table__wrapper">
              <div className="card__title">
                <h5 className="bold-text">Events</h5>
                <h5 className="subhead">Description</h5>
              </div>
            </div>
          </Col>
          <Col md="6" lg="6" xl="6" className="text-right">
            <ButtonToolbar className="modal__footer flex justify-content-right w100">
                <Button
                  outline
                  color="primary"
                  className="mr-3"
                  onClick={toggle}
                >
                Cancel
                </Button>{" "}
                <Button
                  type="submit"
                  onClick = {() => props.onStep(1)}
                  className="btn btn-primary"
                  color="#ffffff"
                >
                  Add Event
                </Button>
            </ButtonToolbar>
          </Col>
        </Row>
        <div className="table react-table">
          <table {...getTableProps()} className="table">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      {column.isSorted ? <Sorting column={column} /> : ""}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="table table--bordered" {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      // console.log(cell)
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {rows.length > 0 && (
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
  )
}

const EventsModal = ({
  isOpen,
  setOpen,
  toggle,
  data,
  theme,
  rtl,
}) => {
  
  
  const [step, setStep] = useState(0);  
  var [data, setData] = useState(data)

  const handleStep = (step) =>{
    setStep(step);
  }
  
  
  return (
    <Modal
      className={`modal-program-events modal-lg ${theme.className} ${rtl.direction}-support`}
      isOpen={isOpen}
      toggle={() => setOpen(true)}
    >
      <ModalBody className="modal-lg">
        <Col md={12} lg={12}>
        { step === 0 && <TableWrapper programId = {data.id} onStep = { handleStep} />}
        { step === 1 && <AddEventForm onStep = { handleStep} />}
        { step === 2 && <AddIconForm onStep = { handleStep} />}
        </Col>
      </ModalBody>
    </Modal>
  );
};

const TableWrapper = ({ programId, toggle, onStep  }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <RenderEventsData programId = {programId} toggle={toggle} onStep={onStep} />
    </QueryClientProvider>
  );
};

EventsModal.propTypes = {};

export default EventsModal;
