import React, { useEffect, useMemo, useState } from "react";
import {
  usePagination,
  useTable,
  useRowSelect,
  useExpanded,
} from "react-table";
import { Row, Col, Table, Button, ButtonToolbar } from "reactstrap";
import { PROGRAM_COLUMNS } from "./columns";
import { getProgramsHierarchyByProgram } from "@/shared/apiHelper";
import {
  useDispatch,
  flashSuccess,
  flashError,
} from "@/shared/components/flash";
import axios from "axios";

const flattenProgram = (program, depth = 0, flattenData = []) => {
  program?.forEach((p) => {
    flattenData.push({ ...p, depth });
    if (p.children && p.children.length > 0) {
      let newDepth = p.parent_id && depth + 5;
      flattenProgram(p?.children, newDepth, flattenData);
    }
  });

  return flattenData;
};

const ApprovalFlowProgramHierarchy = ({
  organization,
  program,
  selectPrograms,
  setSelectPrograms,
  selectProgramHierarchy,
  setSelectProgramHierarchy,
  setName,
  formData,
}) => {
  const [programs, setPrograms] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const getProgramChildrenIds = (program) => {
    const programIds = new Set();
    const collectProgramChildrenIds = (program) => {
      if (program.children && program.children.length > 0) {
        program.children.forEach((child) => {
          programIds.add(child.id);
          collectProgramChildrenIds(child);
        });
      }
    };
    collectProgramChildrenIds(program);
    return Array.from(programIds);
  };

  useEffect(() => {
    setLoading(true);
    if (organization?.id && program?.id) {
      getProgramsHierarchyByProgram(organization.id, program.id)
        .then((response) => {
          const data = flattenProgram(response[0].children);
          setPrograms(data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [organization, program]);

  const handleSelectPrograms = (e) => {
    if (e.target.checked && programs) {
      const programIds = programs?.flatMap((program) => {
        return [program.id, ...getProgramChildrenIds(program)];
      });
      setSelectPrograms([...new Set(programIds)]);
    } else {
      setSelectPrograms([]);
    }
  };

  const handleProgramHierarchySelect = (id, programChildrenIds = []) => {
    setSelectProgramHierarchy((prevState) => {
      if (prevState.includes(id)) {
        return prevState.filter(
          (programId) =>
            programId !== id && !programChildrenIds.includes(programId)
        );
      } else {
        return [...prevState, id, ...programChildrenIds];
      }
    });
  };

  const handleProgramSelect = (pId) => {
    if (pId) {
      setSelectPrograms((prevState) => {
        if (prevState.includes(pId)) {
          return prevState.filter((programId) => programId !== pId);
        } else {
          return [...prevState, pId];
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
              handleProgramHierarchySelect(
                row.original.id,
                getProgramChildrenIds(row.original)
              )
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
            onChange={handleSelectPrograms}
            checked={selectPrograms?.length === programs?.length ? true : false}
            indeterminate={
              selectPrograms?.length === programs?.length ? true : false
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
              onChange={() => handleProgramSelect(row.original.id)}
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

  const tableRef = useTable(
    {
      columns: useMemo(
        () => [...columns],
        [selectProgramHierarchy, selectPrograms]
      ),
      data: useMemo(() => (programs ? programs : []), [programs]),
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
    tableRef;

  const handleSubmit = () => {
    if (selectPrograms?.length > 0 || selectPrograms?.length > 0) {
      formData.program_id =
        selectPrograms?.length > 0 ? selectPrograms : selectProgramHierarchy;
    } else {
      formData.program_id =
        selectPrograms?.length > 0 ? selectPrograms : selectProgramHierarchy;
    }
    console.log("form", formData);
    axios
      .post(
        `organization/${organization.id}/program/${program.id}/program-approval-step`,
        formData
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          flashSuccess(dispatch, "Approval updated successfully");
          setName("ApprovalFlow");
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
        <div className="form__form-group">
          <h4 className="form__form-group-label thick">
            Save Approval Flow to Hierarchy
          </h4>
        </div>
        <div>
          <ButtonToolbar>
            <Button
              className="btn btn-primary"
              color="fff"
              type="button"
              onClick={() => setName("ApprovalFlow")}
            >
              Back
            </Button>
            <Button
              className="btn btn-primary"
              color="fff"
              type="submit"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </ButtonToolbar>
        </div>
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

export default ApprovalFlowProgramHierarchy;
