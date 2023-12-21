import { Link } from 'react-router-dom';
import React, { useMemo } from 'react';

export const TABLE_COLUMNS = [
  {
    Header: ' ',
    columns: [
      {
        Header: "Account Holder",
      },
      {
        Header: "Account",
      },
    ],
  },
  {
    Header: "Debit",
    columns: [
      {
        Header: "Asset",
        id: 1
      },
      {
        Header: "Liability",
        id: 2
      },
      {
        Header: "Revenue",
        id: 3
      },
    ],
  },
  {
    Header: 'Credit',
    columns: [
      {
        Header: "Asset",
      },
      {
        Header: "Liability",
      },
      {
        Header: "Revenue",
      },
    ],
  }
]


