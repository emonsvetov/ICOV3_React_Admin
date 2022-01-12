import React, {useState} from 'react'
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar } from 'reactstrap';
// import axios from 'axios';
import { Form, Field } from 'react-final-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '../../../shared/prop-types/ReducerProps';
import renderCheckBoxField from '@/shared/components/form/CheckBox';
import axios from 'axios'

const CopyProgramModal = ({isOpen, setOpen, toggle, program, theme, rtl}) => {
    const [loading, setLoading] = useState(false)
    const [sourceProgram, setSourceProgram] = useState(program)
    const [programId, setProgramId] = useState(program.id)
    const onSubmitCopyForm = values => {
        setLoading(true)
        if( typeof values.create_as_sub !== 'undefined' && values.create_as_sub )   {
            sourceProgram.program_id = programId
        }
        delete sourceProgram.id
        sourceProgram.name = values.name
        // alert(values.create_as_sub)
        // alert(JSON.stringify(sourceProgram))
        axios.post('/organization/1/program', sourceProgram)
        .then( (res) => {
            if(res.status == 200)  {
                window.location = '/program?message=Program copied successfully!'
            }
        })
        .catch( error => {
            console.log(error.response.data);
            setLoading(false)
        })
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
                    name: program.name
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
                        label={`Create as subprogram under "${program.name}"`}
                        // initialValue={item.defaultChecked}
                        // disabled={item.disabled}
                        // className={className}
                    />
                    
                    <ButtonToolbar className="modal__footer flex justify-content-right w100">
                        <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                        <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Confirm</Button>
                    </ButtonToolbar>
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