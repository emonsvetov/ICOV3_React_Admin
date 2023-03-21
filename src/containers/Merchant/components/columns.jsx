import { Link } from 'react-router-dom'

export const COLUMNS = [
    {
        Header: "#",
        accessor: "id",
        disableFilters:true,
        disableGlobalFilters:true,
    },
    {
        Header: "Logo",
        accessor: "logo",
        Cell: ({ row, value }) => { return <img className='merchant-index-logo' src={`${process.env.REACT_APP_API_STORAGE_URL}/${value}`} />},
    },
    {
        Header: "Display",
        accessor: "display",
        Cell: ({ row }) => { return `${row.original.display_rank_by_priority},${row.original.display_rank_by_redemptions}`},
    },
    {
        Header: "Merchant Name",
        accessor: "name",
        Cell: ({ row, value }) => { return <Link to={`/merchants/view/${row.original.id}`}>{value}</Link>},
    },
    {
        Header: "Code",
        accessor: "merchant_code"
    },
    {
        Header: "Default",
        accessor: "is_default"
    },
    {
        Header: "Status",
        accessor: "status"
    },
    {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => { return <Link to={`/merchants/view/${row.original.id}`}>View</Link>},
    }
]