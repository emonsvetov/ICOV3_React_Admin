import React, {useState, useEffect, useMemo} from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DomainProgramsDataTable from './DomainProgramsDataTable';
import AddProgramToDomain from './AddProgramToDomain';

const DomainPrograms = ( {domain, organization} ) => {
    const [trigger, setTrigger] = useState( 0 );
    const [searchTrigger, setSearchTrigger] = useState( 0 );
    if( !organization?.id ) return null
    if( !domain?.id ) return null
    return (
        <>
            <AddProgramToDomain organization={organization} domain={domain} searchTrigger={searchTrigger} setSearchTrigger={setSearchTrigger} setTrigger={setTrigger} />
            <DomainProgramsDataTable organization={organization} domain={domain} trigger={trigger} setTrigger={setTrigger} setSearchTrigger={setSearchTrigger} />
        </>
    )
}
export default withRouter(connect((state) => ({
    organization: state.organization
}))(DomainPrograms));
// export default DomainPrograms;
