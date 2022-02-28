import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Field, Form } from 'react-final-form';
import {
  Card, CardBody, Col, Button, ButtonToolbar,
} from 'reactstrap';
import renderDropZoneMultipleField from '@/shared/components/form/DropZoneMultiple';
import {ORGANIZATION_ID} from '../../../../App/auth';
import axios from 'axios';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const fetchIcons = async() => {
  try {
      const response = await axios.get(`/organization/${ORGANIZATION_ID}/event_icons`);
      return response.data
  } catch (e) {
      throw new Error(`API error:${e?.message}`);
  }
};

const IconUpload = ({ setIcons, toggle, onCancel }) => {

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleUpload(values){

    let data = new FormData();
    
    if(!values.files){
        return
    }
        
    values.files.forEach(element => {
        data.append('icon[]', element)    
    });
    setLoading(true)
    axios
    .post(`/organization/${ORGANIZATION_ID}/event_icons`, data,
      {
        headers: {
            "Content-type": "multipart/form-data",
        },
      }
    )
    .then((res) => {
      if (res.status == 200) { //fetch all on success!
        fetchIcons()
        .then( response => {
            setIcons(response)
        })
      }
    })
    .catch((error) => {
      setError(error.response.data.errors);
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

export default IconUpload;
