import React, {useState} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, ButtonToolbar, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios'


const InsertIconModal = ({isOpen, theme, rtl}) => {
  
    const [activeTab, setActiveTab] = useState(props.activeTab);
  
    const [icons, setIcons ] = useState([]);
    const [activePath, setActivePath ] = useState("");
    const [activeId, setActiveId ] = useState(null);
  
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const toggle = (tab) => {
      if (activeTab !== tab) setActiveTab(tab);
    };
  
    useEffect(() => {
      fetchIcons()
    },[])
  
    const fetchIcons = async() => {
      try {
          const response = await axios.get(`/organization/${ORGANIZATION_ID}/event_icons`);
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
      .post(`/organization/${organization.id}/event_icons`, data,{
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
        <Col md={12} lg={12}>
            <Row className="w100">
              <Col md="6" lg="6" xl="6">
                  <h3>Insert Iconx</h3>
              </Col>
            </Row>
            <div className="pt-5 tabs">
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
                                    <ul className="img_wrap">
                                    {
                                        icons.map(function(data, key){
                                        return <li key={key} onClick={(e)=> {selectItem(data.path, data.id )}} className={activePath === data.path ? 'active' : ''}>
                                            <div className='preview'>
                                                <i className="fa fa-check"></i>
                                                <img src={`${process.env.REACT_APP_API_STORAGE_URL}/${data.path}`} title={data.name} />
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
            </div>
        </Col>
    )
}

InsertIconModal.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired
};
  
export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl
}))(InsertIconModal));