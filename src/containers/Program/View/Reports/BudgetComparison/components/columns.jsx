import { toPoints} from '@/shared/helpers'
export const TABLE_COLUMNS = [
  {
    Header: "Month",
    accessor: "month",
  },
  {
    Header: "Budget",
    accessor: "budget_value",
    Cell: function ($row, $value) {
  return toPoints($value);
},
  },
];
