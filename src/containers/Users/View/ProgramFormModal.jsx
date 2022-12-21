import React, {useState} from 'react';
import { Modal, ModalBody, Button, ButtonToolbar } from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import { Form } from 'react-final-form';
import { FieldArray } from "react-final-form-arrays"
import arrayMutators from "final-form-arrays"
import CheckboxGroup from "@/shared/components/form/CheckboxGroup"

const ProgramFormModal = ({program, roles, programRoles, isOpen, setOpen, toggle, theme, rtl, cbAddProgram}) => {
    // console.log(programRoles)
    // var [roles, setRoles] = useState(roles)
    return (
    <Modal className={`modal-program model-content-center modal-md ${theme.className} ${rtl.direction}-support`} isOpen={isOpen}
           toggle={toggle}>
        <ModalBody className='modal-md'>
            <Form
                onSubmit={cbAddProgram}
                validate={validate}
                initialValues={{
                    roles: programRoles
                }}
                mutators={{
                    ...arrayMutators
                }}
            >
            {({ handleSubmit, form, submitting, pristine, values }) => (
            <form className="form flex-column align-items-center" onSubmit={handleSubmit}>
                <div className="modal__header text-center">
                    <button
                        className="lnr lnr-cross modal__close-btn"
                        aria-label="modal__close-btn"
                        type="button"
                        onClick={toggle}
                    />
                    <span className="lnr lnr-lock modal__title-icon" />
                    <h4 className="text-modal  modal__title mb-0 text-bold">Assign User Role to Program</h4>
                    <p className='mb-2'>"{program.name}"</p>
                </div>
                <div className="modal__body">
                    <div className="form__form-group">
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <FieldArray
                                    name="roles"
                                    component={CheckboxGroup}
                                    options={roles}
                                />
                            </div>
                        </div>
                    </div>
                    {/* <FieldArray name="roles">
                    {({ fields, meta }) => {
                        // console.log(meta)
                        return (
                            <>
                                <CheckboxGroup fields={fields} options={roles}  />
                                {meta.invalid && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </>
                        )
                    }}
                    </FieldArray> */}
                    {/* {values?.roles.length <= 0 && <span className="form__form-group-error">Please select roles</span>} */}
                </div>
                <ButtonToolbar className="modal__footer">
                    <Button className="modal_cancel" outline onClick={toggle}>Cancel</Button>{' '}
                    <Button type="submit" disabled={submitting || pristine} className="modal_ok" color="primary">Ok</Button>
                </ButtonToolbar>
            </form>
            )}
            </Form>
        </ModalBody>
    </Modal>
    )
}

const validate = values => {
    let errors = []
    if( !values.roles || values.roles.length <= 0 )
        errors.roles = "Roles are required" 
    return errors
}

ProgramFormModal.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired
};
  
export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl
}))(ProgramFormModal));