import React, { useEffect, useMemo, useState } from "react";
import {
  usePagination,
  useTable,
  useRowSelect,
  useExpanded,
} from "react-table";
import { Row, Col, Table, Button } from "reactstrap";
import { PROGRAM_COLUMNS } from "./columns";
import { getProgramsHierarchyByProgram } from "@/shared/apiHelper";
import {
  useDispatch,
  flashSuccess,
  flashError,
} from "@/shared/components/flash";
import axios from "axios";

const flattenProgram = (program, depth = 0, flattenData = []) => {
  const newDepth = depth + (program.parent_id ? 5 : 0);
  flattenData.push({
    ...program,
    depth: newDepth,
  });
  if (program.children && program.children.length > 0) {
    program.children.forEach((child) =>
      flattenProgram(child, newDepth, flattenData)
    );
  }
  return flattenData;
};

const ApprovalFlowHierarchyModal = ({
  organization,
  program,
  selectPrograms,
  setSelectPrograms,
  selectProgramHierarchy,
  setSelectProgramHierarchy,
  formData,
  setFormData,
}) => {
  const [programs, setPrograms] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const getAllChildIds = (node) => {
    const ids = new Set();
    const collectIds = (node) => {
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          ids.add(child.id);
          collectIds(child);
        });
      }
    };
    collectIds(node);
    return Array.from(ids);
  };

  useEffect(() => {
    setLoading(true);
    if (organization?.id && program?.id) {
      getProgramsHierarchyByProgram(organization.id, program.id)
        .then((response) => {
          const data = flattenProgram(response[0]);
          setPrograms(data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [organization, program]);

  const handleSelectAll = (e) => {
    if (e.target.checked && programs) {
      const allIds = programs?.flatMap((item) => {
        return [item.id, ...getAllChildIds(item)];
      });
      setSelectPrograms([...new Set(allIds)]);
    } else {
      setSelectPrograms([]);
    }
  };

  const handleSelect = (id, childIds = []) => {
    setSelectProgramHierarchy((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(
          (itemId) => itemId !== id && !childIds.includes(itemId)
        );
      } else {
        return [...prevSelected, id, ...childIds];
      }
    });
  };

  const handleSelectSingleProgram = (id) => {
    if (id) {
      setSelectPrograms((prevSelected) => {
        if (prevSelected.includes(id)) {
          return prevSelected.filter((itemId) => itemId !== id);
        } else {
          return [...prevSelected, id];
        }
      });
    }
  };

  const columns = [
    {
      id: "selectProgram",
      Header: "",
      Cell: ({ row }) => {
        const hasChildren =
          row.original.children && row.original.children.length > 0;
        return hasChildren ? (
          <input
            type="checkbox"
            onChange={() =>
              handleSelect(row.original.id, getAllChildIds(row.original))
            }
            checked={selectProgramHierarchy?.includes(row.original.id)}
          />
        ) : null;
      },
    },
    {
      Header: "Program Name",
      accessor: "name",
      Cell: ({ row }) => {
        return (
          <span
            style={{
              marginLeft: `${row.original?.depth}px`,
            }}
          >
            {row.original.name}
          </span>
        );
      },
    },
    {
      id: "selectAll",
      Header: () => (
        <div className="d-flex">
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={
              selectPrograms?.length === programs?.length ? true : undefined
            }
            indeterminate={
              selectPrograms?.length === programs?.length ? true : undefined
            }
          />{" "}
          <span className="ml-2">Select All</span>
        </div>
      ),
      Cell: ({ row }) => {
        return (
          <div>
            <input
              type="checkbox"
              onChange={() => handleSelectSingleProgram(row.original.id)}
              checked={
                selectPrograms?.includes(row.original.id) ||
                selectProgramHierarchy?.includes(row.original.id)
              }
            />
          </div>
        );
      },
    },
    ...PROGRAM_COLUMNS,
  ];

  const tableInstance = useTable(
    {
      columns: useMemo(
        () => [...columns],
        [selectProgramHierarchy, selectPrograms]
      ),
      data: useMemo(() => (programs ? programs : []), [programs]),
      initialState: { expanded: {} },
      manualPagination: true,
      autoResetSortBy: false,
      autoResetExpanded: false,
      autoResetPage: false,
    },
    useExpanded,
    usePagination,
    useRowSelect
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const handleSubmit = () => {
    if (selectPrograms?.length > 0 || selectPrograms?.length > 0) {
      formData.program_id =
        selectPrograms?.length > 0 ? selectPrograms : selectProgramHierarchy;
    } else {
      formData.program_id =
        selectPrograms?.length > 0 ? selectPrograms : selectProgramHierarchy;
    }
    axios
      .post(
        `organization/${organization.id}/program/${program.id}/program-approval-step`,
        formData
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          flashSuccess(dispatch, "Approval updated successfully");
        }
      })
      .catch((error) => {
        if (error) {
          flashError(dispatch, error.message);
        }
      });
  };

  if (loading) return <p>Loading...</p>;

  const renderRow = (row) => {
    prepareRow(row);
    return (
      <React.Fragment key={row.id}>
        <tr {...row.getRowProps()}>
          {row.cells.map((cell) => (
            <td key={cell.column.id} {...cell.getCellProps()}>
              {cell.render("Cell")}
            </td>
          ))}
        </tr>
      </React.Fragment>
    );
  };

  if (programs) {
    return (
      <>
        <Row>
          <Col>
            <h5>Save Approval Flow to Hierarchy</h5>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              className="btn btn-primary"
              color="fff"
              type="submit"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="p-2">
              <b>
                {" "}
                Please select the programs that you wish to update or add this
                Approval Flow to.
              </b>
            </p>
          </Col>
        </Row>
        <Table {...getTableProps()} className="table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id} {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="m-2">
            {rows.map(renderRow)}
          </tbody>
        </Table>
      </>
    );
  }
};

export default ApprovalFlowHierarchyModal;
