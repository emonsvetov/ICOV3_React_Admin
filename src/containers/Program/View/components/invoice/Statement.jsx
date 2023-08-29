import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { Row, Col, Button } from 'reactstrap';
import StatementDataTable from './components/StatementDataTable';
import getStatement from '@/service/program/getStatement';
import "react-datepicker/dist/react-datepicker.css";
import {format} from "date-fns";

import {useDispatch, flashError} from '@/shared/components/flash'
import FileldDatePicker from '@/shared/components/form/DatePickerComponent'
import {getLastMonthRange} from '@/shared/helpers'
import Error from '@/shared/components/form/FieldError'

const StatementTab = (props) => {

  const dispatch =  useDispatch()

  const [filters, setFilters] = useState( getLastMonthRange() );
  const [loading, setLoading] = useState(false);
  const [statement, setStatement] = useState(null);

  const FilterComponent = (props) => {
    const onSubmit = async (values) => {
      values.start_date = format(new Date(values.start_date), "yyyy-MM-dd")
      values.end_date = format(new Date(values.end_date), "yyyy-MM-dd")
      setLoading(true)
      getStatement(props.program.organization_id, props.program.id, {
        params: values
      })
      .then(response => {
        // console.log(response)
        setStatement(response)
        setFilters(values)
        setLoading(false)
      })
      .catch(error => {
        flashError(dispatch, error.response.data)
        setLoading(false)
      })
    }
    const validate = values => {
      let errors = {};
      if (!values.start_date) {
        errors.start_date = 'Please select start date'
      }
      if (!values.end_date) {
        errors.end_date = 'Please select end date'
      }
      return errors
    }

    // console.log(filters)

    return (
      <Row>
        <Col md="12">
          <div className="modal__title">
            <h3 className="mb-4">Statement of Program</h3>
          </div>
        </Col>
        <Col sm="12">
          <Form
            onSubmit={onSubmit}
            validate={validate}
            initialValues={filters}
          >
            {({ handleSubmit, form, submitting, pristine, values }) => (
              <form className="form" onSubmit={handleSubmit}>
                <Row>
                  <Col sm="5">
                    <div className="form__form-group">
                      <span className="form__form-group-label">From</span>
                      <div className="form__form-group-field">
                        <div className="form__form-group-row">
                          <Field
                            name="start_date"
                            component={FileldDatePicker}
                            validate={(value) => (value ? undefined : "This field is required")}
                          />
                          <Error name="start_date" />
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col sm="5">
                    <div className="form__form-group">
                      <span className="form__form-group-label">To</span>
                      <div className="form__form-group-field">
                        <div className="form__form-group-row">
                          <Field
                            name="end_date"
                            component={FileldDatePicker}
                            validate={(value) => (value ? undefined : "This field is required")}
                          />
                          <Error name="end_date" />
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col sm="2">
                    <div className="form__form-group">
                      <span className="form__form-group-label d-block">&nbsp;</span>
                      <Button type="submit" disabled={submitting} className="btn btn-primary btn-sm" color="#ffffff">Submit</Button>
                    </div>
                  </Col>
                </Row>
              </form>
            )}
          </Form>
        </Col>
      </Row>
    )
  }

  props = { ...props, ...{ statement, loading } }

  return (
    <>
      <FilterComponent {...props} />
      <StatementDataTable {...props} />
    </>
  )
}

export default StatementTab