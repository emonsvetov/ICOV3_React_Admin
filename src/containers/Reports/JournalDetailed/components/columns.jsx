import { useMemo } from 'react';

export const JOURNAL_DETAILED_COLUMNS = [
    {
        Header: "Program",
        accessor: "name",
        Footer:"Page Total",
    },
    {
        Header: "Setup Fee",
        accessor: "setup_fee",
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.setup_fee) + sum, 0),
              [rows],
            );
            // const age = Math.round(totalValue / flatRows.length);
            return <span>{totalValue.toFixed(2)}</span>;
          },
    },
    {
        Header: "Fixed Fee",
        accessor: "fixed_fee",
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.fixed_fee) + sum, 0),
              [rows],
            );
            return <span>{totalValue}</span>;
          },
    },
    {
        Header: "Admin Fee",
        accessor: "admin_fee",
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.admin_fee) + sum, 0),
              [rows],
            );
            const avg = Math.round(totalValue / flatRows.length);
            return <span>{avg}</span>;
          },
    },
    {
        Header: "Usage Fee",
        accessor: "usage_fee",
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.usage_fee) + sum, 0),
              [rows],
            );
            return <span>{totalValue}</span>;
          },
    },
    {
        Header: "Deposit Fee",
        accessor: "deposit_fee",
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.deposit_fee) + sum, 0),
              [rows],
            );
            const avg = Math.round(totalValue / flatRows.length);
            return <span>{avg}</span>;
          },
    },
    {
        Header: "Transaction Fees",
        accessor: "transaction_fee",
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.transaction_fee) + sum, 0),
              [rows],
            );
            return <span>{totalValue}</span>;
          },
    },
    {
        Header: "Refunded Transaction Fees",
        accessor: "refunded_transaction_fee",
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.refunded_transaction_fee) + sum, 0),
              [rows],
            );
            return <span>{totalValue}</span>;
          },
    },
    {
        Header: "Deposits",
        accessor: "deposits",
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.deposits) + sum, 0),
              [rows],
            );
            const avg = Math.round(totalValue / flatRows.length);
            return <span>{avg}</span>;
          },
    },
   {
        Header: "Points Purchased",
        accessor: "points_purchased",
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.points_purchased) + sum, 0),
              [rows],
            );
            return <span>{totalValue}</span>;
          },
    },
    {
        Header: "Reclaims",
        accessor: "reclaims",
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.reclaims) + sum, 0),
              [rows],
            );
            return <span>{totalValue}</span>;
          },
    },
    {
        Header: "Award Credit Reclaimed",
        accessor: "award_credit_reclaims",
        Footer: (info) => {
            const { rows, flatRows } = info;
            const totalValue = useMemo(
              () => rows.reduce((sum, row) => Number(row.values.award_credit_reclaims) + sum, 0),
              [rows],
            );
            return <span>{totalValue}</span>;
          },
    },
    
    // {
    //     Header: "Points Redeemed",
    //     accessor: "point_redeemed",
    //     Footer: (info) => {
    //         const { rows, flatRows } = info;
    //         const totalValue = useMemo(
    //           () => rows.reduce((sum, row) => Number(row.values.point_redeemed) + sum, 0),
    //           [rows],
    //         );
    //         return <span>{totalValue}</span>;
    //       },
    // },
    // {
    //     Header: "Discount Rebate Credited to Program",
    //     accessor: "discount_rebate",
    //     Footer: (info) => {
    //         const { rows, flatRows } = info;
    //         const totalValue = useMemo(
    //           () => rows.reduce((sum, row) => Number(row.values.discount_rebate) + sum, 0),
    //           [rows],
    //         );
    //         return <span>{totalValue}</span>;
    //       },
    // },
    // {
    //     Header: "Total Spend Rebate Credited to Program",
    //     accessor: "total_spend_rebate",
    //     Footer: (info) => {
    //         const { rows, flatRows } = info;
    //         const totalValue = useMemo(
    //           () => rows.reduce((sum, row) => Number(row.values.total_spend_rebate) + sum, 0),
    //           [rows],
    //         );
    //         return <span>{totalValue}</span>;
    //       },
    // },
    // {
    //     Header: "Expiration Rebate Credited to Program",
    //     accessor: "expiration_rebate",
    //     Footer: (info) => {
    //         const { rows, flatRows } = info;
    //         const totalValue = useMemo(
    //           () => rows.reduce((sum, row) => Number(row.values.expiration_rebate) + sum, 0),
    //           [rows],
    //         );
    //         return <span>{totalValue}</span>;
    //       },
    // },
    // {
    //     Header: "Premium From Codes Redeemed",
    //     accessor: "premium_redeemed",
    //     Footer: (info) => {
    //         const { rows, flatRows } = info;
    //         const totalValue = useMemo(
    //           () => rows.reduce((sum, row) => Number(row.values.premium_redeemed) + sum, 0),
    //           [rows],
    //         );
    //         return <span>{totalValue}</span>;
    //       },
    // },
    // {
    //     Header: "Premium Fee",
    //     accessor: "premium_fee",
    //     Footer: (info) => {
    //         const { rows, flatRows } = info;
    //         const totalValue = useMemo(
    //           () => rows.reduce((sum, row) => Number(row.values.premium_fee) + sum, 0),
    //           [rows],
    //         );
    //         return <span>{totalValue}</span>;
    //       },
    // },
    // {
    //     Header: "Cost of Codes Redeemed",
    //     accessor: "cost_redeemed",
    //     Footer: (info) => {
    //         const { rows, flatRows } = info;
    //         const totalValue = useMemo(
    //           () => rows.reduce((sum, row) => Number(row.values.cost_redeemed) + sum, 0),
    //           [rows],
    //         );
    //         return <span>{totalValue}</span>;
    //       },
    // },
    // {
    //     Header: "Convenience Fees",
    //     accessor: "convenience_fee",
    //     Footer: (info) => {
    //         const { rows, flatRows } = info;
    //         const totalValue = useMemo(
    //           () => rows.reduce((sum, row) => Number(row.values.convenience_fee) + sum, 0),
    //           [rows],
    //         );
    //         return <span>{totalValue}</span>;
    //       },
    // },
    
]

