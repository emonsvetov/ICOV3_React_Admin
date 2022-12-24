import React, {useState} from 'react';
import {Form} from 'react-final-form';
import {Row, Col, ButtonToolbar, Button} from 'reactstrap';
import {Field} from 'react-final-form';
import MuiButton from '@material-ui/core/Button';

const FormStep1 = ({config, csvFile, setCsvFile, onclickBack}) => {
  return (
    <div>
      <Field name={config.importFile.name}>
        {({input, meta}) => (
          <div className="form__form-group">
            <div className="form__form-group-field flex-column">
              <div className="flex-row form__form-group-field">
                <div className="flex-column">
                  <MuiButton variant="contained" component="label" style={{textTransform: 'inherit'}}>
                    {config.importFile.label}
                    <input
                      hidden
                      type='file'
                      // accept='.csv'
                      id='csvFile'
                      {...input}
                      onChange={(e) => {
                        setCsvFile(e.target.files[0])
                      }}
                      value={csvFile?.name.file}
                    >
                    </input>
                  </MuiButton>
                </div>
                <div className="flex-column"
                     style={{justifyContent: 'end', padding: '0px 10px', display: 'flex'}}>
                  {csvFile?.name}
                </div>
              </div>
              {meta.touched && !csvFile && (
                <span className="form__form-group-error">
                                    {meta.error}
                                </span>
              )}
              <div>&nbsp;</div>

              <div className="form__form-group-row flex-row pt-3">
                {/* <Button className="btn btn-outline-primary btn-sm" color="#ffffff" disabled={1 == 2}
                        onClick={onclickBack} style={{}}>Back</Button> */}
                <Button className="btn btn-primary btn-sm" color="#ffffff" disabled={!(csvFile instanceof File)} type="submit">Upload</Button>
              </div>
            </div>
          </div>
        )}
      </Field>
    </div>
  )
}

export default FormStep1;

