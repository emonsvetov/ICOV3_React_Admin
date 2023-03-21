import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import {labelizeNamedData} from '@/shared/helpers'
import getProgramStatusList from '@/service/program/getProgramStatusList'

const ProgramStatusDropdown = ({value, onChange, organization, placeholder }) => {

  const [statusOptions, setStatusOptions] = React.useState([])
  React.useEffect(() => {
    // console.log(organization)
    if( organization?.id )
    {
        getProgramStatusList( organization.id )
        .then( list => {
            setStatusOptions(
                [
                    ...[{'value':'', label: 'All'}], 
                    ...labelizeNamedData(list, ["status", "status"])
                ]
            )
        })
    }
}, [organization])

  const statusPlaceholder = value ? value : placeholder

  return (
    <Select
        value={value}
        onChange={onChange}
        options={statusOptions}
        clearable={false}
        className="react-select"
        placeholder={statusPlaceholder}
        classNamePrefix="react-select"
    />
  )
}

ProgramStatusDropdown.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  organization: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired
};

ProgramStatusDropdown.defaultProps = {
  value: '',
  placeholder: 'All',
};

export default ProgramStatusDropdown;