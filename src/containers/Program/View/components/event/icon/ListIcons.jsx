import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {Col, Row, ButtonToolbar, Button,} from 'reactstrap';
import axios from 'axios';
import TrashIcon from 'mdi-react/TrashOutlineIcon';

import { fetchEventIcons } from '@/shared/apiHelper';
import getEventIconsDefault from '@/service/getEventIconsDefault';

const ListIcons = ({ icon, setIcon, onCancel, onSelectIconOK, defaultIcons, setDefaultIcons, icons, setIcons, program, setActiveTab, setIconUploadType }) => {

  const onclickGotoUploadIcon = (uploadTo = 'global') => {
    setIconUploadType(uploadTo)
    setActiveTab("1")
  }

  useEffect(() => {
    if (program?.organization_id) {
      fetchEventIcons(program.organization_id)
      .then(response => {
        setIcons(response)
      })
      getEventIconsDefault(program.organization_id)
      .then(response => {
        console.log(response)
        setDefaultIcons(response)
      })
    }

  }, [program])

  const deleteIcon = async (icon) => {
    try {
      return await axios.delete(`/organization/${program.organization_id}/event_icons/${icon.id}`);
    } catch (e) {
      throw new Error(`API error:${e?.message}`);
    }
  }

  const onClickDeleteIcon = (item) => {
    // console.log(icon)
    // console.log(item)
    // return
    deleteIcon(item)
      .then(response => {
        if( icon.id === item.id)  { //if currently selected icon deleted
          setIcon(null) //reset state 
        }
        // console.log(response.status)
        if (response.status === 200) {
          fetchEventIcons(program.organization_id)
            .then(response => {
              setIcons(response)
            })
        }
      })
  }

  const selectItem = (icon) => {
    setIcon(icon)
  }
  return (
    <Col md={12} lg={12}>
      <Row className='w100'>
        <h3>Choose from</h3>
        <Col md="12" className='mt-3 py-3'>
          <h4 className='title'>1. Global Library</h4>
          <ul className="img_wrap mt-2">
            {
              defaultIcons.map(function (item, key) {
                return <li key={key} onClick={(e) => selectItem(item)} className={icon?.id === item.id ? 'active' : ''}>
                  <div className='preview'>
                    <i className="fa fa-check"></i>
                    <img src={`${process.env.REACT_APP_API_STORAGE_URL}/${item.path}`} title={item.name} />
                  </div>
                </li>
              })
            }
            <li key={'uploadIconKey'}><Button outline color="primary" className="btn btn-xs" onClick={() => onclickGotoUploadIcon('global')}>+ Upload to Global Library</Button></li>
          </ul>
        </Col>
        <Col md="12" className='mt-3 my-3 text-center bggray'> - <strong>OR</strong> - </Col>
        <Col md="12" className='mt-3'>
          <h4>2. Program Library</h4>
          <ul className="img_wrap mt-2">
            {
              icons.map(function (item, key) {
                return <li key={key} onClick={(e) => selectItem(item)} className={icon?.id === item.id ? 'active' : ''}>
                  <div className='preview'>
                    <i className="fa fa-check"></i>
                    <img src={`${process.env.REACT_APP_API_STORAGE_URL}/${item.path}`} title={item.name} />
                    <div className="mt-2 delete-icon-icon" onClick={(e) => { if (window.confirm('Are you sure to delete this icon?')) { onClickDeleteIcon(item) } }}><TrashIcon color='#bdbdbd' /></div>
                  </div>
                </li>
              })
            }
            <li key={'uploadIconKey'}><Button outline color="primary" className="btn btn-xs" onClick={() => onclickGotoUploadIcon('program')}>+ Upload to Program Library</Button></li>
          </ul>
        </Col>
        <Col md="12" lg="12" xl="12" className='text-right'>
          <ButtonToolbar className="modal__footer flex justify-content-right w100">
            <Button outline color="primary" className="mr-3" onClick={onCancel}> Cancel </Button>{' '}
            <Button color="primary" disabled={!icon} className="mr-3" onClick={() => onSelectIconOK('icon', icon)} > OK </Button>{' '}
          </ButtonToolbar>
        </Col>
      </Row>
    </Col>
  )
}
ListIcons.propTypes = {
  icon: PropTypes.object.isRequired,
  setIcon: PropTypes.func.isRequired,
  setIcons: PropTypes.func.isRequired,
  onSelectIconOK: PropTypes.func.isRequired,
  icons: PropTypes.array.isRequired,
  onCancel: PropTypes.func.isRequired,
  program: PropTypes.object.isRequired,
};
export default ListIcons;