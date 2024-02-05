import React, {useState,useEffect} from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import {isEmpty} from '@/shared/helpers'
import { getAllPrograms } from '@/shared/apiHelper.jsx';
import ProgramStatusIndexDataTable from './ProgramStatusIndexDataTable.jsx';

const ProgramStatusIndex = () => {
  const [defaultPrograms, setDefaultPrograms] = useState([]);
  useEffect(() => {
    if ( isEmpty(defaultPrograms) ){
      getAllPrograms( "minimal=true&limit=99999999" )
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
    <Col md={12}>
      <Card>
        <CardBody>
          <ProgramStatusIndexDataTable programs={defaultPrograms} />
        </CardBody>
      </Card>
    </Col>
  )
}

export default ProgramStatusIndex;
