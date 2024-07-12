import React, { useEffect, useMemo, useState } from "react";
import {
  usePagination,
  useTable,
  useRowSelect,
  useExpanded,
} from "react-table";
import { Table, Container, Input } from "reactstrap";
import { PROGRAM_COLUMNS } from "./columns";
import { getProgramsHierarchyByProgram } from "../../../../../shared/apiHelper";

const toggleSelectParentAndChildren = (
  program,
  data,
  selectedPrograms,
  setSelectedPrograms
) => {
  const isSelected = !selectedPrograms[program.id]; // Toggle the selection state
  const newSelectedPrograms = { ...selectedPrograms };

  const selectProgramAndChildren = (program) => {
    newSelectedPrograms[program.id] = isSelected;
    const children = data.filter((child) => child.parentId === program.id);
    children.forEach((child) => selectProgramAndChildren(child));
  };

  selectProgramAndChildren(program);
  setSelectedPrograms(newSelectedPrograms);
};

const PendingAwardApprovalsTable = ({ auth, organization, program }) => {
  const [programs, setPrograms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPrograms, setSelectedPrograms] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (organization?.id && program?.id) {
      getProgramsHierarchyByProgram(organization.id, program.id)
        .then((response) => {
          const flattenData = [];
          const flattenProgram = (program, margin = 0) => {
            const newMargin = margin + (program.parent_id ? 20 : 0);
            flattenData.push({
              ...program,
              rowMargin: newMargin,
            });
            if (program?.children.length > 0) {
              program?.children.forEach((child) =>
                flattenProgram(child, newMargin)
              );
            }
          };
          response?.forEach((program) => flattenProgram(program));
          setPrograms(flattenData);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [organization, program]);

  const collectDescendantIds = (program, ids = []) => {
    ids.push(program.id); // Add current program ID

    // Recursively add all children IDs
    if (program.children && program.children.length > 0) {
      program.children.forEach((child) => collectDescendantIds(child, ids));
    }

    return ids;
  };

  // Handle checkbox change
  const handleCheckboxChange = (programId, isChecked, program) => {
    // Collect IDs of the program and all its descendants
    const allProgramIds = collectDescendantIds(program);

    // Update selected programs based on isChecked flag
    if (isChecked) {
      setSelectedPrograms((prevSelected) => [
        ...prevSelected,
        ...allProgramIds,
      ]);
    } else {
      setSelectedPrograms((prevSelected) =>
        prevSelected.filter((id) => !allProgramIds.includes(id))
      );
    }
  };
  console.log(selectedPrograms.includes(program.id));
  const RenderActions = ({ row }) => {
    const renderProgram = (program) => {
      const hasChildren = program?.children && program?.children.length > 0;

      return (
        <div key={program.id}>
          <div
            style={{
              marginLeft: program.rowMargin,
            }}
          >
            {hasChildren && (
              <div style={{ marginRight: "5px" }}>
                <Input
                  type="checkbox"
                  onChange={(e) =>
                    handleCheckboxChange(program.id, e.target.checked, program)
                  }
                  value={selectedPrograms.includes(program.id)}
                />
              </div>
            )}
            {program.name}
          </div>
        </div>
      );
    };

    return renderProgram(row?.original);
  };

  const SELECTION_COLUMN = [
    {
      Header: "Program Name",
      accessor: "action",
      Cell: ({ row }) => <RenderActions row={row} />,
    },
    {
      id: "selection",
      Header: ({ getToggleAllPageRowsSelectedProps }) => (
        <div>
          <Input type="checkbox" {...getToggleAllPageRowsSelectedProps()} />{" "}
          <span>Select All</span>
        </div>
      ),
      Cell: ({ row }) => {
        return (
          <div>
            <Input type="checkbox" {...row.getToggleRowSelectedProps()} />
          </div>
        );
      },
    },
  ];

  const columns = useMemo(
    () => [...SELECTION_COLUMN, ...PROGRAM_COLUMNS],
    [PROGRAM_COLUMNS]
  );

  const data = useMemo(() => (programs ? programs : []), [programs]);

  const tableInstance = useTable(
    {
      columns,
      data,
      manualPagination: true,
      autoResetSortBy: false,
      autoResetExpanded: false,
      autoResetPage: false,
    },
    useExpanded,
    usePagination,
    useRowSelect
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    toggleAllRowsSelected,
  } = tableInstance;

  useEffect(() => {
    console.log("Selected Programs:", selectedPrograms);
  }, [selectedPrograms]);

  if (loading) return <p>Loading...</p>;

  if (programs)
    return (
      <Container>
        <div className="users">
          <div className="header d-flex justify-content-between">
            <div className="d-flex w-30 justify-content-between dropdown-group"></div>
          </div>
          <div className="points-summary-table">
            <Table striped borderless size="sm" {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    );

  return null;
};

export default PendingAwardApprovalsTable;
