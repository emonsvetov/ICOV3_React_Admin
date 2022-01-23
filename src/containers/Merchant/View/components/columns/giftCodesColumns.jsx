import { Link } from 'react-router-dom';
import React, { useMemo } from 'react';

const CreateTableData = () => {
    const columns = useMemo(
      () => [
        {
            Header: "Purchase Date",
            accessor: "purchase_date",
            
        },
        {
            Header: "Supplier Code",
            accessor: "supplier_code",
            
        },
        {
            Header: "Redemption Value",
            accessor: "redemption_value",
            Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
            
        },
        {
            Header: "Cost Basis",
            accessor: "cost_basis",
            Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        },
        {
            Header: "Discount Percentage",
            accessor: "discount",
            Cell: ({ row, value }) => { return `${parseFloat(value).toFixed(2)}%`},
        },
        {
            Header: "SKU value",
            accessor: "sku_value",
            Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
            
        },
        {
            Header: "Codes",
            accessor: "code",
        },
        {
            Header: "Pin",
            accessor: "pin"
        },
        {
            Header: "Redemption URL",
            accessor: "redemption_url"
        }
      ],
      [],
    );
  
    return columns;
  };

// export const COLUMNS = [
//     {
//         Header: "Codes",
//         accessor: "code",
//         Cell: ({ row, value }) => { return <Link to={`/merchants/view/${row.original.id}`}>{value}</Link>},
//         width: 65,
//     },
//     {
//         Header: "Redemption Value",
//         accessor: "redemption_value",
//         Cell: ({ row, value }) => { return `$${value}`},
        
//     },
//     {
//         Header: "SKU value",
//         accessor: "sku_value",
//         Cell: ({ row, value }) => { return `$${value}`},
        
//     },
//     {
//         Header: "Discount Percentage",
//         accessor: "discount",
//         Cell: ({ row, value }) => { return `${value}%`},
//     },
//     {
//         Header: "Cost Basis",
//         accessor: "cost_basis",
//         Cell: ({ row, value }) => { return `$${value}`},
//     },
//     {
//         Header: "Redemption URL",
//         accessor: "redemption_url"
//     }
    
// ]

export default CreateTableData;