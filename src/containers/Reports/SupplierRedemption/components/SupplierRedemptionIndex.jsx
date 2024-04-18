import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import SupplierRedemptionTable from './SupplierRedemptionTable';
import SupplierRedemptionFilter, {defFilter} from './SupplierRedemptionFilter';
import axios from "axios";
import {isEmpty} from '@/shared/helpers'
import {CSVLink} from "react-csv";
import {any, bool} from "prop-types";

interface SupplierRedemptionIndexProps
{
    programid?: any
}

const SupplierRedemptionIndex: FC<SupplierRedemptionIndexProps> = () => {
    const [merchants, setMerchants] = useState([]);
    const [defaultMerchants, setDefaultMerchants] = useState([]);
    const [csvData, setCsvData] = useState([]);
    const [params, setParams] = useState(defFilter);
    const [dataReport, setDataReport] = useState({
        data: [{key: 1}],
        config: {
            columns: [{key: 2}],
            total: [{key: 3}]
        },
        total1: 0,
    });

    const exportLink = useRef();

    const getDataReport = async () => {
        const merchantsApiUrl = `/organization/1/report/supplier-redemption`
        try {
            const response = await axios.get(merchantsApiUrl, {params});
            setDataReport(response.data);
            setCsvData([...Object.values(response.data.data), response.data.config.total]);            
        } catch (e) {
        }        
    }
  

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

    const handleFilterChange = (value) => {
        let payload = value;
        if (payload.codes == -1)
            delete payload.codes;
        setParams(payload);
    }

    const handleCSVExport = (value) => {
        exportLink.current.link.click();
    }

    useEffect(() => {
        getData();
        if (merchants) {
            const result = merchants.map(x => x.id)
            setDefaultMerchants(result);
        }
    }, [merchants])

    useEffect(() => {
        getDataReport();
    }, [params])

    if (isEmpty(defaultMerchants)) {
        return <p>Loading...</p>;
    }

    csvData.map(data => {
        if ( data.avg_discount_percent.toString().at(-1) != "%" )
        {
            
        data.avg_discount_percent = data.avg_discount_percent + "%";
        data.percent_total_cost = data.percent_total_cost + "%";
        data.total_cost_basis = "$" + data.total_cost_basis ;
        data.total_premium = "$" + data.total_premium;
        data.total_redemption_value = "$" + data.total_redemption_value;
        data.percent_total_redemption_value = data.percent_total_redemption_value + "%"           
        }
    })

    return (

        <Col md={12}>
            <div style={{display: "none"}}>
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
                    <SupplierRedemptionFilter filters={handleFilterChange} exportCSV={handleCSVExport} merchants={merchants}/>
                    <SupplierRedemptionTable dataReport={dataReport}/>
                </CardBody>
            </Card>
        </Col>
    )
}

export default SupplierRedemptionIndex;
