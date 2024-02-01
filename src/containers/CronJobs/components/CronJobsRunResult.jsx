import React from 'react';
import {Button, Card, CardBody, Col, Modal,} from 'reactstrap';
import CloseButton from "@/shared/components/CloseButton";

const CronJobsRunResult = ({isOpen, setOpen, toggle, output}) => {

  return (
    <Modal className={`modal-lg modal-md p-0`} isOpen={isOpen} toggle={toggle}>
      <CloseButton onClick={toggle} />
      <Card className='w-100'>
        <CardBody className='text-left'>
          <div className='w100'>
            <Col md="12" lg="12" xl="12">
              <div className="card__title">
                <h5 className="colorgrey">Result</h5>
              </div>
            </Col>
          </div>
          <div className='w100'>
            <Col md="12" lg="12" xl="12">
              <div className='mt-3'>
                <div className={'mb-3'}>{ output }</div>
                <Button color='primary' type='submit' onClick={toggle}>Ok</Button>
              </div>
            </Col>
          </div>
        </CardBody>
      </Card>
    </Modal>
  )
}

export default CronJobsRunResult;
