import React, { useMemo, useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  Button,
  ButtonToolbar,
  Container,
  Row,
  Col,
} from "reactstrap";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import {
  useTable,
  usePagination,
  useSortBy,
  useExpanded,
  useResizeColumns,
  useFlexLayout,
} from "react-table";
import ReactTablePagination from "@/shared/components/table/components/ReactTablePagination";
import SortIcon from "mdi-react/SortIcon";
import SortAscendingIcon from "mdi-react/SortAscendingIcon";
import SortDescendingIcon from "mdi-react/SortDescendingIcon";
import MerchantsFilter from "./MerchantsFilter";
import { renameChildrenToSubrows } from "@/shared/helpers";
import axios from "axios";
import { Form, Field } from "react-final-form";
import renderToggleButtonField from "@/shared/components/form/ToggleButton";

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

const fetchMerchantData = async(
  page,
  pageSize,
  pageFilterO = null,
  pageSortBy
) => {
  // const offset = page * pageSize;
  const params = [];
  let paramStr = "";
  if (pageFilterO) {
    if (pageFilterO.keyword !== "undefined" && pageFilterO.keyword)
      params.push(`keyword=${pageFilterO.keyword}`);
    paramStr = params.join("&");
  }
  if (pageSortBy.length > 0) {
    const sortParams = pageSortBy[0];
    const sortyByDir = sortParams.desc ? "desc" : "asc";
    paramStr = `${paramStr}&sortby=${sortParams.id}&direction=${sortyByDir}`;
  }
  try {
    const response = await axios.get(
      `/merchant?page=${page+1}&limit=${pageSize}&${paramStr}`
    );
    // console.log(response)
    if (response.data.length === 0) return { results: [], count: 0 };
    const data = {
      results: renameChildrenToSubrows(response.data.data),
      count: response.data.total,
    };
    // console.log(data)
    return data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

const MerchantsModal = ({ isOpen, setOpen, toggle, theme, rtl, organization, data }) => {
  return (
    <Modal
      className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`}
      isOpen={isOpen}
      toggle={() => setOpen(true)}
    >
      <ModalBody className="modal-lg">
        <TableWrapper toggle={toggle} organization={organization} program={data} />
      </ModalBody>
    </Modal>
  );
};
const DataTable = ({ toggle, organization, program }) => {
  const LOGO_PUBLIC_URL = `${process.env.REACT_APP_API_STORAGE_URL}`;

  // console.log(program)

  const [loading, setLoading] = useState(false);
  const [relationData, setRelationData] = useState([]);
  const [filter, setFilter] = useState({ keyword: "" });

  const fetchProgramMerchantData = async () => {
    try {
      const response = await axios.get(
        `/organization/${organization.id}/program/${program.id}/merchant?minimal=true&sortby=name`
      );
      let result = response.data;
      let temp_relation = [];
      
      result.map((item, index) => {
        let {id}= item;
        let {featured, cost_to_program}= item.pivot;
        temp_relation.push({id, featured, cost_to_program});
      });
      setRelationData(temp_relation);
      console.log(temp_relation)
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (program.id) {

      fetchProgramMerchantData();
    }
  }, [program]);

  const handleToggle = async (type, value, id) => {
    let response;
    let postData = {program_id: program.id, merchant_id: id};
    
    try {
      if(type == "featured" || type == "cost_to_program"){
        postData[type] = value;
        response = await axios.post(
          `/organization/${organization.id}/program/${program.id}/merchant`,postData );
      }
      else{
        if (value) {
          response = await axios.post(
            `/organization/${organization.id}/program/${program.id}/merchant`,postData );
        } else {
          response = await axios.delete(
              `/organization/${organization.id}/program/${program.id}/merchant/${id}`);
        }
      }
      console.log(response, 'response')

    } catch (e) {
      throw new Error(`API error:${e?.message}`);
    }
  };

  const onClickFilterCallback = (keyword) => {
    if (filter.keyword === keyword) {
      alert("No change in filters");
      return;
    }
    setFilter({ keyword });
  };

  const onSubmit = (values) => {
    alert(values);
  };

  const mapRelationData = (results) =>{
      let isActive, cost_to_program, featured;
      results.map((item, index) => {
        isActive = cost_to_program = featured = false;  
        relationData.forEach((relation) => {
          if(relation.id === item.id){
            isActive = true;
            cost_to_program = relation.cost_to_program;
            featured = relation.featured;
          } 
        });
        item.cost_to_program = cost_to_program;
        item.isActive = isActive;
        item.featured= featured;
      })
      
      return results;
  }

  const MERCHANT_COLUMNS = [
    {
      Header: "Logo",
      accessor: "logo",
      Cell: ({ row, value }) => {
        return (
          <img className="merchant_icon" src={`${LOGO_PUBLIC_URL}/${value}`} />
        );
      },
    },
    {
      Header: "Merchant Name",
      accessor: "name",
    },
    {
      Header: "Featured",
      accessor: "featured",
      Cell: ({ row }) => (<Form
        onSubmit={onSubmit}
        initialValues={{
            featured: row.original.featured,
          }}
      >
        {({ handleSubmit }) => (
          <form style={{ width: "25%" }} onSubmit={handleSubmit}>
            <Field
              name="featured"
              component={renderToggleButtonField}
              parse={(value) => {
                handleToggle("featured", value, row.original.id);
                return value;
              }}
            />
          </form>
        )}
      </Form>)
    },
    {
      Header: "Cost to Program",
      accessor: "cost_to_program",
      Cell: ({ row }) => (<Form
        onSubmit={onSubmit}
        initialValues={{
          cost_to_program: row.original.cost_to_program,
          }}
      >
        {({ handleSubmit }) => (
          <form style={{ width: "25%" }} onSubmit={handleSubmit}>
            <Field
              name="cost_to_program"
              component={renderToggleButtonField}
              parse={(value) => {
                handleToggle("cost_to_program", value, row.original.id);
                return value;
              }}
            />
          </form>
        )}
      </Form>)
    },
    {
      Header: "Active",
      accessor: "active",
      // Footer: "Action",
      Cell: ({ row }) => (
        <Form
          onSubmit={onSubmit}
          initialValues={{
            active: row.original.isActive,
          }}
        >
          {({ handleSubmit }) => (
            <form style={{ width: "25%" }} onSubmit={handleSubmit}>
              <Field
                name="active"
                component={renderToggleButtonField}
                parse={(value) => {
                  handleToggle("active", value, row.original.id);
                  return value;
                }}
              />
            </form>
          )}
        </Form>
      ),
    },

  ];

  let columns = useMemo(() => MERCHANT_COLUMNS, []);
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
      "merchants",
      queryPageIndex,
      queryPageSize,
      queryPageFilter,
      queryPageSortBy,
    ],
    () =>
      fetchMerchantData(
        queryPageIndex,
        queryPageSize,
        queryPageFilter,
        queryPageSortBy
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
      data: data ? mapRelationData(data.results) : [],
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
  if (isSuccess)
    return (
      <Container className="merchant-view">
        <Row className="w100">
          <Col md="6" lg="6" xl="6">
            <h3>Merchants</h3>
            <h5 className="colorgrey">Programs / {program?.name}</h5>
          </Col>
        </Row>

        <div className="table react-table merchant-table pt-4">
          <form className="form form--horizontal">
            <div className="form__form-group ">
              <div className="col-md-6 col-lg-6">
                <MerchantsFilter
                  onClickFilterCallback={onClickFilterCallback}
                />
              </div>
              <div className="col-md-6 col-lg-6 text-right pr-0">
                <ButtonToolbar className="modal__footer flex justify-content-right w100">
                  <Button outline color="primary" onClick={toggle}>
                    Cancel
                  </Button>{" "}
                  <Button
                    disabled={isLoading}
                    className="btn btn-primary"
                    color="#ffffff"
                    onClick={() => alert('add default merchant')}
                  >
                    Add Default Merchant
                  </Button>
                </ButtonToolbar>
              </div>
            </div>
          </form>
        </div>

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
      </Container>
    );
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

const TableWrapper = ({ toggle, organization, program }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <DataTable toggle={toggle} organization={organization} program={program} />
    </QueryClientProvider>
  );
};

export default MerchantsModal;
