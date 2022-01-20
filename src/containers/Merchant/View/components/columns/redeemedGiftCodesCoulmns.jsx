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
            Header: "Pin",
            accessor: "pin",
            
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
            Header: "Redeemed On",
            accessor: "redeemed_on",
            Cell: ({ row, value }) => { return `${value}`},
        },
        {
            Header: "Redeemed By",
            accessor: "redeemed_by",
            
        },
        {
            Header: "Test",
            accessor: "test",
            
        },
      ],
      [],
    );
  
    return columns;
  };


export default CreateTableData;