import { Link } from 'react-router-dom';
import React, { useMemo } from 'react';

const CreateTableData = () => {
    const columns = useMemo(
      () => [
        {
            Header: "Denomination",
            accessor: "denomination",
            width: 165,
        },

        {
            Header: "Optimal Amount",
            accessor: "optimal_amount"
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