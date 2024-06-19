import React, {useEffect} from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import getOrganizationList from '@/service/getOrganizationList';
import {labelizeNamedData} from '@/shared/helpers'
import {Button,Row} from "reactstrap";

import ProgramStatusDropdown from './ProgramStatusDropdown'

import { setOrganization as setAuthOrganization, getOrganization, AUTH_ORGANIZATION_TREE } from "@/containers/App/auth";
import {setOrganization} from '@/redux/actions/organizationActions';
import store from '@/containers/App/store';

const ProgramFilter = ({onClickFilterCallback, organization, auth, useOrg = true}) => {
    const [status, setStatus] = React.useState('')
    const [orgOptions, setOrgOptions] = React.useState([])
    const [org, setOrg] = React.useState('')
    const [keyword, setKeyword] = React.useState('')
    useEffect(() => {
      if( auth && auth?.isSuperAdmin )
      {
          getOrganizationList()
          .then(list => {
              list.unshift({id:1, name: 'ALL'});
              setOrgOptions(
                  labelizeNamedData(list)
              )
          })
      }
    }, [auth])

    useEffect(() => {
      if( organization && organization?.id )
      {
        if( auth.isSuperAdmin )
        {
          if(organization.id === 1) {
            setOrg("")
          } else {
            setOrg(organization.id.toString())
          }
        } else {
          setOrg(organization.id.toString())
        }
      }
    }, [organization, orgOptions])


    const onOrgChange = (selectedOption) => {
        setOrg(selectedOption.value)
        if( auth?.isSuperAdmin ) {
          if(selectedOption.value === "1") {
            setOrg("")
          }
          let newOrg = {name: selectedOption.label, id: parseInt(selectedOption.value)}
          store.dispatch(setOrganization(newOrg))
          setAuthOrganization(newOrg);
        }
    };
    const onStatusChange = (selectedOption) => {
        setStatus(selectedOption.value)
    };
    const onProgramPhaseChange = (e) => {
        setKeyword( e.target.value)
    }
    const onClickFilter = (event,reset = false) => {
        event.preventDefault();
        if( reset ) {
            setKeyword('');
            setStatus('');
            onClickFilterCallback('', '', '')
            setOrg('');
            if( auth?.isSuperAdmin ) {
              let newOrg = {name: 'ALL', id: 1}
              store.dispatch(setOrganization(newOrg))
              setAuthOrganization(newOrg);
            }
        } else {
            onClickFilterCallback(status, keyword, org)
        }
    }
    let orgPlaceholder = 'ALL'
    if (org && org !== "1") {
        orgPlaceholder = orgOptions.filter(o => o.value === org).map(o => o.label)
    }
    return (
        <form className="form__form-group" onSubmit={onClickFilter}>
        
        {useOrg && auth?.isSuperAdmin &&
            <div className="col-md-3 px-0 pr-3" >
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
                    />
                </div>
            </div>}
            <div className="col-md-3 px-0" style={{maxWidth:"100px"}}>
                <p className="">Program Status</p>
                <div >
                    <ProgramStatusDropdown value={status} onChange={onStatusChange} organization={organization} />
                </div>
            </div>
            <div className="col-md-3" >
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
            <div className="col-md-3 pl-0 ">
                <p className="">&nbsp;</p>
                <div className='flex'>
                    <Button
                      type='submit'
                      className="btn btn-sm btn-primary"
                      color="#ffffff"
                    
                    >Filter</Button>
                    <Button
                      onClick={(e)=>onClickFilter(e,true)}
                      className="btn btn-sm btn-secondary"
                      color="#ffffff"
                    >Reset</Button>
                </div>
            </div>
       
    </form>
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
    auth: state.auth,
    organization: state.organization
}))(ProgramFilter));