import React from "react";
import { Link } from 'react-router-dom'
import { formatDate, maskString } from "../../../../shared/helpers";

export const TABLE_COLUMNS = [
  {
    Header: "Codes",
    accessor: "code",
    width: 150,
    Cell: ({ row, value }) => {
      console.log(row)
      return <Link to={`/reports/orders/view/${row.original.id}`} >{maskString(value)}</Link>},
  },
  {
    Header: "Pin",
    accessor: "pin",
    width: 50,
  },
  {
    Header: "Redemption Value",
    accessor: "redemption_value",
    Cell: ({ row, value }) => {
      return `$${parseFloat(value).toFixed(2)}`;
    },
  },
  {
    Header: "SKU value",
    accessor: "sku_value",
    Cell: ({ row, value }) => {
      return `$${parseFloat(value).toFixed(2)}`;
    },
    width: 80,
  },
  {
    Header: "Discount Percentage",
    accessor: "discount",
    Cell: ({ row, value }) => {
      return `${parseFloat(value).toFixed(2)}%`;
    },
  },
  {
    Header: "Cost Basis",
    accessor: "cost_basis",
    Cell: ({ row, value }) => {
      return `$${parseFloat(value).toFixed(2)}`;
    },
    width: 100,
  },
  {
    Header: "Redemption URL",
    accessor: "redemption_url",
    width: 200,
  },
  {
    Header: "Redeemed On",
    accessor: "redemption_datetime",
    Cell: ({ row, value }) => {
      return `${formatDate(value)}`;
    },
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
    Cell: ({ row, value }) => {
      return value == 1 ? "Yes" : "No";
    },
    width: 50,
  },
  {
    Header: "Redeemed by V2",
    accessor: "purchased_by_v2",
    Cell: ({ row, value }) => {
      return value == 1 ? "Yes" : "No";
    },
    width: 120,
  },
  {
    Header: "Virtual inventory",
    accessor: "virtual_inventory",
    Cell: ({ row, value }) => {
      return value == 1 ? "Yes" : "No";
    },
    width: 120,
  },
  {
    Header: "Tango RA Number",
    accessor: "tango_reference_order_id",
    width: 120,
  },
  {
    Header: "Tango Request Number",
    accessor: "tango_request_id",
    width: 120,
  },
  {
    Header: "Tango Redeemption Time",
    width: 130,
    accessor: "adjusted_redemption_datetime",
    Cell: ({ row, value }) => {
      return `${formatDate(value)}`;
    },
  },
];
