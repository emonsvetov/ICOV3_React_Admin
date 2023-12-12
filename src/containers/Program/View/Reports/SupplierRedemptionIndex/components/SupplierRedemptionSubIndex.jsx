import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import SupplierRedemptionSubFilter, {defFilter}from "./SupplierRedemptionSubFilter";
import SupplierRedemptionTable from "../../../../../Reports/SupplierRedemption/components/SupplierRedemptionTable";
import axios from "axios";
import {isEmpty} from '@/shared/helpers'
import {CSVLink} from "react-csv";
import {any} from "prop-types";

interface SupplierRedemptionIndexProps
{
    programid?: any
}

const SupplierRedemptionIndex: FC<SupplierRedemptionIndexProps> = ({programid}) => {
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
        if (params.programId > 0){
            const merchantsApiUrl = `/organization/1/report/supplier-redemption`
            try {
                const response = await axios.get(merchantsApiUrl, {params});
                setDataReport(response.data);
                setCsvData([...Object.values(response.data.data), response.data.config.total]);
            } catch (e) {
            }
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
        value.programId = programid;
        setParams(value);
    }

    const handleCSVExport = (value) => {
        exportLink.current.link.click();
    }

    useEffect(() => {
        setParams(prevState => {
            return {
                ...prevState,
                programId: programid
            }
        });
    }, [programid]);

    useEffect(() => {
        getData();
        if (merchants) {
            const result = merchants.map(x => x.id)
            setDefaultMerchants(result);
        }
    }, [merchants])

    useEffect(() => {
        if (programid > 0) {
            getDataReport();
        }
    }, [params])

    if (isEmpty(defaultMerchants)) {
        return <p>Loading...</p>;
    }

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
                    <SupplierRedemptionSubFilter filters={handleFilterChange} exportCSV={handleCSVExport} merchants={merchants}/>
                    <SupplierRedemptionTable dataReport={dataReport}/>
                </CardBody>
            </Card>
        </Col>
    )
}

export default SupplierRedemptionIndex;
