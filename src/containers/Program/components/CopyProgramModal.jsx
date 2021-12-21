import React, {useState} from 'react'
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar } from 'reactstrap';
// import axios from 'axios';
import { Form, Field } from 'react-final-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '../../../shared/prop-types/ReducerProps';
import renderCheckBoxField from '@/shared/components/form/CheckBox';

const CopyProgramModal = ({isOpen, setOpen, toggle, programId, theme, rtl}) => {
    const [loading, setLoading] = useState(false)
    const onSubmitCopyForm = () => {
        setLoading(true)
        setTimeout(alert('Allset'), 2000)
        setLoading(false)
    }
    const validate = values => {
        let errors = {};
        if (!values.name) {
            errors.name = "Program name is required";
        }
        return errors;
    }
    return (
    <Modal className={`modal-program ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={() => setOpen(true)}>
        <ModalHeader>
            <h3 style={{"font-weight": 500}}>Copy Program</h3>
        </ModalHeader>
        <ModalBody>
            <Form
                onSubmit={onSubmitCopyForm}
                validate={validate}
                initialValues={{
                    // program_type: "Employee"
                }}
            >
            {({ handleSubmit, form, submitting, pristine, values }) => (
                <form className="form" onSubmit={handleSubmit}>
                    <Field name="name">
                    {({ input, meta }) => (
                        <div className="form__form-group">
                            <span className="form__form-group-label">Program name</span>
                            <div className="form__form-group-field">
                                <div className="form__form-group-row">
                                    <input type="text" {...input} placeholder="Program name" />
                                    {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                </div>
                            </div>
                        </div>
                    )}
                    </Field>

                    <Field
                        name="create_as_sub"
                        type="checkbox"
                        component={renderCheckBoxField}
                        label="Create as subprogram under “[program 1]”"
                        // initialValue={item.defaultChecked}
                        // disabled={item.disabled}
                        // className={className}
                    />
                    
                    <ButtonToolbar className="modal__footer flex justify-content-right w100">
                        <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                        <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Confirm</Button>
                    </ButtonToolbar>
                    <input type="hidden" name='source_program_id' value={programId} />
                </form>
            )}
            </Form>
        </ModalBody>
    </Modal>
    )
}

CopyProgramModal.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired
};
  
export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl
}))(CopyProgramModal));

// export default CopyProgramModal