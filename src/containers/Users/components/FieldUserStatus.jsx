import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import renderRadioButtonField from '@/shared/components/form/RadioButton';
import Select from 'react-select';
import getUserStatuses from '@/service/getUserStatuses';
import { Field } from 'react-final-form';
import { labelizeNamedData } from '@/shared/helpers'

const FieldUserStatus = ({ organization, fieldType = 'radio' }) => {
  const [statuses, setStatuses] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (organization?.id) {
      getUserStatuses(organization.id)
        .then(statuses => {
          setStatuses(fieldType === "select" ? labelizeNamedData(statuses, ["id", "status"]) : statuses)
          setLoading(false)
        })
    }
  }, [organization])

  const RenderStatusRadio = () => {
    return (
      <div className="form__form-group user-status-type">
          <span className="form__form-group-label">User Status Type</span>
          <div className="form__form-group-field">
              <div className="form__form-group-row">
              {statuses.map((status) =>
                <Field
                  name="user_status_id"
                  component={renderRadioButtonField}
                  label={status.status}
                  radioValue={String(status.id)}
                  key={`user-status-item-${status.id}`}
                />
              )}
              </div>
          </div>
      </div>
    )
  }
  const RenderStatusSelect = () => {
    return (
    <Field name={"user_status_id"}>
    {({ input, meta }) => (
      <div className="form__form-group">
          <span className="form__form-group-label">User Status Type</span>
          <div className="form__form-group-field">
              <div className="form__form-group-row">
                <Select
                  options={statuses}
                  className="react-select"
                  placeholder={'Select Status'}
                  classNamePrefix="react-select"
                  {...input}
                />
                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
              </div>
          </div>
      </div>
    )}
    </Field>
    )
  }

  if (loading) return 'loading...'
  if(fieldType === 'radio') return <RenderStatusRadio />
  if(fieldType === 'select') return <RenderStatusSelect />
}

// FieldUserStatus.propTypes = {
//   organization: Object.isRequired
// };

export default withRouter(connect((state) => ({
  organization: state.organization
}))(FieldUserStatus));