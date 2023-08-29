import React, { useState} from 'react'
import MerchantsHierarchy from '@/shared/components/MerchantsHierarchy'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Button, Col, Row} from "reactstrap";
import DatePicker from "react-datepicker";
import {CSVLink} from "react-csv";
import {getFirstDay} from '@/shared/helpers'
import {dateStrToYmd} from '@/shared/helpers';
import {isEqual, clone} from 'lodash';
import {CheckBoxField} from '@/shared/components/form/CheckBox';
import RadioButtonField from '@/shared/components/form/RadioButton';

const defaultFrom = getFirstDay()
const defaultTo = new Date()

const SupplierRedemptionFilter = (
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
    'dateRange': true,
    'merchants': true,
    'exportToCsv': true,
    'active': true,
    'reportKey': true,
  }
  const [from, setFrom] = React.useState(defaultFrom)
  const [to, setTo] = React.useState(defaultTo)
  const [active, setActive] = React.useState(true)
  const [reportKey, setReportKey] = React.useState('sku_value')
  const [selectedMerchants, setSelectedMerchants] = useState(filter.merchants ? filter.merchants : []);
  const finalFilter = {...filter}

  const onClickFilter = (reset = false, exportToCsv = 0) => {
    let dataSet = {}
    if (options.dateRange) {
      dataSet.from = dateStrToYmd(reset ? defaultFrom : from)
      dataSet.to = dateStrToYmd(reset ? defaultTo : to)
    }
    if (options.merchants) {
      dataSet.merchants = reset ? [] : clone(selectedMerchants)
    }
    if (options.active) {
      dataSet.active = reset ? true : active
    }
    if (options.reportKey) {
      dataSet.reportKey = reset ? 'sku_value' : reportKey
    }


    onClickFilterCallback(dataSet)
    if (reset) {
      setFrom(defaultFrom)
      setTo(defaultTo)
      setSelectedMerchants([]);
      setActive(true)
      setReportKey('sku_value')
    }
  }

  const onClickFilterCallback = (values) => {
    let change = false;

    if (options.merchants) {
      if (!isEqual(finalFilter.merchants, values.merchants)) {
        change = true
      }
    }

    if (options.dateRange) {
      if (finalFilter.from !== values.from || finalFilter.to !== values.to) {
        change = true
      }
    }
    if (options.active) {
      if (finalFilter.active !== values.active) {
        change = true
      }
    }
    if (options.reportKey) {
      if (finalFilter.reportKey !== values.reportKey) {
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
    if (options.programs) {
      filters.programs = values.programs
    }
    if (options.merchants) {
      filters.merchants = values.merchants
    }
    if (options.awardLevels) {
      filters.awardLevels = values.awardLevels
    }
    if (options.dateRange) {
      filters.from = values.from
      filters.to = values.to
    }
    if (options.active) {
      filters.active = values.active
    }
    if (options.reportKey) {
      filters.reportKey = values.reportKey
    }

    setFilter(filters)
    setUseFilter(true)
    console.log(filters)
  }

  const onStartChange = (value) => {
    setFrom(value)
  }
  const onEndChange = (value) => {
    setTo(value)
  }

  const onChangeActive = () => {
    setActive(!active)
  }

  const onChangeRadio = (value) => {
    setReportKey(value)
  }

  return (
    <Row className="table-filter-form form">
      <Col md={8} lg={8} sm={8} className="table-filter-form-fields">
        <div>
          {options.merchants &&
            <div className="table-filter-form-col table-filter-form-col1 float-filter" style={{paddingTop: 4}}>
              <div className="form__form-group">
                <div className="form__form-group-field">
                  <div className="form__form-group-row">
                    <MerchantsHierarchy
                      defaultMerchants={options.merchants}
                      selectedMerchants={selectedMerchants}
                      setSelectedMerchants={setSelectedMerchants}
                    />
                  </div>
                </div>
              </div>
            </div>
          }
          {options.dateRange &&
            <>
              <div className="table-filter-form-col table-filter-form-col2 float-filter">
                <div className="form__form-group">
                  <span className="form__form-group-label">From</span>
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                      <DatePicker
                        dateFormat="MM/dd/yyyy"
                        selected={from}
                        onChange={onStartChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-filter-form-col table-filter-form-col2 float-filter">
                <div className="form__form-group">
                  <span className="form__form-group-label">To</span>
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                      <DatePicker
                        dateFormat="MM/dd/yyyy"
                        selected={to}
                        onChange={onEndChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
          <div className="clearfix">&nbsp;</div>
          <div className="clearfix">&nbsp;</div>
          {options.active &&
            <>
              <div className="table-filter-form-col table-filter-form-col2 float-filter">
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                      <CheckBoxField name="active" label="Active Merchants" checked={active} onChange={onChangeActive}
                                     type="checkbox"/>
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
          {options.reportKey &&
            <>
              <div className="table-filter-form-col table-filter-form-col2 float-filter">
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                      <RadioButtonField
                        name="sku" label="Sku Value" onChange={onChangeRadio}
                        radioValue="sku_value"
                        value={reportKey}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-filter-form-col table-filter-form-col2 float-filter">
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                      <RadioButtonField
                        name="redemption" label="Redemption Value" onChange={onChangeRadio}
                        radioValue="redemption_value"
                        value={reportKey}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
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

export default withRouter(connect((state) => ({
  auth: state.auth
}))(SupplierRedemptionFilter));