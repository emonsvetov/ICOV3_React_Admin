import React, { useState } from "react";
import { Row,Col} from "reactstrap";

import axios from "axios";
import Tabs from "./Tabs";

const AddIconForm = ( props ) => {
  
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState('2');
  
  function handlePickImage(values){
    props.onStep(1)
    // if(values.files)
    //   props.setIcon(values.files[0].name)  
  }

  const onClickCancel = () => {
    props.onStep(1)
  };

  const onClickOK = () => {
    props.onStep(1)
  };
  function handleUpload(values){
      
    let data = new FormData();
    if(!values.files){
      return;
    }
    values.files.forEach(element => {
        data.append('icons[]', element, element.name)    
    });

    axios
    .post(`/event_icon`, data,{
            headers: {
                "Content-type": "multipart/form-data",
            },       
          }
    )
    .then((res) => {
    
      if (res.status == 200) {
        alert('success')
      }
    })
    .catch((error) => {
      setError(error.response.data.errors);
      
    });  
  } 
  
  return (
    
        <Col md={12} lg={12}>
            <Row className='w100'>
                <Col md="6" lg="6" xl="6">
                    <h3>Insert Icon</h3>
                </Col>
                
            </Row>
            
          <div className="pt-5 tabs">
              <Tabs onSubmit={handleUpload} onOK = {handlePickImage} activeTab = {activeTab} onCancel = {onClickCancel}/>
          </div>
         
        </Col>
      
  );
};
export default AddIconForm;
