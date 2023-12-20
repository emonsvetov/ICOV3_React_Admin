import React, {useEffect} from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import getOrganizationList from '@/service/getOrganizationList';
import {labelizeNamedData} from '@/shared/helpers'
import {Button} from "reactstrap";

import ProgramStatusDropdown from './ProgramStatusDropdown'

const ProgramFilter = ({onClickFilterCallback, organization, auth, useOrg = true}) => {
    const [status, setStatus] = React.useState('')
    const [orgOptions, setOrgOptions] = React.useState([])
    const [org, setOrg] = React.useState('')
    const [keyword, setKeyword] = React.useState('')
    const onOrgChange = (selectedOption) => {
        setOrg(selectedOption.value)
    };
    const onStatusChange = (selectedOption) => {
        setStatus(selectedOption.value)
    };
    const onProgramPhaseChange = (e) => {
        setKeyword( e.target.value)
    }
    const onClickFilter = (reset = false) => {
        if( reset ) {
            setKeyword('');
            setOrg('');
            setStatus('');
            onClickFilterCallback('', '', '')
        } else {
            onClickFilterCallback(status, keyword, org)
        }
    }
    useEffect(() => {
        // console.log(organization)
        if( organization?.id )
        {
            if( auth && auth?.isSuperAdmin )
            {
                getOrganizationList()
                .then(list => {
                    setOrgOptions(
                        labelizeNamedData(list)
                    )
                })
            }
        }
    }, [organization, auth])
    let orgPlaceholder = 'All'
    if (org) {
        orgPlaceholder = orgOptions.filter(o => o.value === org).map(o => o.label)
    }

    const handleKeyDown = (event) => {
        console.log(event);
        if (event.key === 'Enter') {
            onClickFilter()
        }
      };


    return (
        <div className="form__form-group">
            {useOrg && auth?.isSuperAdmin &&
            <div className="col-md-4 px-0 pr-3" >
                <p className="">Organization</p>
                <div>
                    <Select
                        value={org}
                        onChange={onOrgChange}
                        options={orgOptions}
                        clearable={false}
                        className="react-select"
                        placeholder={orgPlaceholder}
                        classNamePrefix="react-select"
                       // onKeyDown={handleKeyDown}
                    />
                </div>
            </div>}
            <div className="col-md-4 px-0" style={{maxWidth:"100px"}}>
                <p className="">Program Status</p>
                <div >
                    <ProgramStatusDropdown value={status} onChange={onStatusChange} organization={organization} />
                </div>
            </div>
            <div className="col-md-4" >
                <p className="">Keyword</p>
                <div>
                    <input 
                        value={keyword}
                        onChange={onProgramPhaseChange}
                        type="text"
                        placeholder="Program phrase"
                    />
                </div>
            </div>
            <div className="col-md-4 pl-0">
                <p className="">&nbsp;</p>
                <div className='flex'>
                    <Button
                      onClick={()=>onClickFilter()}
                      className="btn btn-sm btn-info"
                      color="#ffffff"
                      onKeyDown={handleKeyDown}
                    >Filter</Button>
                    <Button
                      onClick={()=>onClickFilter(true)}
                      className="btn btn-sm btn-secondary"
                      color="#ffffff"
                    >Reset</Button>
                </div>
            </div>
        </div>
    )
}

ProgramFilter.propTypes = {
  value: PropTypes.string.isRequired,
  onClickFilterCallback: PropTypes.func.isRequired,
  organization: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  useOrg: PropTypes.bool
};

ProgramFilter.defaultProps = {
  useOrg: true,
  value:''
};

export default withRouter(connect((state) => ({
    auth: state.auth
}))(ProgramFilter));