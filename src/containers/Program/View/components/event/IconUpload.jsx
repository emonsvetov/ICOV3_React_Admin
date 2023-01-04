import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';

import { Field, Form } from 'react-final-form';
import {
  Card, CardBody, Col, Button, ButtonToolbar,
} from 'reactstrap';
import renderDropZoneMultipleField from '@/shared/components/form/DropZoneMultiple';

import axios from 'axios';
import { fetchEventIcons } from '@/shared/apiHelper';
import {useDispatch, flashError, flashSuccess} from "@/shared/components/flash"

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const IconUpload = ({ setIcons, toggle, onCancel, organization }) => {

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  function handleUpload(values){

    let data = new FormData();
    
    if(!values.files){
        return
    }

    values.files.forEach(element => {
        data.append('image[]', element)
    });
    setLoading(true)
    axios
    .post(`/organization/${organization.id}/event_icons`, data,
      {
        headers: {
            "Content-type": "multipart/form-data",
        },
      }
    )
    .then((res) => {
      if (res.status == 200) { //fetch all on success!
        flashSuccess(dispatch, "Icon uploaded!")
        fetchEventIcons(organization.id)
        .then( response => {
            setIcons(response)
        })
      }
    })
    .catch((error) => {
      flashError(dispatch, error.response.data)
      setLoading(false);
    });
  }
  
  async function onSubmit (files){
    handleUpload(files);
    await sleep(800);
    toggle('2');
  }

  return (
    <Col md={12} lg={12}>
      <Card>
        <CardBody>
          <Form onSubmit={onSubmit}>
            {({ handleSubmit, form }) => (
              <form className="form" onSubmit={handleSubmit}>
                <p>
                  The images should be jpg, jpeg, gif, png or ico file format with a maximum size of 5 Mb.
                </p>

                <Field
                  name="files"
                  component={renderDropZoneMultipleField}
                />
                <ButtonToolbar className="form__button-toolbar justify-content-center w100">
                  <Button color="primary" type="submit" disabled={loading}>Submit</Button>
                  <Button type="button" onClick={ onCancel }>
                    Cancel
                  </Button>
                </ButtonToolbar>
              </form>
            )}
          </Form>
        </CardBody>
      </Card>
    </Col>
  );
};

IconUpload.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
export default withRouter(connect((state) => ({
  organization: state.organization
}))(IconUpload));
