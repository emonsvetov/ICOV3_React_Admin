import React, {useState} from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import FolderPlusOutlineIcon from 'mdi-react/FolderPlusOutlineIcon';
import AddProgramForm from './AddProgramForm';
import axios from 'axios';

const AddProgram = () => {

  // useEffect(() => {
  //   alert("Here")
  // });

  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmitAddProgram = values => {
    // alert(values);
    // console.log(values);
    values = {...values, ...{setup_fee:100, is_add_default_merchants:1}} //Todo
    // console.log(values)
    setLoading(true)
    axios.post('/organization/1/program', values)
    .then( (res) => {
      // console.log(res)
      // console.log(res.status == 200)
      if(res.status == 200)  {
        // var t = setTimeout(window.location = '/', 500)
        window.location = '/program?message=New program added successfully!'
      }
    })
    .catch( error => {
      console.log(error.response.data);
      setErrors(error.response.data);
      setLoading(false)
    })
  }

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
          <AddProgramForm onSubmit={onSubmitAddProgram} loading={loading} errors={errors} />
        </Col>
        <Col md={4}>
        </Col>
      </CardBody>
    </Card>
  </Col>
)};

export default AddProgram;
