import { toPoints} from '@/shared/helpers'
import { monthToString} from '@/shared/helpers'
import React, {useMemo} from "react";
export const TABLE_COLUMNS = [
  {
    Header: "Month",
    accessor: "month",
    Cell: ({row, value}) => {
      return monthToString(value);
    },
    Footer: (info) => {
      const {rows, flatRows} = info;
      const totalValue = useMemo(
        () => rows.reduce((sum, row) => Number(row.values.awarded) + sum, 0),
        [rows],
      );
      return <span>Total</span>;
    },
  },
  {
    Header: "Budget",
    accessor: "budget",
    Cell: ({row, value}) => {
      return toPoints(value);
    },
    Footer: (info) => {
      const {rows, flatRows} = info;
      const totalValue = useMemo(
        () => rows.reduce((sum, row) => Number(row.values.budget) + sum, 0),
        [rows],
      );
      return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
    },
  },
  {
    Header: "Actual",
    accessor: "awarded",
    Cell: ({row, value}) => {
      return toPoints(value);
    },
    Footer: (info) => {
      const {rows, flatRows} = info;
      const totalValue = useMemo(
        () => rows.reduce((sum, row) => Number(row.values.awarded) + sum, 0),
        [rows],
      );
      return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
    },
  },
  {
    Header: "Variance",
    accessor: "variance",
    Cell: ({row, value}) => {
      return toPoints(value);
    },
    Footer: (info) => {
      const {rows, flatRows} = info;
      const totalValue = useMemo(
        () => rows.reduce((sum, row) => Number(row.values.variance) + sum, 0),
        [rows],
      );
      return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
    },
  },
];
