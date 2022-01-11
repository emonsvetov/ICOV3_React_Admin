import React, {useState, useEffect} from "react";
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar } from 'reactstrap';
import ProgramTreeView from "./ProgramTreeView";
import axios from 'axios'
import {renameChildrenToSubrows} from '@/shared/helpers'
import {useDispatch, sendModalFlashMessage, ModalFlashMessage} from "@/shared/components/flash"


const fetchProgramData = async () => {
    try {
        const response = await axios.get(
        `/organization/1/program?minimal=true&sortby=name`
        );
        // console.log(response)
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

const MoveProgramModal = ({isOpen, setOpen, toggle, programId}) => {
    const dispatch = useDispatch()
    const [formError, setFormError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    let [data, setData] = useState([]);
    const [originalSelected, setOriginalSelected] = useState([]);

    useEffect( () => {
        setSelected(programId)
        setOriginalSelected(programId)
        if( data.length === 0 ) {
            console.log('fetching programs...')
            fetchProgramData()
            .then( response => {
                setData(response)
            })
        }
    }, [programId, fetchProgramData])

    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds)
    };
    const onClickMoveConfrim = async() => {
        
        setLoading(true)
        // alert(JSON.stringify({selected, programId}))
        // console.log(programId)
        // console.log(selected)
        if( selected.length <=0 ) setFormError('Select a program to move to');
        else if( selected === programId )  setFormError('Select a different program to move to');
        else   {
            try {
                let formData = {
                    program_id: selected
                }
                setLoading( true )
                const response = await axios.patch(`/organization/1/program/${programId}`, formData);
                console.log(response)
                setLoading(false)
                if( response.status === 200)    {
                    dispatch(sendModalFlashMessage('Program has been moved', 'alert-success'))
                }
            } catch (e) {
                setLoading(false)
                dispatch(sendModalFlashMessage('Program could not be moved', 'alert-danger'))
                throw new Error(`API error:${e?.message}`);
            }
        }
        setLoading(false)
    };
    // console.log(data)
    data = renameChildrenToSubrows(data)
    // console.log(data)
    // console.log(selected)
    // console.log(originalSelected)
    return (
        <Modal className="modal-program" isOpen={isOpen} toggle={() => setOpen(true)}>
            <ModalFlashMessage />
            <ModalHeader>
                <h3 style={{"fontWeight": 500}}>Move Program to</h3>
            </ModalHeader>
            <ModalBody style={{maxHeight:'600px', overflow:'scroll'}}>
                <ProgramTreeView data={data} handleSelect={handleSelect} selected={selected} />
                {formError && <span className="form__form-group-error">{formError}</span>}
            </ModalBody>
            <ButtonToolbar className="modal__footer flex justify-content-right">
                <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                <Button type="submit" disabled={selected===originalSelected || loading} className="btn btn-primary" color="#ffffff" onClick={onClickMoveConfrim}>Confirm</Button>
            </ButtonToolbar>
        </Modal>
    )
}

export default MoveProgramModal