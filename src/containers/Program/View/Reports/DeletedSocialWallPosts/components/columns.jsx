

export const TABLE_COLUMNS = [
    {
        Header: "Program Name",
        accessor: "program_name",

    },
    {
        Header: "Receiver Name",
        accessor: "receiver_name",
    },
    {
        Header: "Event",
        accessor: "event_name",
    },
    {
        Header: "Type",
        accessor: "social_wall_post_type",
        enableRowSpan: 1,
    },
    {
        Header: "Social Wall Post/Comment",
        enableRowSpan: 1,
        accessor: "comment",
    },
    {
        Header: "Created By",
        enableRowSpan: 1,
        accessor: "created_by_name",
    },
    {
        Header: "Created At",
        enableRowSpan: 1,
        accessor: "created_at_format_date",
    },
    {
        Header: "Deleted By",
        accessor: "deleted_by_name",
    },
    {
        Header: "Deleted At",
        accessor: "deleted_at_format_date",
    },
];
