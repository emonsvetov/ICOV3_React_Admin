import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import AnnualAwardsSummaryTable from './components/AnnualAwardsSummaryTable.jsx';
import {isEmpty} from '@/shared/helpers'
import {getAllPrograms} from '@/shared/apiHelper.jsx';

const JournalDetailed = () => {
  const [defaultPrograms, setDefaultPrograms] = useState([]);
  let {programId} = useParams();

  useEffect(() => {
    if (isEmpty(defaultPrograms)) {
      getAllPrograms("minimal=true&limit=99999999&programId=" + programId)
        .then(response => {
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
    <AnnualAwardsSummaryTable programs={defaultPrograms}/>
  )
}
export default JournalDetailed
