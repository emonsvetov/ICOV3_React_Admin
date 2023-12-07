import React, {useEffect, useRef, useState} from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import SupplierRedemptionTable2 from './SupplierRedemptionTable2';
import SupplierRedemptionFilter2, {defFilter} from './SupplierRedemptionFilter2';
import axios from "axios";
import {isEmpty} from '@/shared/helpers'
import {CSVLink} from "react-csv";


const SupplierRedemptionIndex = () => {
    const [merchants, setMerchants] = useState([]);
    const [defaultMerchants, setDefaultMerchants] = useState([]);
    const [csvData,setCsvData] = useState([]);
    const [dataReport, setDataReport] = useState({
        data: [{key:1}],
        config: {
            columns: [{key:2}],
            total: [{key:3}]
        },
        total1: 0,
    });

    const exportLink = useRef();

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

            }
        }
    }

  const getDataReport = async (params) => {
    const merchantsApiUrl = `/organization/1/report/supplier-redemption`
    try {
      const response = await axios.get(merchantsApiUrl, { params });
        setDataReport(response.data);
        setCsvData([...Object.values(response.data.data),response.data.config.total]);
    } catch (e) {}
  }

    const handleFilterChange = (value) => {
        getDataReport(value);
    }

    const handleCSVExport = (value) => {
        exportLink.current.link.click();
    }

    useEffect(() => {
        getDataReport(defFilter)
    }, [])

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
        <div style={{display:"none"}}>
            <CSVLink
                data={Object.values(csvData)}
                headers={dataReport.config.columns}
                filename="report.csv"
                className="hidden"
                ref={exportLink}
                target="_blank"
            ></CSVLink>
        </div>
      <Card>
        <CardBody>
          <SupplierRedemptionFilter2 filters={handleFilterChange} exportCSV={handleCSVExport} merchants={merchants}/>
          <SupplierRedemptionTable2 dataReport={dataReport}  />
        </CardBody>
      </Card>
    </Col>
  )
}

export default SupplierRedemptionIndex;
