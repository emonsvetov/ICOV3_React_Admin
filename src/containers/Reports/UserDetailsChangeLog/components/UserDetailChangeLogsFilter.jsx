import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import { Button, Row } from "reactstrap";
import RenderDatePicker from "@/shared/components/form/DatePickerWithInitial";

const getFirstDay = () => {
  let date = new Date();
  return new Date(date.getFullYear(), 0, 1);
};

const UserDetailChangeLogsFilter = ({ onClickFilterCallback,setFilter,filter }) => {
  const [date, setDate] = useState({ from: getFirstDay(), to: new Date() });
  const [keyword,setKeyword] =useState("")
  const onClickFilter = (values) => {
    onClickFilterCallback(
      date.from.toISOString().slice(0, 10),
      date.to.toISOString().slice(0, 10),
      
    );
    setFilter({values})
  };

  const handleDateChange = (selected, type) => {
    let temp = date;
    temp[type] = selected;
    setDate(temp);
  };
  const handleChange = (field, selected) => {
    switch (field) {
      case "keyword":
        setKeyword(selected);
        break;
      default:
        console.log("default case...");
    }
  };

  return (
    <Form onSubmit={onClickFilter}>
      {({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="form" onSubmit={handleSubmit}>
          <Row>
            <div className="col-md-4">
              <Field
                name="keyword"
                parse={(value) => {
                  handleChange("keyword", value);
                  return value;
                }}
              >
                {({ input, meta }) => (
                  <div className="form__form-group">
                    <span className="form__form-group-label">Search</span>
                    <div className="form__form-group-field">
                      <div className="form__form-group-row">
                        <input type="text" {...input} placeholder="" />
                      </div>
                    </div>
                  </div>
                )}
              </Field>
            </div>
            <div className="col-md-4 px-0">
              <div className="form__form-group">
                <span className="form__form-group-label">From</span>
                <div className="form__form-group-field">
                  <Field
                    name="from"
                    dueDate={getFirstDay}
                    onChange={(e) => handleDateChange(e, "from")}
                    component={RenderDatePicker}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form__form-group">
                <span className="form__form-group-label">To</span>
                <div className="form__form-group-field">
                  <Field
                    name="to"
                    dueDate={new Date()}
                    onChange={(e) => handleDateChange(e, "to")}
                    component={RenderDatePicker}
                  />
                </div>
              </div>
            </div>
          </Row>
          <Row>
            <div className="col-md-5 d-flex align-items-end pl-1">
              <Button
                type="submit"
                onClick={() => {
                  form.change("action", "submit");
                }}
                disabled={submitting}
                className="btn btn-sm btn-primary"
                color="#ffffff"
              >
                Filter
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  form.change("action", "Reset");
                }}
                disabled={submitting}
                className="btn btn-sm btn-primary"
                color="#ffffff"
              >
                Reset
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  form.change("action", "export");
                }}
                disabled={submitting}
                className="btn btn-sm btn-primary"
                color="#ffffff"
              >
                Export CSV
              </Button>
            </div>
          </Row>
        </form>
      )}
    </Form>
  );
};

export default UserDetailChangeLogsFilter;
