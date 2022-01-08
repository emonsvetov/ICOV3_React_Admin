import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

const CreateTableData = () => {
  const columns = useMemo(
    () => [
      {
          Header: "Event ID",
          accessor: "id",
          width: 65,
      },
      {
          Header: "Event Name",
          accessor: "name",
          Cell: ({ row, value }) => { return <Link to={`/events/view/${row.original.id}`} >{value}</Link>},
      },
      {
          Header: "Type",
          accessor: "type",
          Cell: ({ row, value }) => { return 'Standard'},
      },
      {
          Header: "Status",
          accessor: "status",
          Cell: ({ row, value }) => { return 'Enabled'},
      }
    ],
    [],
  );

  const data = [];
  // const rows = () => {
  //   for (let i = 1; i < 36; i += 1) {
  //     data.push({
  //       id: i,
  //       name: 'Event'+ i,
  //     });
  //   }
  // };

  // rows();
  const reactTableData = { tableHeaderData: columns, tableRowsData: data };
  return reactTableData;
};

export default CreateTableData;
