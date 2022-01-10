import React, {useState} from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import FolderPlusOutlineIcon from 'mdi-react/FolderPlusOutlineIcon';
import AddProgramForm from './AddProgramForm';

const AddProgram = () => {
  return(
  <Col md={12}>
    <Card>
      <CardBody style={{display:'flex'}}>
        <Col md={4}>
        </Col>
        <Col md={4}>
          <div className="pb-4">
            <div  className='text-center'><FolderPlusOutlineIcon size={34} color='#70bbfd' /></div>
            <h3 className="text-center text-blue font-22">Create a new program</h3>
          </div>
          <AddProgramForm />
        </Col>
        <Col md={4}>
        </Col>
      </CardBody>
    </Card>
  </Col>
)};

export default AddProgram;
