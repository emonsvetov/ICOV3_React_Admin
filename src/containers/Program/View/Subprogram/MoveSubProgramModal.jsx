import React, {useState, useEffect} from "react";
import { Modal, ModalBody, ModalHeader, Button, ButtonToolbar } from 'reactstrap';
import axios from 'axios'
import {renameChildrenToSubrows} from '@/shared/helpers'
import {useDispatch, sendFlashMessage} from "@/shared/components/flash";
import ProgramTreeView from "../../components/ProgramTreeView";
import {fetchProgramTreeForMoving} from "@/shared/apiHelper"
import {labelizeNamedData} from '@/shared/helpers'

// const fetchProgramData = async (organization) => {
//     try {
//         const response = await axios.get(
//         `/organization/${organization.id}/program?sortby=name`
//         );
//         // console.log(response)
//         if( response.data.length === 0) return {results:[],count:0}
//         const data = {
//             results: renameChildrenToSubrows(response.data.data),
//             count: response.data.total
//         };
//         return data;
//     } catch (e) {
//         throw new Error(`API error:${e?.message}`);
//     }
// };

const MoveSubProgramModal = ({isOpen, setOpen, toggle, subprogram, organization}) => {
    const dispatch = useDispatch()
    const [formError, setFormError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const [exclude, setExclude] = useState([]);
    let [data, setData] = useState(null);
    const [originalSelected, setOriginalSelected] = useState([]);

    useEffect( () => {
        // console.log("here")
        if( organization && subprogram )  {
            // console.log(organization)
            setSelected(subprogram.id)
            setOriginalSelected(subprogram.id)
            fetchProgramTreeForMoving(organization.id, subprogram.id)
            .then( response => {
                // console.log(response.tree)
                // console.log(renameChildrenToSubrows([response.tree]))
                // console.log(renameChildrenToSubrows(response.tree))
                setData(renameChildrenToSubrows([response.tree]));
                setExclude(response.exclude);
            })
        }
    }, [organization, subprogram])

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
        else if( selected === subprogram.id )  setFormError('Select a different program to move to');
        else   {
            try {
                let formData = {
                    program_id: selected === 'allprograms' ? null : selected
                }
                setLoading( true )
                const response = await axios.patch(`/organization/${organization.id}/program/${subprogram.id}/move`, formData);
                // console.log(response)
                setLoading(false)
                if( response.status === 200)    {
                    dispatch(sendFlashMessage('Program has been moved', 'alert-success', 'top'))
                    let tmp = setTimeout(()=> window.location = '/program', 2000)
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
    // console.log(data)
    // console.log(data.results)
    // console.log(exclude)
    return (
        <Modal className="modal-program" isOpen={isOpen} toggle={() => setOpen(true)}>
            <h3 style={{"fontWeight": 500}}>Move Sub Program to</h3>
            <ModalBody style={{maxHeight:'600px', overflow:'scroll'}}>
                <ProgramTreeView data={data} handleSelect={handleSelect} selected={selected} rootNode={false} exclude={exclude} />
                {formError && <span className="form__form-group-error">{formError}</span>}
            </ModalBody>
            <ButtonToolbar className="modal__footer flex justify-content-right">
                <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                <Button type="submit" disabled={selected===originalSelected || loading} className="btn btn-primary" color="#ffffff" onClick={onClickMoveConfrim}>Confirm</Button>
            </ButtonToolbar>
        </Modal>
    )
}

export default MoveSubProgramModal