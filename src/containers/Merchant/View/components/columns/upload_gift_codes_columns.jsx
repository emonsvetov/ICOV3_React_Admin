const COLUMNS = [
        {
            Header: "purchase_date",
            accessor: "purchase_date",
            
        },
        {
            Header: "supplier_code",
            accessor: "supplier_code",
            
        },
        {
            Header: "redemption_value",
            accessor: "redemption_value",
            Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
            
        },
        {
            Header: "cost_basis",
            accessor: "cost_basis",
            Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
        },
        {
            Header: "discount",
            accessor: "discount",
            Cell: ({ row, value }) => { return `${parseFloat(value).toFixed(2)}%`},
        },
        {
            Header: "sku_value",
            accessor: "sku_value",
            Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
            
        },
        {
            Header: "code",
            accessor: "code",
        },
        {
            Header: "pin",
            accessor: "pin"
        },
        {
            Header: "redemption_url",
            accessor: "redemption_url"
        }
]
export default COLUMNS;