import ChevronRightIcon from 'mdi-react/ChevronRightIcon';
import AddIcon from 'mdi-react/AddIcon';
import MinusIcon from 'mdi-react/MinusIcon';
import React, {useMemo} from 'react';

const footerRenderer  = (info, field) => {
  const { rows, flatRows } = info;
  const totalValue = rows.reduce((sum, row) => row.original.dinamicDepth === 1 ? Number(row.values[field]) + sum : 0 + sum, 0);
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
            maxWidth: 100,
        },
        {
            Header: "Program Name",
            accessor: "name",
            Footer:"Page Total",
            minWidth: 170,
            className: 'frozenColumn',
        },
        {
          Header: "Program ID",
          accessor: "shownId",
          Footer:"",
          maxWidth: 100,
          Cell: ({ row, value }) => {
            return !!value ? value : row.original.account_holder_id;
          },
        },
        {
          Header: "Deposits",
          accessor: "deposits",
          Footer: (info) => footerRenderer(info, 'deposits'),
          maxWidth: 100,
        },
        {
          Header: "Deposit Reversal",
          accessor: "deposit_reversal",
          Footer: (info) => footerRenderer(info, 'deposit_reversal'),
          maxWidth: 130,
        },
        {
          Header: "Points Purchased",
          accessor: "points_purchased",
          Footer: (info) => footerRenderer(info, 'points_purchased'),
          maxWidth: 100,
        },
        {
          Header: "Points Reclaimed",
          accessor: "reclaims",
          Footer: (info) => footerRenderer(info, 'reclaims'),
          maxWidth: 100,
        },
        {
          Header: "Award Credit Reclaimed",
          accessor: "award_credit_reclaims",
          Footer: (info) => footerRenderer(info, 'award_credit_reclaims'),
          maxWidth: 100,
        },
        {
          Header: "Net Points purchased",
          accessor: "net_points_purchased",
          Footer: (info) => footerRenderer(info, 'net_points_purchased'),
          maxWidth: 100,
        },
        {
          Header: "Points Redeemed",
          accessor: "points_redeemed",
          Footer: (info) => footerRenderer(info, 'points_redeemed'),
          maxWidth: 100,
        },
        {
          Header: "Total Spend Rebate",
          accessor: "total_spend_rebate",
          Footer: (info) => footerRenderer(info, 'total_spend_rebate'),
          maxWidth: 100,
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
            maxWidth: 100,
        },
        {
            Header: "Fixed Fee",
            accessor: "fixed_fee",
            Footer: (info) => footerRenderer(info, 'fixed_fee'),
            maxWidth: 100,
        },
        {
            Header: "Admin Fee",
            accessor: "admin_fee",
            Footer: (info) => footerRenderer(info, 'admin_fee'),
            maxWidth: 100,
        },
        {
            Header: "Usage Fee",
            accessor: "usage_fee",
            Footer: (info) => footerRenderer(info, 'setup_fee'),
            maxWidth: 100,
        },
        {
            Header: "Deposit Fee",
            accessor: "deposit_fee",
            Footer: (info) => footerRenderer(info, 'deposit_fee'),
            maxWidth: 100,
        },
        {
          Header: "Deposit Fee Reversal",
          accessor: "deposit_fee_reversal",
          Footer: (info) => footerRenderer(info, 'deposit_fee_reversal'),
          maxWidth: 100,
        },
        {
          Header: "Convenience Fees",
          accessor: "convenience_fees",
          Footer: (info) => footerRenderer(info, 'convenience_fees'),
          maxWidth: 100,
        },
        {
            Header: "Transaction Fees",
            accessor: "transaction_fee",
            Footer: (info) => footerRenderer(info, 'transaction_fee'),
            maxWidth: 100,
        },
        {
            Header: "Refunded Transaction Fees",
            accessor: "refunded_transaction_fee",
            Footer: (info) => footerRenderer(info, 'refunded_transaction_fee'),
            maxWidth: 150,
        },
        {
          Header: "Premium Fee",
          accessor: "premium_fee",
          Footer: (info) => footerRenderer(info, 'premium_fee'),
          maxWidth: 100,
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
            maxWidth: 120,
        },
        {
            Header: "Cost of Codes Redeemed",
            accessor: "codes_redeemed_cost",
            Footer: (info) => footerRenderer(info, 'codes_redeemed_cost'),
            maxWidth: 100,
        },
        {
            Header: "Program Funds net transfers",
            accessor: "program_funds_net_transfers",
            Footer: (info) => footerRenderer(info, 'program_funds_net_transfers'),
            maxWidth: 140,
        },
        {
            Header: "Program refunds for monies pending",
            accessor: "program_refunds_for_monies_pending",
            Footer: (info) => footerRenderer(info, 'program_refunds_for_monies_pending'),
            maxWidth: 140,
        }
      ],
      Footer: 'Others'
    }
]

