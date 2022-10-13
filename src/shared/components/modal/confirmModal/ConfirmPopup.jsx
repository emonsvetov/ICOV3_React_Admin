import React, {useState} from 'react';
import {
  Modal,
  Button,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';

const ConfirmPopup = ({message, action, isOpen, setOpen, toggle}) => {
  const createMarkup = (value) => {
    return {__html: value};
  }

  if (!message){
    message = 'Are you sure you want to delete this item? <br/> WARNING: This cannot be undone!'

  }

  return (
    <Modal className={`modal-2col modal-md`} isOpen={isOpen} toggle={() => setOpen(true)}>

      <Card className='w-100'>
        <CardHeader tag="h3">
          Confirm
          <Button className='btn btn-lg float-end' close onClick={toggle}/>
        </CardHeader>
        <CardBody>
          <div dangerouslySetInnerHTML={createMarkup(message)}/>
          <p>&nbsp;</p>
          <div className='d-flex justify-content-end'>
            <Button color='danger' type='submit' onClick={action}>Ok</Button>&nbsp;
            <Button color='danger' type='submit' onClick={toggle}>No</Button>
          </div>
        </CardBody>
      </Card>
    </Modal>
  )
}

export default ConfirmPopup;
