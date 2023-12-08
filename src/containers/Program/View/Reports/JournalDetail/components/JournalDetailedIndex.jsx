import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import JournalDetailedTable from './JournalDetailedTable';
import { useParams } from "react-router-dom";

const JournalDetailedIndex = () => {
  // const reactTableData = GetIndexData();
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
    <Col md={12}>
      <Card>
        <CardBody>
          <JournalDetailedTable programs={defaultPrograms}/>
        </CardBody>
      </Card>
    </Col>
  )
}

export default JournalDetailedIndex;
