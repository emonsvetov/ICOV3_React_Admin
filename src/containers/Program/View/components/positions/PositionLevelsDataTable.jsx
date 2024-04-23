import React, { useMemo, useState } from "react";
import { Button, Row, Col } from "reactstrap";
import { Table } from "antd";
import ReactTableBase from "@/shared/components/table/ReactTableBase";
import { COLUMNS } from "./columns";

const PositionsDataTable = ({ program }) => {
  const [positionLevels, setPositionLevels] = useState([]);
  const tableConfig = {
    isResizable: true,
    isSortable: false,
  };

  const RenderActions = ({ row }) => {
    return (
      <>
        <span className="btn btn-primary" color="#ffffff">
          View{" "}
        </span>{" "}
        <span className="btn btn-primary" color="#ffffff">
          Assign Permission
        </span>
      </>
    );
  };

  let positions_columns = [
    ...COLUMNS,
    ...[
      {
        Header: "",
        accessor: "action",
        Cell: ({ row }) => <RenderActions row={row} />,
      },
    ],
  ];

  let columns = useMemo(() => positions_columns, []);

  return (
    <div>
      <Row>
        <Col>
          <ReactTableBase
            columns={columns}
            data={positionLevels}
            tableConfig={tableConfig}
            program={program}
          />
          <Table rowKey="id" columns={columns} />
        </Col>
      </Row>
    </div>
  );
};

export default PositionsDataTable;
