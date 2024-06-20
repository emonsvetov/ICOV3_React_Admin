import React from 'react';
import { Link } from 'react-router-dom';
import AddIcon from 'mdi-react/AddIcon';
import MinusIcon from 'mdi-react/MinusIcon';
import { formatDate, maskString } from "../../../../shared/helpers";

const footerRenderer = (info, field) => {
  const { rows } = info;
  const totalValue = rows.reduce((sum, row) => Number(row.values[field]) + sum, 0);
  return <span>{totalValue}</span>;
};

export const TABLE_COLUMNS = [
  {
    Header: () => null,
    id: 'expander',
    Cell: ({ row }) => (
        <span {...row.getToggleRowExpandedProps()}>
        {row.isExpanded ? <MinusIcon /> : <AddIcon />}
      </span>
    ),
    width: 30,
    disableSortBy: true,
    canFilter: false,
  },
  {
    Header: "Codes",
    accessor: "code",
    Cell: ({ row, value }) => <Link to={`/reports/orders/view/${row.original.id}`}>{maskString(value)}</Link>,
    width: 150,
  },
  {
    Header: "Merchant",
    accessor: "redeemed_merchant_name",
    Cell: ({ row, value }) => <Link to={`/merchants/view/${row.original.merchant_id}`}>{value}</Link>,
    width: 150,
  },
  {
    Header: "Program",
    accessor: "redeemed_program_name",
    Cell: ({ row, value }) => <Link to={`/program/view/${row.original.redeemed_program_id}`}>{value}</Link>,
    width: 150,
  },
  {
    Header: "User",
    accessor: "redeemed_by_user_name",
    Cell: ({ row, value }) => <Link to={`/users/view/${row.original.redeemed_user_id}`}>{value}</Link>,
    width: 150,
  },
  {
    Header: "Redemption Value",
    accessor: "redemption_value",
    Cell: ({ row, value }) => `$${parseFloat(value).toFixed(2)}`,
  },
  {
    Header: "SKU value",
    accessor: "sku_value",
    Cell: ({ row, value }) => `$${parseFloat(value).toFixed(2)}`,
    width: 80,
  },
  {
    Header: "Discount Percentage",
    accessor: "discount",
    Cell: ({ row, value }) => `${parseFloat(value).toFixed(2)}%`,
  },
  {
    Header: "Cost Basis",
    accessor: "cost_basis",
    Cell: ({ row, value }) => `$${parseFloat(value).toFixed(2)}`,
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
    Cell: ({ row, value }) => formatDate(value),
    width: 100,
  },
  {
    Header: "Purchased in system",
    accessor: "purchased_in_system",
    width: 100,
  },
  {
    Header: "Redeemed By",
    accessor: "redeemed_by",
    width: 100,
  },
];

export const RenderRowSubComponent = ({ row }) => (
    <div style={{ padding: '20px' }}>
      <p>Pin: {row.original.pin}</p>
      <p>Test: {row.original.medium_info_is_test === 1 ? "Yes" : "No"}</p>
      <p>Redeemed by V2: {row.original.purchased_by_v2 === 1 ? "Yes" : "No"}</p>
      <p>Virtual inventory: {row.original.virtual_inventory === 1 ? "Yes" : "No"}</p>
      <p>Tango RA Number: {row.original.tango_reference_order_id}</p>
      <p>Tango Request Number: {row.original.tango_request_id}</p>
      <p>Tango Redemption Time: {formatDate(row.original.adjusted_redemption_datetime)}</p>
    </div>
);
