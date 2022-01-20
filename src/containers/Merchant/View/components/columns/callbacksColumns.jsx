import { Link } from 'react-router-dom';
import React, { useMemo } from 'react';

const CreateTableData = () => {
    const columns = useMemo(
      () => [
        {
            Header: "Callback",
            accessor: "callback",
            width: 165,
        },
        {
            Header: "Type",
            accessor: "type"
        },
        {
            Header: "Method",
            accessor: "method"
        },
        {
          Header: "Hostname",
          accessor: "hostname"
        },
        {
          Header: "Secret Key",
          accessor: "secret_key"
        },
        {
          Header: "Modified",
          accessor: "modified"
        },
        {
            Header: "Action",
            accessor: "action",
            Cell: ({ row }) => { return <Link to={{}}>View</Link>},
        }
      ],
      [],
    );
  
    return columns;
  };


export default CreateTableData;