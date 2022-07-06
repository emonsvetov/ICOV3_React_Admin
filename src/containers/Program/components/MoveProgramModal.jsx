import React, {useState, useEffect} from "react";
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar } from 'reactstrap';
import ProgramTreeView from "./ProgramTreeView";
import axios from 'axios'
import {renameChildrenToSubrows} from '@/shared/helpers'
import {useDispatch, sendFlashMessage} from "@/shared/components/flash";


const fetchProgramData = async (organization) => {
    try {
        const response = await axios.get(
        `/organization/${organization.id}/program?sortby=name`
        );
        // console.log(response)
        if( response.data.length === 0) return {results:[],count:0}
        const data = {
            results: renameChildrenToSubrows(response.data.data),
            count: response.data.total
        };
        return data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

const MoveProgramModal = ({isOpen, setOpen, toggle, program, organization}) => {
    const dispatch = useDispatch()
    const [formError, setFormError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    let [data, setData] = useState(null);
    const [originalSelected, setOriginalSelected] = useState([]);

    useEffect( () => {
        setSelected(program.id)
        setOriginalSelected(program.id)
        // console.log(data)
        if( !data || (typeof data == 'object' && data.length === 0) ) {
            console.log('fetching programs...')
            fetchProgramData(organization)
            .then( response => {
                console.log(response)
                setData(response)
            })
        }
    }, [program, fetchProgramData, data])

    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds)
    };
    const onClickMoveConfrim = async() => {
        setLoading(true)
        // alert(JSON.stringify({selected, programId}))
        // console.log(programId)
        // console.log(selected)
        // return;
        if( selected.length <=0 ) setFormError('Select a program to move to');
        else if( selected === program.id )  setFormError('Select a different program to move to');
        else   {
            try {
                let formData = {
                    parent_id: selected === 'allprograms' ? null : selected
                }
                setLoading( true )
                const response = await axios.patch(`/organization/${organization.id}/program/${program.id}/move`, formData);
                // console.log(response)
                setLoading(false)
                if( response.status === 200)    {
                    dispatch(sendFlashMessage('Program has been moved', 'alert-success', 'top'))
                    let tmp = setTimeout(()=> window.location = '/program', 500)
                }
            } catch (e) {
                setLoading(false)
                dispatch(sendFlashMessage('Program could not be moved', 'alert-danger', 'top'))
                throw new Error(`API error:${e?.message}`);
            }
        }
        setLoading(false)
    };
    // console.log(data)
    // data = renameChildrenToSubrows(data)
    // console.log(data)
    // console.log(selected)
    // console.log(originalSelected)
    if( !data ) return 'Loading...'
    // console.log(data)
    // console.log(data.results)
    return (
        <Modal className="modal-program" isOpen={isOpen} toggle={() => setOpen(true)}>
            <ModalHeader>
                <h3 style={{"fontWeight": 500}}>Move Program to</h3>
            </ModalHeader>
            <ModalBody style={{maxHeight:'600px', overflow:'scroll'}}>
                <ProgramTreeView data={data?.results} handleSelect={handleSelect} selected={selected} />
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