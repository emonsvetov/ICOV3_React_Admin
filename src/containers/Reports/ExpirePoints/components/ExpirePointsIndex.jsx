import React, {useEffect, useState} from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import ExpirePointsIndexDataTable from './ExpirePointsIndexDataTable';
import {isEmpty} from '@/shared/helpers'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import { getAllPrograms } from '@/shared/apiHelper.jsx';

const ExpirePointsIndex = ({organization}) => {

  const [defaultPrograms, setDefaultPrograms] = useState([]);

  useEffect(() => {
    if ( organization?.id ){
      getAllPrograms( "minimal=true&limit=99999999" )
      .then( response => {
        const data = response?.data ? response.data : [];
        const result = data.map(x => x.account_holder_id)
        setDefaultPrograms(result);
      })
    }
  }, [organization])

  if (isEmpty(defaultPrograms)) {
    return <p>Loading...</p>;
  }

  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <ExpirePointsIndexDataTable programs={defaultPrograms} />
        </CardBody>
      </Card>
    </Col>
  )
}
export default withRouter(connect((state) => ({
  organization: state.organization
}))(ExpirePointsIndex));
