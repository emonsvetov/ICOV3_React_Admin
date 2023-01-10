import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {Col, Row, ButtonToolbar, Button,} from 'reactstrap';
import axios from 'axios';
import TrashIcon from 'mdi-react/TrashOutlineIcon';

import { fetchEventIcons } from '@/shared/apiHelper';

const EventIcons = ({ icon, setIcon, onCancel, onSelectIconOK, icons, setIcons, program }) => {

  useEffect(() => {
    if (program?.organization_id) {
      fetchEventIcons(program.organization_id)
        .then(response => {
          setIcons(response)
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

  const onClickDeleteIcon = (icon) => {
    deleteIcon(icon)
      .then(response => {
        console.log(response.status)
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
EventIcons.propTypes = {
  icon: PropTypes.object.isRequired,
  setIcon: PropTypes.func.isRequired,
  setIcons: PropTypes.func.isRequired,
  onSelectIconOK: PropTypes.func.isRequired,
  icons: PropTypes.array.isRequired,
  onCancel: PropTypes.func.isRequired,
  program: PropTypes.object.isRequired,
};
export default EventIcons;