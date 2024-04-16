import React, {FC, useEffect, useRef, useState} from 'react';
import {any} from "prop-types";
import AnnualAwardsSummarySubProgramTable from "./AnnualAwardsSummarySubProgramTable"
import AnnualAwardsSummarySubProgramFilter, {defFilter} from "./AnnualAwardsSummarySubProgramFilter"
import {CSVLink} from "react-csv";
import {Card, CardBody} from "reactstrap";
import axios from "axios";
import { getAllPrograms } from '@/shared/apiHelper.jsx';

interface AnnualAwardsSummarySubProgramIndexProps
{
    programid: any
}

export const defData = {
    title: '',
    columans: [],
    data: [],
    total: [],
}

const AnnualAwardsSummarySubProgramIndex: FC<AnnualAwardsSummarySubProgramIndexProps> = ({programid}) => {
    const [process, setProcess] = useState(true);
    const [dataAwards, setDataAwards] = useState(defData);
    const [dataReward, setDataReward] = useState(defData);
    const [params, setParams] = useState(defFilter);
    const [csvData, setCsvData] = useState([]);
    const [defaultPrograms, setDefaultPrograms] = useState([]);
    const [subPrograms, setSubPrograms] = useState([]);

    const exportLink = useRef();

    const handleFilterChange = (value) => {
        setParams(prevState => {
            return {
                ...value,
                programId: programid,
                programs: value.programs !== '' ? value.programs : defaultPrograms.join(','),
            }
        });
    }

    const convertToTreeData = (data, parentId = null) => {
        const filteredData = data.filter(item => item.parent_id === parentId);

        return filteredData.map((item, index) => ({
            title: item.name,
            value: `${item.account_holder_id}_${index}`,
            key: `${item.account_holder_id}_${index}`,
            children: convertToTreeData(data, item.id),
        }));
    };

    const getProgram = async () =>{
        getAllPrograms("minimal=true&limit=99999999&programId=" + programid)
            .then(response => {
                const progarmData = response?.data ? response.data : [];
                const treeData = convertToTreeData(response.data);
                setSubPrograms(treeData);
                const result = progarmData.map(x => x.account_holder_id)
                setDefaultPrograms(result);
                setParams(prevState => ({
                    ...prevState,
                    programId: programid,
                    programs: result.join(','),
                }));
            });
    }

    const getDataReport = async () => {

        if (params.programId > 0 && params.programs !== '' && params.exportToCsv === 0){
            console.log(params)
            const apiUrl = `/organization/1/report/annual-awards-summaryAdmin`
            try {
                const response = await axios.get(apiUrl, {params});
                const res = response.data
                setDataAwards(res.awards);
                setDataReward(res.rewards);
            } catch (e) {}
        }

        if (params.exportToCsv === 1) {
            const apiUrl = `/organization/1/report/annual-awards-summaryAdmin`
            try {
                const response = await axios.get(apiUrl, {params});
                const res = response.data
                setCsvData(res);
            } catch (e) {}
        }
    }

    useEffect(() => {
        if (csvData && csvData.length > 0) {
            exportLink.current.link.click();
        }
    }, [csvData]);

    useEffect(() => {
        getProgram();
    }, []);

    useEffect(() => {

        getDataReport();
    }, [params])

    return (<>
        <div style={{display: "none"}}>
            <CSVLink
                data={csvData}
                filename="report.csv"
                className="hidden"
                ref={exportLink}
                target="_blank"
            ></CSVLink>
        </div>
        <Card>
            <CardBody>
                <AnnualAwardsSummarySubProgramFilter programs={subPrograms} filters={handleFilterChange} />
                <AnnualAwardsSummarySubProgramTable dataReport={dataAwards}/>
                <AnnualAwardsSummarySubProgramTable dataReport={dataReward}/>
            </CardBody>
        </Card>
    </>)
}
export default AnnualAwardsSummarySubProgramIndex;
