import React, {useEffect, useState} from 'react';
import { Form, Field } from 'react-final-form';
import {Row, Col, Card, CardTitle, Button} from 'reactstrap';
import StatementDataTable from './components/StatementDataTable';
import getStatement from '@/service/program/getStatement';
// import renderSelectField from '@/shared/components/form/Select';
// import {useDispatch, sendFlashMessage} from "@/shared/components/flash";

import axios from 'axios'


const StatementTab = (props) => {

    let dt = new Date()
    const offset = dt.getTimezoneOffset()
    let end_date = new Date(dt.getTime() - (offset*60*1000))
    end_date =  end_date.toISOString().split('T')[0]

    dt.setMonth(dt.getMonth() - 1)
    let start_date = new Date(dt.getTime() - (offset*60*1000))
    start_date =  start_date.toISOString().split('T')[0]

    const [filters, setFilters] = useState( {start_date, end_date} );
    const [loading, setLoading] = useState( false );
    const [statement, setStatement] = useState( null );

    const FilterComponent = (props) => {
        const onSubmit = async(values) => {
            setLoading(true)
            getStatement(props.program.organization_id, props.program.id, {
                params: values
            })
            .then( response => {
                // console.log(response)
                setStatement(response)
                setFilters(values)
                setLoading(false)
            })
            .catch( error => {
                console.log(error);
                setLoading(false)
            })
        }
        const validate = values => {
            let errors = {};
            if( !values.start_date ) {
                errors.start_date = 'Please select start date'
            }
            if( !values.end_date ) {
                errors.end_date = 'Please select end date'
            }
            return errors
        }
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
                                    <Field name="start_date">
                                        {({ input, meta }) => (
                                            <div className="form__form-group">
                                                <span className="form__form-group-label">From</span>
                                                <div className="form__form-group-field">
                                                    <div className="form__form-group-row">
                                                        <input type="date" {...input} placeholder="yyyy-mm-dd" />
                                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Field>
                                </Col>
                                <Col sm="5">
                                    <Field name="end_date">
                                        {({ input, meta }) => (
                                            <div className="form__form-group">
                                                <span className="form__form-group-label">To</span>
                                                <div className="form__form-group-field">
                                                    <div className="form__form-group-row">
                                                        <input type="date" {...input} placeholder="yyyy-mm-dd" />
                                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Field>
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

    props = {...props, ...{statement, loading}}

    return (
        <>
            <FilterComponent {...props}/>
            <StatementDataTable {...props}/>
        </>
    )
}

export default StatementTab