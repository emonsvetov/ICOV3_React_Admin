import { Link } from 'react-router-dom';
import React, { useMemo } from 'react';

const CreateTableData = () => {
    const columns = useMemo(
      () => [
        {
            Header: "Name",
            accessor: "name",
            width: 165,
        },
        {
            Header: "Action",
            accessor: "action",
            Cell: ({ row }) => { return <>
              <Link to={{}}>move</Link> |
              <Link to={{}}>delete sub merchant and sub tree</Link> |
              <Link to={{}}>delete node</Link>
            </>
             },
        }
      ],
      [],
    );
  
    return columns;
  };


export default CreateTableData;