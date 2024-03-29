import React, {useEffect, useState} from 'react';
import {Field} from 'react-final-form';
import {Row, Col} from 'reactstrap';
import Select from 'react-select';
import {FieldArray} from "react-final-form-arrays"
import CheckboxGroup from "@/shared/components/form/CheckboxGroup"
import CheckboxField from '@/shared/components/form/CheckBox';
import renderSelectField from '@/shared/components/form/Select';
import FieldUserStatus from './FieldUserStatus'
import axios from "axios";

const FormFields = ({form, values, submitting, pristine, program, config = {
        roles: [],
        roleInput: 'select',
        roleField: 'role_id',
        rolePlaceholder: 'Select Role',
        roleDisable: false,
        isProgram: false
    }}) => {
    const [isSendInvite, setIsSendInvite] = useState(false);
    const [awardLevels, setAwardLevels] = useState([]);
    const [initialAwardLevel, setInitialAwardLevel] = useState(null);
    const onChangeSendInvite = (checked) => {
        setIsSendInvite(checked)
    }

    useEffect(() => {
        getDataAwardLevels();
        if (!values.award_level) {
            setInitialAwardLevel( values.award_level || null);
        }
    }, [program]);

    const getDataAwardLevels = async () => {
        const response = await axios.get(
            `/organization/${program.organization_id}/program/${program.id}/program-award-levels`,
        );
        const options = response.data.map(level => ({
            label: level.name,
            value: level.id,
            id: level.id,
        }));
        setAwardLevels(options);
    };

    return (
        <div className="user-form-fields w100">
            <Row>
                <Col md="6" lg="4" xl="4">
                    <Field name="first_name">
                        {({input, meta}) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">First Name</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="First Name"/>
                                        {meta.touched && meta.error &&
                                            <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Field>
                </Col>
                <Col md="6" lg="4" xl="4">
                    <Field name="last_name">
                        {({input, meta}) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Last Name</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Last Name"/>
                                        {meta.touched && meta.error &&
                                            <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Field>
                </Col>
            </Row>
            <Row>
                {!config.roleDisable &&
                    <Col md="6" lg="4" xl="4">
                        <Field name={config.roleField}>
                            {({input, meta}) => (
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Role</span>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                            {config.roleInput === 'checkbox' &&
                                                <FieldArray
                                                    component={CheckboxGroup}
                                                    options={config.roles}
                                                    {...input}
                                                />
                                            }
                                            {config.roleInput === 'select' &&
                                                <Select
                                                    options={config.roles}
                                                    clearable={false}
                                                    className="react-select"
                                                    placeholder={config.rolePlaceholder}
                                                    classNamePrefix="react-select"
                                                    {...input}
                                                />
                                            }
                                            {meta.touched && meta.error &&
                                                <span className="form__form-group-error">{meta.error}</span>}
                                        </div>
                                    </div>
                                    {/*{!config.isProgram && (<em>Program roles to be assigned within a Program</em>)}*/}
                                </div>
                            )}
                        </Field>
                    </Col>
                }
                <Col md="6" lg="4" xl="4">
                    <FieldUserStatus/>
                </Col>
            </Row>


            <Row>
                <Col md="6" lg="4" xl="4">
                    <Field name="email">
                        {({input, meta}) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Email</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Email"/>
                                        {meta.touched && meta.error &&
                                            <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Field>
                </Col>
                <Col md="6" lg="4" xl="4">
                    <Field name="phone">
                        {({input, meta}) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Phone Number</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Phone Number"/>
                                        {meta.touched && meta.error &&
                                            <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Field>
                </Col>
            </Row>
            <Row>
                <Col md="6" lg="4" xl="4">
                    <Field name="award_level">
                        {({input, meta}) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Award Level</span>
                                <Field
                                    name="award_level"
                                    component={renderSelectField}
                                    options={awardLevels}
                                />
                                {meta.touched && meta.error &&
                                    <span className="form__form-group-error">{meta.error}</span>}

                            </div>
                        )}
                    </Field>
                </Col>
                <Col md="6" lg="4" xl="4">
                    <Field name="work_anniversary">
                        {({input, meta}) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Work Anniversary</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="date" {...input} placeholder="Work Anniversary"/>
                                        {meta.touched && meta.error &&
                                            <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Field>
                </Col>
                <Col md="6" lg="4" xl="4">
                    <Field name="dob">
                        {({input, meta}) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Birthday</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="date" {...input} placeholder="Birthday"/>
                                        {meta.touched && meta.error &&
                                            <span className="form__form-group-error">{meta.error}</span>}
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
                        {({input, meta}) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Department / Team</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Department / Team"/>
                                        {meta.touched && meta.error &&
                                            <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Field>
                </Col>
                <Col md="6" lg="4" xl="4">
                    <Field name="employee_number">
                        {({input, meta}) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Employee Number</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Employee Number"/>
                                        {meta.touched && meta.error &&
                                            <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Field>
                </Col>
                <Col md="6" lg="4" xl="4">
                    <Field name="supervisor_employee_number">
                        {({input, meta}) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Supervisor ID</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="Supervisor ID"/>
                                        {meta.touched && meta.error &&
                                            <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Field>
                </Col>
            </Row>
            <h4 className='mb-2'>Password Settings:</h4>
            {(config.isProgram && !values?.id) &&
                <div className="form__form-group">
                    <Field
                        name="send_invite"
                        label="Send Invite"
                        type="checkbox"
                        component={CheckboxField}
                        parse={value => {
                            onChangeSendInvite(value)
                            return value
                        }}
                    />
                    {isSendInvite &&
                        <label>User will set password for themselves</label>}
                </div>
            }
            {!isSendInvite && <Row>
                <Col md="6" lg="4" xl="4">
                    <Field name="password">
                        {({input, meta}) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Password</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="password" {...input} placeholder="password"/>
                                        {meta.touched && meta.error &&
                                            <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Field>
                </Col>
                <Col md="6" lg="4" xl="4">
                    <Field name="password_confirmation">
                        {({input, meta}) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Confirm Password</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="password" {...input} placeholder="confirm password"/>
                                        {meta.touched && meta.error &&
                                            <span className="form__form-group-error">{meta.error}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Field>
                </Col>
            </Row>}
        </div>
    )
}

export default FormFields