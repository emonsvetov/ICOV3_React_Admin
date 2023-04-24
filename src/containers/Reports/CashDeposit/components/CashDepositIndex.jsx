import React from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import CashDepositIndexDataTable from './CashDepositIndexDataTable';
// import axios from "axios";
// import {isEmpty} from '@/shared/helpers'
// import {withRouter} from "react-router-dom";
// import {connect} from "react-redux";
// import { getPrograms } from '@/shared/apiHelper.jsx';

const CashDepositIndex = ({organization}) => {

  const defaultPrograms = []

  // const [defaultPrograms, setDefaultPrograms] = useState([]);

  // useEffect(() => {
  //   if ( organization?.id ){
  //     getPrograms( organization.id, "minimal=true" )
  //     .then( response => {
  //       const data = response?.data ? response.data : [];
  //       const result = data.map(x => x.account_holder_id)
  //       setDefaultPrograms(result);
  //     })
  //   }
  // }, [organization])

  // if (isEmpty(defaultPrograms)) {
  //   return <p>Loading...</p>;
  // }

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
export default CashDepositIndex
// export default withRouter(connect((state) => ({
//   organization: state.organization
// }))(CashDepositIndex));
