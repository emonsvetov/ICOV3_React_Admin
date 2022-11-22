import React, {useEffect, useState} from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import InventoryIndexDataTable from './InventoryIndexDataTable.jsx';
import axios from "axios";
import {isEmpty} from '@/shared/helpers'

const InventoryIndex = () => {
  const [merchants, setMerchants] = useState([]);
  const [defaultMerchants, setDefaultMerchants] = useState([]);

  const getData = async () => {
    const merchantsApiUrl = `/organization/1/merchant?page=0&limit=9999999999&minimal=1`
    if (isEmpty(merchants)) {
      try {
        const response = await axios.get(merchantsApiUrl);
        if (response.data.length === 0) return {results: [], count: 0}

        const data = response.data;
        setMerchants(data);
        return data;
      } catch (e) {
        throw new Error(`API error:${e?.message}`);
      }
    }
  }

  useEffect(() => {
    getData();
    if (merchants) {
      const result = merchants.map(x => x.id)
        setDefaultMerchants(result);
    }
  }, [merchants])

  if (isEmpty(defaultMerchants)) {
    return <p>Loading...</p>;
  }

  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <InventoryIndexDataTable merchants={defaultMerchants}/>
        </CardBody>
      </Card>
    </Col>
  )
}

export default InventoryIndex;
