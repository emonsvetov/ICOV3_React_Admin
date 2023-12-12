import React, { useState} from 'react'
import ProgramsHierarchy from '@/shared/components/ProgramsHierarchy'
import {connect} from 'react-redux'

import {Button, Col, Row} from "reactstrap";
import {CSVLink} from "react-csv";
import {getFirstDay} from '@/shared/helpers'
import {isEqual, clone, cloneDeep} from 'lodash';

const defaultFrom = getFirstDay()
const defaultTo = new Date()

const TrialBalanceFilter = (
    {
        filter,
        setFilter,
        setUseFilter,
        download,
        exportData,
        exportLink,
        exportHeaders
    }) => {
    const options = {
        'dateRange': false,
        'programs': true,
        'keyword': false,
        'exportToCsv': true,
        'createdOnly': false,
        'reportKey': true,
        'programId': true,
    }

    const [from, setFrom] = React.useState(defaultFrom)
    const [to, setTo] = React.useState(defaultTo)
    const [createdOnly, setCreatedOnly] = React.useState(false)
    const [reportKey, setReportKey] = React.useState('sku_value')
    const [selectedPrograms, setSelectedPrograms] = useState(filter.programs ? filter.programs : []);
    const finalFilter = {...filter}
    let previous = cloneDeep(finalFilter);
    const [keyword, setKeyword] = React.useState('')

    const onKeywordChange = (e) => {
        setKeyword( e.target.value )
    }


    const onClickFilter = (reset = false, exportToCsv = 0) => {
        let dataSet = {}
        if (options.programs) {
            dataSet.programs = reset ? [] : clone(selectedPrograms)
        }
        if (options.programId) {
            dataSet.programId = filter.programId
        }

        onClickFilterCallback(dataSet)
        previous = dataSet;
        if (reset) {
            setSelectedPrograms([]);
        }
    }

    const onClickFilterCallback = (values) => {
        let change = false;

        if (options.programs) {
            if (!isEqual(values.programs, previous.programs)) {
                change = true
            }
        }

        if (!change) {
            alert('No change in filters')
            setUseFilter(false)
            return
        }

        let filters = {}
        if (options.programs) {
            filters.programs = values.programs
        }
        if (options.programs) {
            filters.programs = values.programs
        }
        filters.programId = filter.programId
        filters.programs = filter.programs

        setFilter(filters)
        setUseFilter(true)
    }

    return (
        <Row className="table-filter-form form">
            <Col md={8} lg={8} sm={8} className="table-filter-form-fields">
                <div>
                    {options.programs &&
                        <div className="table-filter-form-col table-filter-form-col1 float-filter" style={{paddingTop: 4}}>
                            <div className="form__form-group">
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">

                                        <ProgramsHierarchy
                                            defaultPrograms={options.programs}
                                            selectedPrograms={selectedPrograms}
                                            setSelectedPrograms={setSelectedPrograms}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="clearfix">&nbsp;</div>
                    <div className="clearfix">&nbsp;</div>
                </div>
            </Col>
            <Col className="align-items-center max-height-32px pl-1">
                <Button
                    onClick={() => onClickFilter()}
                    className="btn btn-sm btn-primary"
                    color="#ffffff"
                >Filter</Button>
                <Button
                    onClick={() => onClickFilter(true)}
                    className="btn btn-sm btn-primary"
                    color="#ffffff"
                >Reset</Button>
                {options.exportToCsv &&
                    <div>
            <span className="text-blue pointer mr-2" onClick={() => {
                download(filter)
            }}>Export to CSV</span>
                        <CSVLink
                            data={exportData}
                            headers={exportHeaders}
                            filename="report.csv"
                            className="hidden"
                            ref={exportLink}
                            target="_blank"
                        />
                    </div>
                }
            </Col>
        </Row>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        organization: state.organization,
    };
};
export default connect(mapStateToProps)(TrialBalanceFilter);