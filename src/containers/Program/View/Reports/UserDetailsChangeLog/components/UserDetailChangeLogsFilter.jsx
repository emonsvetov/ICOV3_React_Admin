import React from "react";
import { Button, Col, Row } from "reactstrap";
import DatePicker from "react-datepicker";
import { CSVLink } from "react-csv";
import { getFirstDay } from "@/shared/helpers";
import { dateStrToYmd } from "@/shared/helpers";
import { cloneDeep } from "lodash";

const defaultFrom = getFirstDay();
const defaultTo = new Date();

const UserDetailsChangeLogsFilter = ({
  filter,
  setFilter,
  setUseFilter,
  download,
  exportData,
  exportLink,
  exportHeaders,
}) => {
  const options = {
    dateRange: true,
    keyword: false,
    exportToCsv: true,
  };
  const [from, setFrom] = React.useState(defaultFrom);
  const [to, setTo] = React.useState(defaultTo);
  const finalFilter = { ...filter };
  let previous = cloneDeep(finalFilter);
  const [keyword, setKeyword] = React.useState("");

  const onKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const onClickFilter = (reset = false, exportToCsv = 0) => {
    let dataSet = {};
    if (options.dateRange) {
      dataSet.from = dateStrToYmd(reset ? defaultFrom : from);
      dataSet.to = dateStrToYmd(reset ? defaultTo : to);
    }
    if (options.keyword) {
      dataSet.keyword = filter.keyword;
    }

    onClickFilterCallback(dataSet);
    previous = dataSet;
    if (reset) {
      setFrom(defaultFrom);
      setTo(defaultTo);
      setKeyword("");
    }
  };

  const onClickFilterCallback = (values) => {
    let change = false;

    if (options.dateRange) {
      if (finalFilter.from !== values.from || finalFilter.to !== values.to) {
        change = true;
      }
    }
    if (options.keyword) {
      if (finalFilter.keyword !== values.keyword) {
        change = true;
      }
    }

    if (!change) {
      alert("No change in filters");
      setUseFilter(false);
      return;
    }

    let filters = {};
    if (options.keyword) filters.keyword = values.keyword;

    if (options.dateRange) {
      filters.from = values.from;
      filters.to = values.to;
    }
    filters.programs = filter.programs
    setFilter(filters);
    setUseFilter(true);
  };

  const onStartChange = (value) => {
    setFrom(value);
  };
  const onEndChange = (value) => {
    setTo(value);
  };

  return (
    <Row className="table-filter-form form">
      <Col md={8} lg={8} sm={8} className="table-filter-form-fields">
        <div>
          {options.keyword && (
            <div className="table-filter-form-col table-filter-form-col1">
              <div className="form__form-group">
                <span className="form__form-group-label">Search</span>
                <div className="form__form-group-field">
                  <div className="form__form-group-row">
                    <input
                      value={keyword}
                      onChange={onKeywordChange}
                      type="text"
                      placeholder="Search"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {options.dateRange && (
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
          )}
          <div className="clearfix">&nbsp;</div>
          <div className="clearfix">&nbsp;</div>
        </div>
      </Col>
      <Col className="align-items-center max-height-32px pl-1">
        <Button
          onClick={() => onClickFilter()}
          className="btn btn-sm btn-primary"
          color="#ffffff"
        >
          Filter
        </Button>
        <Button
          onClick={() => onClickFilter(true)}
          className="btn btn-sm btn-primary"
          color="#ffffff"
        >
          Reset
        </Button>
        {options.exportToCsv && (
          <div>
            <span
              className="text-blue pointer mr-2"
              onClick={() => {
                download(filter);
              }}
            >
              Export to CSV
            </span>
            <CSVLink
              data={exportData}
              headers={exportHeaders}
              filename="report.csv"
              className="hidden"
              ref={exportLink}
              target="_blank"
            />
          </div>
        )}
      </Col>
    </Row>
  );
};

export default UserDetailsChangeLogsFilter;
