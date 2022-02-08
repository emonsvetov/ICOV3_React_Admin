import { Link } from 'react-router-dom';
import React, { useMemo } from 'react';

const header_columns1 = [
    {
        Header: 'Account Holder',
        accessor: 'account_holder',
      },
      {
        Header: 'Account',
        accessor: 'account',
      },
      
      
]
const header_columns2 = [
    {
        Header: 'Asset',
        accessor: 'debit_asset',
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.debit_asset) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
          },
    },
    {
        Header: 'Liability',
        accessor: 'debit_liability',
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.debit_liability) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
          },
    },
    {
        Header: 'Revenue',
        accessor: 'debit_revenue',
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.debit_revenue) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
          },
    }
]
const header_columns3 = [
    {
        Header: 'Asset',
        accessor: 'credit_asset',
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.credit_asset) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
          },
    },
    {
        Header: 'Liability',
        accessor: 'credit_liability',
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.credit_liability) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
          },
    },
    {
        Header: 'Revenue',
        accessor: 'credit_revenue',
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.credit_revenue) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
          },
    }
]



export const PROGRAM_COLUMNS = [
    
    {
        Header: " ",
        columns: header_columns1
    },
    {
        Header: "Debit",
        columns: header_columns2
    },
    {
        Header: "Credit",
        columns: header_columns3
    },
]

