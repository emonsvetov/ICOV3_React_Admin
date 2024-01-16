import React, {useState} from 'react'
import ProgramsHierarchy from '@/shared/components/ProgramsHierarchy'
import {connect} from 'react-redux'

import {Button, Col, Row} from "reactstrap";
import DatePicker from "react-datepicker";
import {CSVLink} from "react-csv";
import {getFirstDay} from '@/shared/helpers'
import {dateStrToYmd} from '@/shared/helpers';
import {isEqual, clone, cloneDeep} from 'lodash';
import {CheckBoxField} from '@/shared/components/form/CheckBox';

const defaultFrom = getFirstDay()
const defaultTo = new Date()

const MigrationFilter = (
    {
        auth,
        filter,
        setFilter,
        setUseFilter,
        download,
        exportData,
        exportLink,
        exportHeaders
    }) => {
    const options = {
        'keyword': true,
        'exportToCsv': false,
    }

    const finalFilter = {...filter}
    let previous = cloneDeep(finalFilter);
    const [keyword, setKeyword] = React.useState('')

    const onKeywordChange = (e) => {
        setKeyword(e.target.value)
    }

    const onClickFilter = (reset = false, exportToCsv = 0) => {
        let dataSet = {}

        if (options.keyword) {
            dataSet.keyword = clone(keyword)
        }

        onClickFilterCallback(dataSet)
        previous = dataSet;
        if (reset) {
            setKeyword('')
        }
    }

    const onClickFilterCallback = (values) => {
        let change = false;

        if (options.keyword) {
            if (finalFilter.keyword !== values.keyword) {
                change = true
            }
        }

        if (!change) {
            alert('No change in filters')
            setUseFilter(false)
            return
        }

        let filters = {}
        if (options.keyword) filters.keyword = values.keyword

        setFilter(filters)
        setUseFilter(true)
    }

    return (
        <Row className="table-filter-form form">
            <Col md={8} lg={8} sm={8} className="table-filter-form-fields">
                <div>
                    {options.keyword &&
                        <div className="table-filter-form-col table-filter-form-col1">
                            <div className="form__form-group">
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input
                                            value={keyword}
                                            onChange={onKeywordChange}
                                            type="text"
                                            placeholder={`Search`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
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
    };
};
export default connect(mapStateToProps)(MigrationFilter);