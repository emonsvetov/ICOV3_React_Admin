
import React from 'react';

export const TABLE_COLUMNS = [
    {
        Header: "Merchant",
        accessor: "name",

        Footer: "Total",
    },
];

export const tableColumns = (config) => {
    const res = config.columns.map(item => ({
        Header: item.label,
        accessor: item.key,
        width: item.width,
        Cell: ({ row, value }) => {
            if (item.type === 'float'){
                value = item.prefix + parseFloat(value).toFixed(2) + item.suffix;
            }
            return value;
        },
        Footer: (info) => {
            const { rows, flatRows } = info;
            if (item.type === 'float'){
                return <span>{item.prefix}{parseFloat(config.total[item.key]).toFixed(2)}{item.suffix}</span>;
            }
            return <span>{item.prefix}{config.total[item.key]}{item.suffix}</span>;

        },
    }));
    return res;
}

