import React from 'react';
import {Button, Card, CardBody, Col, Modal,} from 'reactstrap';
import CloseButton from "@/shared/components/CloseButton";

const CronJobsRunConfirm = ({action, isOpen, setOpen, toggle}) => {

  return (
    <Modal className={`modal-small modal-md p-0`} isOpen={isOpen} toggle={toggle}>
      <CloseButton onClick={toggle} />
      <Card className='w-100'>
        <CardBody className='text-center'>
          <div className='w100'>
            <Col md="12" lg="12" xl="12">
              <div className="card__title">
                <h5 className="colorgrey">Are you sure to run?</h5>
              </div>
            </Col>
          </div>
          <div className='w100'>
            <Col md="12" lg="12" xl="12">
              <div className='mt-3'>
                <Button color='primary' type='submit' onClick={action}>Yes</Button>&nbsp;&nbsp;&nbsp;
                <Button color='danger' type='submit' onClick={toggle}>No</Button>
              </div>
            </Col>
          </div>
        </CardBody>
      </Card>
    </Modal>
  )
}

export default CronJobsRunConfirm;
