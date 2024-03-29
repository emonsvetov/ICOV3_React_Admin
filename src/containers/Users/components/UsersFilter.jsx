import React, { useEffect } from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button } from 'reactstrap';
import getUserStatusList from '@/service/getUserStatuses';
import getOrganizationList from '@/service/getOrganizationList';
import { labelizeNamedData } from '@/shared/helpers'

const UserFilter = ({ onClickFilterCallback, organization, auth }) => {
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
    const onUserPhraseChange = (e) => {
        setKeyword(e.target.value)
    }
    const onClickFilter = () => {
        onClickFilterCallback(status, keyword, org)
    }
    useEffect(() => {
        if (organization?.id) {

            if (auth?.isSuperAdmin) {
                getOrganizationList()
                    .then(list => {
                        setOrgOptions(
                            labelizeNamedData(list)
                        )
                    })
            }

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
    }, [organization, auth])
    const statusPlaceholder = status ? status : 'All'
    let orgPlaceholder = 'All'
    if (org) {
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
    auth: state.auth
}))(UserFilter));