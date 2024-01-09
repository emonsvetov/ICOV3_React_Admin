import React, {useState, useEffect} from "react";
import {Field, Form} from 'react-final-form';
import {Button, Row, Col} from 'reactstrap';
import renderSelectField from '@/shared/components/form/Select'
import {connect} from 'react-redux'
import {CSVLink} from "react-csv";
import {isEqual, clone, cloneDeep} from 'lodash';
import ProgramsHierarchy from '@/shared/components/ProgramsHierarchy'
import Select from "react-select";

const prepareList = () => {
    let y = new Date().getFullYear();
    let list = [];
    for (var i = y; i > y - 7; i--) {
        list.push({label: i, value: i})
    }
    return list;
}

const Filter = ({
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
        'programId': false,
        'year': true,
    }

    const YEAR_LIST = prepareList();

    const [targetYear, setTargetYear] = useState({
        label: new Date().getFullYear(),
        value: new Date().getFullYear()
    })

    const [selectedPrograms, setSelectedPrograms] = useState(filter.programs ? filter.programs : []);

    const finalFilter = {...filter}
    let previous = cloneDeep(finalFilter);

    const onClickFilter = (reset = false, exportToCsv = 0) => {
        let dataSet = {}
        if (options.programs) {
            dataSet.programs = reset ? [] : clone(selectedPrograms)
        }
        if (options.year) {
            dataSet.year = targetYear
        }

        onClickFilterCallback(dataSet)
        previous = dataSet;
        if (reset) {
            setTargetYear({label: new Date().getFullYear(), value: new Date().getFullYear()})
            setSelectedPrograms([]);
        }
    }

    const onClickFilterCallback = (values) => {
        console.log(values)
        let change = false;

        if (options.programs) {
            if (!isEqual(values.programs, previous.programs)) {
                change = true
            }
        }

        if (options.year) {
            if (finalFilter.year !== values.year) {
                change = true
            }
        }

        if (!change) {
            alert('No change in filters')
            setUseFilter(false)
            return
        }

        let filters = {}
        if (options.year) {
            filters.year = values.year.value
            filters.targetYear = values.year
        }
        if (options.programs) {
            filters.programs = values.programs
        }
        // filters.programs = filter.programs

        setFilter(filters)
        setUseFilter(true)
    }

    const handleChangeYear = (value) => {
        setTargetYear(value)
    }


    return (
        <Row>
            {options.programs &&
                <div className="table-filter-form-col table-filter-form-col1 float-filter"
                     style={{paddingTop: 4}}>
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

            <div className="table-filter-form-col table-filter-form-col2 float-filter col">
                <div className="form__form-group col-md-12" style={{maxWidth: 150}}>
                            <span className="form__form-group-label">
                                Target Year
                            </span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-row">
                            <Select
                                name="year"
                                value={targetYear}
                                onChange={handleChangeYear}
                                options={YEAR_LIST}
                                clearable={false}
                                className="react-select"
                                classNamePrefix="react-select"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Col className="align-items-center max-height-32px pl-1">
                <Button
                    onClick={()=>onClickFilter()}
                    className="btn btn-sm btn-primary"
                    color="#ffffff"
                >Filter</Button>
                <Button
                    onClick={()=>onClickFilter(true)}
                    className="btn btn-sm btn-primary"
                    color="#ffffff"
                >Reset</Button>
                {options.exportToCsv &&
                    <>
            <span
                className="btn btn-sm btn-primary mr-2 text-white pointer"
                onClick={() => { download(filter) }}
            >Export to CSV</span>
                        <CSVLink
                            data={exportData}
                            headers={exportHeaders}
                            filename="report.csv"
                            className="hidden"
                            ref={exportLink}
                            target="_blank"
                        />
                    </>
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
export default connect(mapStateToProps)(Filter);