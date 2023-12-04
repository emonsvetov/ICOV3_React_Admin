import { toPoints} from '@/shared/helpers'
export const TABLE_COLUMNS = [
  {
    Header: "Program Id",
    accessor: "program_id",
  },
  {
    Header: "Program Name",
    accessor: "program_name",
  },
  {
    Header: "External Id",
    accessor: "external_id",
  },
  // {
  //   Header: "Org Id",
  //   accessor: "recipient_organization_uid",
  // },
  {
    Header: "First Name",
    accessor: "recipient_first_name",
  },
  {
    Header: "Last Name",
    accessor: "recipient_last_name",
  },
  {
    Header: "Email",
    accessor: "recipient_email",
  },
  {
    Header: "Amount Awarded",
    accessor: "points_awarded",
    Cell: ({ row, value }) => { return toPoints(row.original.factor_valuation * value); },
  },
  {
    Header: "Amount Redeemed",
    accessor: "points_redeemed",
    Cell: ({ row, value }) => { return toPoints(row.original.factor_valuation * value); },
  },
  // {
  //   Header: "Amount Expired",
  //   accessor: "points_expired",
  //   Cell: ({ row, value }) => { return toPoints(row.original.factor_valuation * value); },
  // },
  // {
  //   Header: "Amount Reclaimed",
  //   accessor: "points_reclaimed",
  //   Cell: ({ row, value }) => { return toPoints(row.original.factor_valuation * value); },
  // },
  // {
  //   Header: "Award Credit Reclaimed",
  //   accessor: "award_credit_points_reclaimed",
  //   Cell: ({ row, value }) => { return toPoints(row.original.factor_valuation * value); },
  // },
  {
    Header: "Current Balance",
    accessor: "points_balance",
    Cell: ({ row, value }) => { return toPoints(row.original.factor_valuation * value); },
  },
  {
    Header: "Peer Points Allocated",
    accessor: "peer_rewards_earned",
    Cell: ({ row, value }) => { return toPoints(row.original.factor_valuation * value); },
  },
  {
    Header: "Peer Points Given",
    accessor: "peer_rewards_given",
    Cell: ({ row, value }) => { return toPoints(row.original.factor_valuation * value); },
  },
  {
    Header: "Peer Points Balance",
    accessor: "peer_balance",
    Cell: ({ row, value }) => { return toPoints(row.original.factor_valuation * value); },
  },
  // {
  //   Header: "Anniversary",
  //   accessor: "anniversary",
  // },
  // {
  //   Header: "Birthday",
  //   accessor: "birth",
  // },
];
