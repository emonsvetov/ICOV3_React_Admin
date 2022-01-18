import React from 'react'

const MerchantFilter = ({onClickFilterCallback}) => {
    const [keyword, setKeyword] = React.useState('')
    const onKeywordChange = (e) => {
        setKeyword( e.target.value)
    }
    const onClickFilter = () => {
        onClickFilterCallback(keyword)
    }
    return (
        <div className="form__form-group">
            <div className="col-md-4">
                <div className="">
                    <input 
                        value={keyword}
                        onChange={onKeywordChange}
                        type="text"
                        placeholder="Search by ID or name"
                    />
                </div>
            </div>
            <div className="col-md-4 d-flex align-items-center max-height-32px pl-1">
                <span className="text-blue pointer" onClick={onClickFilter}>Filter</span>
            </div>
        </div>
    )
}

export default MerchantFilter;