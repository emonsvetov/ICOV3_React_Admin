import React,{ useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {isEmpty} from '@/shared/helpers'
import { getAllPrograms } from '@/shared/apiHelper.jsx';
import { Card, CardBody, Col } from 'reactstrap';
import UserDetailChangeLogsTable from './UserDetailChangeLogsTable';

const UserDetailsChangeLogsIndex = ({organization}) => {
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
          <UserDetailChangeLogsTable  programs={defaultPrograms}/>
        </CardBody>
      </Card>
    </Col>
  )
}

export default withRouter(connect((state) => ({
  organization: state.organization
}))(UserDetailsChangeLogsIndex));
