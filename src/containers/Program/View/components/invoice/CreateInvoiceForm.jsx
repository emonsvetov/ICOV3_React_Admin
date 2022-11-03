import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { Row, Col, ButtonToolbar, Button, Modal, ModalBody } from "reactstrap";
import { useParams } from "react-router-dom";
import {labelizeRecursive} from '@/shared/helpers'
import {useDispatch, sendFlashMessage, ApiErrorMessage} from "@/shared/components/flash"
// import renderRadioButtonField from '@/shared/components/form/RadioButton';
import formValidation from "@/shared/validation/createInvoice";


import renderSelectField from '@/shared/components/form/Select'
import axios from "axios";

export const BuildProgramOptions = ({programs, depth = 0}) => {
  let optionsHtml = []
  if( programs.length > 0) {
      programs.map( p => {
          optionsHtml.push(<option key={`program-option-${p.id}`} value={`${p.id}`}>{'-'.repeat(depth)} {p.name}</option>)
          if( p?.children && p.children.length > 0)   {
              depth++;
              optionsHtml.push(<BuildProgramOptions key={`program-option-group-${p.id}`} programs={p.children} depth={depth} />)
          }
      })
  }
  return optionsHtml
}

const CreateInvoiceForm = (props) => {
  const dispatch = useDispatch()
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [program, setProgram] = useState(null);
  const [programList, setProgramList] = useState(null);

  const handleChangeProgram = (selected) => {
    setProgram(selected.value);
  };
  
  // console.log(props)

  const programId = useParams();


  useEffect( () => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async() =>{
    try {
        const response = await axios.get(
        `/organization/${props.program.organization_id}/program/${props.program.id}/descendents?includeSelf=1`
        );
        // console.log(response)
        const results = response.data;
        setProgramList(labelizeRecursive(results));
    } catch (e) {
        throw new Error(`API error:${e?.message}`)
    }
  }

  const onSubmit = (values) => {
    // console.log(values)
    const programId = values.program.value;
    let invoiceData = {
      amount: values.amount,
      amount_confirmation: values.amount_confirmation,
    };
    console.log(invoiceData)
    // return;
    
    axios
      .post(`/organization/${props.organization.id}/program/${programId}/invoice/on-demand`, invoiceData)
      .then((res) => {
          console.log(res)
        if (res.status == 200) {
          props.setStep(0);
          dispatch(sendFlashMessage('Invoice saved successfully', 'alert-success', 'top'))
          // window.location = `/program/view/${programId}`;
          props.setTrigger( Math.floor(Date.now() / 1000) )
        }
      })
      .catch((error) => {
        // console.log(error.response.data);
        dispatch(sendFlashMessage(<ApiErrorMessage errors={error.response.data} />, 'alert-danger', 'top'))
        setLoading(false)
      });
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
                  <div className="modal__title">
                      <h3 className="mb-4">Create Invoice </h3>
                  </div>
              </Col>
              <Col md="6" lg="6" xl="6" className="text-right">
                <ButtonToolbar className="modal__footer flex justify-content-right w100">
                  <Button
                    outline
                    color="primary"
                    className="mr-3"
                    onClick={()=>props.setStep(0)}
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
                        <Field name="amount_confirmation">
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
