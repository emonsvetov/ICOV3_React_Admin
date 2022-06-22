import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';

import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar, Row, Col } from 'reactstrap';
import {fetchProgramFlatListAndDifference} from "@/shared/apiHelper"
import { Form, Field } from 'react-final-form';
import axios from 'axios'
import renderSelectField from '@/shared/components/form/Select';
import {labelizeNamedData} from '@/shared/helpers'
import {useDispatch, sendFlashMessage} from "@/shared/components/flash";
const AddSubProgramModal = ({organization, program, isOpen, setOpen, toggle, theme, rtl}) => {
    // console.log(program)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [subprogramList, setSubprogramList] = useState(null)
    const [inventory, setInventory] = useState(null)
    // const [subprogramList, setSubprogramList] = useState(null)
    // const [directAnscestor, setDirectAnscestor] = useState({label:'-- none --',value:program.id})
    const [initialValues, setInitialValues] = useState(null)
    
    const onSubmit = async(values) => {
        // console.log('submitting')
        // console.log(values)
        // return
        try {
            let formData = {
                parent_id: values.direct_anscestor.value
            }
            let program_to_add = values.sub_program.value
            setLoading( true )
            const response = await axios.patch(`/organization/${organization.id}/program/${program_to_add}/move`, formData);
            // console.log(response)
            setLoading(false)
            if( response.status === 200)    {
                dispatch(sendFlashMessage('Subprogram has been added', 'alert-success', 'top'))
                // let tmp = setTimeout(()=> window.location = '/program', 2000)
            }
        } catch (e) {
            setLoading(false)
            dispatch(sendFlashMessage('Subprogram could not be added', 'alert-danger', 'top'))
            throw new Error(`API error:${e?.message}`);
        }
    };
    useEffect( () => {
        if( organization && program )  {
            // console.log(organization)
            fetchProgramFlatListAndDifference(organization.id, program.id)
            .then( list => {
                // console.log(list)
                if( list?.available )   {
                    setInventory(labelizeNamedData(list.available));
                }
                if( list?.subprograms )   {
                    let subprograms = labelizeNamedData(list.subprograms);
                    for( var x in subprograms)  {
                        if(subprograms[x]['value'] == program.id)  {
                            subprograms[x]['label'] = '-- none --'
                            setInitialValues({direct_anscestor: subprograms[x]})
                            // console.log(subprograms[x])
                            // setDirectAnscestor(subprograms[x])
                        }
                    }
                    setSubprogramList(subprograms);
                }
            })
        }
    }, [organization, program])

    const validate = values => {
        console.log(values)
        let errors = {};
        if (!values.sub_program) {
            errors.sub_program = "Sub program is required";
        }
        if (!values.direct_anscestor) {
            errors.direct_anscestor = "Direct anscestor is required";
        }
        return errors;
    }

    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={() => setOpen(true)}>
        <Form 
        onSubmit={onSubmit}
        validate={(values) => validate(values)}
        initialValues={initialValues}
        >
        {({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="form form--horizontal" onSubmit={handleSubmit}>
            <ModalHeader className='w100'>
                <Row className='w100'>
                    <Col md="6" lg="6" xl="6">
                        <h3>Add a sub program</h3>
                    </Col>
                    <Col md="6" lg="6" xl="6" className='text-right'>
                        <ButtonToolbar className="modal__footer flex justify-content-right w100">
                            <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                            <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Add</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
            </ModalHeader>
            <ModalBody className="modal-lg">
               
              <Row>
                <Col md="6" >
                    <div className="form__form-group">
                        <span className="form__form-group-label">Select from the dropdown list to add as a subprogram :</span>
                        <div className="form__form-group-field">
                            <Field
                                name="sub_program"
                                component={renderSelectField}
                                options={inventory}
                            />
                        </div>
                    </div>
                </Col>
                <Col md="6" >
                    <div className="form__form-group">
                        <span className="form__form-group-label">Select from the dropdown list to add as a Direct Anscestor</span>
                        <div className="form__form-group-field">
                            <Field
                                name="direct_anscestor"
                                component={renderSelectField}
                                options={subprogramList}
                                // defaultValue={directAnscestor}
                            />
                        </div>
                    </div>
                </Col>
              </Row>
                
            </ModalBody>
            </form>
        )}
        </Form>
    </Modal>
    )
}
AddSubProgramModal.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired
};
  
export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl
}))(AddSubProgramModal));

