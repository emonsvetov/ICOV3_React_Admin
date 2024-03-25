import React, {useState, useEffect} from "react";
import ProgramsHierarchy from "@/shared/components/ProgramsHierarchy";
import {connect} from "react-redux";

import {Button, Col, Row} from "reactstrap";
import DatePicker from "react-datepicker";
import {CSVLink} from "react-csv";
import {dateStrToYmd, getFirstDay} from "@/shared/helpers";
import {clone, isEqual} from "lodash";
import Select from 'react-select'
import MultipleSelectField from '@/shared/components/form/MultipleSelectField'
import MerchantsHierarchy from '@/shared/components/MerchantsHierarchy'

const defaultFrom = getFirstDay();
const defaultTo = new Date();

export const OrdersFilter = ({ config, filter, setFilter, setUseFilter, download, exportData, exportLink, exportHeaders, loading}) => {

    const orderStatuses = [
      {'label': 'All', 'value': 0},
      {'label': 'Success', 'value': 1},
      {'label': 'Error', 'value': 2},
    ];
    const inventoryTypes = [
      {'label': 'All Codes', 'value': 0},
      {'label': 'Real Codes', 'value': 1},
      {'label': 'Virtual Codes', 'value': 2},
    ];
    const purchasesByV2 = [
      {'label': 'V2', 'value': 2},
      {'label': 'V3', 'value': 1},
      {'label': 'All', 'value': 0}
    ];

    const defaultFilters = {
      keyword: '',
      from: defaultFrom,
      to: defaultTo,
      orderStatus: 0,
      purchaseByV2: 0,
      inventoryType: 0,
      merchants: [],
    }

    const finalFilter = {...defaultFilters, ...filter}
    let finalFilterPrograms = clone(filter.programs)

    const defaultConfig = {
      label: '',
      keyword: true,
      dateRange: true,
      merchants: true,
      orderStatus: true,
      purchaseByV2: true,
      inventoryType: true,
    }

    const options = {...defaultConfig, ...config}

    // console.log(options)

    const [keyword, setKeyword] = React.useState(finalFilter.keyword)
    const [from, setFrom] = React.useState(finalFilter.from)
    const [to, setTo] = React.useState(finalFilter.to)
    const [inventoryType, setInventoryTypes] = React.useState(finalFilter.inventoryType)
    const [purchaseByV2, setPurchaseByV2] = React.useState(finalFilter.purchaseByV2)
    const [orderStatus, setOrderStatuses] = React.useState(finalFilter.orderStatus)
    const [awardLevels, setAwardLevels] = React.useState(finalFilter.awardLevels);
    const [selectedPrograms, setSelectedPrograms] = useState(filter.programs ? filter.programs : []);
    const [selectedMerchants, setSelectedMerchants] = useState([]);

    useEffect(() => {
      setSelectedPrograms(filter.merchants ? filter.merchants : []);
    }, [filter.merchants]);

    const onKeywordChange = (e) => {
      setKeyword(e.target.value)
    }
    const onStartChange = (value) => {
      setFrom(value)
    }
    const onEndChange = (value) => {
      setTo(value)
    }
    const onInventoryTypesChange = (e) => {
      setInventoryTypes(e.value)
    }
    const onPurchasesByV2Change = (e) => {
      setPurchaseByV2(e.value)
    }
    const onOrderStatusesChange = (e) => {
      setOrderStatuses(e.value)
    }
    const onClickFilter = (reset = false, exportToCsv = 0) => {
      let dataSet = {};

      if (options.keyword) {
        dataSet.keyword = reset ? '' : keyword;
      }

      if (options.dateRange) {
        dataSet.from = dateStrToYmd(reset ? defaultFrom : from);
        dataSet.to = dateStrToYmd(reset ? defaultTo : to);
      } else if (options.date) {
        dataSet.from = dateStrToYmd(reset ? defaultFrom : from);
      }

      if (options.type) {
        dataSet.type = options.type;
      }
      if (options.inventoryType) {
        dataSet.inventoryType = inventoryType;
      }
      if (options.purchaseByV2) {
        dataSet.purchaseByV2 = purchaseByV2;
      }
      if (options.orderStatus) {
        dataSet.orderStatus = orderStatus;
      }
      if (options.programs) {
        dataSet.programs = reset ? [] : clone(selectedPrograms);
      }
      if (options.merchants) {
        dataSet.merchants = reset ? [] : clone(selectedMerchants);
      }
      if (options.awardLevels) {
        dataSet.awardLevels = reset ? [] : clone(awardLevels);
      }

      onClickFilterCallback(dataSet);

      if (reset) {
        setKeyword('');
        setFrom(defaultFrom);
        setTo(defaultTo);
        setSelectedPrograms([]);
        setSelectedMerchants([]);
        setAwardLevels([]);
      }
    };
    const awardLevelAll = () => {
      let all = options.awardLevels.map(award => award.value);
      if (isEqual(awardLevels, all)) {
        setAwardLevels([]);
      } else {
        setAwardLevels(all);
      }
    };

    const onClickFilterCallback = (values) => {
      let change = false;

      if (options.keyword) {
        if (finalFilter.keyword !== values.keyword) {
          change = true
        }
      }

      if (options.programs) {
        if (!isEqual(finalFilterPrograms, values.programs)) {
          finalFilterPrograms = clone(values.programs);
          change = true
        }
      }

      if (options.merchants) {
        if (!isEqual(finalFilter.merchants, values.merchants)) {
          change = true
        }
      }

      if (options.awardLevels) {
        if (!isEqual(finalFilter.awardLevels, values.awardLevels)) {
          change = true
        }
      }

      if (options.dateRange) {
        if (finalFilter.from !== values.from || finalFilter.to !== values.to) {
          change = true
        }
      }

      if (options.date) {
        if (finalFilter.from !== values.from) {
          change = true
        }
      }

      if (options.inventoryType) {
        if (finalFilter.inventoryType !== values.inventoryType) {
          change = true
        }
      }

      if (options.purchaseByV2) {
        if (finalFilter.purchaseByV2 !== values.purchaseByV2) {
          change = true
        }
      }

      if (options.orderStatus) {
        if (finalFilter.orderStatus !== values.orderStatus) {
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
      if (options.date) {
        filters.from = values.from
      }
      if (options.type) {
        filters.type = values.type
      }
      if (options.inventoryType) {
        filters.inventoryType = values.inventoryType
      }
      if (options.purchaseByV2) {
        filters.purchaseByV2 = values.purchaseByV2
      }
      if (options.orderStatus) {
        filters.orderStatus = values.orderStatus
      }

      setFilter(filters)
      setUseFilter(true)
    }
    return (
        <Row className="table-filter-form form">
          <Col md={10} lg={10} sm={10} className="table-filter-form-fields">
            <div>
              {options.awardLevels &&
                  <div className="table-filter-form-col table-filter-form-col1 float-filter" style={{paddingTop: 4}}>
                    <div className="">
                              <span className="form__form-group-label" onClick={awardLevelAll}
                                    style={{cursor: 'pointer'}}
                              >View for Award Level</span>
                      <div className="form__form-group-field">
                        <div className="form__form-group-row">
                          <MultipleSelectField
                              name="view_for_award_level"
                              options={options.awardLevels}
                              type="native"
                              setValue={setAwardLevels}
                              fieldValue={awardLevels}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
              }
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

              {options.date &&
                  <>
                    <div className="table-filter-form-col table-filter-form-col2 float-filter">
                      <div className="form__form-group">
                        <span className="form__form-group-label">Through&nbsp;Date</span>
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
                  </>
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
              {options.keyword &&
                  <>
                    <div className="table-filter-form-col table-filter-form-col2 float-filter">
                      <div className="form__form-group">
                        <span className="form__form-group-label">Search</span>
                        <div className="form__form-group-field">
                          <div className="form__form-group-row">
                            <input
                                value={keyword}
                                onChange={onKeywordChange}
                                type="text"
                                placeholder={`Search ${options.label}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
              }
              {options.inventoryType &&
                  <>
                    <div className="table-filter-form-col table-filter-form-col2 float-filter">
                      <div className="form__form-group">
                        <span className="form__form-group-label">Type</span>
                        <div className="form__form-group-field">
                          <div className="form__form-group-row">
                            <Select
                                options={inventoryTypes}
                                clearable={false}
                                className="react-select"
                                classNamePrefix="react-select"
                                onChange={onInventoryTypesChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
              }
              {options.orderStatus &&
                  <>
                    <div className="table-filter-form-col table-filter-form-col2 float-filter">
                      <div className="form__form-group">
                        <span className="form__form-group-label">Status</span>
                        <div className="form__form-group-field">
                          <div className="form__form-group-row">
                            <Select
                                options={orderStatuses}
                                clearable={false}
                                className="react-select"
                                classNamePrefix="react-select"
                                onChange={onOrderStatusesChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
              }
              {options.purchaseByV2 &&
                  <>
                    <div className="table-filter-form-col table-filter-form-col2 float-filter"
                         style={{whiteSpace: 'nowrap'}}>
                      <div className="form__form-group">
                        <span className="form__form-group-label">Redeemed By</span>
                        <div className="form__form-group-field">
                          <div className="form__form-group-row">
                            <Select
                                options={purchasesByV2}
                                clearable={false}
                                className="react-select"
                                classNamePrefix="react-select"
                                onChange={onPurchasesByV2Change}
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
                disabled={loading}
            >Filter</Button>
            <Button
                onClick={() => onClickFilter(true)}
                className="btn btn-sm btn-primary"
                color="#ffffff"
            >Reset</Button>
            {options.exportToCsv &&
                <>
            <span
                className="btn btn-sm btn-primary mr-2 text-white pointer"
                onClick={() => {
                  download(filter)
                }}
            >Export to CSV</span>
                  <CSVLink
                      data={exportData}
                      headers={exportHeaders}
                      filename="report.csv"
                      className="hidden"
                      ref={exportLink}
                      target="_blank"
                      disabled={loading}
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

export default connect(mapStateToProps)(OrdersFilter);
