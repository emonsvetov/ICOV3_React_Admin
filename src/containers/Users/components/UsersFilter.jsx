import React, { useEffect } from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button } from 'reactstrap';
import getUserStatusList from '@/service/getUserStatuses';
import getOrganizationList from '@/service/getOrganizationList';
import { labelizeNamedData } from '@/shared/helpers'

import { setOrganization as setAuthOrganization, getOrganization, AUTH_ORGANIZATION_TREE } from "@/containers/App/auth";
import {setOrganization} from '@/redux/actions/organizationActions';
import store from '@/containers/App/store';

const UserFilter = ({ onClickFilterCallback, organization, auth }) => {
    const [statusOptions, setStatusOptions] = React.useState([])
    const [status, setStatus] = React.useState('')
    const [orgOptions, setOrgOptions] = React.useState([])
    const [org, setOrg] = React.useState('')
    const [keyword, setKeyword] = React.useState('')
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
    const onUserPhraseChange = (e) => {
        setKeyword(e.target.value)
    }
    const onClickFilter = () => {
        onClickFilterCallback(status, keyword, org)
    }
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

    useEffect(() => {
        if (organization?.id) {
            getUserStatusList(organization.id)
                .then(list => {
                    setStatusOptions(
                        [
                            ...[{ 'value': '', label: 'All' }],
                            ...labelizeNamedData(list, ["status", "status"])
                        ]
                    )
                })
        }
        // console.log(auth)
    }, [organization])

    const statusPlaceholder = status ? status : 'All'
    let orgPlaceholder = 'ALL'
    if (org && org !== "1") {
        orgPlaceholder = orgOptions.filter(o => o.value === org).map(o => o.label)
    }
    return (
        <div className="form__form-group">
            {auth?.isSuperAdmin &&
                <div className="col-md-3 px-0">
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
            <div className="col-md-3 pr-0">
                <p className="">Status</p>
                <div>
                    <Select
                        value={status}
                        onChange={onStatusChange}
                        options={statusOptions}
                        clearable={false}
                        className="react-select"
                        placeholder={statusPlaceholder}
                        classNamePrefix="react-select"
                    />
                </div>
            </div>
            <div className="col-md-3">
                <p className="">Keyword</p>
                <div>
                    <input
                        value={keyword}
                        onChange={onUserPhraseChange}
                        type="text"
                        placeholder="Search by ID, email, name"
                    />
                </div>
            </div>
            <div className="col-md-3 pl-0">
                <p className="">&nbsp;</p>
                <div className="d-flex align-items-end ">
                    <Button type="button" onClick={onClickFilter} className="btn btn-sm btn-primary" color="#ffffff">Filter</Button>
                </div>
            </div>
        </div>
    )
}
export default withRouter(connect((state) => ({
    auth: state.auth,
    organization: state.organization
}))(UserFilter));