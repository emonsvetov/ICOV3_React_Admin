import { Link } from 'react-router-dom';
import React, { useMemo } from 'react';

const CreateTableData = () => {
    const columns = useMemo(
      () => [
        {
            Header: "Codes",
            accessor: "code",
            Cell: ({ row, value }) => { return <Link to={{}}>{value}</Link>},
            width: 165,
        },
        {
            Header: "Redemption Value",
            accessor: "redemption_value",
            Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
            
        },
        {
            Header: "SKU value",
            accessor: "sku_value",
            Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
            
        },
        {
            Header: "Discount Percentage",
            accessor: "discount",
            Cell: ({ row, value }) => { return `${parseFloat(value).toFixed(2)}%`},
        },
        {
            Header: "Cost Basis",
            accessor: "cost_basis",
            Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        },
        {
            Header: "Redemption URL",
            accessor: "redemption_url"
        },
        {
            Header: "Transfered On",
            accessor: "transfered_on",
            Cell: ({ row, value }) => { return `${value}`},
        },
        {
            Header: "Transfered To",
            accessor: "transfered_to",
            
        }
      ],
      [],
    );
  
    return columns;
  };


export default CreateTableData;