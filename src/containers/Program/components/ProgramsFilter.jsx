import React, {useEffect} from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import getOrganizationList from '@/service/getOrganizationList';
import getProgramStatusList from '@/service/program/getProgramStatusList'
import {labelizeNamedData} from '@/shared/helpers'
import {Button} from "reactstrap";

const ProgramFilter = ({onClickFilterCallback, organization, auth}) => {
    const [statusOptions, setStatusOptions] = React.useState([])
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
        console.log(organization)
        if( organization?.id )
        {
            if( auth?.isSuperAdmin )
            {
                getOrganizationList()
                .then(list => {
                    setOrgOptions(
                        labelizeNamedData(list)
                    )
                })
            }

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
    }, [organization, auth])
    const statusPlaceholder = status ? status : 'All'
    let orgPlaceholder = 'All'
    if (org) {
        orgPlaceholder = orgOptions.filter(o => o.value === org).map(o => o.label)
    }
    return (
        <div className="form__form-group">
            {auth?.isSuperAdmin &&
            <div className="col-md-4 px-0 pr-3">
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
            <div className="col-md-4 px-0">
                <p className="">Program Status</p>
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
            <div className="col-md-4">
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
                      className="btn btn-sm btn-primary"
                      color="#ffffff"
                    >Filter</Button>
                    <Button
                      onClick={()=>onClickFilter(true)}
                      className="btn btn-sm btn-primary"
                      color="#ffffff"
                    >Reset</Button>
                </div>
            </div>
        </div>
    )
}
export default withRouter(connect((state) => ({
    auth: state.auth
}))(ProgramFilter));