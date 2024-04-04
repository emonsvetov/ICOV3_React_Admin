import { toPoints} from '@/shared/helpers'
export const TABLE_COLUMNS = [
  {
    Header: "Program ID",
    accessor: "program_account_holder_id",
  },
  {
    Header: "Program",
    accessor: "program_name",
  },
  {
    Header: "External ID",
    accessor: "external_id",
  },
  {
    Header: "Org ID",
    accessor: "recipient_organization_uid",
  },
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
];
