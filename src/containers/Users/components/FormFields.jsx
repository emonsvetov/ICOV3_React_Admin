import React, {useEffect, useState} from 'react';
import {Field} from 'react-final-form';
import {Row, Col} from 'reactstrap';
import Select from 'react-select';
import {FieldArray} from "react-final-form-arrays"
import CheckboxGroup from "@/shared/components/form/CheckboxGroup"
import CheckboxField from '@/shared/components/form/CheckBox';
import FieldUserStatus from './FieldUserStatus'
import renderSelectField from '@/shared/components/form/Select'
import axios from 'axios'

const defaultConfig = {
  roles:[],
  roleInput: 'checkbox',
  roleField: 'roles',
  rolePlaceholder: 'Select Role',
  roleDisable: false,
  isProgram: false,
  unitNumberField: 'unit_number',
  unitNumberOptions: [],
  positionLevelField: 'position_level',
  positionLevelOptions: []
}

const FormFields = ({form, values, submitting, pristine, program, config}) => {
  config = {...defaultConfig, ...config}
  // console.log(config)
  const [isSendInvite, setIsSendInvite] = useState(false)
  const [awardLevels, setAwardLevels] = useState([]);
  const [initialAwardLevel, setInitialAwardLevel] = useState(null);
  // console.log(onChangeActive)
  const onChangeSendInvite = (checked) => {
      setIsSendInvite(checked)
  }

    useEffect(() => {
        if (program && program.organization_id && program.id) {
            getDataAwardLevels();
        }
        if (!values.award_level) {
            setInitialAwardLevel(values.award_level || null);
        }
    }, [program, values.award_level]);

    const getDataAwardLevels = async () => {
        // Check if necessary IDs are available
        if (program.organization_id && program.id) {
            try {
                const response = await axios.get(
                    `/organization/${program.organization_id}/program/${program.id}/program-award-levels`
                );
                const options = response.data.map(level => ({
                    label: level.name,
                    value: level.id,
                    id: level.id,
                }));
                setAwardLevels(options);
            } catch (error) {
                console.error('Failed to fetch award levels:', error);
            }
        }
    };


    const onChangeUnitNumber = () => {
      // console.log("On change unit number")
    }    
    
    const onChangeAdminRole = (e) => {
      console.log(e)
      console.log("On change Org Admin Role")
    }
    
    return (
      <div className="user-form-fields w100">
        <Row>
          <Col md="6" lg="4" xl="4">
            <Field name="first_name">
              {({ input, meta }) => (
                <div className="form__form-group">
                  <span className="form__form-group-label">First Name</span>
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                      <input type="text" {...input} placeholder="First Name" />
                      {meta.touched && meta.error && (
                        <span className="form__form-group-error">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Field>
          </Col>
          <Col md="6" lg="4" xl="4">
            <Field name="last_name">
              {({ input, meta }) => (
                <div className="form__form-group">
                  <span className="form__form-group-label">Last Name</span>
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                      <input type="text" {...input} placeholder="Last Name" />
                      {meta.touched && meta.error && (
                        <span className="form__form-group-error">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Field>
          </Col>
        </Row>
        <Row>
          {!config.roleDisable && config.roles.length > 0 && (
            <Col md="6" lg="4" xl="4">
              <Field name={config.roleField}>
                {({ input, meta }) => (
                  <div className="form__form-group">
                    <span className="form__form-group-label">Role</span>
                    <div className="form__form-group-field">
                      <div className="form__form-group-row">
                        {config.roleInput === "checkbox" && (
                          <FieldArray
                            component={CheckboxGroup}
                            options={config.roles}
                            {...input}
                          />
                        )}
                        {config.roleInput === "select" && (
                          <Select
                            options={config.roles}
                            clearable={false}
                            className="react-select"
                            placeholder={config.rolePlaceholder}
                            classNamePrefix="react-select"
                            {...input}
                          />
                        )}
                        {meta.touched && meta.error && (
                          <span className="form__form-group-error">
                            {meta.error}
                          </span>
                        )}
                      </div>
                    </div>
                    {/*{!config.isProgram && (<em>Program roles to be assigned within a Program</em>)}*/}
                  </div>
                )}
              </Field>
              {program && program?.organization && <Field name={'is_organization_admin'}>
                {({ input, meta }) => (
                  <div className="form__form-group">
                    <span className="form__form-group-label">Admin Roles</span>
                    <div className="form__form-group-field">
                      <div className="form__form-group-row">
                        <Field
                          name="is_organization_admin"
                          label={`Admin in "${program.organization.name}" org`}
                          type="checkbox"
                          component={CheckboxField}
                          parse={(value) => {
                            onChangeAdminRole(value);
                            return value;
                          }}
                        />
                        {meta.touched && meta.error && (
                          <span className="form__form-group-error">
                            {meta.error}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Field>}
            </Col>
          )}
          <Col md="6" lg="4" xl="4">
            <FieldUserStatus />
          </Col>
        </Row>

        <Row>
          <Col md="6" lg="4" xl="4">
            <Field name="email">
              {({ input, meta }) => (
                <div className="form__form-group">
                  <span className="form__form-group-label">Email</span>
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                      <input type="text" {...input} placeholder="Email" />
                      {meta.touched && meta.error && (
                        <span className="form__form-group-error">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Field>
          </Col>
          <Col md="6" lg="4" xl="4">
            <Field name="phone">
              {({ input, meta }) => (
                <div className="form__form-group">
                  <span className="form__form-group-label">Phone Number</span>
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                      <input
                        type="text"
                        {...input}
                        placeholder="Phone Number"
                      />
                      {meta.touched && meta.error && (
                        <span className="form__form-group-error">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Field>
          </Col>
          {program?.uses_units > 0 && (
            <Col md="6" lg="4" xl="4">
              <div className="form__form-group">
                <span className="form__form-group-label">
                 Unit Number
                </span>
                <div className="form__form-group-field">
                  <div className="form__form-group-row">
                    <Field
                      name={config.unitNumberField}
                      options={config.unitNumberOptions}
                      component={renderSelectField}
                      parse={(value) => {
                        onChangeUnitNumber(value);
                        return value;
                      }}
                    />
                  </div>
                </div>
              </div>
            </Col>
          )}
        </Row>
        <Row>
          <Col md="6" lg="4" xl="4">
            <Field name="award_level">
              {({ input, meta }) => (
                <div className="form__form-group">
                  <span className="form__form-group-label">Award Level</span>
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                      <Field
                          name="award_level"
                          component={renderSelectField}
                          options={awardLevels}
                      />
                      {meta.touched && meta.error && (
                        <span className="form__form-group-error">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Field>
          </Col>
          <Col md="6" lg="4" xl="4">
            <Field name="work_anniversary">
              {({ input, meta }) => (
                <div className="form__form-group">
                  <span className="form__form-group-label">
                    Work Anniversary
                  </span>
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                      <input
                        type="date"
                        {...input}
                        placeholder="Work Anniversary"
                      />
                      {meta.touched && meta.error && (
                        <span className="form__form-group-error">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Field>
          </Col>
          <Col md="6" lg="4" xl="4">
            <Field name="dob">
              {({ input, meta }) => (
                <div className="form__form-group">
                  <span className="form__form-group-label">Birthday</span>
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                      <input type="date" {...input} placeholder="Birthday" />
                      {meta.touched && meta.error && (
                        <span className="form__form-group-error">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Field>
          </Col>
        </Row>
        <Row>
          <Col md="6" lg="4" xl="4">
            <Field name="division">
              {({ input, meta }) => (
                <div className="form__form-group">
                  <span className="form__form-group-label">
                    Department / Team
                  </span>
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                      <input
                        type="text"
                        {...input}
                        placeholder="Department / Team"
                      />
                      {meta.touched && meta.error && (
                        <span className="form__form-group-error">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Field>
          </Col>
          <Col md="6" lg="4" xl="4">
            <Field name="employee_number">
              {({ input, meta }) => (
                <div className="form__form-group">
                  <span className="form__form-group-label">
                    Employee Number
                  </span>
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                      <input
                        type="text"
                        {...input}
                        placeholder="Employee Number"
                      />
                      {meta.touched && meta.error && (
                        <span className="form__form-group-error">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Field>
          </Col>
          <Col md="6" lg="4" xl="4">
            <Field name="supervisor_employee_number">
              {({ input, meta }) => (
                <div className="form__form-group">
                  <span className="form__form-group-label">Supervisor ID</span>
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                      <input
                        type="text"
                        {...input}
                        placeholder="Supervisor ID"
                      />
                      {meta.touched && meta.error && (
                        <span className="form__form-group-error">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Field>
          </Col>
        </Row>
        <Row>
         {(program?.use_budget_cascading > 0 || program?.use_cascading_approvals > 0) && (
            <Col md="6" lg="4" xl="4">
              <div className="form__form-group">
                <span className="form__form-group-label">
                 Position Level
                </span>
                <div className="form__form-group-field">
                  <div className="form__form-group-row">
                    <Field
                      name={config.positionLevelField}
                      options={config.positionLevelOptions}
                      component={renderSelectField}
                      parse={(value) => {
                        return value;
                      }}
                    />
                  </div>
                </div>
              </div>
            </Col>
          )}
        </Row>
        <h4 className="mb-2">Password Settings:</h4>
        {config.isProgram && !values?.id && (
          <div className="form__form-group">
            <Field
              name="send_invite"
              label="Send Invite"
              type="checkbox"
              component={CheckboxField}
              parse={(value) => {
                onChangeSendInvite(value);
                return value;
              }}
            />
            {isSendInvite && (
              <label>User will set password for themselves</label>
            )}
          </div>
        )}
        {!isSendInvite && (
          <Row>
            <Col md="6" lg="4" xl="4">
              <Field name="password">
                {({ input, meta }) => (
                  <div className="form__form-group">
                    <span className="form__form-group-label">Password</span>
                    <div className="form__form-group-field">
                      <div className="form__form-group-row">
                        <input
                          type="password"
                          {...input}
                          placeholder="password"
                        />
                        {meta.touched && meta.error && (
                          <span className="form__form-group-error">
                            {meta.error}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Field>
            </Col>
            <Col md="6" lg="4" xl="4">
              <Field name="password_confirmation">
                {({ input, meta }) => (
                  <div className="form__form-group">
                    <span className="form__form-group-label">
                      Confirm Password
                    </span>
                    <div className="form__form-group-field">
                      <div className="form__form-group-row">
                        <input
                          type="password"
                          {...input}
                          placeholder="confirm password"
                        />
                        {meta.touched && meta.error && (
                          <span className="form__form-group-error">
                            {meta.error}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Field>
            </Col>
          </Row>
        )}
      </div>
    );
}

export default FormFields