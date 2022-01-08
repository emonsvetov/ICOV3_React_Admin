import React from 'react';
import PropTypes from 'prop-types';

import { Field, Form } from 'react-final-form';
import {
  Card, CardBody, Col, Button, ButtonToolbar,
} from 'reactstrap';
import renderDropZoneMultipleField from '@/shared/components/form/DropZoneMultiple';

const DropFiles = ({ onSubmit }) => {
  

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
                <ButtonToolbar className="form__button-toolbar">
                  <Button color="primary" type="submit">Submit</Button>
                  <Button type="button" onClick={form.reset}>
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

DropFiles.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default DropFiles;
