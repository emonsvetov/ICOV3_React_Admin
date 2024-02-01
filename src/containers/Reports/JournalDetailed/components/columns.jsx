import React from 'react';
import AddIcon from 'mdi-react/AddIcon';
import MinusIcon from 'mdi-react/MinusIcon';
const footerRenderer  = (info, field) => {
  const { rows, flatRows } = info;
  const totalValue = rows.reduce((sum, row) => Number(row.values[field]) + sum, 0)
  return <span>{totalValue}</span>;
}

export const JOURNAL_DETAILED_COLUMNS = [
    {
      Header: 'General Info',
      columns: [
        {
          // Build our expander column
          id: 'expander', // Make sure it has an ID
          Header: ({getToggleAllRowsExpandedProps, isAllRowsExpanded}) => (
              <span {...getToggleAllRowsExpandedProps()}>
              {isAllRowsExpanded ? '' : ''}
            </span>
          ),
          Cell: ({row}) =>
              // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
              // to build the toggle for expanding a row
              row.canExpand ? (
                  <span
                      {...row.getToggleRowExpandedProps({
                          style: {
                              // We can even use the row.depth property
                              // and paddingLeft to indicate the depth
                              // of the row
                              paddingLeft: `${row.depth * 2}rem`,
                          },
                      })}
                  >
                {row.isExpanded ? <MinusIcon className="chevron-expand"/> : <AddIcon className="chevron-expand"/>}
              </span>
              ) : null,
          width: 70
       },
        {
            Header: "Program Name",
            accessor: "name",
            Footer:"Page Total",
            minWidth: 170,
        },
        {
          Header: "Program ID",
          accessor: "account_holder_id",
          Footer:"",
          maxWidth: 100,
        },
        {
          Header: "Deposits",
          accessor: "deposits",
          Cell: ({ row, value }) => { return `$${value}`},
          Footer: (info) => footerRenderer(info, 'deposits')
        },
        {
          Header: "Deposit Reversal",
          accessor: "deposit_reversal",
          Cell: ({ row, value }) => { return `$${value}`},
          Footer: (info) => footerRenderer(info, 'deposit_reversal')
        },
        {
          Header: "Points Purchased",
          accessor: "points_purchased",
          Cell: ({ row, value }) => { return `$${value}`},
          Footer: (info) => footerRenderer(info, 'points_purchased')
        },
        {
          Header: "Points Reclaimed",
          accessor: "reclaims",
          Cell: ({ row, value }) => { return `$${value}`},
          Footer: (info) => footerRenderer(info, 'reclaims')
        },
        {
          Header: "Award Credit Reclaimed",
          accessor: "award_credit_reclaims",
          Cell: ({ row, value }) => { return `$${value}`},
          Footer: (info) => footerRenderer(info, 'award_credit_reclaims')
        },
        {
          Header: "Net Points purchased",
          accessor: "net_points_purchased",
          Cell: ({ row, value }) => { return `$${value}`},
          Footer: (info) => footerRenderer(info, 'net_points_purchased')
        },
        {
          Header: "Points Redeemed",
          accessor: "points_redeemed",
          Cell: ({ row, value }) => { return `$${value}`},
          Footer: (info) => footerRenderer(info, 'points_redeemed')
        },
      ],
      Footer: 'General Info',
    },
    {
      Header: "Fees",
      columns: [
        {
            Header: "Setup Fee",
            accessor: "setup_fee",
            Cell: ({ row, value }) => { return `${value}%`},
            Footer: (info) => footerRenderer(info, 'setup_fee'),
            maxWidth: 70,
        },
        {
            Header: "Fixed Fee",
            accessor: "fixed_fee",
            Cell: ({ row, value }) => { return `${value}%`},
            Footer: (info) => footerRenderer(info, 'fixed_fee'),
            maxWidth: 70,
        },
        {
            Header: "Usage Fee",
            accessor: "usage_fee",
            Cell: ({ row, value }) => { return `${value}%`},
            Footer: (info) => footerRenderer(info, 'setup_fee'),
            maxWidth: 70,
        },
        {
            Header: "Deposit Fee",
            accessor: "deposit_fee",
            Cell: ({ row, value }) => { return `${value}%`},
            Footer: (info) => footerRenderer(info, 'deposit_fee'),
            maxWidth: 70,
        },
        {
          Header: "Convenience Fees",
          accessor: "convenience_fees",
          Cell: ({ row, value }) => { return `${value}%`},
          Footer: (info) => footerRenderer(info, 'convenience_fees'),
        },
        {
          Header: "Premium Fee billed To client",
          accessor: "premium_fee",
          Cell: ({ row, value }) => { return `${value}%`},
          Footer: (info) => footerRenderer(info, 'premium_fee'),
        },
        {
          Header: "License Fee",
          accessor: "program_pays_for_saas_fees",
          Cell: ({ row, value }) => { return `${value}%`},
          Footer: (info) => footerRenderer(info, 'program_pays_for_saas_fees'),
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
            Cell: ({ row, value }) => { return `$${value}`},
            Footer: (info) => footerRenderer(info, 'codes_redeemed_premium'),
        },
        {
            Header: "Cost of Codes Redeemed",
            accessor: "codes_redeemed_cost",
            Cell: ({ row, value }) => { return `$${value}`},
            Footer: (info) => footerRenderer(info, 'codes_redeemed_cost'),
        },
        {
            Header: "Program Funds net transfers",
            accessor: "program_funds_net_transfers",
            Cell: ({ row, value }) => { return `$${value}`},
            Footer: (info) => footerRenderer(info, 'program_funds_net_transfers'),
        },
        {
            Header: "Program refunds for monies pending",
            accessor: "program_refunds_for_monies_pending",
            Cell: ({ row, value }) => { return `$${value}`},
            Footer: (info) => footerRenderer(info, 'program_refunds_for_monies_pending'),
        },
        {
            Header: "Total Spend Rebate",
            accessor: "total_spend_rebate",
            Cell: ({ row, value }) => { return `$${value}`},
            Footer: (info) => footerRenderer(info, 'total_spend_rebate'),
        },
        {
          Header: "Discount Rebate",
          accessor: "discount_rebate_credited_to_program",
          Cell: ({ row, value }) => { return `$${value}`},
          Footer: (info) => footerRenderer(info, 'discount_rebate_credited_to_program'),
        },
        {
          Header:"Expiration Rebate",
          accessor: "expiration_rebate_credited_to_program",
          Cell: ({ row, value }) => { return `$${value}`},
          Footer: (info) => footerRenderer(info, 'discount_rebate_credited_to_program'),
        }

      ],
      Footer: 'Others'
    }
]

