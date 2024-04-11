import {Link} from 'react-router-dom';
import React, {useMemo} from 'react';

export const TABLE_COLUMNS = [

  {
    Header: "Merchant",
    accessor: "merchant_name",
    width: 250,
  },
  {
    Header: "Denomination",
    accessor: "denomination",
    width: 250,
  },
  {
    Header: "# in Inventory",
    accessor: "count",
    width: 250,
  },
  {
    Header: "2-Week Target",
    accessor: "optimal_value",
    width: 250,
  },
]

