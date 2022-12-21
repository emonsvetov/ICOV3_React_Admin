import React, {useState, useEffect} from "react";
import { Modal, ModalBody, Button, ButtonToolbar } from 'reactstrap';
import axios from 'axios'
import {renameChildrenToSubrows} from '@/shared/helpers'
import {useDispatch, sendFlashMessage} from "@/shared/components/flash";
import ProgramTreeView from "../../components/ProgramTreeView";
import {fetchProgramTreeForMoving} from "@/shared/apiHelper"

const MoveSubProgramModal = ({isOpen, setOpen, toggle, subprogram, organization, setTrigger}) => {
    const dispatch = useDispatch()
    const [formError, setFormError] = useState('');
    const [loading, setLoading] = useState(false);
    const [disableMove, setDisableMove] = useState(false);
    const [selected, setSelected] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [exclude, setExclude] = useState([]);
    let [data, setData] = useState(null);
    const [originalSelected, setOriginalSelected] = useState([]);

    useEffect( () => {
        // console.log("here")
        if( subprogram?.id )  {
            // console.log(organization)
            setSelected(subprogram.id)
            setOriginalSelected(subprogram.id)
            fetchProgramTreeForMoving(subprogram.organization_id, subprogram.id)
            .then( response => {
                setData(renameChildrenToSubrows([response.tree]));
                setExclude(response.exclude);
            })
        }
    }, [subprogram])

    const handleSelect = (event, nodeIds) => {
        // console.log(nodeIds)
        // console.log(exclude)
        setFormError('');
        setDisableMove(false);
        if( typeof exclude === 'object' && exclude.length > 0 && nodeIds)  {
            if(exclude.indexOf(nodeIds) !== -1)  {
                // alert("cannot move to this node");
                setDisableMove(true);
                setFormError('cannot select to this node');
                return;
            }
        }
        setSelected(nodeIds)
    };
    const onClickMoveConfrim = async() => {
        // console.log(`/organization/${subprogram.organization_id}/program/${subprogram.id}/move`);
        // return;
        setLoading(true)
        // alert(JSON.stringify({selected, programId}))
        // console.log(programId)
        // console.log(selected)
        // return;
        if( selected.length <=0 ) setFormError('Select a program to move to');
        else if( selected === subprogram.id )  setFormError('Select a different program to move to');
        else   {
            try {
                let formData = {
                    parent_id: selected === 'allprograms' ? null : selected
                }
                setLoading( true )
                // console.log(subprogram.id)
                // console.log(formData)
                // return
                const response = await axios.patch(`/organization/${subprogram.organization_id}/program/${subprogram.id}/move`, formData);
                // console.log(response)
                setLoading(false)
                if( response.status === 200)    {
                    setOpen(false)
                    dispatch(sendFlashMessage('SubProgram has been moved', 'alert-success', 'top'))
                    // let tmp = setTimeout(()=> window.location = window.location, 500)
                    setTrigger( Math.floor(Date.now() / 1000) )
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
    // console.log(subprogram)
    // console.log(selected)
    // console.log(originalSelected)
    if( !organization || !subprogram || !data ) return 'Loading...'

    // console.log(expanded)
    // console.log(data.results)
    // console.log(exclude)
    return (
        <Modal className="modal-program" isOpen={isOpen} toggle={toggle}>
            <h3 style={{"fontWeight": 500}}>Move Sub Program "{subprogram.name}" to</h3>
            <ModalBody style={{maxHeight:'600px', overflow:'scroll'}}>
                <ProgramTreeView data={data} handleSelect={handleSelect} selected={selected} rootNode={false} expandedList={expanded} />
                {formError && <span className="form__form-group-error">{formError}</span>}
            </ModalBody>
            <ButtonToolbar className="modal__footer flex justify-content-right">
                <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                <Button type="submit" disabled={selected===originalSelected || loading || disableMove} className="btn btn-primary" color="#ffffff" onClick={onClickMoveConfrim}>Confirm</Button>
            </ButtonToolbar>
        </Modal>
    )
}

export default MoveSubProgramModal