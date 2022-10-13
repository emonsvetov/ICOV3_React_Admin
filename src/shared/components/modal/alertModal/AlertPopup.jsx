import React from 'react';
import {
  Modal,
  Button,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';

const AlertPopup = ({title, message, action, isOpen, setOpen, toggle}) => {

  const createMarkup = (value) => {
    return {__html: value};
  }

  if( !title )  {
    title = 'Alert'
  }

  if (!message){
    message = 'This alert means that something isn\'t right!! <br/> (Presse OK to close this alert)'
  }

  return (
    <Modal className={`modal-md modal-alert`} isOpen={isOpen} toggle={() => setOpen(true)}>

      <Card className='w-100'>
        <CardHeader tag="h3">
          {title}
          <Button className='btn btn-lg float-end' close onClick={toggle}/>
        </CardHeader>
        <CardBody>
          <div dangerouslySetInnerHTML={createMarkup(message)}/>
          <p>&nbsp;</p>
          <div className='d-flex justify-content-end'>
            <Button color='danger' type='submit' onClick={toggle}>OK</Button>
          </div>
        </CardBody>
      </Card>
    </Modal>
  )
}

export default AlertPopup;
