import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody, Row, Col, ButtonToolbar, Button, Card, CardBody, Container
} from "reactstrap";
import CloseCircleIcon from "mdi-react/CloseCircleIcon";
import CheckCircleIcon from "mdi-react/CheckCircleIcon";
import { getEventLedgerCodes, createEventLedgerCode, updateEventLedgerCode, deleteEventLedgerCode } from '@/shared/apiHelper'

const LedgerCodes = ({ program,  cb_CodeAction}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => {
    setIsOpen( !isOpen )
  }

  return (
  <div className="ledgercode__wrap">
    <div className="ledgercode__link-group align-right">
      <span className="link" onClick={toggle}>Toggle Manage Ledger Codes</span>
      {isOpen && <LedgerCodesBlock program={program} cb_CodeAction={cb_CodeAction} />}
    </div>
  </div>
  )
}

// Single Ledger Code Rendering

const RenderLedgerCode = ({lcd, program, onDeleteCb, cb_CodeAction}) => {
  const [value, setValue] = useState(lcd.ledger_code)
  const [editMode, setEditMode] = useState(false)
  const save = () => {
    // console.log(value)
    // console.log(lcd)
    if( value.trim() && value.trim() !== lcd.ledger_code)  {
      const data = {...lcd, ...{ledger_code: value}}
      updateEventLedgerCode(program.organization_id, program.id, lcd.id, data)
      .then( res => {
        console.log(res)
        setEditMode(false)
        cb_CodeAction()
      })
    }
  }

  const deleteLedgerCode = (id) => {
    if( !window.confirm("Are you sure to delete this ledger code?") ) return;
    deleteEventLedgerCode(program.organization_id, program.id, id)
    .then( res=> {
      console.log(res)
      onDeleteCb(id)
    })
  }
  const onChange = (e) => {
    setValue( prev => e.target.value);
  }
  return (
    <div className="ledgercode__item">
      <Row className="pr-0">
        <Col>
            {!editMode && <div className="ledgercode__item-text" onClick={() => setEditMode(true)}>{value}</div>}
            {editMode && <div className="ledgercode__item-input d-flex">
              <input type="text" value={value} onChange={onChange} />
              {(value.trim() !== lcd.ledger_code && value.trim() !== "") && 
                <CheckCircleIcon color="green" size={21} onClick={save} />
              }
            </div>}
        </Col>
        <Col className="px-0">
          <div className="ledgercode__item-action"><CloseCircleIcon color="red" size={18} onClick={() => deleteLedgerCode(lcd.id) } /></div>
        </Col>
      </Row>
    </div>
  )
}

// Add Ledger Code

const AddLedgerCode = ({program, onCreateCb, cb_CodeAction}) => {
  const [value, setValue] = useState('')

  const addLedgerCode = () => {
    if( value.trim() !== "")  {
      createEventLedgerCode(program.organization_id, program.id, {ledger_code: value})
      .then( res => {
        onCreateCb()
      })
    }
  }
  const onChange = (e) => {
    setValue( prev => e.target.value);
  }
  return (<div><div className="form__form-group ledgercode__form-group">
    <div className="form__form-group-field">
      <div className="form__form-group-row d-flex">
        <input type="text" value={value} onChange={onChange} />
        <span onClick={addLedgerCode} className="btn btn-primary btn-xs" disabled={ !value.trim() }>Add</span>
      </div>
    </div>
  </div></div>)
}

// Main code block

const LedgerCodesBlock = ({program, cb_CodeAction}) => {
  const [loading, setLoading] = useState(false);
  const [add, setAdd] = useState(false);
  const [ledgerCodes, setLedgerCodes] = useState([]);

  const toggleAdd = () => {
    setAdd( !add )
  }
  
  const onCreateCb = () => {
    loadLedgerCodes()
    cb_CodeAction()
  }

  const onDeleteCb = () => {
    loadLedgerCodes()
    cb_CodeAction()
  }

  const loadLedgerCodes = () => {
    setLoading(true)
    getEventLedgerCodes(program.organization_id, program.id)
    .then(ledgercodes => {
      setLoading(false)
      setLedgerCodes(ledgercodes)
    })
  }

  useEffect(() => {
    if( program?.id ){
      loadLedgerCodes()
    }
  }, [program])
  if( loading ) return (
    <div>Loading...</div>
  )

  if ( !ledgerCodes.length > 0 ) return(<div>No ledger code...</div>)

  return (
    <Card>
        <CardBody className='pt-0 px-0'>
          <div className="ledgercode__list pt-2">
            {ledgerCodes.map( lcd => <RenderLedgerCode onDeleteCb={onDeleteCb} key={`${program}-${lcd.id}`} program={program} lcd={lcd} cb_CodeAction={cb_CodeAction} />)}
            <div className="ledgercode__add-btn pt-2">
              <span className="link" onClick={toggleAdd}>Toggle Add Ledger Code</span>
              {add && <AddLedgerCode program={program} onCreateCb={onCreateCb} cb_CodeAction={cb_CodeAction} />}
            </div>
          </div>
      </CardBody>
    </Card>
  )

}

export default LedgerCodes