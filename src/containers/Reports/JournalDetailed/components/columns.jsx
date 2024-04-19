import ChevronRightIcon from 'mdi-react/ChevronRightIcon';
import AddIcon from 'mdi-react/AddIcon';
import MinusIcon from 'mdi-react/MinusIcon';
import React, {useMemo} from 'react';
import {Link} from "react-router-dom";
import {toCurrency, toPoints} from '@/shared/helpers'

const footerRenderer  = (info, field) => {
  const { rows, flatRows } = info;
  const totalValue = rows.reduce((sum, row) => row.original.dinamicDepth === 1 ? Number(row.values[field]) + sum : 0 + sum, 0);
  return <span style={{float: 'right'}}>{toCurrency(totalValue)}</span>;
}

const totalSubRowsRenderer  = (row, value, label) => {
  let totalSubRows = 0;
    const cb = (e) => {
      totalSubRows = Number(e.values[label]) + totalSubRows;
      e.subRows && e.subRows.forEach(cb);
    }
    row.subRows.forEach(cb);

    const result = row.subRows.length === 0 || row.isExpanded  ? toCurrency(value) : toCurrency(totalSubRows);
    return <div>{result}</div>
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
        noAlignRight: true
      },
      {
        Header: "Program Name",
        accessor: "name",
        Footer:"Page Total",
        Cell: ({row, value}) => {
          const space = row.original.dinamicDepth === 1 ? '' : ' • ';
          const boldRow = row.original.dinamicDepth === 1;
          return <div style={boldRow ? {fontWeight: 'bold'} : {}}>{space.repeat(row.original.dinamicDepth)}<Link
            to={`/program/view/${row.original.id}`}>{value}</Link></div>
        },
        minWidth: 200,
        className: 'frozenColumn',
        noAlignRight: true
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
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'deposits'),
        Footer: (info) => footerRenderer(info, 'deposits'),
        maxWidth: 100,
      },
      {
        Header: "Deposit Reversal",
        accessor: "deposit_reversal",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'deposit_reversal'),
        Footer: (info) => footerRenderer(info, 'deposit_reversal'),
        maxWidth: 130,
      },
      {
        Header: "Points Purchased",
        accessor: "points_purchased",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'points_purchased'),
        Footer: (info) => footerRenderer(info, 'points_purchased'),
        maxWidth: 100,
      },
      {
        Header: "Points Reclaimed",
        accessor: "reclaims",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'reclaims'),
        Footer: (info) => footerRenderer(info, 'reclaims'),
        maxWidth: 100,
      },
      {
        Header: "Award Credit Reclaimed",
        accessor: "award_credit_reclaims",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'award_credit_reclaims'),
        Footer: (info) => footerRenderer(info, 'award_credit_reclaims'),
        maxWidth: 100,
      },
      {
        Header: "Net Points purchased",
        accessor: "net_points_purchased",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'net_points_purchased'),
        Footer: (info) => footerRenderer(info, 'net_points_purchased'),
        maxWidth: 100,
      },
      {
        Header: "Deposit Fee",
        accessor: "deposit_fee",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'deposit_fee'),
        Footer: (info) => footerRenderer(info, 'deposit_fee'),
        maxWidth: 100,
      },
      {
        Header: "Deposit Fee Reversal",
        accessor: "deposit_fee_reversal",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'deposit_fee_reversal'),
        Footer: (info) => footerRenderer(info, 'deposit_fee_reversal'),
        maxWidth: 100,
      },
      {
        Header: "Total Spend Rebate",
        accessor: "total_spend_rebate",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'total_spend_rebate'),
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
        Header: "Fixed Fee",
        accessor: "fixed_fee",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'fixed_fee'),
        Footer: (info) => footerRenderer(info, 'fixed_fee'),
        maxWidth: 100,
      },
      {
        Header: "Admin Fee",
        accessor: "admin_fee",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'admin_fee'),
        Footer: (info) => footerRenderer(info, 'admin_fee'),
        maxWidth: 100,
      },
      {
        Header: "Usage Fee",
        accessor: "usage_fee",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'usage_fee'),
        Footer: (info) => footerRenderer(info, 'setup_fee'),
        maxWidth: 100,
      },
      {
        Header: "Setup Fee",
        accessor: "setup_fee",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'setup_fee'),
        Footer: (info) => footerRenderer(info, 'setup_fee'),
        maxWidth: 100,
      },
      {
        Header: "Convenience Fees",
        accessor: "convenience_fees",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'points_purchased'),
        Footer: (info) => footerRenderer(info, 'convenience_fees'),
        maxWidth: 100,
      },
      {
        Header: "Transaction Fees",
        accessor: "transaction_fee",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'transaction_fee'),
        Footer: (info) => footerRenderer(info, 'transaction_fee'),
        maxWidth: 100,
      },
      {
        Header: "Refunded Transaction Fees",
        accessor: "refunded_transaction_fee",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'refunded_transaction_fee'),
        Footer: (info) => footerRenderer(info, 'refunded_transaction_fee'),
        maxWidth: 150,
      },
      {
        Header: "Premium Fee",
        accessor: "premium_fee",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'premium_fee'),
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
        Header: "Points Redeemed",
        accessor: "points_redeemed",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'points_redeemed'),
        Footer: (info) => footerRenderer(info, 'points_redeemed'),
        maxWidth: 100,
      },
      {
        Header: "Premium From Codes Redeemed",
        accessor: "codes_redeemed_premium",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'codes_redeemed_premium'),
        Footer: (info) => footerRenderer(info, 'codes_redeemed_premium'),
        maxWidth: 120,
      },
      {
        Header: "Cost of Codes Redeemed",
        accessor: "codes_redeemed_cost",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'codes_redeemed_cost'),
        Footer: (info) => footerRenderer(info, 'codes_redeemed_cost'),
        maxWidth: 100,
      },
      {
        Header: "Program Funds net transfers",
        accessor: "program_funds_net_transfers",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'program_funds_net_transfers'),
        Footer: (info) => footerRenderer(info, 'program_funds_net_transfers'),
        maxWidth: 140,
      },
      {
        Header: "Program refunds for monies pending",
        accessor: "program_refunds_for_monies_pending",
        Cell: ({row, value}) => totalSubRowsRenderer(row, value, 'program_refunds_for_monies_pending'),
        Footer: (info) => footerRenderer(info, 'program_refunds_for_monies_pending'),
        maxWidth: 140,
      }
    ],
    Footer: 'Others'
  }
]

