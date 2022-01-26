import { Link } from 'react-router-dom';

export const AVAILABLE_GIFT_CODES_COLUMNS = [
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
    }
]

export const CALLBACKS_COLUMNS = [
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
]

export const GIFT_CODES_COLUMNS = [
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
]


export const OPTIMAL_AMOUNT_COLUMNS = [
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
]

export const REDEEMED_GIFT_CODES_COULMNS = [
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
]

export const SUB_MERCHANTS_COLUMNS = [
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
]


export const TRANSFERED_GIFT_CODES_COLUMNS = [
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
]

