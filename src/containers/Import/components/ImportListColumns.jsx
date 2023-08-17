const ImportType = ({ row }) => {
  if (row.hasOwnProperty("csv_import_type")) {
    return (
      <div>
        <span>{row.csv_import_type.name}</span>
        <br />
        <span>
          <strong>Context:</strong> {row.csv_import_type.context}
        </span>
      </div>
    );
  }
};

export const IMPORT_LIST_COLUMNS = [
  {
    Header: "#",
    accessor: "id",
    Footer: "#",
    disableFilters: true,
    disableGlobalFilters: true,
    width: 60,
    // sticky:'left'
  },
  {
    Header: "Import Type",
    accessor: "csv_import_type_id",
    Cell: ({ row, value }) => <ImportType row={row.original} />,
  },
  {
    Header: "File Name",
    accessor: "name",
    Cell: ({ row, value }) => {
      return (
        <a
          href={`${process.env.REACT_APP_API_STORAGE_URL}/${row.original.path}`}
        >
          {value}
        </a>
      );
    },
  },
  {
    Header: "Rows",
    accessor: "rowcount",
  },
  {
    Header: "Filesize",
    accessor: "size",
  },
  {
    Header: "Processed?",
    accessor: "is_processed",
  },
  {
    Header: "Imported?",
    accessor: "is_imported",
  },
  {
    Header: "Date",
    accessor: "created_at",
    Cell: ({ row, value }) => value,
  },
];
