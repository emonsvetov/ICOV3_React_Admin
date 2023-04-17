const footerRenderer  = (info, field) => {
  const { rows, flatRows } = info;
  const totalValue = rows.reduce((sum, row) => Number(row.values[field]) + sum, 0)
  return <span>{totalValue}</span>;
}

export const JOURNAL_DETAILED_COLUMNS = [
    {
        Header: "Program",
        accessor: "name",
        Footer:"Page Total",
        minWidth: 200,
    },
    {
        Header: "Setup Fee",
        accessor: "setup_fee",
        Footer: (info) => footerRenderer(info, 'setup_fee'),
        maxWidth: 70,
    },
    {
        Header: "Fixed Fee",
        accessor: "fixed_fee",
        Footer: (info) => footerRenderer(info, 'fixed_fee'),
        maxWidth: 70,
    },
    {
        Header: "Admin Fee",
        accessor: "admin_fee",
        Footer: (info) => footerRenderer(info, 'admin_fee'),
        maxWidth: 70,
    },
    {
        Header: "Usage Fee",
        accessor: "usage_fee",
        Footer: (info) => footerRenderer(info, 'setup_fee'),
        maxWidth: 70,
    },
    {
        Header: "Deposit Fee",
        accessor: "deposit_fee",
        Footer: (info) => footerRenderer(info, 'deposit_fee'),
        maxWidth: 70,
    },
    {
        Header: "Transaction Fees",
        accessor: "transaction_fee",
        Footer: (info) => footerRenderer(info, 'transaction_fee')
    },
    {
        Header: "Refunded Transaction Fees",
        accessor: "refunded_transaction_fee",
        Footer: (info) => footerRenderer(info, 'refunded_transaction_fee')
    },
    {
        Header: "Deposits",
        accessor: "deposits",
        Footer: (info) => footerRenderer(info, 'deposits')
    },
    {
        Header: "Points Purchased",
        accessor: "points_purchased",
        Footer: (info) => footerRenderer(info, 'points_purchased')
    },
    {
        Header: "Reclaims",
        accessor: "reclaims",
        Footer: (info) => footerRenderer(info, 'reclaims')
    },
    {
        Header: "Award Credit Reclaimed",
        accessor: "award_credit_reclaims",
        Footer: (info) => footerRenderer(info, 'award_credit_reclaims')
    },
    {
        Header: "Points Redeemed",
        accessor: "points_redeemed",
        Footer: (info) => footerRenderer(info, 'points_redeemed')
    },
    {
        Header: "Discount Rebate Credited to Program",
        accessor: "discount_rebate_credited_to_program",
        Footer: (info) => footerRenderer(info, 'discount_rebate_credited_to_program'),
    },
    {
        Header: "Total Spend Rebate Credited to Program",
        accessor: "total_spend_rebate",
        Footer: (info) => footerRenderer(info, 'total_spend_rebate'),
    },
    {
        Header: "Expiration Rebate Credited to Program",
        accessor: "expiration_rebate_credited_to_program",
        Footer: (info) => footerRenderer(info, 'expiration_rebate_credited_to_program'),
    },
    {
        Header: "Premium From Codes Redeemed",
        accessor: "codes_redeemed_premium",
        Footer: (info) => footerRenderer(info, 'codes_redeemed_premium'),
    },
    {
        Header: "Premium Fee",
        accessor: "premium_fee",
        Footer: (info) => footerRenderer(info, 'premium_fee'),
    },
    {
        Header: "Cost of Codes Redeemed",
        accessor: "codes_redeemed_cost",
        Footer: (info) => footerRenderer(info, 'codes_redeemed_cost'),
    },
    {
        Header: "Convenience Fees",
        accessor: "convenience_fees",
        Footer: (info) => footerRenderer(info, 'convenience_fees'),
    },
]

