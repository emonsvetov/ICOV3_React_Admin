import React, { useEffect, useState } from 'react';
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
import { Form, Field } from 'react-final-form';
import axios from "axios";
import renderRadioButtonField from '@/shared/components/form/RadioButton';
import getProgramStatuses from '@/service/program/getProgramStatusList';
import {useDispatch, flashSuccess, flashError} from "@/shared/components/flash"

const ChangeStatusModal = ({ organization, isOpen, setOpen, toggle, theme, rtl, program, setTrigger }) => {
    const dispatch = useDispatch()
    const [statuses, setStatuses] = useState([])
    useEffect(() => {
        if (organization?.id) {
            getProgramStatuses(organization.id)
                .then(statuses => {
                    // console.log(statuses)
                    setStatuses(statuses)
                })
        }
    }, [organization])

    const onSubmitChangeStatus = values => {
        // console.log(values)
        // return;
        // setLoading(true)
        axios.patch(`/organization/${organization.id}/program/${program.id}/status`, values)
        .then( (res) => {
            if(res.status == 200)  {
                setTrigger( Math.floor(Date.now() / 1000) )
                flashSuccess(dispatch, "Program Status updated successfully!")
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

    const RenderStatusList = () => {
        return statuses.map( (status) => 
            <Field
                name="program_status_id"
                component={renderRadioButtonField}
                label={status.status}
                radioValue={String(status.id)}
                key={`program-status-item-${status.id}`}
            />
        )
    }

    // console.log(program)

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
                            program_status_id: String(program.status.id)
                        }}
                    >
                        {({ handleSubmit, form, submitting, pristine, values }) => (
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="form__form-group label-mb-0">
                                    <span className="form__form-group-label">User status</span>
                                    {statuses && <RenderStatusList />}
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