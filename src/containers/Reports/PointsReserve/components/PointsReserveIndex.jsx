import React, {useEffect, useState} from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import PointsReserveTable from './PointsReserveTable';
import {isEmpty} from '@/shared/helpers'
import { getAllPrograms } from '@/shared/apiHelper.jsx';
import {connect} from "react-redux";

const PointsReserveIndex = ({organization}) => {
  // const reactTableData = GetIndexData();
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
          <PointsReserveTable  programs={defaultPrograms}  />
        </CardBody>
      </Card>
    </Col>
  )
}


const mapStateToProps = (state) => {
  return {
    organization: state.organization,
  };
};
export default connect(mapStateToProps)(PointsReserveIndex);