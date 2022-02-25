import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { Row, Col, ButtonToolbar, Button, Modal, ModalBody } from "reactstrap";
import { useParams } from "react-router-dom";

// import renderRadioButtonField from '@/shared/components/form/RadioButton';
import formValidation from "@/shared/validation/createInvoice";

import renderSelectField from '@/shared/components/form/Select'
import axios from "axios";


const CreateInvoiceForm = (props) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [program, setProgram] = useState(null);
  const [programList, setProgramList] = useState(null);


  const [isOpen, setOpen] = useState(false);

  const handleChangeProgram = (selected) => {
    setProgram(selected.value);
  };
  
  
  const programId = useParams();


  useEffect( () => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async() =>{
    try {
        const response = await axios.get(
        `/organization/1/program?minimal=true`
        );
        // console.log(response)
        const results = response.data;
        let processed = results.map((item) => ({"label": item.name, "value": item.id}));
        
        setProgramList(processed);
    } catch (e) {
        throw new Error(`API error:${e?.message}`)
    }
  }

  const onSubmit = (values) => {
    let invoiceData = {};
    return;
    
    axios
      .post(`/organization/1/program/${programId.id}/event`, invoiceData)
      .then((res) => {
        //   console.log(res)
        if (res.status == 200) {
          props.onStep(0);
          // window.location = `/program/view/${programId}`;
        }
      })
      .catch((error) => {
        //console.log(error.response.data);
        setError(error.response.data.errors);
        setLoading(false);
      });
  };

  const onClickCancel = () => {
    props.onStep(0);
  };

//   const templatePlaceholder = template ? template : "Select a Template";

  return (
    <>
      <Form
        onSubmit={onSubmit}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={{}}
      >
        {({ handleSubmit, form, submitting, pristine, values }) => (
          <form className="form" onSubmit={handleSubmit}>
            {error && (
              <div
                className="alert alert-danger fade show w100 mb-4"
                role="alert"
              >
                <div className="alert__content">{error}</div>
              </div>
            )}
            <Row className="w100">
              <Col md="6" lg="6" xl="6">
                <div className="react-table__wrapper">
                    <div className="card__title">
                        <h3 className="mb-4">Create Invoice </h3>
                        
                    </div>
                </div>
                        
                
              </Col>
              <Col md="6" lg="6" xl="6" className="text-right">
                <ButtonToolbar className="modal__footer flex justify-content-right w100">
                  <Button
                    outline
                    color="primary"
                    className="mr-3"
                    onClick={onClickCancel}
                  >
                    Cancel
                  </Button>{" "}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    color="#ffffff"
                  >
                    Save
                  </Button>
                </ButtonToolbar>
              </Col>
            </Row>
            <Row>
              <Col md="6" lg="6" xl="6">
                <div className="form__form-group ml-5">
                  <span className="form__form-group-label">
                    Program
                  </span>
                </div>
              </Col>
              <Col md="6" lg="6" xl="6">
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                        <Field 
                              name="program"
                              options={programList}
                              placeholder={"select program"}
                              component={renderSelectField}
                              parse={value => {
                                handleChangeProgram(value)
                                  return value;
                              }}
                          />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
            <Col md="6" lg="6" xl="6">
                <div className="form__form-group ml-5">
                  <span className="form__form-group-label">
                  Amount
                  </span>
                </div>
              </Col>
              <Col md="6" lg="6" xl="6">
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                        <Field name="amount">
                            {({ input, meta }) => (
                                
                                <>
                                <input
                                    type="text"
                                    {...input}
                                    placeholder="Amount"
                                />
                                {meta.touched && meta.error && (
                                    <span className="form__form-group-error">
                                    {meta.error}
                                    </span>
                                )}
                                </>
                            )}
                        </Field>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
            <Col md="6" lg="6" xl="6">
                <div className="form__form-group ml-5">
                  <span className="form__form-group-label">
                  Confirm Amount
                  </span>
                </div>
              </Col>
              <Col md="6" lg="6" xl="6">
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                        <Field name="amount_confirm">
                            {({ input, meta }) => (
                                
                                <>
                                <input
                                    type="text"
                                    {...input}
                                    placeholder="Confirm Amount"
                                />
                                {meta.touched && meta.error && (
                                    <span className="form__form-group-error">
                                    {meta.error}
                                    </span>
                                )}
                                </>
                            )}
                        </Field>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

          </form>
        )}
      </Form>
    </>
  );
};

export default CreateInvoiceForm;
