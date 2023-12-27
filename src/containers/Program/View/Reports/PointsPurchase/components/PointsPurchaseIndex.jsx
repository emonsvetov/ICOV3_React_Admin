import React, {useState, useEffect}  from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import PointsPurchaseTable from './PointsPurchaseTable';
import {isEmpty} from '@/shared/helpers'
import {connect} from "react-redux";
import { getAllPrograms } from '@/shared/apiHelper.jsx';
import {withRouter, useParams} from "react-router-dom";

const PointsPurchaseIndex = () => {
  // const reactTableData = GetIndexData();
  const [defaultPrograms, setDefaultPrograms, program] = useState([]);

  let {programId} = useParams();

  useEffect(() => {
      getAllPrograms( "minimal=true&limit=99999999&programId=" +  programId )
          .then( response => {
              const data = response?.data ? response.data : [];
              const result = data.map(x => x.account_holder_id)
              setDefaultPrograms(result);
          })
  }, [programId])

  if (isEmpty(defaultPrograms)) {
    return <p>Loading...</p>;
  }

  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <PointsPurchaseTable programs={defaultPrograms} program={program}/>
        </CardBody>
      </Card>
    </Col>
  )
}

const mapStateToProps = (state) => {
  return {
    organization: state.organization,
    program: state.program,
  };
};
export default connect(mapStateToProps)(PointsPurchaseIndex);
