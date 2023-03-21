import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
    Modal,
    Button,
    Card,
    CardHeader,
    CardBody,
} from 'reactstrap';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import { Form } from 'react-final-form';
import axios from "axios";
import {useDispatch, flashSuccess, flashError} from "@/shared/components/flash"
import FieldUserStatus from './FieldUserStatus'

const ChangeStatusModal = ({ organization, isOpen, setOpen, toggle, theme, rtl, user, setTrigger }) => {
    const dispatch = useDispatch()

    const onSubmitChangeStatus = values => {
        // console.log(values)
        // return;
        // setLoading(true)
        axios.patch(`/organization/${organization.id}/user/${user.id}/status`, values)
        .then( (res) => {
            if(res.status == 200)  {
                setTrigger( Math.floor(Date.now() / 1000) )
                flashSuccess(dispatch, "User Status updated successfully!")
                toggle()
            }
        })
        .catch( error => {
            console.log(error.response.data);
            flashError(dispatch, error.response.data)
        })
    }

    const validate = values => {
        return true;
    }
    
    return (
        <Modal className={`modal-action modal-md ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={toggle}>
            <Card className='w-100'>
                <CardHeader tag="h3">
                    Change Status
                    <Button className='btn float-end' close onClick={toggle} />
                </CardHeader>
                <CardBody>
                    <Form
                        onSubmit={onSubmitChangeStatus}
                        validate={validate}
                        initialValues={{
                            user_status_id: String(user.status.id)
                        }}
                    >
                        {({ handleSubmit, form, submitting, pristine, values }) => (
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="form__form-group label-mb-0">
                                    <FieldUserStatus />
                                </div>
                                <div className='d-flex justify-content-end'>
                                    <Button className='btn-sm mr-2' color='outline-primary' onClick={toggle}>Cancel</Button><Button className='btn-sm' color='primary' type='submit'>Submit</Button>
                                </div>
                            </form>
                        )}
                    </Form>
                </CardBody>
            </Card>
        </Modal>
    )
}

ChangeStatusModal.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired
};

export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
    organization: state.organization
}))(ChangeStatusModal));