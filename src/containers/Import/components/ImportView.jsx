import React from 'react';
import {Card, CardBody, Col, Row} from 'reactstrap';
import {IMPORT_DATA} from "./MockData"
import ErrorsTable from "./ErrorsTable";

const ImportView = ({item}) => {
  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <div className="form__form-group-field" >
            <div className="form__form-group" style={{maxWidth:100}}>
              <h5>File Name</h5>
            </div>
            <div className="form__form-group" >
              {item.name}
            </div>
          </div>

          <div className="form__form-group-field" >
            <div className="form__form-group" style={{maxWidth:100}}>
              <h5>File Size</h5>
            </div>
            <div className="form__form-group" >
              {item.size} Kb
            </div>
          </div>

          <div className="form__form-group-field" >
            <div className="form__form-group" style={{maxWidth:100}}>
              <h5>File Rows</h5>
            </div>
            <div className="form__form-group" >
              {item.rows}
            </div>
          </div>

          <div className="form__form-group-field" >
            <div className="form__form-group" style={{maxWidth:100}}>
              <h5>Import Type</h5>
            </div>
            <div className="form__form-group" >
              {item.type}
            </div>
          </div>

          <div className="form__form-group-field" >
            <div className="form__form-group" style={{maxWidth:100}}>
              <h5>Imported</h5>
            </div>
            <div className="form__form-group" >
              {item.rows - item.errors.length}
            </div>
          </div>

          <div className="form__form-group-field" >
            <div className="form__form-group" style={{maxWidth:100}}>
              <h5>Errors</h5>
            </div>
            <div className="form__form-group" >
              {item.errors.length && <ErrorsTable errors={item.errors} />}
            </div>
          </div>

        </CardBody>
      </Card>
    </Col>
  )
}

export default ImportView;
