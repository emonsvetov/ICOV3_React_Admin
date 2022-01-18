import React, { useState, useEffect } from 'react';
import {
  Nav, NavItem, NavLink, TabContent, TabPane, Col, Row, ButtonToolbar, Button, 
} from 'reactstrap';
import classnames from 'classnames';

import showResults from '@/utils/showResults';
import DropFiles from './DropFiles';
import axios from 'axios';
import { object } from 'prop-types';
require('dotenv').config()

const Tabs = (props) => {
  
  const [error, setError] = useState(false);
  
  const [activeTab, setActiveTab] = useState(props.activeTab);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const [icons, setIcons ] = useState([]);
  const [activePath, setActivePath ] = useState("");
  const [activeId, setActiveId ] = useState(null);

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  
  const set_path = (name )=> {
      let path;
      if(name.path.includes('uploads')){
        path = process.env.REACT_APP_API_STORAGE_URL + "/app/public" + name.path;
      }
      else{
        path = process.env.REACT_APP_API_STORAGE_URL + "/app/public" + name.path;
      }
    
    return path;
  }

  useEffect(() => {
    fetchIcons()
  },[])

  const fetchIcons = async() => {
    try {
        const response = await axios.get(`/event_icons`);
        setIcons(response.data)
    } catch (e) {
        //throw new Error(`API error:${e?.message}`);
    }
  };

  const selectItem = (path, id )=> {
    setActivePath(path );
    setActiveId(id );
  }

  const setItem = ()=> {
  }

  function handleUpload(values){

      
    let data = new FormData();
    
    if(!values.files){
        return
    }
        
    values.files.forEach(element => {
        data.append('icon[]', element)    
    });
    
    axios
    .post(`/organization/1/event_icons`, data,{
            headers: {
                "Content-type": "multipart/form-data",
            },       
          }
    )
    .then((res) => {
    
      if (res.status == 200) {
        values.files.forEach(element => {
            setIcons([...icons, {path:element.name}])
        });
      }
    })
    .catch((error) => {
      setError(error.response.data.errors);
      setLoading(false);
    });  
  } 
  

  async function handleSubmit (files){
    handleUpload(files);
    await sleep(800);
    toggle('2');

  }
  return (
    <div className="tabs__wrap">
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => toggle('1')}
          >
            Upload Files
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => toggle('2')}
          >
            Library
          </NavLink>
        </NavItem>
        
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
            <DropFiles onSubmit={handleSubmit} />
        </TabPane>
        <TabPane tabId="2">
            <Col md={12} lg={12}>
              <Row className='w100'>
                  <Col md="12" lg="12" xl="12">
                      <ul class="img_wrap">
                      {
                        icons.map(function(data, key){
                          return <li key={key} onClick={(e)=> {selectItem(data.path, data.id )}} className={activePath === data.path ? 'active' : ''}>
                              <div className='preview'>
                                <i class="fa fa-check"></i>
                                <img src={set_path(data)} alt="icons" />
                              </div>
                            </li>
                        })
                      }
                    </ul>

                  </Col>
                  <Col md="12" lg="12" xl="12" className='text-right'>
                      <ButtonToolbar className="modal__footer flex justify-content-right w100">
                      <Button outline color="primary" className="mr-3" onClick={ props.onCancel }> Cancel </Button>{' '}
                      <Button color="primary" className="mr-3" onClick = {()=> props.onOK( activePath, activeId ) } > OK </Button>{' '}
                      </ButtonToolbar>
                  </Col>
              </Row>
            </Col>
        </TabPane>
        
      </TabContent>
    </div>
  );
};

export default Tabs;
