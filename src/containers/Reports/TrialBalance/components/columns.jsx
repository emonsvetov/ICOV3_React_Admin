import { Link } from 'react-router-dom';
import React, { useMemo } from 'react';

export const TABLE_COLUMNS = [
  {
    Header: "Account Holder",
    accessor: "account_holder",
    width: 130
  },
  {
    Header: "Account",
    accessor: "account_id",
    width: 130
  },
  {
    Header: "Posting Amount",
    accessor: "posting_amount",
    width: 130
  },
  {
    Header: "Quantity",
    accessor: "qty",
    width: 130
  },
  {
    Header: "Credit/Debit",
    accessor: "is_credit",
    width: 130,
    Cell: ({ value }) => (value ? "Credit" : "Debit")
  },
  {
    Header: "Posting Timestamp",
    accessor: "posting_timestamp",
    width: 180
  },
  {
    Header: "Account Type",
    accessor: "account_type_name",
    width: 130
  },
  {
    Header: "Finance Type",
    accessor: "finance_type_name",
    width: 130
  }
];

