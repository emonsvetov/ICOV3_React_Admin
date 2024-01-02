import React, {useEffect, useState} from 'react';
// import {withRouter} from "react-router-dom";
// import {connect} from "react-redux";
import { useParams } from "react-router-dom";
import JournalDetailedTable from './components/JournalDetailedDataTable.jsx';
// import { getPrograms } from '@/shared/apiHelper.jsx';
// import { isEmpty } from '@/shared/helpers';
import {isEmpty} from '@/shared/helpers'
import { getAllPrograms } from '@/shared/apiHelper.jsx';

const JournalDetailed = ({organization}) => {
    const [defaultPrograms, setDefaultPrograms] = useState([]);

    
    let {programId} = useParams();

    useEffect(() => {
        if ( isEmpty(defaultPrograms) ){

            getAllPrograms( "minimal=true&limit=99999999&programId="+programId )
                .then( response => {
                    const data = response?.data ? response.data : [];
                    const result = data.map(x => x.account_holder_id)
                    setDefaultPrograms(result);
                })
        }
    })


    if (isEmpty(defaultPrograms)) {
        return <p>Loading...</p>;
    }

  return (

    <JournalDetailedTable programs={defaultPrograms} />
)}
export default JournalDetailed
// export default withRouter(connect((state) => ({
//   organization: state.organization
// }))(JournalDetailed));
