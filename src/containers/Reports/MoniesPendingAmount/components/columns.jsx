import { Link } from 'react-router-dom';
import React, { useMemo } from 'react';

export const PROGRAM_COLUMNS = [
   
    {
        Header: "Program Name",
        accessor: "name",
        Footer:"Total",
        
    },
    {
        Header: "Parent Program Name",
        accessor: "parent_name",
    },
    {
        Header: "Date of deposit",
        accessor: "deposit_date",
        
    },
    {
        Header: "Amount of deposit",
        accessor: "amount",
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(4)}`},
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.amount) + sum, 0),
              [rows],
            );
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Notes",
        accessor: "note",
    },
    {
        Header: "Invoice",
        accessor: "invoice",
    }
    
]

