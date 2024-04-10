import React, {useEffect, useState} from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import DepositTransferIndexDataTable from './DepositTransferIndexDataTable';
import {isEmpty} from '@/shared/helpers'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import { getPrograms } from '@/shared/apiHelper.jsx';
import { getAllPrograms } from '@/shared/apiHelper.jsx';


const DepositTransferIndex = ({organization}) => {

  const [defaultPrograms, setDefaultPrograms] = React.useState([]);

  useEffect(() => {
    if (isEmpty(defaultPrograms)) {
      getAllPrograms("minimal=true&limit=99999999")
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
    <Col md={12}>
      <Card>
        <CardBody>
          <DepositTransferIndexDataTable programs={defaultPrograms} />
        </CardBody>
      </Card>
    </Col>
  )
}

export default withRouter(connect((state) => ({
  organization: state.organization
}))(DepositTransferIndex));
