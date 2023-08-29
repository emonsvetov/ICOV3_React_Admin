import React, {useState} from 'react';
import { Form, Field } from 'react-final-form';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
// import renderRadioButtonField from '@/shared/components/form/RadioButton';
import formValidation from "@/shared/validation/example/example";
import WYSIWYGEditor from './components/WYSIWYGEditor'

const ExampleForm = () => {

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const onSubmit = values => {
        alert(JSON.stringify(values))
    }

    const handleEditorChange = (e) => {
        console.log('Content was updated:', e.target.getContent());
    }    

    return (
    <Form
        onSubmit={onSubmit}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={{

        }}
    >
    {({ handleSubmit, form, submitting, pristine, values }) => (
    <form className="form" onSubmit={handleSubmit}>
        {error && 
            <div className="alert alert-danger fade show w100 mb-4" role="alert">
                <div className="alert__content">{error}</div>
            </div>
        }
        <Row>
            <Col md="12">
                <Field name="name">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Merchant Name</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Merchant Name" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>
                <Field
                    name="example_textarea"
                    component={WYSIWYGEditor}
                />
            </Col>
        </Row>
        <Row>
        <Col md="12">
        <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button type="submit" disabled={loading || pristine} className="btn btn-primary" color="#ffffff">Save</Button>
                </ButtonToolbar></Col>
        </Row>
    </form>
    )}
  </Form>
)}

export default ExampleForm;
