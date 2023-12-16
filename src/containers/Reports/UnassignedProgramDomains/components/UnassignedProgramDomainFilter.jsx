import React, { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { Button, Row } from 'reactstrap';

const UnassignedProgramDomainFilter = ({ onClickFilterCallback }) => {
    const [keyword, setKeyword] = useState('');
    const [rootProgramName, setRootProgramName] = useState('');

    const onKeywordChange = (event) => {
        setKeyword(event.target.value);
    };

    const onRootProgramNameChange = (event) => {
        setRootProgramName(event.target.value);
    };

    const onClickFilter = () => {
        onClickFilterCallback({ keyword, rootProgramName });
    };

    return (
        <Form onSubmit={onClickFilter}>
            {({ handleSubmit, form, submitting }) => (
                <form className="form" onSubmit={handleSubmit}>
                    <Row>
                        {/* Program Name Field */}
                        <div className="col-md-3">
                            <Field name="participant">
                                {({ input, meta }) => (
                                    <div className="form__form-group">
                                        <span className="form__form-group-label">Program Name:</span>
                                        <div className="form__form-group-field">
                                            <input type="text" {...input} placeholder="" onChange={onKeywordChange} />
                                        </div>
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div className="col-md-6 d-flex align-items-end pl-5">
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="btn btn-sm btn-primary"
                            >Filter</Button>
                        </div>
                    </Row>
                </form>
            )}
        </Form>
    );
};

export default UnassignedProgramDomainFilter;
