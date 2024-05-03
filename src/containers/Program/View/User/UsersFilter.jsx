import React from 'react';

const UsersFilter = ({ onKeywordChange, onClickSearch, onRoleChange, roleOptions, selectedRole }) => {
    return (
        <div className="form__form-group">
            <div className="col-md-4">
                <div className="">
                    <input
                        onChange={onKeywordChange}
                        type="text"
                        placeholder="Search users"
                    />
                </div>
            </div>
            <div className="col-md-4">
                <select
                    value={selectedRole}
                    onChange={onRoleChange}
                    className="form-control"
                >
                    <option value="">All Roles</option>
                    {roleOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
            <div className="col-md-4 d-flex align-items-center max-height-32px pl-1">
                <span className="text-blue pointer" onClick={onClickSearch}>Search</span>
            </div>
        </div>
    );
}

export default UsersFilter;
