import React from 'react';
import {
  Modal,
  Button,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';

const TransferMoniesConfirm = ({programs, amounts, action, isOpen, setOpen, toggle}) => {

  const getProgramName = (key) => {
    const programId = key.replace("amounts_", "")
    return programs.map( program => {
      if(program.id == programId) {
        return program.name
      }
    })
  }

  const RenderProgramAmounts = () => {
    let html = []
    for (const [key, amount] of Object.entries(amounts)) {
      if( amount !== "" ) {
        if( !isNaN(amount) ) {
          html.push(
            <li><strong>${parseFloat(amount).toFixed(2)}</strong> to <strong>{getProgramName(key)}</strong></li>
          )
        }
      }
    }
    return html
  }

  if( !programs || !amounts) return ''

  return (
    <Modal className={`modal-2col modal-md p-0`} isOpen={isOpen} toggle={() => setOpen(true)}>
      <Card className='w-100'>
        <CardHeader tag="h3">
          Confirm
          <Button className='btn btn-lg float-end' close onClick={toggle}/>
        </CardHeader>
        <CardBody className='text-left'>
          <p>Are you sure you to transfer?</p>
          <RenderProgramAmounts />
          <div className='d-flex justify-content-end mt-3'>
            <Button color='primary' type='submit' onClick={action}>Ok</Button>&nbsp;
            <Button color='danger' type='submit' onClick={toggle}>No</Button>
          </div>
        </CardBody>
      </Card>
    </Modal>
  )
}

export default TransferMoniesConfirm;
