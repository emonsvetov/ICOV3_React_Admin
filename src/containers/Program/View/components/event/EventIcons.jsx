import React, { useEffect } from 'react';
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Col, Row, ButtonToolbar, Button,} from 'reactstrap';
import axios from 'axios';
import TrashIcon from 'mdi-react/TrashOutlineIcon';

import { fetchEventIcons } from '@/shared/apiHelper';

const EventIcons = ({ icon, setIcon, onCancel, onSelectIconOK, icons, setIcons, activePath, activeId, organization }) => {

  useEffect(() => {
    if (organization?.id) {
      fetchEventIcons(organization.id)
        .then(response => {
          setIcons(response)
        })
    }

  }, [organization])

  const deleteIcon = async (icon) => {
    try {
      return await axios.delete(`/organization/${organization.id}/event_icons/${icon.id}`);
    } catch (e) {
      throw new Error(`API error:${e?.message}`);
    }
  }

  const onClickDeleteIcon = (icon) => {
    deleteIcon(icon)
      .then(response => {
        console.log(response.status)
        if (response.status === 200) {
          fetchEventIcons(organization.id)
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
        <Col md="12" lg="12" xl="12">
          <ul className="img_wrap">
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
          </ul>
        </Col>
        <Col md="12" lg="12" xl="12" className='text-right'>
          <ButtonToolbar className="modal__footer flex justify-content-right w100">
            <Button outline color="primary" className="mr-3" onClick={onCancel}> Cancel </Button>{' '}
            <Button color="primary" className="mr-3" onClick={() => onSelectIconOK('icon', icon)} > OK </Button>{' '}
          </ButtonToolbar>
        </Col>
      </Row>
    </Col>
  )
}
export default withRouter(connect((state) => ({
  organization: state.organization
}))(EventIcons));