import React from 'react'
import Select from 'react-select'

import ProgramStatusDropdown from '@/containers/Program/components/ProgramStatusDropdown'

const ProgramFilter = ({onClickFilterCallback, organization}) => {
    const [status, setStatus] = React.useState('')
    const [keyword, setKeyword] = React.useState('')
    const onStatusChange = (selectedOption) => {
        setStatus(selectedOption.value)
    };
    const onProgramPhaseChange = (e) => {
        setKeyword( e.target.value)
    }
    const onClickFilter = () => {
        onClickFilterCallback(status, keyword)
    }
    const statusPlaceholder = status ? status : 'All'
    return (
        <div className="form__form-group">
            <div className="col-md-4 px-0">
                <ProgramStatusDropdown value={status} onChange={onStatusChange} organization={organization} />
            </div>
            <div className="col-md-4">
                <div className="">
                    <input 
                        value={keyword}
                        onChange={onProgramPhaseChange}
                        type="text"
                        placeholder="Program phrase"
                    />
                </div>
            </div>
            <div className="col-md-4 d-flex align-items-center max-height-32px pl-1">
                <span className="text-blue pointer" onClick={onClickFilter}>Filter</span>
            </div>
        </div>
    )
}

export default ProgramFilter;