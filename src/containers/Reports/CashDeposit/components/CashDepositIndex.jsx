import React, {useEffect, useState} from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import CashDepositIndexDataTable from './CashDepositIndexDataTable';
import axios from "axios";
import {isEmpty} from '@/shared/helpers'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

const CashDepositIndex = ({organization}) => {
  const [programs, setPrograms] = useState([]);
  const [defaultPrograms, setDefaultPrograms] = useState([]);

  const getData = async () => {
    const programsApiUrl = `/organization/${organization.id}/program?page=0&limit=9999999999&hierarchy=1&all=1`
    if (isEmpty(programs)) {
      try {
        const response = await axios.get(programsApiUrl);
        if (response.data.length === 0) return {results: [], count: 0}

        const data = response.data.data;
        setPrograms(data);
        return data;
      } catch (e) {
        throw new Error(`API error:${e?.message}`);
      }
    }
  }

  useEffect(() => {
    if (organization){
      getData();
    }
    if (programs) {
      const result = programs.map(x => x.account_holder_id)
      setDefaultPrograms(result);
    }
  }, [programs, organization])

  if (isEmpty(defaultPrograms)) {
    return <p>Loading...</p>;
  }

  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <CashDepositIndexDataTable programs={defaultPrograms} />
        </CardBody>
      </Card>
    </Col>
  )
}

export default withRouter(connect((state) => ({
  organization: state.organization
}))(CashDepositIndex));
