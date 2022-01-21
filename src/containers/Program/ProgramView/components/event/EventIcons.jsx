import React, { useEffect } from 'react';
import {
  Col, Row, ButtonToolbar, Button, 
} from 'reactstrap';
import axios from 'axios';
import {ORGANIZATION_ID} from '../../../../App/auth';
import TrashIcon from 'mdi-react/TrashOutlineIcon';

const fetchIcons = async() => {
    try {
        const response = await axios.get(`/organization/${ORGANIZATION_ID}/event_icons`);
        return response.data
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

const deleteIcon = async(icon) => {
    // alert( JSON.stringify( icon) )
    try {
        return await axios.delete(`/organization/${ORGANIZATION_ID}/event_icons/${icon.id}`);
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
}

const EventIcons = ({icon, setIcon, onCancel, onSelectIconOK, icons, setIcons, activePath, activeId}) => {
    useEffect(() => {
        fetchIcons()
        .then( response => {
            setIcons(response)
        })
      },[])

    const onClickDeleteIcon = (icon) => {
        deleteIcon( icon )
        .then( response => {
            console.log(response.status)
            if( response.status === 200)    {
                fetchIcons()
                .then( response => {
                    setIcons(response)
                })
            }
        })
    }

    const selectItem = ( icon )=> {
        setIcon( icon )
    }
    return(
    <Col md={12} lg={12}>
       <Row className='w100'>
            <Col md="12" lg="12" xl="12">
                <ul class="img_wrap">
                    {
                    icons.map(function(item, key){
                        return <li key={key} onClick={ (e)=> selectItem( item  ) } className={icon?.id === item.id ? 'active' : ''}>
                            <div className='preview'>
                                <i class="fa fa-check"></i>
                                <img src={`${process.env.REACT_APP_API_STORAGE_URL}/${item.path}`} title={item.name} />
                                <div className="mt-2 delete-icon-icon" onClick={(e) => {if(window.confirm('Are you sure to delete this icon?')){onClickDeleteIcon(item)}}}><TrashIcon color='#bdbdbd' /></div>
                            </div>
                        </li>
                    })
                    }
                </ul>
            </Col>
            <Col md="12" lg="12" xl="12" className='text-right'>
                <ButtonToolbar className="modal__footer flex justify-content-right w100">
                <Button outline color="primary" className="mr-3" onClick={ onCancel }> Cancel </Button>{' '}
                <Button color="primary" className="mr-3" onClick = {()=> onSelectIconOK( icon ) } > OK </Button>{' '}
                </ButtonToolbar>
            </Col>
        </Row>
    </Col>
    )
}

export default EventIcons