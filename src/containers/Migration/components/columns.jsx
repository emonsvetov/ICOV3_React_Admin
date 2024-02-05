import React from "react";
import getV2DeprecatedMigrate from '@/service/getV2DeprecatedMigrate';

const RenderActions = ({row}) => {
    return (
        <>
            <a className='link' onClick={() => {
                console.log(row.original);
                getV2DeprecatedMigrate(row.original.account_holder_id).then( response => {
                    console.log(response)
                })
            }}>Migrate</a>
        </>
    )
}
export const TABLE_COLUMNS = [
    {
        Header: "V2 Program Name",
        accessor: "name",
    },
    {
        Header: "V3 Program Name",
        accessor: "v3name",
    },
    {
        Header: "",
        accessor: "count",
        Cell: ({row}) => <RenderActions row={row}/>,
    },
];
