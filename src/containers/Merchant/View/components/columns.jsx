import { Link } from 'react-router-dom';
import ChevronUpIcon from 'mdi-react/ChevronUpIcon';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';

export const AVAILABLE_GIFT_CODES_COLUMNS = [
    {
        Header: "Codes",
        accessor: "code",
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
        accessor: "optimal_value"
    }
]

export const REDEEMED_GIFT_CODES_COULMNS = [
    {
        Header: "Codes",
        accessor: "code",
        width: 200,
    },
    {
        Header: "Pin",
        accessor: "pin",
        width: 50,
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
        width: 80,
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
        width: 100,
    },
    {
        Header: "Redemption URL",
        accessor: "redemption_url"
    },
    {
        Header: "Redeemed On",
        accessor: "redemption_datetime",
        Cell: ({ row, value }) => { return `${value}`},
        width: 100,
    },
    {
        Header: "Redeemed By",
        accessor: "redeemed_by",
        width: 100,
    },
    {
        Header: "Test",
        accessor: "medium_info_is_test",
        Cell: ({ row, value }) => { return value == 1 ? 'Yes' : 'No'},
        width: 50,
    },
    {
        Header: "Redeemed by V2",
        accessor: "purchased_by_v2",
        Cell: ({ row, value }) => { return value == 1 ? 'Yes' : 'No'},
        width: 120,
    },
]

export const SUB_MERCHANTS_COLUMNS = [
    {
        id: 'expander',
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
          <span {...getToggleAllRowsExpandedProps()}>
            {isAllRowsExpanded ? 'Collpase All' : 'Expand All'}
          </span>
        ),
        Cell: ({ row }) =>
          row.canExpand ? (
            <span
              {...row.getToggleRowExpandedProps({
                style: {
                  paddingLeft: `${row.depth * 2}rem`,
                },
              })}
            >
              {row.isExpanded ? <ChevronUpIcon className="chevron-expand" /> : <ChevronRightIcon className="chevron-expand" />}
            </span>
        ) : null,
    },
    {
        Header: "Name",
        accessor: "name",
        width: 165,
    }
]


export const TRANSFERED_GIFT_CODES_COLUMNS = [
    {
        Header: "Codes",
        accessor: "code",
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

