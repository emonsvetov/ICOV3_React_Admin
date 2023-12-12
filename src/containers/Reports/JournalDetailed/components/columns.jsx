const footerRenderer  = (info, field) => {
  const { rows } = info;
  const totalValue = rows.reduce((sum, row) => Number(row.values[field]) + sum, 0)
  return <span>{totalValue}</span>;
}

export const JOURNAL_DETAILED_COLUMNS = [
    {
      Header: 'General Info',
      columns: [
        {
            Header: "Program Name",
            accessor: "name",
            Footer:"Page Total",
            minWidth: 170,
        },
        {
          Header: "Program ID",
          accessor: "id",
          Footer:"",
          maxWidth: 100,
        },
        {
          Header: "Deposits",
          accessor: "deposits",
          Footer: (info) => footerRenderer(info, 'deposits')
        },
        {
          Header: "Deposit Reversal",
          accessor: "deposit_reversal",
          Footer: (info) => footerRenderer(info, 'deposit_reversal')
        },
        {
          Header: "Points Purchased",
          accessor: "points_purchased",
          Footer: (info) => footerRenderer(info, 'points_purchased')
        },
        {
          Header: "Points Reclaimed",
          accessor: "reclaims",
          Footer: (info) => footerRenderer(info, 'reclaims')
        },
        {
          Header: "Award Credit Reclaimed",
          accessor: "award_credit_reclaims",
          Footer: (info) => footerRenderer(info, 'award_credit_reclaims')
        },
        {
          Header: "Net Points purchased",
          accessor: "net_points_purchased",
          Footer: (info) => footerRenderer(info, 'net_points_purchased')
        },
        {
          Header: "Points Redeemed",
          accessor: "points_redeemed",
          Footer: (info) => footerRenderer(info, 'points_redeemed')
        },
        {
          Header: "Total Spend Rebate",
          accessor: "total_spend_rebate",
          Footer: (info) => footerRenderer(info, 'total_spend_rebate'),
        }
      ],
      Footer: 'General Info',
    },
    {
      Header: "Fees",
      columns: [
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
          Header: "Deposit Fee Reversal",
          accessor: "deposit_fee_reversal",
          Footer: (info) => footerRenderer(info, 'deposit_fee_reversal'),
          maxWidth: 70,
        },
        {
          Header: "Convenience Fees",
          accessor: "convenience_fees",
          Footer: (info) => footerRenderer(info, 'convenience_fees'),
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
          Header: "Premium Fee",
          accessor: "premium_fee",
          Footer: (info) => footerRenderer(info, 'premium_fee'),
        }
      ],
      Footer: "Fees"
    },
    {
      Header: 'Others',
      columns: [
        {
            Header: "Premium From Codes Redeemed",
            accessor: "codes_redeemed_premium",
            Footer: (info) => footerRenderer(info, 'codes_redeemed_premium'),
        },
        {
            Header: "Cost of Codes Redeemed",
            accessor: "codes_redeemed_cost",
            Footer: (info) => footerRenderer(info, 'codes_redeemed_cost'),
        },
        {
            Header: "Program Funds net transfers",
            accessor: "program_funds_net_transfers",
            Footer: (info) => footerRenderer(info, 'program_funds_net_transfers'),
        },
        {
            Header: "Program refunds for monies pending",
            accessor: "program_refunds_for_monies_pending",
            Footer: (info) => footerRenderer(info, 'program_refunds_for_monies_pending'),
        }
      ],
      Footer: 'Others'
    }
]

