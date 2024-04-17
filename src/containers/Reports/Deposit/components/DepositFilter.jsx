import React, { useState, useEffect } from "react";
import { Field, Form } from "react-final-form";
import { Button, Row, Col } from "reactstrap";
import DatePicker from "react-datepicker";
import renderSelectField from "@/shared/components/form/Select";
import axios from "axios";
import {CSVLink} from "react-csv";
import { getFirstDay, dateStrToYmd } from "@/shared/helpers";
import { isEqual, clone, cloneDeep } from "lodash";
import Select from "react-select";

const defaultFrom = getFirstDay();
const defaultTo = new Date();

const DepositFilter = ({
  filter,
  setFilter,
  setUseFilter,
  download,
  exportData,
  exportLink,
  exportHeaders,
  programOptions,
  programs
}) => {
  const options = {
    dateRange: true,
    exportToCsv: true,
    programId: true,
    selectedPrograms: true,
    invoiceNumber: true,
  };
  const [from, setFrom] = React.useState(defaultFrom);
  const [to, setTo] = React.useState(defaultTo);
  const [programId, setProgramId] = useState();
  const [selectedPrograms, setSelectedPrograms] = useState(programs);
  const [invoiceNumber, setInvoiceNumber] = useState();
  const finalFilter = { ...filter };
  let previous = cloneDeep(finalFilter);

  const onClickFilter = (reset = false, exportToCsv = 0) => {
    let dataSet = {};
    if (options.dateRange) {
      dataSet.from = dateStrToYmd(reset ? defaultFrom : from);
      dataSet.to = dateStrToYmd(reset ? defaultTo : to);
    }
    
    if (options.programId && programId) {
      dataSet.programId = programId;
    }

    if (options.selectedPrograms && selectedPrograms) {
      dataSet.selectedPrograms = selectedPrograms;
    }

    if (options.invoiceNumber && invoiceNumber) {
      dataSet.invoiceNumber = invoiceNumber;
    }

    onClickFilterCallback(dataSet);
    previous = dataSet;
    if (reset) {
      setFrom(defaultFrom);
      setTo(defaultTo);
      setProgramId(null);
      setSelectedPrograms(programs)
      setInvoiceNumber("");
    }
  };

  const onClickFilterCallback = (values) => {
    let change = false;

    if (options.programId) {
      if (!isEqual(values.programId, previous.programId)) {
        change = true;
      }
    }

    if (options.selectedPrograms) {
      if (!isEqual(values.selectedPrograms, previous.selectedPrograms)) {
        change = true;
      }
    }

    if (options.dateRange) {
      if (finalFilter.from !== values.from || finalFilter.to !== values.to) {
        change = true;
      }
    }

    if (options.invoiceNumber) {
      if (!isEqual(values.invoiceNumber, previous.invoiceNumber)) {
        change = true;
      }
    }

    if (!change) {
      alert("No change in filters");
      setUseFilter(false);
      return;
    }

    let filters = {};
    if (options.dateRange) {
      filters.from = values.from;
      filters.to = values.to;
    }
    if (options.programId && programId) {
      filters.programId = programId;
    } else if (options.selectedPrograms && selectedPrograms) {
      filters.programs = selectedPrograms;
    }
    if (options.invoiceNumber && invoiceNumber) {
      filters.invoiceNumber = values.invoiceNumber;
    }
    console.log(filters)
    setFilter(filters);
    setUseFilter(true)
  };

  const onStartChange = (value) => {
    setFrom(value);
  };
  const onEndChange = (value) => {
    setTo(value);
  };

  const handleChangeProgram = (value) => {
    setProgramId(null)
    setSelectedPrograms([value.value])
  }  
  
  const handleChangeProgramId = (value) => {
    setProgramId(value)
    setSelectedPrograms(null)
  }
  
  const handleChangeInvoiceNumber = (value) => {
    setInvoiceNumber(value)
  }

  return (
    <Form onSubmit={onClickFilter} initialValues={{}}>
      {({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="form" onSubmit={handleSubmit}>
          <Row>
            <div className="col-md-4 px-0">
              <div className="form__form-group">
                <span className="form__form-group-label">From</span>
                <div className="form__form-group-field">
                  <DatePicker
                    dateFormat="MM/dd/yyyy"
                    selected={from}
                    onChange={onStartChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form__form-group">
                <span className="form__form-group-label">To</span>
                <div className="form__form-group-field">
                  <DatePicker
                    dateFormat="MM/dd/yyyy"
                    selected={to}
                    onChange={onEndChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <Field
                name="invoice_number"
                parse={(value) => {
                  handleChangeInvoiceNumber(value);
                  return value;
                }}
              >
                {({ input, meta }) => (
                  <div className="form__form-group">
                    <span className="form__form-group-label">
                      Invoice Number
                    </span>
                    <div className="form__form-group-field">
                      <div className="form__form-group-row">
                        <input type="text" {...input} placeholder="" />
                      </div>
                    </div>
                  </div>
                )}
              </Field>
            </div>
          </Row>
          <Row>
            <div className="col-md-4">
              <div className="form__form-group">
                <span className="form__form-group-label">Program Name</span>
                <div className="form__form-group-field">
                  <div className="form__form-group-row">
                    <Select
                      name="program"
                      onChange={handleChangeProgram}
                      options={programOptions}
                      clearable={false}
                      className="react-select"
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <Field
                name="program_id"
                parse={(value) => {
                  handleChangeProgramId(value);
                  return value;
                }}
              >
                {({ input, meta }) => (
                  <div className="form__form-group">
                    <span className="form__form-group-label">Program ID</span>
                    <div className="form__form-group-field">
                      <div className="form__form-group-row">
                        <input type="text" {...input} placeholder="" />
                      </div>
                    </div>
                  </div>
                )}
              </Field>
            </div>

            <div className="col-md-4 d-flex align-items-end pl-1">
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
            </div>
          </Row>
        </form>
      )}
    </Form>
  );
};

export default DepositFilter;
